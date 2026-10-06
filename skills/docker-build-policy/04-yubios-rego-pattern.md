# 04. The yubiOS.rego pattern

Scope: the shape of yubiOS.rego: package, default deny, the approved_registry allowlist, the allow rules, the decision object, and the actionable deny messages.

## The pattern

The source doc's policy (repo root yubiOS.rego), reproduced from the source doc (yubi-OS/yubiOS skills/docker-build-policy/SKILL.md):

```rego
package docker
import future.keywords.if
import future.keywords.in

default allow := false                       # default deny

approved_registry(ref) if startswith(ref, "quay.io/fedora/")
approved_registry(ref) if startswith(ref, "dhi.io/")
approved_registry(ref) if startswith(ref, "ghcr.io/actions/")
approved_registry(ref) if startswith(ref, "ghcr.io/hadolint/")

allow if input.local                          # local-only layers pass

allow if {                                    # approved registry AND digest-pinned
    approved_registry(input.image.ref)
    input.image.isCanonical
}

decision := { "allow": allow, "reason": reason }

reason := msg if {                            # actionable deny messages
    not input.local
    not approved_registry(input.image.ref)
    msg := sprintf("Image '%v' is not from an approved registry...", [input.image.ref])
}
reason := msg if {
    not input.local
    approved_registry(input.image.ref)
    not input.image.isCanonical
    msg := sprintf("Image '%v' uses a mutable tag. Pin to a digest...", [input.image.ref])
}
reason := "Build allowed." if allow
```

Key rules, per the source doc: default deny; allow only local builds or approved_registry AND isCanonical. The decision object (allow plus a human-readable reason) is what the buildx evaluator consumes.

## Reading the pattern rule by rule

package docker: the evaluator queries data.docker.decision, which is why doc 07's opa eval commands query exactly that path (source doc).

default allow := false: default deny. Nothing is allowed unless a rule positively proves allow. Rego's default rule semantics make this the safe initial state; the language is declarative, so policy authors state what queries should return rather than how to execute them (source: https://www.openpolicyagent.org/docs/policy-language, weight 0.89).

approved_registry(ref): one rule body per prefix, currently quay.io/fedora/, dhi.io/, ghcr.io/actions/ and ghcr.io/hadolint/ (source doc). Prefixes are tight: org path, not bare host (source doc; see doc 05 for why).

allow if input.local: pure local builds pass. Doc 03 explains why this rule must exist at all (source doc; upstream corroboration at https://docs.docker.com/build/policies/intro/, weight 0.51).

allow if { approved_registry(...); input.image.isCanonical }: the conjunction is Rego's AND: both bodies must hold. A remote image passes only if its registry is approved AND the reference is digest pinned.

decision and reason: the decision object binds allow to the computed reason. Two deny messages use sprintf to name the offending ref, one for a non-approved registry, one for a mutable tag; when allow holds the reason is "Build allowed." (source doc). The deny messages are the debugging interface: a failing build log names the ref and the fix (source doc; doc 08).

## Precedent for allow-style Docker policies

OPA's own Docker authorization example uses the same shape: a policy with an allow rule consumed by a Docker integration (source: https://github.com/open-policy-agent/opa-docker-authz, weight 0.55; example policy at https://github.com/open-policy-agent/opa-docker-authz/blob/main/example.rego, weight 0.61). The yubiOS pattern is the same idiom applied at build time rather than at daemon request time.

## Rego constructs in play

The pattern uses future.keywords.if and future.keywords.in imports and startswith for prefix matching (source doc). Partial rules with per-value bodies, like the multiple approved_registry definitions, are a documented Rego construct: multi-value rules generate a set of keys and values (source: https://www.openpolicyagent.org/docs/cheatsheet, weight 0.71). The Rego cheat sheet and policy language docs are the references to consult before extending the policy (weights 0.71 and 0.89).
