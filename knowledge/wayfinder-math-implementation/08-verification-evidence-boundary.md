# 08 Verification suites and the evidence boundary

Scope: the seven test suites behind publication, the fresh-context adversarial review, the retrospective-only status of the ledger replays, and what the evidence boundary refuses to relabel.

## The suites

Verification before publication ran seven suites, all passing:

| Suite | Checks |
|---|---|
| Numerical | 57 |
| API | 36, including one explanatory marker |
| Archive | 10 |
| New math | 71, including 38,172 exhaustive graph cases and all ten recorded transitions 51 to 61 |
| New preview | 41, against real math helpers with explicit AI, cache and DB boundary doubles |
| Storage | 7 |
| Browser | 60, including mobile reachability, candidate-state preservation, error handling, escaped paths and exact guide copying |

(source doc: verification before publication section, primary project artifact)

Two design choices inside the suites deserve note. First, the new math suite is exhaustive at 38,172 graph cases rather than sampled, which is possible because the certified layer is discrete. Second, the preview suite runs against real math helpers but explicit boundary doubles for AI, cache and DB, so the boundary between proved arithmetic and external systems is tested as a boundary, not blurred (source doc: verification before publication section, primary project artifact).

## Fresh-context adversarial review

A fresh-context general and smart adversarial review ran before publication. The initial review BLOCKED, exposing a D1 row-size regression and failure and labeling issues; the corrected version received PASS (source doc: verification before publication section, primary project artifact). The block matters as much as the pass: it shows the review had real power to reject, which is the property that makes an approval meaningful.

The practice has a literature behind it. Adversarial code review splits maker from checker, using fresh context and separate reasoning so the reviewer is not grading its own work (source: https://www.augmentcode.com/guides/adversarial-code-review, jev weight 0.36, weak backing). Research on AI security reviewers shows reviewers are sensitive to injected or misleading context, which is an argument for fresh context and diff-only framing (source: https://arxiv.org/abs/2602.16741, jev weight 0.82; related large-scale review at https://link.springer.com/article/10.1007/s11432-025-4703-6, jev weight 0.94). Community tooling implements the pattern as multi-model adversarial gates that run mechanical checks first (source: https://github.com/ng/adversarial-review, jev weight 0.41, weak backing).

## CI, deployment, and live verification

Publication followed a full chain of evidence (source doc: final publication section, primary project artifact):

- PR [#231](https://github.com/yubi-OS/yubiOS/pull/231) merged as commit `41d5d47889e9c83b760944067ff8a2f87be0b176`.
- Integrated branch CI run [34570655611](https://github.com/yubi-OS/yubiOS/actions/runs/34570655611) passed all three jobs.
- Main merge CI run [34570898261](https://github.com/yubi-OS/yubiOS/actions/runs/34570898261) passed.
- Cloudflare Worker deployment `3413a5a0f7f44d45a9dc0f904632ee13` verified on the existing origin, with all six public assets matching source SHA256.

Live verification then exercised the deployed system: a text baseline numbered 65 was created from 12 real refs documents, stored diagnostic packing round-tripped exactly, three previews ran clean with no persisted maps, and historical maps 51 to 52 still compare on the old frame and produce the exact -2 ledger (source doc: final publication section, primary project artifact).

## The evidence boundary

The boundary is the part most easily lost in retelling, so it is worth stating precisely. The ten exact historical ledger replays remain retrospective. Three zero outcomes were unchanged CHANGE points; three were ADDs that joined already-connected neighbours. No new prospective edit benchmark is counted, and the historical 4/10 sign agreement is not relabeled as 10/10 prediction (source doc: evidence boundary section, primary project artifact).

The distinction is not pedantry. In validation practice generally, retrospective validation tests a model on data that already exists while prospective validation tests it on data collected after the claim, and the two answer different questions (source: https://readingtheevidence.org/articles/prospective-vs-retrospective-validation/, jev weight 0.48, weak backing; see also https://usvalidation.com/kb_article/sequential-validation-approaches/, jev weight 0.44, weak backing). A retrospective replay shows the ledger reproduces history exactly. It does not show the instrument predicts future edit outcomes, and the 4/10 sign agreement is the honest summary of how often prediction matched sign in the recorded history.

## What is retained

Existing `CurvedCorpus.lean`, measurement checks, and all recorded scientific negatives are retained (source doc: evidence boundary section, primary project artifact). Keeping the negatives is the strongest signal in the whole record: a verification culture that preserves its own failed and null results is one where the 4/10 number and the blocked review stay visible instead of being quietly dropped. The final publication and deployment receipt is appended only after remote CI and live verification complete, which keeps the receipt honest by construction: nothing is recorded as published before the remote systems confirm it.
