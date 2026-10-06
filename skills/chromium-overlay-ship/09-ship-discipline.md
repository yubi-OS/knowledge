# 09 - Ship discipline: the guidelines and the durable record

Scope: the standing rules that outlive any single ship cycle. The source doc's four guidelines, the full 7-step ship sequence in one place, the durable changelog discipline (SERIES.md rows plus the COMPANY.md memory bullet appended in the same turn), and the track record that justifies the discipline.

Source doc: yubi-OS/yubiOS skills/chromium-overlay-ship/SKILL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/chromium-overlay-ship/SKILL.md).

## The four guidelines

The source doc closes with four guidelines, each of which a section of this corpus expands:

1. Never `git add .` on the box tree; tooling strays must stay out of patches (source doc; expanded in doc 02).
2. Validate every chunked patch fetch (byte count, first line, section counts) before pushing (source doc; the fetch mechanics are the bridge-based transfer described across docs 01 and 03).
3. CI verification is workflow-filtered, never head_sha-only (source doc; expanded in doc 06).
4. Append the ship record to COMPANY.md in the same turn; the SERIES row and COMPANY bullet are the durable changelog (source doc).

Read together they form a single principle: every hand-off in the pipeline (box to patch, patch to overlay, push to CI, cycle to history) is verified at the boundary, and the record is written where future cycles will actually read it.

## The full ship sequence

The source doc's ship sequence is 7 steps (source doc):

1. **Box commit**: explicit paths only, with the explicit safe.directory and identity flags (doc 02).
2. **Generate the patch**: cumulative fixup diff or new-member diff against `507c6ee3e2`, `--binary` for assets (doc 03).
3. **Fetch over the bridge in chunks**: base64 in about 130,000-character chunks, reassembled locally with a strict character filter and `base64.b64decode`, then validated: byte count equals the box `wc -c`, first line starts `diff --git`, and the `diff --git` and `GIT binary patch` section counts are checked (source doc). The reason chunking exists: long base64 written via the write tool truncates, and long heredocs break; the chunked fetch is the reliable path (source doc).
4. **Push to the overlay** via the Git Data API with a SERIES.md row insert or replace (doc 05).
5. **CI dispatch and verification**: dispatch `arm64-chromium-build.yml` on main, then workflow-filtered polling until a run exists at the new head sha and completes (doc 06). The source doc notes runs are usually green within minutes for patch-only changes (source doc).
6. **Linear comment**: resolve issue 165 in team OMN via GraphQL, then `commentCreate` with the issue id; comments are numbered sequentially (29, 30, ...) and the count is the session changelog (source doc).
7. **Memory**: append the entry (box commit, overlay sha, CI run id, the lesson) to COMPANY.md's OMN-165 bullet in the same turn (source doc).

Step 6 is covered here rather than as its own doc: the outline validation scored it as padding (0.31, see outline.json), but the sequence would be incomplete without it, so it is recorded as source-doc fact in this step list.

## The durable changelog

Two artifacts carry history (source doc):

- The SERIES.md row for each patch member, kept detailed with each fixup's story appended before the trailing columns (doc 05).
- The COMPANY.md OMN-165 bullet, appended in the same turn as the ship, carrying the box commit, overlay sha, CI run id, and the lesson (source doc).

The "same turn" qualifier in guideline 4 is the operative part. A record written later is a record that does not get written; the box commit sha and CI run id are exactly the identifiers that are cheap to capture now and expensive to reconstruct later (source doc).

## The track record

The source doc states its provenance: proven across patches 0001 through 0019 and 12+ fixups, from 2026-09-27 to 2026-10-01, with 10 ship cycles in the Oct-1 session alone, and every default encoding a failure that already cost a cycle once (source doc). That framing matters for how the guidelines should be read: they are not aspirations, they are the distilled cost of specific failures, each traceable to a failure mode (doc 08).

## When to use this skill

The source doc's description scopes it to any "commit + push + CI" cycle on the provenance-gate tree, including fixups, new series members, and release-related patches, for the yubi-OS/chromium-provenance overlay series on OMN-165 / Antimony (source doc). The worked example is the rebrand fixup: box commit, cumulative --binary patch, chunked fetch, Git Data API push with a SERIES row, CI dispatch and workflow-filtered verification, numbered Linear comment (source doc).

## What "done" means

A ship cycle is done when all 7 steps have landed: the commit exists on the box, the patch is validated and pushed with its SERIES row, CI is green at the new head sha, the numbered Linear comment is posted, and the COMPANY.md bullet is appended (source doc). Anything less leaves one of the two durable records or the verification chain incomplete.
