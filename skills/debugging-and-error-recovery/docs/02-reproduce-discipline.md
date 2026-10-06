# 02 - Reproduce Discipline

Scope: Step 1 of the triage checklist, making the failure happen reliably, and the source doc's 4-way decision tree for non-reproducible bugs (timing, environment, state, truly random).

## Reproduce before you fix

The source doc's Step 1 rule: make the failure happen reliably; if you cannot reproduce it, you cannot fix it with confidence. The reproduction-first gate is what separates diagnosis from guessing, and it is the first branch of the triage checklist: reproduce, then proceed; otherwise gather context, try a minimal environment, or document conditions and monitor.

The skill shows the mechanics with a package-manager example and immediately notes that the npm commands are a placeholder: substitute the repository's own test command, per the test-driven-development skill's Discover the Stack First section (source doc). The three moves shown are running the specific failing test, running with verbose output, and running in isolation to rule out test pollution.

## The non-reproducible decision tree

The source doc splits non-reproducible bugs into 4 classes with distinct counter-moves:

- Timing-dependent: add timestamps to logs around the suspected area, try artificial delays to widen race windows, run under load or concurrency to increase collision probability.
- Environment-dependent: compare Node or browser versions, OS, and environment variables; check for differences in data such as an empty versus populated database; try reproducing in CI where the environment is clean.
- State-dependent: check for leaked state between tests or requests; look for global variables, singletons, or shared caches; run the failing scenario in isolation versus after other operations.
- Truly random: add defensive logging at the suspected location, set up an alert for the specific error signature, document the observed conditions and revisit when it recurs.

The tree is ordered by how actionable the class is. Timing and state classes are attacked by perturbing the suspected dimension; the random class is the only one where the source doc routes to monitoring instead of forcing reproduction.

## Race conditions as the hard case

The timing branch has strong tooling support in the systems world. The kernel concurrency sanitizer work summarized by LWN describes race conditions as among the trickiest bugs to find because the resulting problems are subtle and reproducing them is hard (https://lwn.net/Articles/802128/, w 0.84). KCSAN-style watchpoint tooling exists precisely because the manual counter-moves in the source doc's timing branch (delays, load, concurrency) are low-yield for kernel-scale races.

Record-and-replay debugging is the adjacent technique for the same class: creating a program execution recording that can be replayed and interactively debugged, useful for intermittent, non-deterministic, and other hard-to-reproduce defects (https://en.wikipedia.org/wiki/Debugging, weak backing, w 0.49). Where the source doc perturbs the environment to raise collision probability, record-and-replay freezes one collision and makes it replayable; the two are complementary, not competing.

## Practitioner corroboration

Secondary practitioner sources converge on the same discipline, though at lower authority. Guides on reproducing intermittent bugs frame reproduction as the precondition for any reliable fix (https://bugpilot.io/2026/03/11/reproducing-intermittent-bugs-elusive-defect-strategies-guide/, weak backing, w 0.19), and flaky-test writeups treat converting a CI-observed failure into a locally reproducible one as the core skill (https://buglyst.com/blog/how-to-reproduce-a-flaky-test, weak backing, w 0.25). These are corroboration for the source doc's stance, not primary evidence; the source doc carries the operational detail.
