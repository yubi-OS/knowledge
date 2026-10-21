# 05. Not Doing, and Why

**Scope:** Not doing (and why): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md, no external web dig

## Why a not-doing list

The one-pager closes its plan with an explicit list of what the MVP will not build and why. Each exclusion protects the core measurement from scope creep and from acting on verdicts before they are trustworthy.

## Exclusion 1: powered-lens actuation (V3)

- **Clef MVP probability**: 0.007.
- **Reason**: the measure-then-correct loop is the follow-on once the two-axis oracle measures. It builds on the oracle, not ahead of it.

The grounding section (doc 02) shows the lens idea is mathematically sound: a lens is a fractional Fourier transform, and adaptive optics is the canonical measure-then-correct loop. But adaptive optics only works when the measurement is trustworthy, and its failure modes (unmeasured modes, non-common-path error, servo lag) are exactly what happens when correction outruns measurement. Building the actuator before the sensor is validated would reproduce those failures.

The companion solo log scores V3 highly on its own terms (advance 0.7083, testable 0.8484) and labels it "strongest as follow-on actuation, not MVP". The exclusion is about order, not merit.

## Exclusion 2: router pair-bands (V4)

- **Reason**: consume the oracle after it exists.

Router pair-bands would route work based on oracle verdicts. That makes V4 a consumer, not part of the instrument. Building a consumer before its producer means guessing the producer's output format and reliability. The later hierarchy-router build used deterministic edge-standard D bands first, consistent with this ordering.

## Exclusion 3: intake product surface (V5)

- **Reason**: plumbing, not measurement.

An intake surface is how users would submit artifacts. It adds no measurement capability. The solo log notes V5's measurement core is identical to V1 and V2, so building V5 first would add surface area without adding any new reading.

## Exclusion 4: new models and parameter retunes

The one-pager excludes:

- any new model deployment;
- any D-window or coverage retune.

The second exclusion connects to edge-standard-v1's version rule: changing the coverage target, the minimum component, or the scale window is a major version bump that invalidates prior measurements. The oracle builds on top of edge-standard-v1; retuning it during the oracle build would move the ground under the gold calibration. The doc's phrase is "major version bumps only".

## The exclusions as a dependency statement

| Excluded item | Depends on | Status at MVP |
|---|---|---|
| V3 lens actuation | trustworthy oracle | deferred |
| V4 router pair-bands | oracle verdict format | deferred |
| V5 intake surface | nothing new to measure | deferred |
| Model deploys | n/a | excluded |
| D/coverage retune | would break versioning | excluded |

## Consistency with the later SPEC

The SPEC's out-of-scope list repeats the same items: powered-lens actuation (V3), router pair-bands (V4), intake surface (V5), a console card, and any `admitted` flip. It adds the console card and states the reason for no admission flip: the oracle is a consistency instrument, not a taste axis. The SPEC also states that these follow-ons are gated on the MVP measuring clean.

## What the list protects

1. **Measurement integrity**: nothing acts on a verdict until the verdict has passed its gold table.
2. **Version stability**: the D instrument underneath stays fixed.
3. **Build focus**: lanes spend effort on the instrument, not on surfaces and consumers.

## Reading the list later

When a follow-on is proposed, this list is the precondition check. If the oracle has not yet passed its gold table and parity on the live route, the follow-on is still out of scope.
