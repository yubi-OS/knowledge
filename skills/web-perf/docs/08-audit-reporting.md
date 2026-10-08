# 08 - Audit Reporting: Output Format, Prioritization, and Scoring Context

Scope: the four-part report structure, the prioritization guidelines that govern what goes in it, and how Lighthouse scoring and Google's field reports frame the numbers the audit quotes.

Grounding spine: yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).

## The four-part output

The source doc fixes the report structure:

1. Core Web Vitals Summary: a table of metric, value, and rating (good/needs-improvement/poor), using the threshold table from doc 03.
2. Top Issues: a prioritized list of problems with estimated impact rated high, medium, or low.
3. Recommendations: specific, actionable fixes with code snippets or config changes.
4. Codebase Findings: framework and bundler detected plus optimization opportunities, omitted entirely when there is no codebase access (doc 07).

## The guidelines that govern the content

Six rules from the source doc shape every section:

- Be assertive: verify claims by checking network requests, DOM, or codebase, then state findings definitively.
- Verify before recommending: confirm something is unused before suggesting removal (the preconnect rule in doc 05 is the canonical example).
- Quantify impact: use estimated savings from insights, and never prioritize a change with 0ms impact.
- Skip non-issues: if render-blocking resources have 0ms estimated impact, note them but recommend nothing.
- Be specific: "compress hero.png (450KB) to WebP", not "optimize images".
- Prioritize ruthlessly: a site with a 200ms LCP and 0 CLS is already excellent, and the report should say so instead of manufacturing work.

The last rule inverts the usual audit incentive. A report that lists 20 findings against a green site is a worse artifact than one that certifies the site and lists 2 real ones.

## How Lighthouse scores the same metrics

When the report references a Lighthouse score, the mechanics matter. Officially: "Once Lighthouse has gathered the performance metrics (mostly reported in milliseconds), it converts each raw metric value into a metric score from 0 to 100 by looking where the metric value falls on its Lighthouse scoring curve" (https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/, weight 0.96). The scoring calculator page adds the distributional caveat: "Lighthouse uses log-normal curves, which have extremely long tails" and will not display scores under 5/100 (https://googlechrome.github.io/lighthouse/scorecalc/, weight 0.79). A third-party reference notes the composition has shifted over time, describing the breakdown "as of Lighthouse 12" with Total Blocking Time and Largest Contentful Paint as leading terms (https://www.debugbear.com/docs/metrics/lighthouse-performance, weak backing, weight 0.34). Two report rules follow: never treat a Lighthouse score as an average of metric thresholds, and when quoting a score, name the Lighthouse version that produced it.

## The field-data counterpoint

The report should situate lab findings against Google's field view where available. The Search Console Core Web Vitals report "shows URL performance grouped by status (Poor, Need improvement, Good), metric type (CLS, INP, and LCP), and URL group (groups of similar web pages)" (https://support.google.com/webmasters/answer/9205520?hl=en, weight 0.81). Because that report aggregates CrUX field data at the 75th percentile (doc 03), a lab trace and a Search Console verdict can legitimately disagree; the report explains the difference instead of averaging it away.

Lighthouse itself remains runnable against "any web page, public or requiring authentication", from PageSpeed Insights, Chrome DevTools, the command line, or as a Node module (https://developer.chrome.com/docs/lighthouse, weight 0.94), which makes it a portable cross-check inside audit reports.

## Third-party audit structures

Two commercial audit guides describe similar report shapes and can be cited as corroboration that the structure is industry-standard, not as sources of thresholds: a 35-step Core Web Vitals audit checklist with explanations and fixes (https://seosly.com/blog/core-web-vitals-audit/, weak backing, weight 0.18) and a Screaming Frog tutorial on auditing Core Web Vitals with a crawler (https://www.screamingfrog.co.uk/seo-spider/tutorials/how-to-audit-core-web-vitals/, weak backing, weight 0.42). A priced agency service describes the deliverable as "prioritized recommendations and acceptance testing included" (https://agencewebperformance.fr/en/prestations/audit-performance/, weak backing, weight 0.14); the acceptance-testing idea is worth borrowing for the recommendations section, but the pricing page carries no technical authority.

Interactive calculators help sanity-check weights while drafting: an interactive Lighthouse scoring calculator lets you "see how FCP, LCP, TBT, CLS, and Speed Index weights and thresholds determine your Lighthouse performance score" (https://unlighthouse.dev/tools/lighthouse-score-calculator, weak backing, weight 0.15). Verify anything non-obvious against the official scoring doc instead.

## Drafting discipline

1. Lead with the summary table; nobody reads a report whose verdict is on page 3.
2. Cap Top Issues at what survives the 0ms filter; a short list with measured impact beats a long list of maybes.
3. Every recommendation carries a snippet or config diff, a target file, and the metric it moves.
4. Close with the codebase section or an explicit "no codebase access, Phase 5 skipped".

Sources: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/ (weight 0.96), https://developer.chrome.com/docs/lighthouse (weight 0.94), https://support.google.com/webmasters/answer/9205520?hl=en (weight 0.81), https://googlechrome.github.io/lighthouse/scorecalc/ (weight 0.79), https://www.screamingfrog.co.uk/seo-spider/tutorials/how-to-audit-core-web-vitals/ (weak backing, weight 0.42), https://www.debugbear.com/docs/metrics/lighthouse-performance (weak backing, weight 0.34), https://seosly.com/blog/core-web-vitals-audit/ (weak backing, weight 0.18), https://unlighthouse.dev/tools/lighthouse-score-calculator (weak backing, weight 0.15), https://agencewebperformance.fr/en/prestations/audit-performance/ (weak backing, weight 0.14), plus yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).
