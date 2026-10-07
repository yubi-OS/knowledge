# Evidence and Pinned Assumptions: the mandatory second half of PWC

*This doc explicates the cost section of yubi-OS/yubiOS docs/PWC.md, the second half of the doctrine: what pays for dissolving the controller, and what a PWC claim must name to be honest.*

## The structural weakness: no one is watching

A controller-free program has exactly 1 structural weakness. When a load-bearing assumption breaks, no 1 is watching, because there is no 1. The controller was not just an intervener; it was also a listener. Dissolve it and the system loses its capacity to notice that the world changed under it.

PWC does not accept that loss as a cost of the design. It prices the loss in and pays for it, with 3 instruments named in the source doc: evidence, pinned assumptions, and honest scope. All 3 are mandatory. A controller-free mechanism that ships without them is not PWC, it is ungoverned.

## Sub-claim 1: evidence is the alarm that replaces the watcher

A controller-free mechanism must be observable enough that a broken assumption produces a detectable signal. The source doc names the signal classes:

- a verification failure (the mechanism itself refuses, loudly, at the moment of use),
- a logged measurement (the act of checking leaves a trace an auditor can find),
- a build attestation that stopped matching (the pin no longer describes the artifact),
- an audit trail an outsider can replay (someone who was not present can reconstruct what happened and detect the lie).

The append-only record is not a nicety. It is the alarm that stands in for the watcher that no longer exists. Where control-by-record is the mechanism, the record is not merely evidence, it is the control itself: nothing intervenes and nothing needs to, because the event is captured in a form that makes the lie detectable later.

## Sub-claim 2: every structural control rests on pins

Every structural control rests on assumptions. The source doc names 3 kinds:

1. a kernel feature floor, the minimum kernel that carries the mechanism,
2. a signer that behaves, the authority whose key must keep signing correctly,
3. a format that stays stable, the structure whose layout must not shift underneath the check.

Those assumptions are pins like any other input. They are named, dated, and re-checkable. The failure mode is specific: a floor that silently shifts is a control that silently stopped. Nothing errors. Nothing alarms. The mechanism simply no longer holds, and because there is no watcher, nothing notices.

The drift discipline is the repository's PINNED.md discipline: historical evidence is not a current pin. The fact that a mechanism worked on kernel 6.x last year is not the pin; the pin is what is true now, dated now, and re-checkable now. An assumption that has stopped being verified has stopped being an assumption and become a hope.

## Sub-claim 3: honest scope, the claim is about where the control moved

A PWC claim is a claim about where the control moved, not about safety in the abstract. A doc or ADR that adopts a controller-free mechanism says:

- which mechanism replaced the watcher: construction, verification at use, or record,
- what evidence proves the replacement still holds.

Both, not either. Naming the mechanism without the evidence is a promise with no alarm wired to it. Naming evidence without the mechanism is a log with no claim attached. PWC without a named mechanism is just ungoverned, and the source doc's non-negotiable says it plainly: no controller-free mechanism ships without naming the structural mechanism that replaces the watcher, and evidence is not optional in PWC, it is the 2nd half of the claim.

## What this section buys the doctrine

The 3 instruments close the loop the doctrine opens. PWC removes the watcher and inherits the watcher's job of noticing. Evidence is the noticing. Pins make the noticing checkable over time, so drift is caught before it becomes compromise. Honest scope makes the claim auditable: a reviewer can ask "which mechanism, what evidence" and get an answer that either stands or fails in the open. The watcher is gone, but its duties, intervene at the boundary, notice the drift, state the truth, are redistributed to structure, record, and pinned dates.

The inverse test is short: if you cannot name the mechanism and the evidence, you have not dissolved a controller, you have removed 1.

## Sources

None. Internal-record doc, grounded solely in yubi-OS/yubiOS docs/PWC.md.
