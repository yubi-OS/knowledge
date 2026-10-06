# 01 - Trigger and failure classes

Scope: the two failure classes the digest-bump recovery playbook covers (a stale fedora-bootc FROM digest that 404s on quay.io, and an arm64 layer pull dying mid-stream), and the incident cadence that turned them into a standing playbook.

Grounding spine: source doc yubi-OS/yubiOS playbooks/digest-bump-recovery.md. External mechanisms are grounded in searXNG digs, each claim carries its source URL and jev weight. Results weighted below 0.5 are labeled weak backing.

## The primary failure signature

The playbook applies when a build fails because the `Containerfile` FROM digest is gone from quay.io (source doc). The concrete error the source doc records is:

```
quay.io/fedora/fedora-bootc:45@sha256:1dcca7ac…: not found
```

(source doc)

The failure is registry-side, not build-side. In the OCI image spec, a digest is a REQUIRED descriptor property that identifies the targeted content, and retrieved content SHOULD be verified against that digest (https://specs.opencontainers.org/image-spec/descriptor/, jev weight 0.66, high). So a pinned `sha256:...` reference is a claim about exact bytes; when the registry can no longer serve those bytes the manifest request returns not-found and the pull fails before any build step runs. A general Docker troubleshooting guide describes the same shape as "manifest unknown", resolved by checking digests and inspecting the registry (https://devopsaitoolkit.com/blog/docker-error-manifest-unknown/, jev weight 0.11, weak backing). A Red Hat solution documents the Quay-side symptom "Manifest not found" appearing while the tags view still shows tags and sizes (https://access.redhat.com/solutions/7077254, jev weight 0.40, weak backing), which matches the playbook's situation of a tag that still exists but a specific manifest that does not.

The image in question is a bootc image hosted on quay.io. Fedora's own bootc documentation shows the standard pattern of building FROM `quay.io/fedora/fedora-bootc` (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.63, high), and a Fedora IoT walkthrough demonstrates publishing and updating bootc images through quay.io specifically (https://docs.fedoraproject.org/en-US/iot/fedora-iot-bootc-quay-example/, jev weight 0.53, high). That hosting choice is what puts yubiOS builds at the mercy of quay.io manifest availability.

## The second failure class: arm64 stream truncation

The source doc groups a second failure under the same playbook: an arm64 layer pull dying mid-stream (source doc). Incident 1 of the verified ledger shows the concrete detail: an arm64 stream truncation at layer 16,045,778 on digest `sha256:f6b5b775…`, recovered by re-resolving the pin and rebuilding via `fetch-fedora-bootc-manifest.yml` (source doc). The trigger is not a 404 but an incomplete pull; the remedy is the same because in both cases the pinned digest failed to deliver its content and the pin must be re-resolved against the registry.

## Cadence: days, not weeks

The playbook records that this failure class fired three times in seven days, from 2026-07-26 to 2026-07-30 (source doc). The operational rule that follows: treat any `fedora-bootc:45@sha256:…` pin as good for days, not weeks (source doc). This is the reason the playbook exists as a standing procedure rather than a one-off fix note.

A parallel project hit the same class of problem and weighed keeping the digest for reproducibility against dropping it for a tag, with CI re-resolving the pin on a schedule (https://github.com/cgwalters-forge/tracker/issues/185, jev weight 0.19, weak backing). The yubiOS playbook resolves the same tension the other way: keep the digest pin, but pair it with an automated fetch workflow that re-resolves it (see doc 02).

## Operational directive

The source doc is explicit about ownership: this is self-mode fixable, do not surface a stale pin to Jenny as a blocker (source doc). Incident 3 was recovered entirely in self-mode under Jenny's standing directive "stale image? just re-run the fetch group ci" (source doc). The playbook's job is to make that self-mode recovery deterministic, which is what the two-dispatch decision and the 5-step mechanism (docs 02 and 03) encode.

## What this doc adds beyond the source doc

The dig results confirm the registry mechanics behind both failure classes: digest-based references are content-addressed and immutable (https://specs.opencontainers.org/image-spec/descriptor/, jev weight 0.66, high), the "manifest not found" surface on quay.io is a known failure mode (https://access.redhat.com/solutions/7077254, jev weight 0.40, weak backing), and other bootc projects treat stale digest pins as an expected recurring event rather than an anomaly (https://github.com/cgwalters-forge/tracker/issues/185, jev weight 0.19, weak backing). None of this contradicts the source doc; it grounds why a "good for days, not weeks" pin is a structural property of quay.io hosting rather than bad luck.
