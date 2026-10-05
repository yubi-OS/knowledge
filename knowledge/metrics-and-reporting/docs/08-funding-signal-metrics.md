# Funding and pilot signal metrics for early-stage open-source

**Scope:** Funding and pilot signal metrics for early-stage open-source: grant pipelines, pilot customers, community growth proxies without telemetry.

## The measurement problem

An early-stage open-source project needs to know whether its funding and commercialization bets are alive, but it measures none of its own adoption (no telemetry by design), so the signal has to come from sources the project actually touches: grant applications, paid pilots, and contribution activity. The field's foundational research frames the stakes: digital infrastructure should be treated as a necessary public good, free source code makes building software exponentially cheaper for everyone, yet there is a common misconception that the labor behind open-source projects is well funded (https://www.fordfoundation.org/learning/library/research-reports/roads-and-bridges-the-unseen-labor-behind-our-digital-infrastructure, weight 0.75, authoritative). The same report closes with a survey of current funding models, from corporate sponsorship to crowdfunding to foundations, plus tentative principles for successful funding (https://www.eyrie.org/~eagle/reviews/books/roads-bridges.html, weight 0.28, weak backing). For a single-maintainer project, the report's practical content is a menu of models to choose between, which is exactly what a funding-pipeline metric tracks: which model is being tried, and what came back.

## Funding secured versus targeted

Definition: funding actually secured against the target list of grant programs, sponsorships, and pilot-funding opportunities. Decision it drives: whether public-security funding (or whichever vertical the project targets) is a real revenue line, or should be deprioritized in favor of offers with faster signal.

The tracking shape is a pipeline table, one row per target: program name, applied date, status (researching, applied, decision received, secured or declined), amount, and decision date. The metric that falls out is the secured-to-targeted ratio over a fixed window. Sustainability guides catalog the model space a pipeline should span, including sponsorships, grants, paid support, employer backing, fiscal hosts, open core, and services (https://www.fosshub.com/resources/sustainability/funding-models/, weight 0.19, weak backing; directory at https://www.oss.fund/guides/, weight 0.45, weak backing). Funding concentration is the known failure mode: money tends to concentrate on popular, high-profile projects, leaving smaller, critical dependencies under-resourced (https://enicomp.com/open-source-sustainability-and-sponsorship-models/, weight 0.21, weak backing). A small project should read that as a base rate: most applications will decline, which is why the ratio, not any single outcome, is the metric.

## Paid pilots as the fastest signal

Grant cycles are slow; paid pilots are fast. A pilot produces a validated-or-invalidated outcome in weeks and directly tests willingness to pay, the quantity every pricing decision depends on. The pilot metrics (count per offer, outcome per pilot) are covered in the business-health doc; the funding-specific addition is sequencing: because pilot signal arrives faster than grant signal, a funding pipeline should never be the project's only revenue-line test. If the secured-versus-targeted ratio stays at 0 across two quarters while pilots validate pricing, the pilot-driven offers win priority on evidence.

## Community growth proxies without telemetry

Absent telemetry, contribution activity is the honest adoption proxy: unique external contributors, external PR share, and issue participants. Sustainability research supports using project-level analysis this way: the opensustain.tech project analyzed open-source in environmental sustainability and issued recommendations for community building, policy development, and investment based on project-level metrics (https://opensource.com/article/23/1/open-source-sustainability, weight 0.34, weak backing). The caveat from the not-yet-measurable discipline applies unchanged: these proxies measure developer engagement, not user counts, and any report using them must label them as proxies.

## The signal-speed table

| Signal source | Typical latency | Cost to track | Decision it feeds |
|---|---|---|---|
| Paid pilot | weeks | a log row per pilot | price point commitment, offer priority |
| Grant application | months (6 to 12 common) | a pipeline row per application | whether a funding vertical is real |
| Sponsorship inquiry | weeks to months | a pipeline row | whether sponsorship model fits |
| Community proxies | continuous | repo stats, no tooling | whether the project is attracting contributors |

Latency ordering is the design principle: track fast-signal sources most actively, because they change decisions soonest, and keep slow-signal pipelines alive at the minimum documentation cost until a decision lands.

## Boundaries

- No funding number is real until money or a signed commitment exists; "in discussion" is a pipeline status, not a metric value.
- Grant money and commercial revenue are tracked separately; blending them hides which model works.
- The community proxy set is explicitly labeled as engagement, never presented as adoption.
