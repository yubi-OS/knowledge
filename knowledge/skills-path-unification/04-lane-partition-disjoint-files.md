# 04. Lane partition (disjoint files)

**Scope:** Lane partition (disjoint files): detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md, no external web dig

## Why lanes

The audit covered 131 skills and 741 companion files. Fixing five path classes across that corpus serially would be slow and would concentrate every judgment call in one context. The spec instead partitions the work into five parallel lanes, each owning a disjoint set of skill directories. Disjointness is the property that makes parallel work safe: no file appears in two lanes, so no two lanes can produce conflicting edits.

## The five lanes

| Lane | Model tier | Skills assigned |
|---|---|---|
| 1 | smart | single-action-curve-rsi, repo-refs-skill, repo-history-skill |
| 2 | smart | jev-orchestrator (+ SPEC, EVOLUTION, CAPABILITY files), jev-corpus (+ SPEC-CORPUS, SPEC-VISCO), knowledge-corpus-mint (+ MINT-BRIEF*), self-archaeology |
| 3 | smart | restful-self (+ companion), internal-big-picture, internal-nonlex-tokens, curve-guided-rsi-self, curve-guided-rsi, curve-compass-skill, hyperspherical-harmonic-curve, continuous-runtime-detection-falco, runtime-attestation-keylime, least-privilege-pod-security-standards |
| 4 | general | custom-connection, radio-queue (+ scripts, examples), play-audio-on-rock1, ascii-uart-animator, chromium-overlay-ship, the-cult, the-follower, human-for-feasibility, prior-art-search, parallel-build-lanes, parallel-deep-research, refs-refresh-sweep, novelty-indication, pr-launch, systemd-homed, 0pointer-mastery |
| 5 | general | security-and-hardening, shipping-and-launch, performance-optimization, test-driven-development, using-agent-skills, token-efficiency, recursive-self-improvement, context-isolation, nss-knowledge-recursion, nss-adjacent-problems, nss-composition, nss-mode |

Counts: lane 1 has 3 skills, lane 2 has 4, lane 3 has 10, lane 4 has 16, lane 5 has 12, for 45 skill directories in total. The remaining skills in the 131-skill corpus had no hits assigned to a lane.

## How the partition follows the rules

The partition is not alphabetical; it groups skills by the kind of judgment their fixes require.

**Lanes 1 to 3 (smart tier): judgment-heavy R2 and R4 work.** These skills carry long RSI changelogs, cite many artifacts, and reference retired repos and session paths. Each R4 hit needs a decision between (a) repoint, (b) runtime-capture rewrite, or (c) annotate, and each R2 citation needs a plausibility check that a yubiOS equivalent exists. Lane 2 also owns large companion SPEC files for the jev family and the mint brief files. These are the lanes where a wrong call fabricates a repo path, which is why they get the smart tier.

**Lane 4 (general tier): mechanical R1 and R3 work.** custom-connection, radio-queue, play-audio-on-rock1, and ascii-uart-animator are exactly the skills R1 names for connection-id replacement. Their fixes are mostly string substitutions with known targets. The lane also collects workflow skills whose fixes are R2 push-target changes and R3 dirName rewrites.

**Lane 5 (general tier): R5 plus engineering-workflow skills.** The first five skills in lane 5 are exactly the five R5 skills with broken `../../references/*.md` links. Grouping them means one lane makes the single "try to source from `anthropics/skills` once" attempt and applies a consistent outcome to all five.

## Disjointness details

Companion files travel with their skill. jev-orchestrator's SPEC, EVOLUTION, and CAPABILITY files, jev-corpus's SPEC-CORPUS and SPEC-VISCO, the MINT-BRIEF files, restful-self's companion, and radio-queue's scripts and examples all belong to the lane that owns the parent skill. That keeps every file in exactly one lane even when a skill directory has many files.

## Model-tier choice

Matching tier to task is a token-efficiency principle: mechanical substitutions with known targets do not need the most capable model, while decisions that risk fabricating repo paths do. The split here is 3 smart lanes covering 17 skills and 2 general lanes covering 28.

## What lanes may not do

Lanes edit copies in their own workspace (doc 05), never push, and never touch another lane's files. The orchestrator owns the merge and the single push, which keeps the history atomic and lets the advisor review one full diff.
