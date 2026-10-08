# 03 - Channel Targeting: Where the Story Runs, and in What Order

**Scope:** The channel map the pr-launch skill uses, the launch-day posting order, and what the platforms' own rules say about self-submission.

Ground spine: the source doc, yubi-OS/yubiOS skills/pr-launch/SKILL.md, sections "Project Context: yubios" (channel lists) and "Launch Phases, Phase 1". Claims from digs carry their URL and jev noul weight.

## The channel map

The source doc splits channels by audience (source doc):

- **Technical:** HN, LWN.net, r/linux, r/netsec, r/linuxhardware, Phoronix, The Register, Lobste.rs.
- **General:** r/privacy, r/hardware, broader tech press (Ars Technica, Wired), product-focused newsletters.

The launch-day order is a priority order, not a list: "HN is the kingmaker for technical launches. Hit it first, then fan out within 2 hours." Sequence: (1) Show HN post at 9-11 AM ET on a weekday, Thursday ideal; (2) Lobste.rs submit; (3) r/netsec and r/linux simultaneously; (4) email pitch to Phoronix, LWN, The Register; (5) r/privacy and broader community channels (source doc).

## HN's own rules constrain the play

The official Show HN guidelines define the format: "Show HN is for something you've made that other people can play with. HN users can try it out, give you feedback, and ask questions in the thread" (https://news.ycombinator.com/showhn.html, weight 0.74). The official site guidelines add the promotion constraint: "Please don't use HN primarily for promotion. It's ok to post your own stuff part of the time, but the primary use of the site should be for..." sharing others' work (https://news.ycombinator.com/newsguidelines.html, weight 0.75). This is why the skill's Show HN template is a technical description with an offer to answer questions, not an announcement ad (source doc, doc 04), and why the anti-pattern list bans solicited upvote seeding while permitting briefed organic commenters.

Timing guidance in the dug corpus is close to but not identical with the source doc's window. The okara.ai guide says to post a Show HN "on a Tuesday, Wednesday, or Thursday morning between 8 and 11 a.m. ET" (https://okara.ai/blog/how-to-launch-on-hacker-news, weight 0.18, weak backing). The source doc says 9-11 AM ET with Thursday ideal. Dated correction from the dig: the upper bound may extend to 8 AM ET, and Tuesday and Wednesday are also viable per practitioner guides; the source doc's Thursday preference stands.

Expected traffic scale, weakly sourced: a front-page Show HN "drives 5-30k visits" per the Dock launch template (https://trydock.ai/templates/launch-on-hacker-news, weight 0.11, weak backing). Treat as an order-of-magnitude planning number only.

## Reddit requires per-subreddit discipline

The launch sequence posts to r/netsec, r/linux, and r/privacy as seed posts, with the source doc's rule to stagger subreddit posts by 30-60 minutes to avoid spam flags (source doc). Each of these subreddits has its own moderators and rules, which is why the skill drafts a distinct seed post per subreddit rather than one cross-post (source doc, doc 04).

Practitioner corroboration, weakly sourced: daily.dev's channel guide recounts the AFFiNE launch, which pushed on Reddit and Hacker News first and added Twitter/X on Day 2 (https://business.daily.dev/resources/promote-open-source-project-proven-channels/, weight 0.23, weak backing). r/opensource threads describe a monitoring-first posture: a practitioner uses f5bot to listen for project mentions across Reddit and HN and joins threads to provide context and links (https://www.reddit.com/r/opensource/comments/vwesxt/whats_your_formula_for_promoting_your_open_source/, weight 0.07, weak backing; https://www.reddit.com/r/opensource/comments/17i85p2/how_do_you_promote_your_open_source_project/, weight 0.06, weak backing). The monitoring pattern fits Phase 2 of the skill's timeline (comment engagement and coverage capture).

## Press is a separate track with its own clock

The press targets (Phoronix, LWN, The Register) are pitched by email, and the source doc puts the email in slot 4 of launch day, after the community posts are live (source doc). The anti-pattern list adds a sequencing reason: "Don't pitch press before seeding community. If HN picks it up first, Phoronix might cover it unprompted. Work with that" (source doc). The pitch template and its word-count discipline are covered in doc 04.

## What the map excludes

The source doc's channel map contains no paid channels, no influencer outreach, and no launch platforms (Product Hunt and similar are absent). The dug corpus's broadest channel inventory, DevHunt's "67 places to get a developer tool in front of developers" list of newsletters, podcasts, communities and awesome lists with per-channel self-promotion rules (https://devhunt.org/promote, weight 0.14, weak backing), is useful for Phase 3 newsletter selection but exceeds the skill's deliberately narrow channel set.
