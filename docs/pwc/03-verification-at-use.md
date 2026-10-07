# 03: Verification at Use

*Scope: mechanism 2 of PWC, where the check and the use are the same act, and what that buys: no TOCTOU, no watcher, no gap.*

## The race that verification at use dissolves

The standard failure this mechanism targets has a name and a taxonomy. Time-of-check to time-of-use (TOCTOU) is the weakness class where a program checks a property of a resource (a permission, a signature, an identity) and then acts on that resource as a separate, later operation, so the state can change between the two. CWE-367 classifies it as a base weakness, mapped for use against real-world vulnerabilities (weight 0.75). It sits under CWE-362, the general race condition class (weight 0.32, weak backing).

The shape of the bug is always the same: a check, a gap, a use. A racing thread or process substitutes a different object in the gap (weight 0.41, weak backing). Every defence in the classic playbook is an attempt to manage the gap: reopen the file after the check and re-verify, hold a lock across both operations, shrink the window and hope. None of them removes the gap; they only make it smaller or narrower (weight 0.41, weak backing).

PWC's answer is structural, not managerial: eliminate the gap by making the check and the use one act. If the verification happens inside the mechanism that performs the use, there is no window in which the world can change, because the thing being verified is the thing being used, at the same instant, by the same instrument.

## dm-verity: the control is the mapping

PWC.md gives the canonical yubiOS instance: dm-verity on `/usr` (ADR-007, SPEC.md principle 3). There is no file-integrity daemon scanning the root filesystem, no agent that finds a tampered file and quarantines it after the fact. Verification lives in the read path itself: the device-mapper mapping is the control. A poisoned byte does not get caught later by a watcher; it fails to read. The read request is the check and the read result is the use, in one act, in kernel space, by a mechanism that cannot be talked out of its verdict.

This is exactly the TOCTOU elimination the race-condition literature describes as the strongest fix, arrived at by architecture rather than patch (weight 0.41, weak backing for the general claim; the yubiOS instance is grounded in PWC.md and ADR-007). Notice what was removed: an integrity daemon is a controller in the PAC sense. It runs on something, it can be subverted, it only sees its own vantage, and stopping it converts "the system is safe" into "the system is safe while the scanner is running." The device-mapper target has none of those properties. It is structure, not process.

## Verified boot chains: verification all the way down

The same pattern extends before the OS ever starts. A verified boot chain is a sequence where each stage verifies the next as a condition of transferring control: the image is either boot-verified or the previous deployment is still there. yubiOS's atomic A/B updates make this structural: no controller watches an update for safety, because rollback is a property of the deployment layout, not a supervisory decision. The boot either presents a verified state or falls back to the last known-good one, and no process had to be watching at boot time for that to hold.

The composefs signed catalog completes the picture at the file level: the catalog pins every file's digest and the mount refuses anything that does not match. No process compares hashes; the mount is the comparison. Again the check and the use are the same act: mounting the filesystem is simultaneously the verification of it.

## What the mechanism costs

Verification at use is honest about its limits, and PWC.md says so. It is weaker than control by construction, because the unsafe state still exists and is still reachable: it is simply refused at the moment of use, every time. And it rests on pinned assumptions: a kernel feature floor, a signer that behaves, a hash format that stays stable. A floor that silently shifts is a verification that silently stopped. That is why the evidence half is not optional: a verification failure, logged and observable, is the alarm that stands in for the watcher this mechanism dissolved.

The decision rule from PWC.md's table applies: when the unsafe state is reachable but foreign, choose verification at use, because there is no gap between check and use and therefore no TOCTOU. When the state can be made unreachable entirely, prefer construction (doc 02). When it must be allowed to pass but not silently, record is the instrument (doc 04).

## Sources

| source | url | jev weight |
| --- | --- | --- |
| CWE-367: Time-of-check Time-of-use (TOCTOU) Race Condition | https://cwe.mitre.org/data/definitions/367.html | 0.75 |
| TOCTOU Vulnerability Defences: Eliminating Time-of-Check to Time-of-Use Races Across the Stack | https://www.systemshardening.com/articles/cross-cutting/toctou-vulnerability-defences/ | 0.41 |
| What Is TOCTOU? Time-of-Check to Time-of-Use Explained | https://safeguard.sh/resources/blog/toctou-time-of-check-to-time-of-use | 0.36 |
| TOCTOU Explained: Time of Check Time of Use Race Conditions for CISSP | https://www.learnsecuritymanagement.com/cissp-toctou-time-of-check-time-of-use | 0.32 |
