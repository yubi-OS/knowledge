# 02: Pricing Experiment Methods Before Scale
Scope: Established pricing experiment methods for early-stage B2B (Van Westendorp, Gabor-Granger, conjoint, price A/B tests) and the evidence quality each produces.

## Why pricing is tested deliberately

Pricing is the most powerful lever in B2B SaaS and the one companies touch least: most startups set pricing in a 2-hour brainstorm, publish it, and leave it unchanged for 18 months while A/B testing trivial page elements (scian.io/blog/b2b-pricing-experiments-iteration, w=0.27, weak backing). A pricing experiment in the functional sense is a bounded test: a cohort sees a new meter or bundle while instrumentation tracks expansion, contraction, and logo churn (beyondtmrw.org/article/b2b-saas-pricing-experiments-in-2026-usage-based-meters-ai-seat-expansion-and-churn-sensitivity-modeling, w=0.27, weak backing).

## Survey methods: Van Westendorp and Gabor-Granger

Van Westendorp's Price Sensitivity Meter and Gabor-Granger are the two standard survey methods for finding a defensible price band before real transactions exist. Comparative guides agree on the split: Van Westendorp asks four willingness-to-buy questions and produces acceptance ranges suited to discovery when the price is unknown; Gabor-Granger walks respondents up and down a price ladder and estimates demand at specific price points (marketbridge.com/article/survey-pricing-methodologies/, w=0.38, weak backing; quali-fi.com/learn/pricing-research, w=0.30, weak backing). Conjoint-based pricing handles trade-offs among features and price when the offer has multiple dimensions (quali-fi.com/learn/pricing-research, w=0.30, weak backing). For a completely new offering with no competitors, both methods help set prices for a single product (conjointly.com/blog/gabor-granger-or-van-westendorp/, w=0.28, weak backing).

For B2B SaaS specifically, one decision worksheet frames the short answer as: use Van Westendorp for range discovery, Gabor-Granger for price testing against specific points, and treat both as research inputs rather than proof of conversion (blog.glasgow.works/blog/van-westendorp-vs-gabor-granger-b2b-saas/, w=0.26, weak backing). Survey guides note the methods combine with qualitative value-perception interviews (koji.so/docs/pricing-research-survey-guide, w=0.24, weak backing).

Evidence quality: survey methods are cheap and fast but measure stated willingness to pay. Stated WTP is a weak signal compared with an actual paid pilot, which measures revealed WTP. This hierarchy is the reason the days-61-90 plan treats the priced pilot, not a survey, as the phase's WTP instrument (session source doc, internal).

## In-market experiments: price tests on real cohorts

B2B-appropriate experiment methods include willingness-to-pay research, customer conversations, staged rollouts to new customers, and cohort analysis (growthspreeofficial.com/blogs/pricing-experiments-b2b-saas, w=0.21, weak backing). A cohort-based test framework for B2B SaaS advises monitoring tier adoption, cannibalization of adjacent tiers, and average selling price across the test cohort when testing a new price point (nicholasmelillo.com/articles/the-b2b-saas-pricing-experiment-framework-testing-price-without-breaking-trust, w=0.32, weak backing).

In-market tests carry higher evidence value than surveys because behavior is observed, but they cost trust if mishandled: grandfathering existing customers, announcing changes, and testing only on new cohorts are the standard mitigations (nicholasmelillo.com, w=0.32, weak backing).

## Mapping methods to the days-61-90 phase

By day 61 the plan assumes a price already exists, set during days 31 to 60 from the revenue and cost models (session source doc, internal). The pricing-experiment methods above serve two narrow roles in that phase: validating that the assumed price band is sane before the pilot invoice goes out (Van Westendorp or Gabor-Granger with the design partner), and instrumenting the pilot itself as the in-market test whose readout is conversion and renewal behavior. A price A/B test across multiple customers is not available at this stage because there is one pilot customer; the pilot is a single-point price test, which is exactly why its evidence is bounded and why the day-90 decision framework in doc 07 requires readouts before scaling.

## Evidence standard for this doc

Every external claim carries weak backing (jev weight below 0.5). The method descriptions are consistent across 5 independent practitioner sources, which raises confidence, but none is a primary research result.
