# 08 - The Verified working record: V25 to V39, and the green state at V83

Scope: the failure timeline the playbook records, its honest status line, the lane-opening PRs, and the green boot-timing state at V83.

Internal-record subtopic: this doc records run and PR history stated entirely inside the source doc (yubi-OS/yubiOS playbooks/sealed-uki-vm-debug.md), so it ran no searXNG dig and cites the source doc throughout.

## The status line the playbook insists on

The Verified working section is a failure timeline, not a green run: as of its date (2026-08-01) the lane had not yet produced a green signed-UKI build (source doc). Any reader of the playbook must carry that caveat forward; the green state exists only later, via the V83 boot-tuning commit recorded below.

## The timeline

| Run | Commit | V | Failure (row) |
|---|---|---|---|
| #33 | `9c9cde13b4` | V25 | sbsign not found, ephemeral container (row 1) |
| #34 | `ec5941c8dd06` | V26 | same; the comment was wrong (row 1) |
| #35 | `118fc04a6c62` | V27 | `No match for argument`; URI `;` split bash (rows 1, 2) |
| #37 | `9fb28b6d5198` | V28 | `cpio: chown failed` on `/var/lib/softhsm` (row 3) |
| #38 | `a5b4c97822f0` | V29 | cert missing at `/output/pki/sb.crt` (row 4) |
| #40/#41 | `4def8b47ce64` | V30 | dup dispatch; cert-verify diagnostic found no fault |
| #42 | `8ed444b93931` | V31/V32 | single-`docker run` merge (row 4) |
| #43/#44 | `c5516b4f8c0a`, `1968d4da644f` | V33/V34 | base64 cert env var; `EISDIR` (row 4) |
| #45 | `4d75c23ccf19` | V35 | `EISDIR` persisted; cross-mount tried |
| #46/#47 | `40269e13236a`, `28dc9a10433f` | V36 | cross-version BDB I/O error (row 5) |
| #48 | `a50ecac42cc0` | V37 | 0 jobs, colon in step name (row 0; row 6 latent) |
| #49 | `bbdebc4177b0` | V38 | 0 jobs, same class (row 0) |
| #50 (30610224165) | `3211e25a617e` | V39 | YAML parses (3 jobs, PyYAML-verified); awaiting PKI gen + signing |
| #51 (30610238585) | none | none | duplicate of #50, created 17 s later, cancelled (202) |

(source doc). Reading the table as a debug curriculum: rows 1 and 2 open the record, row 3 is a container-state surprise, rows 4 and 5 are a two-row detour through mount topology, row 0 closes the parse-failure class, and V39 is the first parse-clean state, still awaiting the PKI generation and signing steps.

## Operational facts the timeline encodes

Two operational notes ride alongside the table (source doc). The `/runs/{id}/logs` endpoint 404s after about 15 to 30 minutes, so the timeline was diagnosed from the file diff, not from logs. And duplicate dispatches land 10 to 20 seconds apart; run #51 was created 17 seconds after #50 and was cancelled via the list-and-cancel call, which returns 202.

## Where the green state came from

The lane history around the timeline (all source doc):

- PR #154 (`1c284b48826f`, "feat(ci): sealed UKI Secure Boot VM lane (companion to ci_test_bootc-filesystem.yml)") opened the lane on 2026-07-31. The source doc records this lane as the one that did go green.
- PR #155 (`0cb68518bef0`, "feat(ci): fill in ci_test_sealed-uki-vm.yml stub (OMN-53 sealed UKI VM lane)") was merged; it filled in the stub that the V25 to V39 debugging was iterating on.
- Commit `1d0666d77c0b` ("ci(V83): arm64 boot_timeout 900->1200s (TCG slack)") tuned the arm64 boot timeout from 900 to 1200 seconds to absorb TCG-emulated boot slack, and that state is GREEN at run 30652859000 (source doc).

The V83 lesson is specific: on emulated hardware, boot-time budgets are part of the lane's correctness, and a timeout that is tight on real hardware is not tight the same way under TCG. The playbook records the green run id (30652859000) as the anchor for that state.

## Supporting record

The playbook points at two supporting documents (source doc): the day-by-day narrative lives in `documents/.../sealed-uki-vm-debugging-journal-2026-07-30.md`, and the row 7 ECDSA finding is source-verified in `.../sealed-uki-vm-pkcs11-ecdsa-deepdive-VERIFIED-2026-07-31.md`. Those are the primary narrative artifacts behind this timeline; this corpus doc summarizes what the playbook itself records.
