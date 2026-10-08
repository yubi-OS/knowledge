# 06. Podman policy.json: pull-time signature enforcement

Scope: containers-policy.json as the pull-time enforcement layer for podman: reject-by-default, sigstoreSigned policy entries, keyPath, and signedIdentity semantics.

## The yubiOS policy

The source doc's policy.json rejects everything by default and carves out the yubiOS registry with a signature requirement:

```json
{
  "default": [{ "type": "reject" }],
  "transports": {
    "docker": {
      "dhi.io/yubi-OS/": [
        {
          "type": "sigstoreSigned",
          "keyPath": "/etc/containers/cosign-yubiOS.pub",
          "signedIdentity": { "type": "matchRepository" }
        }
      ]
    }
  }
}
```

(source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md). The effect is stated in one line in the source doc: a pull only succeeds if the signature verifies, via `podman pull dhi.io/yubi-OS/yubiOS@sha256:...`. This is the pull-time counterpart to the build-time Build Policies of doc 05: build policies gate what a build consumes, policy.json gates what a runtime or CI job pulls.

The upstream man page is containers-policy.json(5) from the containers/image project (https://github.com/containers/image/blob/main/docs/containers-policy.json.5.md, jev weight 0.83). It records a boundary worth knowing: some tools like podman and buildah hard-code overrides of the signature verification policy for push operations, allowing those operations regardless of configuration in policy.json. Policy.json is therefore a pull-time gate, not a push-time one; push-time assurance comes from the signing step itself (doc 07).

## signedIdentity semantics

The Arch manual page for containers-policy.json(5) documents the field the yubiOS policy sets: if the signedIdentity field is missing it is treated as matchRepoDigestOrExact, and matchExact, matchRepoDigestOrExact, and matchRepository can only be used when a Docker-like image identity is provided by the transport; the dir: and oci: transports can only be used with exactReference or exactRepository (https://man.archlinux.org/man/containers-policy.json.5.en, jev weight 0.81). The yubiOS choice of matchRepository means the signature must be made for the repository the image is pulled from, which ties the signature to identity rather than merely to a blob.

A real-world policy with the same shape exists in the SUSE BCI documentation: a default of insecureAcceptAnything replaced per-transport by a sigstoreSigned entry with a keyPath pointing at a distribution-provided public key (https://opensource.suse.com/bci-docs/guides/image-verification/, jev weight 0.79). The structural pattern, default deny or accept plus per-transport sigstoreSigned overrides, is the standard usage.

## Ecosystem context

Signature verification at pull time is a pattern shared beyond podman: the Kubernetes blog on verifying container image signatures within CRI runtimes describes how the Kubernetes community has signed container image artifacts since release v1.24, with the corresponding enhancement moving from alpha to beta in v1.26 (https://kubernetes.io/blog/2023/06/29/container-image-signature-verification/, jev weight 0.88). Policy.json is the containers-stack implementation of the same idea.

Weak-backing notes: golinuxcloud.com's podman image signing guide scored 0.18 and a notmyidea.org post on verifying cosign signatures with podman scored 0.22 under jev weighting; neither is used as a claim source. The podman Wikipedia page scored 0.54, marginally above threshold, and confirms only the general fact that podman runs containers rootless using Linux namespaces (https://en.wikipedia.org/wiki/Podman, jev weight 0.54).

## Default-first evaluation order

The policy evaluation is structured around the `default` entry: when a pull matches no per-transport rule, the default applies, which is why the yubiOS policy uses `reject` rather than omitting default. The SUSE example inverts the polarity with `insecureAcceptAnything` as default and a sigstoreSigned carve-out for one registry (https://opensource.suse.com/bci-docs/guides/image-verification/, jev weight 0.79); the yubiOS policy chooses the stricter polarity because the threat model is a build host that must never pull unverified content by accident. The man page also documents the per-scope structure the transports block implements: rules are keyed by transport type and then by scope within that transport, so the `docker` transport with scope `dhi.io/yubi-OS/` matches pulls from any repository under that prefix (https://github.com/containers/image/blob/main/docs/containers-policy.json.5.md, jev weight 0.83).

## How this composes with cosign

The keyPath in the yubiOS policy points at `/etc/containers/cosign-yubiOS.pub`, the public half of the cosign key pair generated in doc 07. The chain is: generate the pair, sign images with cosign (key-based or keyless in CI), install the public key into policy.json, and every podman pull on the host then verifies the sigstore signature against it. A pull of an unsigned or wrongly signed image fails closed, which is the runtime-side guarantee the hardening checklist requires.
