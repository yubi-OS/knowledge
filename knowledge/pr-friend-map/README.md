# pr-friend-map: knowledge corpus

Minted 2026-10-05 from `yubi-OS/yubiOS refs/pr-friend-map-2026-07-17.md`. Topic: pre-launch public-relations friend mapping, meaning identifying and organizing friendly press and community contacts for a proof-first, build-in-public campaign without overclaiming.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | [01-readiness-gates.md](01-readiness-gates.md) | Pre-launch readiness assessment and claim hygiene: what must be true before any outreach begins. |
| 02 | [02-friend-map-tiers.md](02-friend-map-tiers.md) | Identifying and organizing communities into priority tiers with first contribution, first ask, and gate. |
| 03 | [03-upstream-contribution.md](03-upstream-contribution.md) | Relationship-led participation in bootc, Fedora, and systemd upstreams: reproductions, docs PRs, one narrow question. |
| 04 | [04-fido2-practitioners.md](04-fido2-practitioners.md) | Engaging YubiKey/FIDO2 practitioners with a precise enrollment and recovery flow, inviting correction. |
| 05 | [05-arm64-board-collab.md](05-arm64-board-collab.md) | Working with ARM64 firmware and board communities to review provisioning and recovery before claiming proof. |
| 06 | [06-supply-chain-communities.md](06-supply-chain-communities.md) | OpenSSF and hardened-desktop operators as reviewers of evidence-bounded security claims. |
| 07 | [07-homelab-testers.md](07-homelab-testers.md) | Recruiting homelab and security owner-operators as early testers with explicit risk framing. |
| 08 | [08-media-gating.md](08-media-gating.md) | Earned media gated on reproduced proof milestones, pitching evidence and limitations. |
| 09 | [09-outreach-cadence.md](09-outreach-cadence.md) | Sequencing the first 14 days with stop conditions, quality-over-volume metrics, and a refresh rule. |

## Research summary

- Results collected: 132 kept results across 22 search queries (18 initial plus 4 redo queries across 2 re-digs), via the searXNG dig endpoint.
- Weight split across all archived results: 48 high (jev weight >= 0.5) and 84 low (weight < 0.5).
- Weight split across results used in authored docs: 43 high and 74 low. Weak-backed claims are labeled inline in the docs.
- Jev requests: 29 total (1 preflight probe, 1 outline validation with 9 score questions, 22 weighting batches of 5, 5 redo weighting batches), clef model on /api/decide. Usage tokens recorded per request in research-db/jev-log.json.
- Redos: 2 docs re-dug (08 media-gating, 09 outreach-cadence) with different queries after the first pass came back thin or noisy; each logged in its digs record.
- Skipped docs: none. All 9 outlined subtopics were authored; docs 08 and 09 carry explicit weak-evidence caveats instead of padding.

Preflight 2026-10-05: searXNG 63 results healthy; /api/decide (clef) 200.

## Refresh rule

Before sending any external outreach, re-check the target community's current rules, the blocker register, the exact evidence URL, and the wording of any public claim.
