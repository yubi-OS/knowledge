Scope: the test pyramid shape (about 80 percent unit, 15 percent integration, 5 percent E2E), the small/medium/large resource model, and the decision guide for choosing a test level.

# 03: The Test Pyramid and Test Sizes

Grounding spine: the source doc "yubi-OS/yubiOS skills/test-driven-development/SKILL.md", "The Test Pyramid", "Test Sizes (Resource Model)", and "Decision Guide" sections.

## The pyramid shape

The source doc prescribes investing testing effort as a pyramid: most tests small and fast, progressively fewer at higher levels. Its stated distribution is unit tests about 80 percent (pure logic, isolated, milliseconds each), integration tests about 15 percent (component interactions, API boundaries), and E2E tests about 5 percent (full user flows, real browser).

The external provenance is Mike Cohn. The TestRail guide (https://www.testrail.com/blog/testing-pyramid/, jev weight 0.25, weak) attributes the pyramid to Cohn's book "Succeeding with Agile" and describes it as the optimal number and types of tests; the BugMojo comparison (https://www.bugmojo.com/blog/guides/unit-vs-integration-vs-e2e-testing, jev weight 0.15, weak) attributes the mix guidance to Cohn and Martin Fowler and frames the tradeoff as speed versus realism: unit tests check logic at high speed, E2E tests check user flows at high realism. A Google Testing Blog tour notes Google's rule of thumb is a pyramid-shaped composition of 70 percent small, 20 percent medium, and 10 percent large tests (https://ajguerrer.github.io/blog/google-test/tour/, jev weight 0.11, weak). That 70/20/10 split differs from the source doc's 80/15/5 in exact numbers while agreeing on the shape: heavily weighted base, thin top. Treat the specific percentages as calibration, not doctrine.

## The resource model: small, medium, large

Beyond the pyramid levels, the source doc classifies tests by resources consumed:

| Size | Constraints | Speed | Example |
|---|---|---|---|
| Small | single process, no I/O, no network, no database | milliseconds | pure function tests, data transforms |
| Medium | multi-process OK, localhost only, no external services | seconds | API tests with test DB, component tests |
| Large | multi-machine OK, external services allowed | minutes | E2E tests, performance benchmarks, staging integration |

The source doc says small tests should make up the vast majority of the suite because they are fast, reliable, and easy to debug when they fail.

This size taxonomy is Google's, and the dig recovered primary evidence for it. A pytest plugin exists specifically to enforce Google's hermetic testing best practices with test categorization small/medium/large, timing limits, resource isolation, and test pyramid validation (https://github.com/mikelane/pytest-test-categories, jev weight 0.20, weak). The concept of hermeticity itself is documented on the Google Testing Blog: a hermetic server is "a server in a box" that starts with no external network dependencies (https://testing.googleblog.com/2012/10/hermetic-servers.html, jev weight 0.77). The Google Testing Blog front page (https://testing.googleblog.com/, jev weight 0.69) corroborates the blog as the source of record for this lineage.

## The decision guide

The source doc's decision guide is a three-question ladder:

1. Is it pure logic with no side effects? Unit test (small).
2. Does it cross a boundary (API, database, file system)? Integration test (medium).
3. Is it a critical user flow that must work end-to-end? E2E test (large), limited to critical paths.

The operative constraint is the third branch: E2E tests are for critical paths only. Because large tests are the slowest and most brittle per the resource model, a suite that inverts the pyramid (many E2E, few unit) pays minutes per test where milliseconds would do, and pays flakiness on top.

## Why shape matters for TDD

For the TDD cycle specifically, the pyramid determines loop speed. RED/GREEN cycles run many times per hour; only small tests are fast enough to sit inside that loop. Integration and E2E tests verify boundaries and critical flows at coarser cadence. The source doc's later Browser Testing section extends this: for anything running in a browser, unit tests alone are not enough and runtime verification is required, which is the E2E layer doing its narrow, high-value job.
