# 09: Planning discipline and drift control

Scope: the source doc's planning-discipline section and the drift-control layers the doc itself carries: least-privilege coverage, continuous and adaptive coverage, and the dated drift check. Internal-record subtopic: grounded in the source doc; no dig.

## Planning discipline

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) requires that "substantial planning and research cycles should leave a dated note under refs/" (source doc). It names the current cycle as refs/planning-cycle-2026-07-11.md, which records the latest consistency corrections and research sources (source doc).

This is the same evidentiary posture as the rest of the mission: decisions are recorded where they can be checked later, and the record is dated so that staleness is detectable. The doc applies to its own maintenance the standard it applies to builds: nothing floats free of provenance (source doc).

## Least-privilege coverage

The doc carries an explicit least-privilege coverage section (source doc): Linux capabilities (drop plus ambient), ProtectSystem/ProtectHome, rootless execution, dynamic user, RBAC, and PrivilegeBoundary, with sandbox or jail idioms (bwrap, nsjail, landlock, seccomp) used where isolation is preferred over containerization (source doc).

Within the corpus this section is the doc's declaration of how the mission's authority-restriction principle extends from keys (doc 05) to processes: the same "no authority it does not need" logic that forbids OEM keys applies at the capability and sandboxing layer (source doc).

## Continuous and adaptive coverage

The doc also states that it supports the yubiOS continuous-monitoring layer: runtime detection (falco, tracee, tetragon, kubeArmor), adaptive policy, and real-time monitoring, with the document observable from the runtime-detect surface and alerts and metrics feeding the audit-evidence rollup (source doc).

This ties the mission to the verification layers: dm-verity (doc 03) covers the disk, the supply-chain gate (doc 02) covers the build, and the runtime-detection layer covers what happens while the system is running. The doc treats these as one coverage stack, not independent features (source doc).

## The 2026-09-18 drift check

The doc ends with a dated drift note: "MISSION.md (round-9 cycle-7 repaired): the mission statement is unchanged; the round records (7-11) are consistent with it; note additive" (source doc). Dated 2026-09-18, from wayfinder round 11, cycle 27 (source doc).

The drift check is the doc's own example of the discipline it prescribes: a dated, additive note confirming that the mission statement survived the intervening rounds unchanged and that the recorded rounds remain consistent with it (source doc). Last reviewed 2026-07-11 at the top of the doc (source doc); the drift note of 2026-09-18 is the most recent maintenance record inside it.

## Reading the discipline structurally

Every element in this doc is a record with a date and a location: the planning cycle under refs/, the drift check dated in the doc, the review date at the top. None of it depends on anyone's memory, which is the doc's own standard applied to itself: the mission's upkeep is structured so a future maintainer (human or machine) can verify continuity rather than trust a summary of it (source doc).

## Sources note

This is an internal-record subtopic: no dig was run (docs-mint variant speed optimization 4). The planning-discipline requirement, the two coverage sections, and the 2026-09-18 drift check are all statements inside the source doc about the project's own records and processes, so the source doc is the correct and sufficient ground. The corpus dates both anchors it cites: last reviewed 2026-07-11 (doc header) and drift-checked 2026-09-18 (doc tail), both from the source doc.

## Placement in the corpus

Docs 01 through 07 of this corpus cover what the mission demands; docs 08 and 10 cover what it constrains and how it maps to mechanisms. This doc covers how the mission maintains itself: the dated refs/ note, the two coverage declarations, and the drift check are the self-maintenance half of the same structure. Together they mean the mission document is itself subject to the verification discipline it imposes on code (source doc).
