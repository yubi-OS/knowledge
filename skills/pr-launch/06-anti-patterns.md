# 06 - Anti-Patterns: The Failure Modes of a Technical Launch

**Scope:** The 6 launch anti-patterns the pr-launch skill names, the platform rules that motivate them, and how the external evidence lines up.

Ground spine: the source doc, yubi-OS/yubiOS skills/pr-launch/SKILL.md, sections "Anti-Patterns" and "Guidelines". Claims from digs carry their URL and jev noul weight.

## The 6 anti-patterns

The source doc names 6, each with its mechanism (source doc):

1. **Don't cross-post to 5 subreddits at once.** Stagger by 30-60 minutes. "Mods notice." The mechanism is per-subreddit spam detection: simultaneous identical posts across subreddits look like a bot campaign.
2. **Don't lead with features.** "Lead with the problem (TPM lock-in, OEM opacity) then show the solution." Feature-first framing reads as advertising; problem-first framing reads as engineering narrative.
3. **Don't write for everyone.** "The technical post assumes they know what FIDO2 is. The general post doesn't. Same project, different story." Splitting audiences is a prerequisite for both messages being sharp (doc 01).
4. **Don't disappear after posting.** "The first 2-4 hours of comments are where launches live or die." This is the Phase 2 engagement rule stated as an anti-pattern (doc 08).
5. **Don't use "revolutionary," "game-changing," "novel."** "Signals insecurity. Let the tech speak." Banned words are a credibility tax in technical channels (doc 01).
6. **Don't pitch press before seeding community.** "If HN picks it up first, Phoronix might cover it unprompted. Work with that." The sequencing insight: press prefers to cover what is already moving.

The Guidelines section repeats items 1 through 5 verbatim as numbered rules and adds the scope boundary: every use stays inside the frontmatter description's scope (source doc).

## What the platform rules actually say

The HN rules make anti-patterns 1, 4, and 5 concrete. The official guidelines: "Please don't use HN primarily for promotion. It's ok to post your own stuff part of the time" (https://news.ycombinator.com/newsguidelines.html, weight 0.75). The official Show HN page defines the eligible artifact: something you've made that other people can play with (https://news.ycombinator.com/showhn.html, weight 0.74). Practitioner coverage, weakly sourced, reports the moderation corollary: "don't ask friends to upvote or comment. Accounts and sites can be flagged" (https://favors.dev/blog/show-hn-launch-guide, weight 0.10, weak backing). This is why the source doc's seeding mechanism is carefully worded: briefing 2-3 people who comment substantively is community seeding; soliciting upvotes is a violation. The line between the two is comment content, not coordination itself.

Reddit's own self-promotion guidance is the source for anti-pattern 1. The sitewide wiki states "Guidelines for self-promotion on reddit" and directs spammers to the spam policy (https://www.reddit.com/r/reddit.com/wiki/selfpromotion/, weight 0.53). The much-cited 9:1 ratio (one promotional post per 9 non-promotional) is documented across guides: redditservices notes "The 9:1 ratio is etiquette, not a threshold" and that enforcement runs through Reddit Rule 2 (authentic participation, no spam or manipulation), the spam policy, and each subreddit's own rules (https://redditservices.com/blog/reddit-self-promotion-rules, weight 0.07, weak backing). rankcow describes the same 90/10 standard (https://www.rankcow.com/blog/reddit-self-promotion-rules, weight 0.07, weak backing), redditgrowthdb quotes the spam guidance that repeated unsolicited mass engagement is not allowed (https://www.redditgrowthdb.com/guides/reddit-self-promotion-rules, weight 0.07, weak backing), and prowlo surveyed the posted rules of 13 subreddits and found the 9:1 rule cited everywhere (https://prowlo.com/blog/reddit-self-promotion-rules, weight 0.08, weak backing). The getupvotes guide packages the same rules for practitioners (https://getupvotes.com/reddit-self-promotion/, weight 0.05, weak backing).

Corroboration note: the source doc's stagger-by-30-60-minutes rule is a per-post operational tactic, weaker than what these sources imply. A launch account with no history of non-promotional participation is exposed under Rule 2 regardless of posting cadence. The corpus records this as drift between the skill's tactical rule and the platforms' account-level standards; the skill's rule remains the shipped guidance, with the dig evidence as dated context.

## The pattern behind the 6

Read together, the anti-patterns form 2 clusters. Anti-patterns 2, 3, and 5 are message failures: wrong shape (feature-first), wrong scope (everyone), wrong tone (hype). Anti-patterns 1, 4, and 6 are sequencing failures: wrong timing (simultaneous cross-posting), wrong absence (disappearing), wrong order (press before community). A launch that passes the message cluster but fails the sequencing cluster still dies; the reverse also holds. This is why the skill gates both: the message frameworks govern the first cluster, the phase timeline governs the second (docs 01, 02).

## The one permitted version of self-interest

The skill never says don't promote; it says promote in the shape the channel accepts. Show HN with a technical description and a question-answering author is the permitted shape (source doc template, doc 04). A subreddit seed post that documents a mechanism and links the ADRs is the permitted shape. The anti-patterns are the shapes the channels reject, stated so the author can pattern-match before posting rather than after flagging.
