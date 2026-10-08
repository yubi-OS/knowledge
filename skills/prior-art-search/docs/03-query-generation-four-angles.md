# 03 Query generation across four angles

Scope: the 3 to 5 query budget and the four angles (direct competitors, failed attempts, academic/formal, adjacent/historical), plus the specificity-over-abstraction principle that governs query wording.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`.

## The four angles

The source doc's step 2 generates 3 to 5 queries drawn from four fixed angles:

1. **Direct competitors / equivalents.** Patterns: "[topic] alternative", "[topic] vs", "best [topic] tool", "[topic] comparison".
2. **Failed attempts.** Patterns: "[topic] failed", "[topic] abandoned", "[topic] shutdown", "[topic] why it didn't work".
3. **Academic / formal.** Patterns: "[topic] research", "[topic] paper", "[topic] survey".
4. **Adjacent / historical.** Patterns: "[topic] history", "before [topic]", "early [topic]", "[topic] origin".

The budget is hard: pick 3 to 5 queries and do not run more. Each angle exists because prior art is written in different registers. A competitor's product page, a shutdown postmortem, a survey paper, and an origin story each use different vocabulary for the same space, which is why one query phrasing cannot cover all four.

## Specificity over abstraction

The source doc's query-generation section is built on contrasts: "ideation tools" is bad because it is too broad; "ideation software for product managers" is good because it is concrete. "What failed" is bad because it is vague; "[product name] shutdown" and "[company] postmortem" are good. "Alternatives" is bad because it is unspecified; "[product] alternatives 2026" and "[product] vs [competitor]" are good. The stated principle: "Specificity wins. The query generator's job is to make the question concrete enough that the answer is meaningful."

## The failed-attempts angle has a dedicated genre

The dig evidence shows the failed-attempts angle is not hypothetical: there is a whole genre of postmortem compilations to target. CB Insights maintains a compilation of startup failure post-mortems written by founders and investors, updated through 2024 with 483 post-mortems listed (https://www.cbinsights.com/research/startup-failure-post-mortem/, jev noul 0.19, weak backing for counts). An AI-assisted analysis over 1092+ post-mortems distills them into recurrent failure verdicts and risk indicators (https://ideaproof.io/why-startups-fail-ai-analysis, jev noul 0.11, weak backing). Curated lists such as Allen Cheng's collection of 59+ failed-company postmortems aggregate the same genre for a general audience (https://www.allencheng.com/failed-startups-why-businesses-fail-postmortems/, jev noul 0.10, weak backing), and WhyStartupsFail collects entrepreneur and investor posts on why ventures fail and how they shut down (https://www.whystartupsfail.com/insights, jev noul 0.08, weak backing). The practical consequence for query generation: phrases like "[product] shutdown" and "[company] postmortem" reliably land in this genre, which is exactly where the skill's most valuable signal lives.

## The competitor angle has its own frameworks

The direct-competitor angle targets landscape-analysis writing. Guides on competitive landscape analysis describe identifying direct and indirect competitors and mapping the market to see where a new entrant can win (https://chrisrobino.com/get-to-work/the-ultimate-guide-to-mapping-your-competitive-landscape, jev noul 0.09, weak backing; https://www.sogolytics.com/learning-center/consumer-research/steps-to-create-competitive-landscape-analysis/, jev noul 0.11, weak backing; https://inspace.io/blog/competitive-landscape-analysis-examples, jev noul 0.10, weak backing). Comparison-matrix frameworks are the standard artifact this angle feeds (https://airfocus.com/glossary/what-is-a-competitive-landscape/, jev noul 0.09, weak backing). The word "competitive" itself is defined as relating to, characterized by, or based on competition (https://www.merriam-webster.com/dictionary/competitive, jev noul 0.51), a trivially authoritative anchor that nonetheless helps a query generator disambiguate "competitor" from "competence".

## Bounded generation, bounded execution

The 3-to-5 query cap is not a stylistic preference; it is the skill's recursion control (see doc 04). Query generation is therefore a selection problem: choose which angles matter most for this topic and spend the budget there, rather than enumerating every pattern the templates allow. The red-flag list treats 10+ search queries as over-budget and abstract queries as a quality failure, so both dimensions of generation (count and wording) are policed.

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md`
- https://www.cbinsights.com/research/startup-failure-post-mortem/ (weight 0.19)
- https://ideaproof.io/why-startups-fail-ai-analysis (weight 0.11)
- https://www.allencheng.com/failed-startups-why-businesses-fail-postmortems/ (weight 0.10)
- https://www.whystartupsfail.com/insights (weight 0.08)
- https://chrisrobino.com/get-to-work/the-ultimate-guide-to-mapping-your-competitive-landscape (weight 0.09)
- https://www.sogolytics.com/learning-center/consumer-research/steps-to-create-competitive-landscape-analysis/ (weight 0.11)
- https://inspace.io/blog/competitive-landscape-analysis-examples (weight 0.10)
- https://airfocus.com/glossary/what-is-a-competitive-landscape/ (weight 0.09)
- https://www.merriam-webster.com/dictionary/competitive (weight 0.51)
