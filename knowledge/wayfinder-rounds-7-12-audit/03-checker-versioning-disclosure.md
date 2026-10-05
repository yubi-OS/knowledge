# Checker versioning and disclosure

**Scope:** Versioned, disclosed checker amendments mid-campaign (the taskcheck v1.1 pattern): find checker defects by sampling failures, version the check, disclose the amendment in the ledger, and prefer catching defects before freezing.

## What round 7 did

Round 7 found defects in its own checker by sampling the failures it produced. Two classes showed up: fenced code blocks and `../` relative links were mishandled by the checker's parsing. Per the rounds 7 to 12 audit (wayfinder-rounds-7-12-audit-2026-09-18), the campaign fixed the checker as a versioned, disclosed amendment (v1.1) in the middle of the round, and recorded the amendment in the ledger.

That sequence matters. A checker that misparses fenced code blocks or `../` links will generate false failures on exactly the files that contain code samples or relative references, so uncorrected it distorts the round's pass and fail counts. The campaign's choice was not to silently fix and move on, and not to leave the broken checker running. It was to fix, version (v1.1), and disclose.

## Why version the check

A corpus-wide check is a tool with a behavior contract, and tool behavior changes need versions. Semantic Versioning 2.0.0 defines the general discipline: a version number communicates what changed so consumers can react (weight 0.98, https://semver.org/). The semantic-release project industrializes the same idea for software: version bumps are derived from the change, and every change is traceable to a release (weight 0.97, https://github.com/semantic-release/semantic-release). Changelog tooling guides make the complementary point that the version history is only useful if changes are recorded where readers can find them (weight 0.55, https://announcekit.app/blog/changelog-versioning/).

Applied to a checker: when the checker's parsing rules change mid-campaign, results produced before the change and results produced after it are not comparable unless the change is marked. Versioning the check (taskcheck v1.1) and recording the amendment in the ledger gives every historical count a checker version it can be read against. Lesson 26 in the campaign's AGENT.md encodes exactly this: version the check, disclose amendments.

## The avoidance rule

The audit is explicit that the mid-round amendment was acceptable because it was disclosed, but avoidable. The prescribed practice: run the check over the whole corpus and inspect a sample of failures before freezing the check. Sampling failures is the cheap detector for checker defects. A checker defect shows up as a cluster of failures that look structurally similar, and a human reading 10 sampled failures spots that pattern in minutes.

## What to keep doing

1. Before freezing a check for a round, run it over the whole corpus once and read a sample of both passes and failures (rounds 7 to 12 audit, lesson 26).
2. Version every checker change. A check without a version cannot support cross-round comparisons, because the counts on either side of the change measure different things (weight 0.98, https://semver.org/).
3. Record the amendment in the ledger at the moment it happens, not at round end. A disclosed amendment and an undisclosed fix differ only in whether the record exists.
4. Never treat a checker fix as license to rewrite historical counts. Keep pre-amendment counts as they were, tagged with the old version, and let the version boundary carry the discontinuity.

## Source quality notes

The three versioning sources scored 0.55 to 0.98 and back the claims about version discipline. One additional result in this subtopic's archive (a bank homepage that scored 0.68) is clearly off-topic despite its weight and was excluded from every claim; the decision-model weight is recorded in the archive but does not license citation. The 8 remaining results (aggregator posts on reproducible builds and version pinning, all below 0.5) were not used.
