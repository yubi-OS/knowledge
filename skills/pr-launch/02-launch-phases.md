# 02 - Launch Phases: From T-3 Days to Week 2+

**Scope:** The 4-phase launch timeline the pr-launch skill prescribes, what each phase produces, and how it compares with generic product-launch timelines.

Ground spine: the source doc, yubi-OS/yubiOS skills/pr-launch/SKILL.md, section "Launch Phases". Claims from digs carry their URL and jev noul weight.

## The source doc's 4 phases

The source doc defines 4 phases with explicit clocks:

1. **Phase 0, Pre-Launch Prep, 2-3 days before.** 3 workstreams: a README audit against the 4 first-reader questions, asset creation (Show HN post, r/netsec and r/linux seed posts, r/privacy seed post, a 1-paragraph press pitch, a 3-post social thread), and seeding, meaning privately briefing 2-3 trusted community members who can comment early on the HN post. The source doc's stated mechanism: "Organic early upvotes change trajectory."
2. **Phase 1, Launch Day, T=0.** Sequence matters, and HN is the kingmaker for technical launches: Show HN post first at 9-11 AM ET on a weekday, Thursday ideal, then fan out within 2 hours to Lobste.rs, r/netsec and r/linux simultaneously, email pitches to Phoronix, LWN, The Register, then r/privacy and broader community channels. One hard rule: do NOT cross-post to Reddit subreddits within the same hour; 30-60 minutes of spacing avoids spam flags.
3. **Phase 2, Press Follow-up, Days 2-5.** Follow up on unanswered press pitches, engage every HN and Reddit comment within 24 hours (named "the highest-leverage window"), and capture coverage links in documents/pr/coverage.md.
4. **Phase 3, Sustained Momentum, Week 2+.** A technical deep-dive post (LWN guest post, own blog, or GitHub Discussion), a post to the FIDO Alliance community forums, and submissions to newsletter roundups (TLDR, Console, The Changelog).

## How the phase structure compares with generic frameworks

Generic product-launch literature allocates far more calendar time to pre-launch than the source doc does. The gantt-chart.io template splits a launch into 3 phases with pre-launch running "T-8 weeks to T-1 day" and notes that pre-launch is where most of the work happens (https://gantt-chart.io/blog/product-launch-event-timeline-template, weight 0.18, weak backing). The launchpad agency guide counts 6 phases and reports planning against its durations "across software, hardware" launches (https://launchpadagency.com/blog/what-is-the-timeline-for-launching-a-new-product-a-comprehensive-guide/, weight 0.19, weak backing). Blazon agency argues that the common failure is timing, "why most teams fail on timing" (https://blazonagency.com/post/product-launch-timeline, weight 0.21, weak backing).

The drift is real and should be read as deliberate: the source doc compresses pre-launch to 2-3 days because its target launches are developer-community launches where the assets already exist in the repo and the audience is reachable through 5 channels, not through a paid consumer campaign. A yubios-style launch is not an 8-week campaign; it is a sequenced posting plan. Where a corpus consumer is launching a product with sales coordination, the generic literature applies, and the Atlassian view is the closest match: the launch timeline is "your team's central coordination tool, ensuring that everyone, from development to sales, understands their responsibilities and deadlines" (https://www.atlassian.com/agile/product-management/product-launch-timeline, weight 0.62). Atlassian's Jira template describes the same artifact as "a scheduling framework that organizes tasks and milestones chronologically" (https://www.atlassian.com/software/jira/templates/product-launch-timeline, weight 0.7). The skill's own output artifact for this is documents/pr/launch-plan.md, a phase checklist with dates (source doc), which is exactly that coordination artifact in minimal form.

Checklist-based guides corroborate the Phase 0 emphasis. ContentMation's open-source launch checklist covers README, licensing, contributor guidelines, and community seeding, and calls pre-launch preparation the most critical part (https://contentmation.com/checklist/open-source-launch, weight 0.19, weak backing). LaunchTry's checklist covers licensing, funding, and community for a sustainable OSS launch (https://launchtry.com/resources/launch-checklist/open-source, weight 0.19, weak backing).

## What each phase produces

The phases map 1:1 onto the skill's output artifacts (source doc, doc 07): Phase 0 produces all 6 launch assets plus the launch plan and the seeding list; Phase 1 executes the sequence and produces live post URLs; Phase 2 fills documents/pr/coverage.md and burns down the comment queue; Phase 3 produces the deep-dive post and the newsletter submissions.

## The seeding step is Phase 0's asymmetry

Of the 3 Phase 0 workstreams, seeding is the one generic checklists do not carry: briefing 2-3 trusted community members before the public post, so early comments on HN are substantive rather than absent (source doc). The mechanism the source doc names, "organic early upvotes change trajectory," is about velocity in the first hour, which is why the launch-day sequence puts HN first and gives it the 9-11 AM ET window before any other channel sees the link.
