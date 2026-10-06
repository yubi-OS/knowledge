# 03. Milestone SecTime: Secure-World Time Evidence

Scope: Milestone SecTime researches whether RK3399/RK3588 yubiOS boards can make trustworthy time claims from the secure world, before those claims are allowed to back attestation, logs, replay windows, or freshness policy.

## Why time needs its own milestone

The goal statement frames time as a precondition for other security claims, not a feature: the question is whether secure-world time is trustworthy "before those claims are used for attestation, logs, replay windows, or freshness policy" (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). Every downstream mechanism that assumes time moves forward needs an answer to where the time came from and who could have moved it.

## The research shape

Five research directions are recorded (source doc):

- Audit the TF-A, U-Boot, and OP-TEE board configuration for the secure time path, "starting with `CFG_SECURE_TIME_SOURCE_CNTPCT`, OP-TEE AArch64 timer handling, and TF-A `SPD=opteed` integration" (source doc).
- Distinguish an ARM generic timer counter read from secure world from a board-backed secure RTC, an RPMB monotonic counter, or a normal-world/REE time fallback (source doc).
- Define what "secure enough" means for yubiOS: monotonic within a boot, stable across suspend/resume, resistant to normal-world tampering, and explicit about power-loss and reboot limits (source doc).
- Add an OP-TEE smoke test or TA-level probe that records monotonic reads and failure behavior on RK3399 and RK3588 hardware (source doc).
- Keep policy claims out of SPEC.md until the clock source, rollback behavior, and recovery path are source-backed and board-tested (source doc).

The distinction in the second bullet is the technical core: a counter that resets at every boot (a generic timer counter) cannot serve the same role as a counter that survives power loss (an RPMB monotonic counter or battery-backed RTC). The doc does not pick a winner; it demands the evidence be separated by source.

## What the dig adds

OP-TEE's porting guidelines are the natural home for the `CFG_SECURE_TIME_SOURCE_*` configuration axis the doc names (weight 0.78, https://optee.readthedocs.io/en/latest/architecture/porting_guidelines.html), and an OP-TEE platform page documents how platform ports configure the time source (weight 0.73, https://optee.readthedocs.io/en/latest/architecture/platforms/qualcomm/index.html). An upstream optee_os issue titled "core broken when CFG_SECURE_TIME_SOURCE_REE=y since commit 82f97f19" is direct evidence that the REE-backed time path is a real and historically fragile configuration, which supports the doc's insistence on auditing the actual board configuration rather than assuming a default (weight 0.69, https://github.com/OP-TEE/optee_os/issues/1371).

On the counter side, OP-TEE's secure storage documentation describes the RPMB-backed storage layer that the doc names as one candidate counter source (weight 0.79, https://optee.readthedocs.io/en/latest/architecture/secure_storage.html), and NXP's application note AN14105 covers secure-element monotonic counters and secure storage, an example of the same mechanism class on a different platform (weight 0.80, https://docs.nxp.com/bundle/AN14105/page/topics/monotonic_counter_and_secure_storage.html). PEP 418, the Python monotonic-clock standard, is cited only as a neutral definition of what "monotonic" means in an API contract (weight 0.74, https://peps.python.org/pep-0418/). Intel's monotonic counters documentation for its Dynamic Application Loader sits just under the 0.5 line (weight 0.47, https://www.intel.com/content/www/us/en/docs/dynamic-application-loader/developer-guide/1-0/monotonic-counters.html) and is labeled weak.

Independent write-ups on the difficulty of sourcing secure time are weak-backed: Hanno Boeck's "In Search of a Secure Time Source" (weight 0.21, https://blog.hboeck.de/archives/890-In-Search-of-a-Secure-Time-Source.html) and Tony Finch's quorate secure time proposal (weight 0.12, http://fanf.livejournal.com/128861.html). They support the general claim that secure time is a known hard problem, nothing more.

## Evidence needed before promotion

Four artifacts are required (source doc):

- A source-backed note under `refs/` identifying the active OP-TEE secure time configuration for RK3399 and RK3588.
- A hardware log showing secure-world monotonic reads across boot, suspend/resume, and expected failure cases.
- ADR coverage for which security decisions may rely on secure-world time and which must use a stronger counter, sealed state, or remote attestation freshness.
- Recovery guidance for boards with only REE-backed time or with ambiguous secure clock wiring.

The structure mirrors Milestone F: concrete artifacts, tied to specific boards, with the SPEC boundary enforced until the evidence lands.

## Sources for this doc

Ground spine: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Dig results weighted by jev noul as cited inline; 12 results kept, 6 with weight 0.5 or higher.
