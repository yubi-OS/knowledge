# 03-item-3-agent-md-kv-canonical

**Scope.** Item 3: AGENT.md, KV canonical: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md, no external web dig

## Jenny's ruling

The ground source states the premise of item 3 up front: the canonical AGENT.md copy is the KV copy, per Jenny's ruling. AGENT.md exists in two places: a KV-served copy (the one live agents fetch) and a git mirror at `tools/point-map/AGENT.md`. Item 3 checks whether the two had drifted and what syncing would cost.

## The diff check

The git mirror was a strict subset of the KV copy.

- All 518 mirror lines appear in the KV copy in the same order.
- None is replaced or removed.
- KV adds 78 lines in three blocks: the operator close route, the gold oracle form, and the G2 verdict line.

So the KV copy had about 596 lines (518 plus 78) and the mirror simply lagged. Syncing the mirror to KV therefore loses nothing. This is the cleanest possible drift outcome: a subset relation means a one-directional sync is lossless, and no merge decision is needed.

## Why the subset test matters

A naive diff between two copies of a document can look alarming (78 lines differ) without saying whether a sync destroys information. The record's check is stronger: it confirms that every mirror line is present, in order, and unmodified in KV. Under that condition, overwriting the mirror with the KV bytes is safe by construction. Had any mirror line been absent from KV, the sync would have needed a human decision about which content wins, even with KV declared canonical.

## The KV change for item 1

Item 1 changed router policy (v24), so AGENT.md's router section had to change too. Three asserted replacements were made in KV:

1. The route description: walk d_w is diagnostic only since v24.
2. The band lineage: a v24 entry.
3. The band-location note.

"Asserted replacements" means each edit checked that the expected old text was present before replacing it, so an edit could not silently apply to the wrong region.

## Propagation and verification

The served bytes matched the edited copy after the propagation delay, verified on the third check, 20 seconds apart. KV is eventually consistent, so an immediate read-back can return the old value; the record polls until the served bytes match, which took up to about 40 seconds across three checks. Only then was the git mirror synced to the same bytes. The order matters: canonical first, verified, then mirror.

## Content errors found, reported, not fixed

The check surfaced six content errors in the KV copy. They were reported and deliberately not fixed in this pass:

| # | Location | Error |
|---|---|---|
| 1 | Policy line | Says policy v21 is live; health reports v24. The approver allowlist claim tied to v21 may also be stale |
| 2 | Line 108 | Unescaped pipes in the audio path row split a table row |
| 3 | Lines 232, 234, 241 | Unescaped pipes inside code spans split rows |
| 4 | Line 235 | The placements map_url points at /map/, which returns 410 |
| 5 | Lines 175 to 195 | The status of the close route and the stale-dispatch sweep is unclear |
| 6 | Whole file | 25 em dashes on 21 lines, against the no-em-dash rule |

Decision for Jenny: fix these in KV first, then re-sync the mirror.

## Why report rather than fix

The item's scope was drift and the item-1 router edits. Fixing six unrelated content errors in the canonical copy would have mixed scope and made the asserted-replacement audit harder to read. Reporting them keeps the KV change set minimal (three asserted replacements) and leaves content decisions with the canonical owner. It also preserves the subset relation for the next sync: if fixes are applied in KV first and the mirror is re-synced afterward, the mirror again becomes byte-identical.

## Two error classes worth naming

Errors 2 and 3 are a markdown hazard: a literal pipe inside a table cell, including inside a code span, terminates the cell in most renderers unless escaped. Error 4 is a dead link (410 Gone), and error 1 is a stale version claim. Errors 1 and 4 are the dangerous ones for an agent-facing document, because an agent reading AGENT.md would act on a stale policy version or a dead endpoint.

## Clef note

The outline score for this subtopic is the lowest in the corpus (0.4213), meaning the clef validation rated it close to padding. It is kept because the item is short but self-contained, and because the canonical-copy ruling governs how every later AGENT.md change must be made.
