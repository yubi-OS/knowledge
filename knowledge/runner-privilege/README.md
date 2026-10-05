# Self-hosted CI runner privilege and compute isolation (runner-privilege)

Knowledge corpus minted 2026-10-05 from `yubi-OS/yubiOS refs/adjacent-problems-runner-privilege-2026-09-13.md` (NSS 6/12 Adjacent problems axis). Topic: runner admission as a trust boundary before any process exists; GitHub-hosted vs self-hosted runners; untrusted PR-triggered jobs on persistent hosts; tool bootstrap without sudo; the SHA-pinning org rule.

## Docs

1. [01-runner-admission-trust-boundary.md](01-runner-admission-trust-boundary.md) - runner admission as the trust boundary set before any job process exists, and the admission-time controls.
2. [02-github-hosted-vs-self-hosted.md](02-github-hosted-vs-self-hosted.md) - custody tradeoffs between GitHub-hosted and self-hosted runners.
3. [03-untrusted-pr-jobs-persistent-hosts.md](03-untrusted-pr-jobs-persistent-hosts.md) - the fork-PR runner-compromise path and the documented mitigations.
4. [04-ephemeral-runner-mitigation.md](04-ephemeral-runner-mitigation.md) - single-job ephemeral runners and scale sets as a lifecycle control.
5. [05-tool-bootstrap-without-sudo.md](05-tool-bootstrap-without-sudo.md) - user-local toolchain installs and unprivileged package systems on sudo-less runner hosts.
6. [06-sha-pinning-org-rule.md](06-sha-pinning-org-rule.md) - why all Actions references are pinned to full 40 character SHAs, and how the rule is enforced.
7. [07-runner-labels-scoping.md](07-runner-labels-scoping.md) - runs-on labels and runner groups as routing and admission controls.
8. [08-hardware-host-segmentation.md](08-hardware-host-segmentation.md) - segmentation of job classes on hardware-attached lab hosts.

## Research summary

- Results collected: 120 (96 from the initial 16-query dig, 24 from redos)
- Weight split: 69 high (noul >= 0.4), 51 low (noul < 0.4); 0 unweighted
- Jev request count: 26 total (1 outline validation, 20 initial weighting, 5 redo weighting); 2 transient 429 responses recovered after a 30s backoff
- Redos performed: 2 (tool-bootstrap-without-sudo, hardware-host-segmentation), each 1 redo with different queries
- Skipped docs: 1 subtopic dropped at outline validation (t09 GitHub-hosted large runner fallback, noul 0.2994 < 0.4 threshold); no docs skipped post-dig
- Outline validation: 8 of 9 subtopics kept (noul 0.5786 to 0.9136)

## Sources note

Every factual claim in the docs carries its source URL and the jev weight (noul, 0..1) that backed it. Claims resting only on low-weight (noul < 0.4) sources are marked as such in the text. The outline validation answers are recorded in research-db/outline-validation.json; the full result archive is research-db/archive.json with per-subtopic dig records under research-db/digs/ and the TypeScript index in research-db/db.ts.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
