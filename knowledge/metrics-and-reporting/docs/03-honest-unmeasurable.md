# Honest flagging of not-yet-measurable metrics

**Scope:** Honest flagging of not-yet-measurable metrics: adoption, community trust, telemetry-by-design constraints, download and pull counts.

## Why flagging beats faking

An early-stage project that refuses telemetry has a gap between what it wants to know (adoption, trust, usage) and what it can measure (nothing in those categories). The honest move is to name the gap in the report itself: list the metric, state that no current mechanism produces a number, and stop. This is harder to sustain than it sounds because the surrounding tooling makes partial numbers available, and a partial number invites over-reading. The discipline is to treat "not yet measurable" as a first-class status equal to "measured", not a footnote.

## The pull-count case: measurable, but with caveats

Adoption is not inherently unmeasurable for containerized projects; it is measurable only through third-party reporting. Docker Hub exposes pull counts through its registry API, and a practitioner writeup documents the recipe: set up a bearer token, then pull the stats endpoint for a specific repository to get the pull count (https://bastide.org/2021/11/10/dockerhub-api-to-get-statistics/, weight 0.55, authoritative). Docker's own documentation describes a richer Insights and analytics surface, including self-serve access to image and extension usage metrics, pulls by tag or by digest, geolocation, and cloud provider breakdowns, though that surface is scoped to Docker Verified Publisher and Docker-Sponsored Open Source images (https://docs.docker.com/docker-hub/repos/manage/trusted-content/insights-analytics/, weight 0.33, weak backing).

So the honest report for a container image can say: pull counts exist as a number Docker Hub itself reports, retrievable via API, and here is the small follow-up work to fetch and record them. What the report must not do is quote a figure nobody fetched. A pull count also measures registry activity, not installed users; mirrors, CI systems, and caches re-pull repeatedly. The number is honest only when its definition travels with it.

GitHub exposes a different slice of the same problem: a REST API for repository statistics, with the caveat that computing statistics is an expensive operation and the endpoint returns cached data when possible (http://developer.github.com/v3/repos/statistics/, weight 0.63, authoritative). For contributor-facing health (commit activity, participation, traffic), this is a real source. For user-facing adoption, it measures developers interacting with the repo, not users running the software.

## The telemetry-by-design constraint

Some projects deliberately ship no telemetry, which makes trust and usage quantitatively unmeasurable by the project itself. That constraint should be stated as a design decision in the metrics report, because it changes which numbers are even possible. The telemetry industry's own tooling makes the trade-off visible: OpenTelemetry exists to standardize the collection of metrics, logs, traces, and context data so diverse sources can be handled consistently (https://grafana.com/opentelemetry-report/, weight 0.53, authoritative). A project that opts out of that entire apparatus is choosing a measurement floor of zero, and its report should say so rather than imply data might appear later.

## What a commercial-metrics guide adds

The Open Source Business Metrics Guide groups measurement into adoption, users, community, and commercial growth, and notes that measuring these for open-source projects requires deliberate instrumentation because the artifacts themselves do not record usage (https://about.scarf.sh/post/the-open-source-business-metrics-guide/, weight 0.49, weak backing). Its categories are a useful checklist for the not-yet-measurable section: for each category, either name the artifact-backed proxy or declare the category unmeasured. Community proxies from repo artifacts (issue participants, external PR contributors) are honest; user counts without telemetry are not, and should be left blank.

## The report pattern

A metrics report at early stage should carry exactly three states per metric:

1. **Measured:** number, artifact it is read from, and the decision it drives.
2. **Measurable with small follow-up:** the mechanism exists (a public API, a fetch job), the number has not been fetched, and the follow-up is scoped. Pull counts live here.
3. **Not yet measurable by design:** no mechanism exists and none should be built (telemetry opt-out), or the concept resists quantification (community trust). State the reason.

The third state is the one projects skip, and skipping it is what turns a metrics report into marketing. A blank row labeled "no mechanism exists, by design" is more credible to a security researcher or prospective contributor than a filled row of invented proxies. Community-metrics specialists make the same point structurally: CHAOSS defines metrics as answering one single question about community health (https://www.chaoss.community/kb-metrics-and-metrics-models/, weight 0.93, authoritative), and if the honest answer to the question "how many users are there?" is "unknown, and we will not instrument users", that answer belongs in the report.

## Boundaries to keep

- Never promote state 2 to state 1 by quoting an unfetched number.
- Never convert a registry-side number (pulls) into a user-side claim (installs) without saying so.
- Keep the not-yet-measurable list in the report itself, not in a private TODO, so external readers see the same gaps the maintainers do.
