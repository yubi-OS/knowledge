# 07 - Tradeoffs and known gaps

Scope: what dispatch-only recovery costs versus a hand edit, what it buys, and the unimplemented fail-fast improvement the playbook names.

Grounding spine: source doc yubi-OS/yubiOS playbooks/digest-bump-recovery.md. General context on digest pinning and CI fail-fast practice comes from searXNG digs with URL and jev weight; sub-0.5 results are labeled weak backing.

## The core tradeoff

The source doc states it in one sentence: dispatch-only recovery costs one extra roughly 2-minute round-trip versus a hand edit and buys an auditable `Containerfile`+`PINNED.md` commit pair (source doc).

The cost side is latency: the dispatch chain (doc 03) routes the bump through a workflow run instead of a local edit, and the playbook prices that at about 2 minutes of extra round-trip. The benefit side is auditability: the fetch workflow's bump is a single commit touching both pin files, so the repo's history shows a coherent pin change rather than a lone `Containerfile` edit whose companion file drifted (doc 02). The playbook judges this trade worth making every time, which is why the decision section says "never a hand-edited digest" (source doc).

The audits in the playbook's cross-references treat this pair as evidence: `PINNED.md` exists so pin state is inspectable, and keeping it in lockstep with the `Containerfile` is what makes the state trustworthy. A hand edit is not just slower to make correct; it is a state the verification chain would eventually flag as an inconsistency.

## The known gap: no fail-fast pre-check

The source doc names a known improvement, explicitly marked unimplemented: a live quay.io HEAD pre-check in `ci_dev_image.yml` that fails fast with "stale pin: bump via fetches group" (source doc). Today the builder pays roughly 50 seconds of build work before discovering the pin is dead (source doc).

The economics: the 5-step recovery already contains the HEAD probe (step 1, doc 03). Moving that probe into the builder workflow would convert the failure from "50 seconds of build, then a confusing pull error" to "seconds of pre-check, then a message that names the remedy". The playbook records this as known but not built, which is itself operational information: until it ships, agents recovering a stale pin should expect the 50-second build cost on the first failed attempt.

General CI practice supports the fail-fast shape: runbooks for Docker CI failures emphasize diagnosing the pull layer before build time is spent (https://infrarunbook.com/article/docker-build-failing-in-ci-pipeline, jev weight 0.09, weak backing), though that source covers registry auth and mirroring rather than pin staleness specifically.

## Why digest pinning is worth the recovery machinery

A fair question: if pins go stale every few days (doc 01), why not pin tags and avoid the whole playbook? The dig results give the general answer. Digests are immutable content hashes while tags are mutable pointers that a re-push can change (https://adhdecode.com/articles/docker/docker-image-digest-vs-tag/, jev weight 0.16, weak backing; https://runbook.academy/courses/kubernetes/lessons/kubernetes-cxv-05-tag-digest/, jev weight 0.19, weak backing). Base-image pinning by digest is the standard recommendation for reproducible builds (https://containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/, jev weight 0.22, weak backing). The OCI image lifecycle treats the digest-update pattern, re-resolving a pinned digest to its current value, as a named maintenance operation (https://www.kunwar.page/chapter/106-the-oci-image-lifecycle-registries-digest-pinning-the-diges, jev weight 0.22, weak backing).

The yubiOS playbook is that pattern applied with automation: keep the immutable pin (reproducibility), and pay for its staleness with a fetch workflow that re-resolves it (doc 02). Automation guides for base-image updates describe the same pairing of digest pinning with an automated update mechanism (https://tomodahinata.com/en/blog/dependabot-docker-base-image-digest-pinning-updates-guide, jev weight 0.20, weak backing).

These sources are all weak-backed context; the tradeoff numbers that matter (2 minutes, 50 seconds) come from the source doc itself.

## The stability the tradeoff protects

The playbook's framing word is "boring" (source doc, doc 04): the rules exist so recovery is uneventful. The tradeoff section completes that picture by pricing the alternative paths. Hand editing is cheaper in the moment and more expensive in audit; skipping the pin entirely trades reproducibility for convenience. Dispatch-only recovery sits between them and is the only path that keeps both properties, at a known, small latency cost.

## What this doc adds beyond the source doc

The cost, benefit, and unimplemented pre-check are all source-doc records. The digs add weak-backed general context on why digest pinning justifies an update mechanism, and note that none of it contradicts the playbook's numbers.
