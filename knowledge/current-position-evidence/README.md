# current-position-evidence

A knowledge corpus on evidence boundaries in early-stage security projects: stating plainly what is verified today versus aspirational, so downstream business documents (offer, pilot, funding, case study) inherit honest claims. Minted 2026-10-05 from the yubiOS refs/ source document `current-position-evidence-2026-07-25.md` (OMN-68, the evidence-boundary document of the yubiOS Business and Stewardship Plan).

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | verified-asset-inventory | How to inventory and verify the technical assets and public artifacts that ground engineering-progress claims. |
| 02 | progress-versus-market-fit | Separating evidence of engineering progress from evidence of product-market fit, and why the two are conflated. |
| 03 | blockers-as-source-of-truth | Maintaining a live, numbered blocker list as the single source of truth, with dated snapshots deferring to it. |
| 04 | vm-versus-hardware-evidence | Why CI and VM-lane evidence cannot back hardware or physical-device claims, and the simulation-to-real ladder. |
| 05 | off-limits-claims-governance | Enumerating claims that must stay off-limits until specific named evidence closes, and enforcing the list. |
| 06 | trademark-non-affiliation-boundary | Non-affiliation and trademark boundaries as part of the honest-claims surface, independent of blocker status. |
| 07 | readiness-gates-claims-mapping | Mapping evidence state to gate levels and which market claims unlock at which gate. |
| 08 | commercial-evidence-gap | The commercial validation gap (zero interviews, design partners, pilots, SOWs) and what evidence standards close it. |
| 09 | evidence-summary-snapshot-discipline | Reusable evidence summaries, dated snapshots, the supersession rule, and downstream citation. |

## Research summary

- Results collected: 156 (108 attempt-1 + 48 redo).
- Weight split (jev noul probability): 34 results >= 0.5 (authoritative backing), 122 results < 0.5 (weak backing, labeled as such in the docs).
- Jev requests: 36 total (1 preflight probe, 1 outline validation, 26 weighting batches attempt flow, 8 redo weighting batches), usage tokens: 26807 input / 0 output (responses carried no output-token field).
- Redos: 4 digs redone once each (02 progress-versus-market-fit, 03 blockers-as-source-of-truth, 05 off-limits-claims-governance, 09 evidence-summary-snapshot-discipline), each with different queries per the redo rule. No dig required a second redo and no doc was skipped.
- Skipped docs: none.

Per-doc source counts:

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 | 12 | 7 |
| 02 | 24 | 2 |
| 03 | 24 | 2 |
| 04 | 12 | 5 |
| 05 | 24 | 3 |
| 06 | 12 | 6 |
| 07 | 12 | 2 |
| 08 | 12 | 1 |
| 09 | 24 | 6 |

Docs 02, 03, 07, and 08 lean on weakly-weighted practitioner sources; every claim backed only below 0.5 is labeled weak in the doc text.

Preflight 2026-10-05: searXNG 195 results healthy; /api/decide (clef) 200.
