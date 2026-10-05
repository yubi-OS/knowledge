# 06 - Design Partner Recruitment

Scope: finding the first users for a narrow product, design partner recruitment, target profile definition, sourcing channels, and getting partners to run the pilot on real infrastructure.

## What a design partner is

The canonical definition comes from Andreessen Horowitz: design partners, or the first few users of a company's software, are often a key part of the early software development process, providing valuable feedback on everything from product functionality to user experience, to pricing and packaging (weight 0.827, https://a16z.com/a-framework-for-finding-a-design-partner/). The range matters: partners inform pricing and packaging, not just bugs, which is why the source plan (yubiOS refs, `days-31-60-narrow-product-2026-07-25.md`) requires a priced SOW to exist before recruitment rather than after.

A structured program guide describes the arrangement: a design partner program is a structured early access arrangement between a B2B startup and a hand picked group of customers who co-build the product in exchange for influence over the roadmap, preferential pricing, and sometimes other commercial incentives (weight 0.268, weak, https://www.koji.so/docs/design-partner-program). A companion guide adds the graduation idea: the goal is to structure the agreement and then graduate beyond design partners into standard commercial terms (weight 0.380, weak, https://www.promptstoproduct.com/what-is-a-design-partner). Another founder guide summarizes the trade as hands-on feedback, roadmap influence, and eventual references exchanged for privileged early access, and notes that a working program is among the strongest pre-revenue evidence you can show (weight 0.180, weak, https://www.edmired.com/blog/design-partners-b2b-startup-guide).

## The source plan's bar: run on real infrastructure

The source plan sets two partners as the goal and adds a quality constraint: partners who "will run the pilot on real infrastructure, not just review docs". This is stricter than the common definition and deliberately so. For an infrastructure OS product, a partner reading documentation produces zero validated learning about the product's actual behavior on their systems. The a16z framing supports the stricter bar indirectly: the value of the right design partner comes from feedback on functionality and experience, which requires using the product, not reading about it.

The target profile per the plan (inherited from the days 0 to 30 phase): release engineering, security platform, firmware, and regulated lab operators. The recruitment channel and candidate list were not sourced in that pass and are carried as an open question.

## Profiling the acute pain user

A 0 to 1 guide structures recruitment as: profile the acute pain user, source from the warm network and communities, and structure the deal (weight 0.361, weak, https://www.stackmatix.com/blog/finding-design-partners-startup). A venture guide frames the MVP side of the same idea: the MVP should have a superpower, a unique ability that solves a critical pain point for early customers, and partner selection follows from that (weight 0.515, https://horizoncap.vc/founders-guide-choose-your-first-design-partners/). yubiOS's acute pain user is described by role rather than company: the person who owns release integrity for an OS image fleet, which maps to the release engineering and security platform roles in the plan's profile.

## How many, and how to structure

Counts vary by source: the plan says 2, a recruitment guide suggests recruiting 3 to 5 (weight 0.380, weak, https://www.promptstoproduct.com/what-is-a-design-partner), and the structured program guide's range is 5 to 15 (weight 0.268, weak, https://www.koji.so/docs/design-partner-program). For a pilot phase with hardware dependency and heavy support cost, the smaller number is defensible: each partner running on real infrastructure consumes engineering time, so the plan's 2 partners is a capacity decision, not a confidence decision.

Structure elements that recur across the weakly backed guides: define what the partner gets (early access, roadmap influence, preferential pricing), what the startup gets (feedback, real environment validation, eventual references), a time bound for the arrangement, and an exit path to standard commercial terms.

## What the recruitment open question means for the plan

The source plan honestly marks its gap: the channel and candidate list are not sourced, pending the founder's network or a targeted outreach list. The recruitment literature's consistent sourcing advice, warm network and communities first (weight 0.361, weak, https://www.stackmatix.com/blog/finding-design-partners-startup), suggests the concrete next artifact is a list of candidate names drawn from communities where release engineering and firmware people already congregate, plus a first message that leads with the priced offer rather than a free trial. A partner whose first exposure to the product is a priced pilot SOW is being screened for commercial intent from the first touch, which is the behavior the days 61 to 90 phase (willingness to pay) needs evidence of.

## Rules to carry

1. Recruit partners who will run the pilot on real infrastructure; doc reviewers are not design partners for an infrastructure product.
2. Have the priced SOW in hand before the first partner conversation.
3. Profile by role and pain (who owns release integrity), then source from warm network and communities.
4. Keep the count matched to support capacity, and write the exchange: what each side gives and gets.
