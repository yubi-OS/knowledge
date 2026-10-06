# 02 - Debug doctrine: the four decision rules

Scope: the four rules the playbook states up front, with the run evidence that backs each one.

Internal-record subtopic: the doctrine is stated and evidenced entirely inside the source doc (yubi-OS/yubiOS playbooks/sealed-uki-vm-debug.md), so this doc ran no searXNG dig and cites the source doc throughout.

## Rule 1: diff against the canonical, never improvise

The playbook's rule 1 says the canonical is right: when the sealed-UKI stub disagrees with `ci_mkosi-installer.yml`, the stub is wrong (source doc). The evidence is concrete: the stub diverged from the canonical in 7 or more ways, and the divergence was the bug in every case (source doc). Practically, this means before hypothesizing about a failure, diff the workflow against the canonical and enumerate the deltas. The canonical carries the SoftHSM bootstrap and the `mkosi --secure-boot-key-source provider:pkcs11` invocation that the stub must reproduce (source doc, doc 01).

## Rule 2: trust nothing in the workflow's own comments

Comments in the workflow file are not evidence. The source doc records the canonical burn: V25's comment claimed "systemd-sbsign is part of systemd", and trusting that comment burned V26 and V27 (source doc). The truth was that the binary ships inside the systemd package at `/usr/lib/systemd/systemd-sbsign` and is not on PATH (doc 04). Two runs were spent confirming what a correct comment would have said in one line. The general form: a comment describes intent, not mechanism; verify the mechanism before acting on the comment.

## Rule 3: check parse state before step logs

Rule 3 orders the investigation: check the run's parse state before reading any step log (source doc). A run with `conclusion=failure` that finished in about 0 seconds is not a step failure at all; it is a YAML parse failure, and the jobs API proves it with `total_count: 0` (source doc, doc 03). Reading step logs for a run that never started a step is the trap: there are no step logs, only a parse state. The playbook gives the exact probe, a `curl` of the jobs API piped to `jq '.total_count'` plus a one-line `python3 -c "import yaml; ..."` that parses the workflow locally (source doc).

## Rule 4: one change per iteration, with a verifying step

Every fix so far uncovered the next failure, which is exactly why iterations must carry one change each (source doc). If a fix bundles two changes and the run changes color, the run cannot say which change did it. The V25 to V39 timeline in doc 08 is the demonstration: rows 1, 2, 3, 4, 5, 6, and 0 each fell in sequence, and the run-to-run commit history shows one variable at a time. A verifying step is part of the rule: each change ships with a step that proves the change did what it claimed, so the next failure is attributable.

## What skipping a rule cost, in runs

The timeline in doc 08 prices each rule. Skipping rule 3 cost the two parse-failure runs, V37 and V38: both dispatched, both failed in about 0 seconds with 0 jobs, both catchable by a local PyYAML parse before dispatch (source doc). Skipping rule 2 cost two runs, V26 and V27: one comment in the workflow file, wrong about systemd-sbsign, survived one iteration each before the real mechanism (full path, no dnf package) was established (source doc). Skipping rule 1 cost the whole V25 to V39 stretch in aggregate: 7 or more divergences from the canonical, each discovered the slow way (source doc). Rule 4 is the multiplier on all of the above: because every fix uncovered the next failure, a run spent on a bundled or unverified change is a run that cannot be attributed (source doc).

## How the rules compose

The rules are ordered for use, not importance. Rule 3 first (is the YAML even parsing), then rule 1 (diff against canonical), then rule 2 (ignore the comments while diffing), then rule 4 (change one thing, verify it). The playbook's row 0 is rule 3 turned into a decision-tree row; the doctrine section and the decision tree describe the same discipline at two altitudes. The cost data backs the discipline: about 15 runs in 2 days, with roughly half spent on failures the logs misdescribed (source doc). Rules that reduce misreading are worth more than cleverness here.
