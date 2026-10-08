# 08 - Post-Launch Tracking and Sustained Momentum

**Scope:** What the pr-launch skill prescribes after the launch-day sequence: the 24-hour comment engagement window, press follow-up, coverage capture, and the Week 2+ momentum plays.

Ground spine: the source doc, yubi-OS/yubiOS skills/pr-launch/SKILL.md, sections "Launch Phases, Phase 2 and Phase 3" and the related anti-patterns. Claims from digs carry their URL and jev noul weight.

## Phase 2: Days 2-5

The source doc gives Phase 2 3 actions (source doc):

1. **Follow up on unanswered press pitches.** The launch-day emails to Phoronix, LWN, The Register get exactly one structured follow-up if unanswered.
2. **Engage every HN and Reddit comment within 24 hours.** The source doc names this "the highest-leverage window." The anti-patterns section states the failure mode: "Don't disappear after posting. The first 2-4 hours of comments are where launches live or die."
3. **Capture coverage links in documents/pr/coverage.md.** The running log is the skill's only post-launch artifact (doc 07).

The engagement window has a platform-structural basis: HN discussion ranks on early activity, and a thread with an absent author decays. The practitioner corpus agrees on the first-hours mechanics. The okara guide advises: "For the first two hours, respond to every comment, including negative ones. This helps keep the discussion active and shows that you are engaged" (https://okara.ai/blog/how-to-launch-on-hacker-news, weight 0.18, weak backing). The launchsaaskit guide adds the first-comment practice: immediately after posting, write the first comment yourself, explaining why you built it, the technical decisions, and what is rough or unfinished (https://launchsaaskit.com/how-to-launch-on-hacker-news, weight 0.14, weak backing). The source doc's own Show HN template ends with "Happy to answer questions about...", which operationalizes the same posture at T=0 (source doc, doc 04).

One resubmission mechanic worth recording: when a post features a link people have already visited, HN greys out the title so it shows up less prominently, which affects later resubmissions of the same URL (https://onlook.substack.com/p/launching-on-hacker-news, weight 0.21, weak backing). For tracking purposes this means a weak first-day launch cannot be mechanically repaired by reposting the same link; the momentum plays below are the recovery path.

## Phase 3: Week 2+

The source doc gives 3 momentum plays (source doc):

1. **Write a technical deep-dive post**, targeted at an LWN guest post, the project's own blog, or a GitHub Discussion. This is the second story beat for the technical audience: launch-day assets summarized, the deep-dive explains a design decision in full.
2. **Post to the FIDO Alliance community forums.** A niche-authority play that reaches the standards community adjacent to the project's FIDO2 reliance.
3. **Submit to relevant newsletter roundups: TLDR, Console, The Changelog.**

The newsletter route is the weakest-evidenced part of the skill. The dug corpus confirms the targets exist and are developer-facing: TLDR is "a byte sized daily tech newsletter" covering startups, tech, and programming (https://tldr.tech/, weight 0.10, weak backing), with a developer edition TLDR Dev covering "programming news, tools, and web development in a 5-minute read" (https://tldr.tech/dev, weight 0.09, weak backing). A practitioner account claims a TLDR feature in under a day for an open-source library (https://www.reddit.com/r/Entrepreneur/comments/135i32q/how_we_launched_and_got_featured_in_tldr/, weight 0.12, weak backing). DevHunt maintains the broadest inventory of these channels, "67 places to get a developer tool in front of developers: newsletters, podcasts, communities and awesome lists, with how to get featured, cost and self-promotion rules" (https://devhunt.org/promote, weight 0.14, weak backing), which is the practical directory for extending Phase 3 beyond the source doc's 3 named outlets.

## The tracking artifact

coverage.md is append-only by convention: each entry is a link plus where it came from (HN thread, subreddit, press reply, published article, newsletter mention) (source doc, doc 07). Its purpose is not analytics; it is the input for the next iteration of the channel map (doc 03): which channels actually converted to coverage, and which stalled. A Week 2 retrospective against coverage.md is the natural close of the launch, and the deep-dive post's distribution can be seeded from the same log.

## Failure modes in this phase

The source doc's anti-patterns apply to Phase 2 directly: disappearing after posting (anti-pattern 4) is a Phase 2 failure, and pitching press before seeding community (anti-pattern 6) inverts the follow-up logic, because press follow-up only works when the community thread gives the journalist something to read (source doc). The 24-hour window is also a boundary: after it, comment engagement has diminishing returns and effort shifts to Phase 3 artifacts (source doc phase clocks).
