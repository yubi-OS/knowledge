# CI/hardware boundary: what can be tested, and what is blocked

Scope: Deciding whether the work is testable without main CI or hardware, or is explicitly blocked on a named lane or board.

## The gate question

The promotion gates document (yubiOS refs, roadmap-promotion-gates, 2026-07-17) requires: "Can this be tested without main CI/hardware, or is it explicitly blocked on a named lane/board?" The gate forces an honest split between the part of a claim that ordinary CI can exercise and the part that needs physical hardware. Items that conflate the two either over claim (a CI pass presented as hardware proof) or stall (a whole item blocked when half of it was testable).

## Embedded CI reality: the board on the desk

Embedded testing literature describes the default failure mode directly. A hardware in the loop guide observes that in cloud deployments CI/CD is taken for granted, but in embedded, a lot of testing still happens on a board sitting on someone's desk, where tests pass on a laptop, the board behaves on the bench, and then someone else on the team or in the field sees a failure nobody can reproduce; HIL is the proposed answer (https://www.embeddedci.com/resources/getting-started-with-hil, jev weight 0.47, weak backing). The same source collection shows HIL applied concretely: sampling digital and analog lines on a logic analyzer and turning stall detection into a repeatable CI regression test on hardware cheap enough to leave permanently wired to the target (https://www.embeddedci.com/resources, jev weight 0.46, weak backing). A practitioner discussion of embedded CI/CD strategies reports that teams investing in CI/CD for embedded systems see improvements in reliability, faster debugging, and more predictable releases (https://dev.to/semaphore/what-cicd-strategies-work-for-embedded-or-iot-projects-that-require-hardware-testing-39p2, jev weight 0.33, weak backing).

These sources are below the 0.5 weight threshold, so they carry weak backing and are used here as corroborating practice rather than authority. They support the gate's premise: the hardware half of a claim is a distinct testing problem, and it needs its own lane.

## What emulation can and cannot carry

Research on CI for latency sensitive network systems states the constraint precisely: enabling CI cycles for network protocols and services poses a significant challenge due to the necessity of building complete and complex networks for testing and verification, a process that demands robust simulation, emulation, or a variety of hardware resources (https://ieeexplore.ieee.org/document/11078620, jev weight 0.63, authoritative). Emulation extends what CI can cover, but the sentence makes clear that hardware resources remain a separate category of requirement for some claims. A CI research paper studying developer motivations and barriers frames the tradeoff space of CI systems as spanning assurance, security, and flexibility (http://dig.cs.illinois.edu/papers/Hilton_CI_Tradeoffs.pdf, jev weight 0.60, authoritative): adding a hardware lane increases assurance but buys it with operational flexibility.

## Mapping to the source doc's applications

The recorded applications show the gate operating as a scope limiter (yubiOS refs, roadmap-promotion-gates, 2026-07-17):

- Firmware RK tags were promoted to CI workflow metadata/publish routing only; real board divergent payloads remain hardware lane work. The CI half was promoted; the hardware half was explicitly named as blocked on the hardware lane.
- Frost is held at research/design with kernel prototype and RK hardware recovery evidence still required. The item cannot be promoted further until its hardware evidence target exists on the named hardware.
- SecTime is held at research/design with hardware proof required before production claims.

The consistent move: promote exactly the testable slice, and name the blocking lane for the rest rather than pretending the hardware claim is covered.

## Authoring guidance

The answer has 3 parts:

1. Testable without main CI/hardware: which claims unit tests, emulators, or dry runs in a normal CI run can exercise.
2. Hardware bound: which claims require physical hardware, named by board or lane.
3. Blocking declaration: for hardware bound claims, the named lane or board they wait on, so the block is a tracked dependency rather than an unbounded maybe.

An item may legitimately promote its CI testable half while its hardware half stays watch listed; that is what the gate is for. What the gate forbids is the unexamined middle, where nobody has decided which half a claim belongs to.
