# 06 - Campaign waves 0 through 3

Scope: the 4-wave campaign architecture, each wave's trigger, duration, theme, and deliverables, from the quiet Wave 0 credibility foundation through the Wave 3 ARM64 owner-root launch.

Grounding spine: yubi-OS/yubiOS docs/PR.md, section "Campaign architecture". Internal-record subtopic, no dig; all claims are source-doc claims.

## Wave 0: credibility foundation

Duration: 2 to 4 weeks, dependent on engineering. No broad announcement in this wave (source doc: yubi-OS/yubiOS docs/PR.md).

Deliverables (source doc):

1. Fix Gate 0 repository hygiene and public claims.
2. Create a one-page evidence dashboard that maps claims to current artifacts and tests.
3. Record a 5-minute architecture walkthrough using the identity-root/platform-root distinction.
4. Prepare a press kit with logo, project screenshots, diagrams, bios, FAQ, fact sheet, and independence notice.
5. Establish role-based press and security contacts plus a response rota.
6. Capture baseline search visibility, referral traffic, stars, forks, contributors, issue quality, and newsletter/community size.

Wave 0 is the measurement baseline: deliverable 6 exists so that later waves can be judged against recorded starting values, not memory (source doc).

## Wave 1: build in public

Duration: 4 to 8 weeks. Theme: "Here is the trust boundary; help us break the assumptions" (source doc).

The wave publishes a weekly evidence series, not a stream of generic project updates. The 7 planned posts (source doc):

1. Why identity root and platform root are different.
2. Why PIV signs the UKI while FIDO2 unlocks the disk.
3. What FIDO2 unlock survives across updates, and what it does not attest.
4. How dev software-authenticator images are prevented from crossing into production.
5. What an ARM64 VM proves, and what only a real board can prove.
6. Recovery as a security property: backup key, lost token, and bad update.
7. What AI-resilient means without pretending that signatures make bad code safe.

Each post must contain one new artifact, one limitation, one specific request for help, and one canonical repository link (source doc). That 4-part structure makes every post both an evidence increment and a contribution funnel.

## Wave 2: proof milestone

Trigger: Gate 2 passes. Theme: "One key, four owner workflows, one reproducible proof" (source doc).

The physical-YubiKey demo is packaged as (source doc):

- A concise announcement with tested hardware and versions.
- A raw evidence bundle: logs, commands, signatures, digests, recovery outcome, and known gaps.
- A narrated demo showing PIV signing, FIDO2 unlock, SSH, and PAM without editing out failure handling.
- A technical explainer on why this does not eliminate every TPM, firmware, or runtime trust boundary.
- Targeted briefings to a small number of Linux and security outlets.

The unedited-failure-handling requirement and the explainer that bounds the demo's claims are what keep Wave 2 inside the claim ledger's boundaries (source doc).

## Wave 3: ARM64 owner-root launch

Trigger: Gate 3 passes. Theme: "From a key in your hand to a chain below the kernel" (source doc).

Lead with real-board evidence, not feature count. Before sending any pitches, publish the provisioning ceremony, fuse safety model, Path A/Path B comparison, independent review, recovery demonstration, and artifact verification (source doc).

## How the waves bind to the gates

Wave 0 executes Gate 0. Wave 1 runs under Gate 1 evidence requirements. Wave 2 fires only on Gate 2, and Wave 3 only on Gate 3. The wave plan and the gate ladder are the same structure viewed from communications and engineering respectively: a wave cannot be pulled forward, because its trigger is a gate whose required evidence is checkable in public (see doc 05; source doc).
