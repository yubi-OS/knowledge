# 01 - Mode axis rubric

Scope: the 0-5 coverage-level rubric for the NSS Mode axis, the breadth-and-correctness scoring principle, and the label bands that turn a raw score into a verdict.

## The core principle: breadth AND correctness

The source doc (yubi-OS/yubiOS skills/nss-mode/SKILL.md) defines the Mode axis as scoring "a file's coverage of execution modes -- not the number of flags mentioned, but the breadth AND correctness of the mode contracts documented or evidenced in the file." Two files can both mention `--dry-run`; only the one whose dry-run actually avoids side effects, preserves output shape, and defines an exit status scores well. This is why the rubric insists on scoring behavior, not keywords: "A token like `--dry-run` earns at most partial credit; full credit requires side-effect-freeness, a meaningful plan, preserved output shape, and a defined exit status" (source doc, Guidelines).

## The six coverage levels

The source doc grades Mode coverage on a 0-5 scale, scored "by the highest level whose behavioral contract is actually evidenced":

| Level | Label | Contract evidenced |
|---|---|---|
| 0 | Absent | One invocation context assumed, no treatment |
| 1 | Nominal | One or two mode terms mentioned, no behavior defined |
| 2 | Basic | Two contrasting modes with usable invocation examples; happy path only |
| 3 | Operational | Several orthogonal contrasts with observable contracts; CI can invoke reliably |
| 4 | Production-grade | Nearly the full matrix: negative cases, flag precedence, TERM=dumb, failure propagation, service readiness, TTY and non-TTY tests |
| 5 | Exemplary | Compact reusable mode model, explicit state transitions, machine-readable output, tested mode combinations |

The jump from 3 to 4 is where most real-world files fail: they handle the happy path in one context but never test the piped, `TERM=dumb`, or CI-without-stdin contexts. The source doc names "cross-context invariance" as the quality signal: the same skill must be safe in TTY, pipe, `TERM=dumb`, CI without stdin, dry run, retry, and under a service supervisor.

## Why the rubric is anchored in POSIX utility conventions

The Mode axis is not an arbitrary scoring exercise; it grades against decades of formalized utility behavior. The POSIX Utility Conventions (https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html, weight 0.87) define how conforming utilities accept operands, options, and option-arguments, and how they process errors; error handling and exit-status behavior are part of the documented utility contract, not an afterthought. QNX's Utility Conventions documentation restates the same contract for its platform, including the rule that an error stops processing of the current operand and proceeds to the next (https://www.qnx.com/developers/docs/8.0/com.qnx.doc.neutrino.utilities/topic/utilconv.html, weight 0.83). A file scoring Operational or above on the Mode axis is, in effect, documenting the subset of these conventions that applies to it.

Exit-status behavior is the other formal anchor. The exit(3) manual page records that `EXIT_SUCCESS` and `EXIT_FAILURE` are the portable spellings of 0 and nonzero (https://www.man7.org/linux/man-pages/man3/exit.3.html, weight 0.82). The Command Line Interface Guidelines make the script-facing consequence explicit: "Return zero exit code on success, non-zero on failure. Exit codes are how scripts determine whether a program succeeded or failed" (https://clig.dev/, weight 0.33, weak backing). The rubric's failure-semantics dimension inherits exactly this contract.

## The label bands

The source doc converts the 0-20 dimensional total into five bands: 0-3 Narrow, 4-7 Emerging, 8-12 Useful, 13-16 Strong, 17-20 Comprehensive. The bands exist so a sweep can rank files without pretending the 10 dimensions are equally weighted; a Useful file is one a CI pipeline can rely on, while a Strong file additionally covers negative cases and flag precedence.

## How the rubric is applied in a sweep

In the cycle-11 sweep the rubric is applied to 40 corpus files, one mode-aware section per file, emitted only through the lens-format patch (source doc). Scoring is local-only: "LOCAL ONLY for the rubric; no network for measurement" (source doc, Constraints), and scores are binary per dimension (0/1/2) with no fractional values. A scorer may not award 1.5 for "sort of handles idempotency"; the binary constraint forces an explicit verdict per dimension, which is what makes the sweep reproducible.

The rubric's self-containment constraint is deliberate: the SKILL.md embeds the full level table, the 10 scoring dimensions, the distinctions, and the lens schema, so a scoring session needs no external fetch (source doc, Self-containment). The corpus docs in this series deepen each dimension; none of them replaces the embedded rubric as the scoring source of record.
