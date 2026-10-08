# Measure First Discipline

Scope: When to optimize and when not to. Measurement-before-change discipline, the cost of premature optimization, and the trigger conditions that justify performance work.

## The discipline

The ground skill (`yubi-OS/yubiOS skills/performance-optimization/SKILL.md`, the source doc) states the rule in one line: measure before optimizing. Performance work without measurement is guessing, and guessing leads to premature optimization that adds complexity without improving what matters. Profile first, identify the actual bottleneck, fix it, measure again. Optimize only what measurements prove matters.

The workflow the source doc prescribes has 5 steps: MEASURE to establish a baseline with real data, IDENTIFY to find the actual bottleneck rather than the assumed one, FIX the specific bottleneck, VERIFY by measuring again and keeping or reverting, and GUARD by adding monitoring or tests to prevent regression. Every optimization story in the corpus follows that loop, so the discipline doc is the spine the other docs hang from.

## When to start

The source doc lists 5 trigger conditions for performance work:

- Performance requirements exist in the spec (load time budgets, response time SLAs).
- Users or monitoring report slow behavior.
- Core Web Vitals scores are below thresholds.
- You suspect a change introduced a regression.
- Building features that handle large datasets or high traffic.

It also states the inverse rule explicitly: when NOT to use. Do not optimize before you have evidence of a problem. Premature optimization adds complexity that costs more than the performance it gains (source doc).

## What the wider literature says about premature optimization

The digs around the premature-optimization question are mostly weak-backed, which is itself a finding: the field's strongest claims are folk wisdom, not measured results.

The most-cited framing is Knuth's "premature optimization is the root of all evil" line, discussed at length on SoftwareEngineering StackExchange. One thread notes that the full quotation criticizes premature optimization at the micro level, not careful design up front (w 0.20, weak, [softwareengineering.stackexchange.com](https://softwareengineering.stackexchange.com/questions/80084/is-premature-optimization-re)). A related thread asks whether optimizing before profiling is always wrong; the consensus there is that measurement-driven optimization beats intuition-driven optimization, but that no rule is absolute (w 0.24, weak, [softwareengineering.stackexchange.com](https://softwareengineering.stackexchange.com/questions/63986/is-it-always-wrong-to-optimi)).

Practitioner write-ups repeat the cost argument. A Qt engineering article frames premature optimization as over-engineering that must be justified by measurements rather than by instinct (w 0.44, weak, [qt.io](https://www.qt.io/software-insights/premature-optimization-stop-over-engineering)). A performance-lab blog argues bottlenecks should be profiled before any optimization pass because most intuitive fixes target the wrong layer (w 0.21, weak, [appperformancelab.com](https://appperformancelab.com/code-optimization-profile-first-optimize-later/)). A note on abstraction cost argues layered abstractions hide the real runtime cost until profiling exposes it (w 0.16, weak, [dev.to](https://dev.to/nsikanadaowo/when-abstraction-becomes-a-bottleneck-the-real-cost-of-overeng)). None of these carry primary data; treat them as supporting color, not authority.

The one dig result with strong backing in this subtopic is indirect: AMD's ROCm profiling guide documents a profiling-driven optimization loop where each candidate optimization must beat wall time relative to the last kept configuration or be reverted (w 0.82, [rocm.blogs.amd.com](https://rocm.blogs.amd.com/software-tools-optimization/profiling-guide/ai-assist-optimization/README.html)). That is the measure-first discipline industrialized: a binary per-experiment success criterion tied to a reference baseline.

## The two measurement modes

The source doc names 2 complementary measurement approaches and says to use both. Synthetic measurement (Lighthouse, DevTools Performance tab) gives controlled, reproducible conditions and is best for CI regression detection and isolating specific issues. Real-user measurement (RUM via the web-vitals library, CrUX) gives real user data in real conditions and is required to validate that a fix actually improved user experience. A weak-backed dig adds the practical warning that lab and field numbers rarely match, so a fix "verified" only in the lab has not been verified (w 0.45, weak, [debugbear.com](https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data)). Doc 03 covers the tooling in depth.

## The anti-pattern this doc guards against

The source doc's rationalizations table lists the excuses that precede unmeasured optimization work: "We'll optimize later" (performance debt compounds), "It's fast on my machine" (your machine is not the user's), "This optimization is obvious" (if you did not measure, you do not know), and "Users won't notice 100ms" (research shows 100ms delays impact conversion rates; users notice more than you think). Each of these is a claim about the future made without measurement, which is exactly what the discipline forbids.

## What to remember

1. No optimization without a measurement that justifies it (source doc).
2. Use the 5 trigger conditions to decide when performance work starts.
3. Keep both synthetic and real-user measurement in the loop; lab wins alone do not count.
4. Change one thing at a time and keep the measurement conditions identical between baseline and result (source doc).
5. Record every attempt, including reverts, so dead ideas stay dead (source doc; see doc 08).
