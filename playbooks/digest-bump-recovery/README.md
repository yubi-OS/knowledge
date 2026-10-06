# playbooks/digest-bump-recovery

Knowledge corpus minted from yubi-OS/yubiOS `playbooks/digest-bump-recovery.md` (the digest bump recovery playbook, stale fedora-bootc pin, 2026-08-01). The ground source is the primary source of record; this corpus explicates it: the recovery procedure, the failure modes it addresses, the verification steps, and the operational discipline the playbook records. The playbook's own sections dictated the outline.

## Corpus index

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-trigger-and-failure-classes.md](01-trigger-and-failure-classes.md) | The two failure classes (dead quay.io digest 404, arm64 layer-pull stream truncation) and the 3-in-7-days cadence |
| 02 | [02-two-dispatch-decision.md](02-two-dispatch-decision.md) | Two dispatches, never a hand-edited digest; the Containerfile/PINNED.md invariant |
| 03 | [03-recovery-mechanism.md](03-recovery-mechanism.md) | The 5-step recovery procedure with the exact commands |
| 04 | [04-dispatch-discipline-rules.md](04-dispatch-discipline-rules.md) | One dispatch per POST, let the dispatcher settle, Docker_push renames on forward |
| 05 | [05-dev-tag-mismatch.md](05-dev-tag-mismatch.md) | Adjacent case: dev tag / short-SHA mismatch, commit 95565a0e, resolve-to-digest discipline |
| 06 | [06-verified-incident-ledger.md](06-verified-incident-ledger.md) | The 3 verified recoveries of 2026-07-26 to 2026-07-30 and the self-mode proof |
| 07 | [07-tradeoffs-and-known-gaps.md](07-tradeoffs-and-known-gaps.md) | Dispatch cost vs hand edit, the auditable commit pair, the unimplemented fail-fast pre-check |
| 08 | [08-cross-references-and-workflow-landscape.md](08-cross-references-and-workflow-landscape.md) | BLOCKERS.md B-PINS, sibling fetch workflows, dispatch-chain-verification, Linear/commit anchors |

## Research summary

- Results collected: 48 (4 dug subtopics, 2 queries each, top 6 kept per query)
- Weight split: 4 high (>= 0.5) / 44 low (< 0.5) of 48
- Jev requests: 5 (1 outline validation, 4 noul weighting batches via DefAPI direct), usage 7456 input / 1004 output tokens
- Redos: 0
- Skipped docs: none
- Internal-record subtopics (02, 04, 06, 08) skipped searXNG by design; their docs say so and cite the source doc only

Preflight 2026-10-06: campaign preflight healthy (orchestrator); searXNG https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng; decide model typesafe/jev-1.13 via DefAPI direct (api.defapi.org), agent-side probe skipped for speed.

## Gaps

- Dig results for the four dug subtopics skew low-weight (blog/tooling pages rather than official docs). The corpus labels every sub-0.5 citation as weak backing and rests its factual spine on the source doc, per the mint contract. The highest-weight external anchors are the OCI image-spec descriptor page (0.66), the Fedora bootc docs (0.63 and 0.53), and the skopeo-inspect manpage (0.50).
- No drift between the dig world and the source doc was found; no dated corrections were needed.
