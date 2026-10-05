# Rego semantics for build policies

Scope: the Rego constructs every build policy needs: the mandatory `package docker` declaration, deny-by-default via `default allow := false`, allow rules, and the decision output object.

## The package declaration

All build policies must start with the package declaration `package docker`. The official intro doc breaks down a minimal policy rule by rule and lists this as the first requirement (https://docs.docker.com/build/policies/intro.md, weight 0.80; the same text mirrored at https://abc.vhrghala.org/p/https/docs.docker.com/build/policies/intro/, weight 0.08, weak backing). A policy without the right package declaration is not a build policy: Buildx looks for the `docker` package when it evaluates.

## Deny by default

`default allow := false` is the deny-by-default rule: if inputs do not match an `allow` rule, the policy check fails (https://docs.docker.com/build/policies/intro.md, weight 0.80). This is the Rego default-value idiom doing the security work: because the default is false, an incomplete policy denies rather than permits, and every capability the build needs must be granted explicitly by an allow rule.

The canonical minimal policy from the docs:

```rego
package docker

default allow := false

# Allow local inputs
allow if input.local

# Allow images with provenance attestations
allow if {
    input.image.hasProvenance
}

decision := {"allow": allow}
```

(source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md; the `allow if input.local` rule is explained at https://docs.docker.com/build/policies/intro/, weight 0.97.)

If any input violates the policy, for example a FROM image that lacks provenance, the build fails before any layer runs (source doc; consistent with the docker/docs intro source at https://github.com/docker/docs/blob/main/content/manuals/build/policies/intro.md, weight 0.43, weak backing).

## The decision object

A policy returns its decision through the `decision` object, conventionally `decision := {"allow": allow}` (source doc). This is the value Buildx consumes: the `allow` field is what gates the build. Keep the object minimal and boolean; anything richer should live in the allow rules themselves so the decision stays auditable.

## allow and deny are not Rego keywords

Neither `allow` nor `deny` are keywords in Rego. If you want to treat them as contradictory, you control which one takes precedence explicitly (https://www.openpolicyagent.org/docs/faq, weight 0.87). In build policies this means: the meaning of `allow` comes entirely from your `default allow := false` declaration plus your allow rules, not from any engine magic. If you accidentally write an `allow` rule that is vacuously true (an unbound variable iterating over an empty set, for example), Rego will not warn you; test with `docker buildx policy eval --print` as described in the eval doc of this corpus.

## Rego itself

OPA is an open source, general-purpose policy engine that unifies policy enforcement across the stack (https://www.openpolicyagent.org/docs, weight 0.96). Rego evaluates declarative rules over the `input` document Buildx supplies; you never call the policy, Buildx does, once per resolved input. The evaluation model is pure: the same input always yields the same decision, which is what makes policy outcomes reproducible in CI and testable offline with `policy eval`.

One OPA FAQ consequence worth remembering: because `allow` is an ordinary variable, multiple `allow if` rules in one policy are OR-ed (any true rule makes `allow` true), and you combine conditions with `{ ... }` blocks that are AND-ed (https://www.openpolicyagent.org/docs/faq, weight 0.87, for the general keyword and precedence point; the block semantics per https://www.openpolicyagent.org/docs/policy-language, weight 0.92).

## A checklist for a correct policy

1. `package docker` is the first line (https://docs.docker.com/build/policies/intro.md, weight 0.80).
2. `default allow := false` comes before any allow rule (https://docs.docker.com/build/policies/intro.md, weight 0.80).
3. An `allow if input.local` rule exists so your own build context and Dockerfile pass (https://docs.docker.com/build/policies/intro/, weight 0.97).
4. One allow rule per capability you intend to grant, each guarded by concrete constraints (registry prefix, digest, provenance).
5. `decision := {"allow": allow}` is set explicitly (source doc).
6. The policy is tested standalone with `docker buildx policy eval` before CI uses it (https://docs.docker.com/build/policies/usage/, weight 0.95).
