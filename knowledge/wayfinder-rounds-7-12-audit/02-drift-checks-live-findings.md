# Drift checks surface live findings

**Scope:** Periodic drift checks against live systems turn a documentation corpus into a sensor: stale digests, retirement conditions met but registers stale, unblocked version floors, and moved counts are findings, not noise.

## The round 8 harvest

Round 8 ran drift-check records against live systems and surfaced four actionable, live-verified findings, per the rounds 7 to 12 audit (wayfinder-rounds-7-12-audit-2026-09-18):

1. The pinned fedora-bootc base image digest had gone stale upstream and returned a 404, blocking the main image build.
2. B-VGPU-VM-UNZUP had met its retirement condition, but the register still listed it as active.
3. B-BOOTC-SEAL's version floor had become unblocked upstream.
4. The open-issue count had moved.

Each of these is a claim about the world outside the corpus that a corpus check caught. None of them is a documentation problem in the usual sense; all of them are build, register, or tracking problems that only surface if something periodically re-checks the corpus's external assumptions.

## Digest pinning: why a stale digest breaks a build

The fedora-bootc 404 is a textbook consequence of digest pinning. Pinning a container base image by digest gives a build an immutable reference: the digest identifies exact image content, so upstream changes cannot silently alter what the build produces (weight 0.74, https://containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/). Renovate's own documentation treats pinning as the deliberate trade of stability over freshness: a pinned dependency never moves by itself, which is precisely why it eventually goes stale when the upstream you pinned against disappears or reorganizes (weight 0.95, https://docs.renovatebot.com/dependency-pinning/). The Renovate CLI docs describe pinning and update automation as the two halves of that trade: the pin guarantees reproducibility, the update bot guarantees the pin is revisited (weight 0.80, https://github.com/renovatebot/renovate/blob/main/docs/usage/dependency-pinning.md, project at weight 0.73, https://github.com/renovatebot/renovate).

The word digest itself just means a condensed summary of information (weight 0.93, https://www.merriam-webster.com/dictionary/digest); in the container world it is the content hash that makes a pinned reference immutable. The lesson is not that pinning is wrong. It is that a pinned reference is a promise with an expiry nobody wrote down, so a corpus that pins anything needs a drift check whose job is to pull the upstream and notice when the promise breaks.

## Retirement conditions and stale registers

B-VGPU-VM-UNZUP is the second failure shape: the condition for retiring the register entry had been met in reality, but the register still listed it. This is the same drift as a stale digest, one level up: a recorded state (active) diverging from the live state (should be retired). Drata's continuous drift detection material describes the general pattern for compliance: continuously compare the declared state against the observed state and raise a finding on every divergence, rather than relying on periodic manual review (weight 0.41, weak backing, https://drata.com/learn/agent-gov/continuous-drift-detection).

## What made round 8 work

Three properties separate round 8's drift records from a routine lint pass:

1. The checks pointed outward. They verified the corpus's external assumptions (upstream digests, retirement conditions, version floors, issue counts) instead of re-reading the corpus against itself.
2. The findings were live-verified. Each record reports a check that actually ran against the live system, not an inference from the last time someone looked.
3. The findings were actionable. A 404 that blocks the main image build, a register entry to retire, a version floor to lower, a count to update. Each maps to a concrete next edit.

## What to keep doing

1. Give every pinned external reference a named drift check with a cadence. Digests, version floors, and retirement conditions are all pins in this sense (weight 0.95, https://docs.renovatebot.com/dependency-pinning/).
2. Treat a corpus of normative documents as a sensor array for the systems it describes. The rounds 7 to 12 audit shows a 21-document docs/ corpus reaching 0 of 21 failing after dated verification in round 11.
3. Record drift findings in the round record with the live evidence attached, so the finding can be re-verified later without trusting the recorder.

## Source quality notes

The four Renovate and digest-pinning sources scored 0.73 to 0.95 and back the claims about pinning trade-offs. The Drata source scored 0.41 and is labeled weak backing above; it is an industry blog, not a primary standard, and is used only for the general continuous-drift pattern, not for any specific claim. The remaining 19 results collected for this subtopic scored below 0.5 and were not used.
