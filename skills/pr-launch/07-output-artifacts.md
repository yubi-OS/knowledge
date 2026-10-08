# 07 - Output Artifacts and the Pre-Launch Verification Checklist

**Scope:** The 7 files the pr-launch skill produces when it runs, and the 9-item pre-launch verification checklist that gates launch day.

This is an internal-record subtopic: it documents the skill's own artifact contract and checklist, which exist only in the source doc, yubi-OS/yubiOS skills/pr-launch/SKILL.md. No dig was run; there is no external mechanism to research. Claims below are attributed to the source doc.

## The 7 output artifacts

When running a PR launch with this skill, the source doc requires exactly these files (source doc, "Output Artifacts"):

1. **documents/pr/launch-plan.md** - the phase checklist with dates. This is the coordination artifact for the 4-phase timeline (doc 02): each phase's actions get a date and an owner slot.
2. **documents/pr/assets/hn-post.md** - the Show HN post draft (structure in doc 04).
3. **documents/pr/assets/reddit-netsec.md** - the technical Reddit seed post for r/netsec (structure in doc 04).
4. **documents/pr/assets/reddit-privacy.md** - the general Reddit seed post for r/privacy (structure in doc 04).
5. **documents/pr/assets/press-pitch.md** - the 1-paragraph press pitch for Phoronix, LWN, Ars Technica (structure in doc 04).
6. **documents/pr/assets/social-thread.md** - the 3-post social summary thread.
7. **documents/pr/coverage.md** - the running log of coverage links, created at Phase 0 and updated post-launch (source doc, Phase 2).

Two properties of this artifact set matter for consumers of the corpus:

- **The 5 launch assets are drafts at Phase 0 and live posts at Phase 1.** The file paths under documents/pr/assets/ hold the reviewed drafts; the same content becomes the posted text. The verification checklist requires "All 4 community posts drafted and reviewed" plus the press pitch and social thread drafted before launch day (source doc).
- **coverage.md is the only post-launch artifact.** Phases 1 through 3 append to it (HN thread URL, subreddit URLs, press replies, published coverage links). It is the skill's persistence layer: after launch week, coverage.md is what remains.

## The pre-launch verification checklist

The source doc's Verification Checklist gates launch day with 9 items (source doc):

1. README answers: what, why not TPM, how to try, how to trust (doc 05).
2. All 4 community posts drafted and reviewed.
3. Press pitch drafted.
4. Social thread drafted.
5. 2-3 trusted community members briefed (the seeding step, doc 02).
6. Launch time confirmed (Thursday 9-11 AM ET preferred, doc 03).
7. documents/pr/launch-plan.md has dates and owners.
8. GitHub repo is public and README renders cleanly.
9. No broken links in README or onboarding doc.

The checklist is a Phase 0 exit gate: all 9 items are checkable before T=0, and none of them require post-launch information. Item 7 is the artifact-consistency check: launch-plan.md must carry dates and owners, not just phase names, because the Phase 1 sequence is time-sensitive (the 2-hour fan-out window).

## In-repo touchpoints and boundary

The source doc's Examples section lists the sections this skill owns or extends: "When to Use, Project Context: yubios, Launch Phases, Phase 0: Pre-Launch Prep (2-3 days before)" (source doc). For boundary cases the source doc's rule is: when a request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising (source doc). In practice that means a request like "prepare the launch" routes to this skill's artifacts, while a request that names a different artifact (an ADR, a CI workflow) belongs to the skill that owns it.

## Why a fixed artifact set

The artifact list is fixed so that a launch run is auditable against a known shape: 7 files, 9 checklist items, 4 phases. A consumer rerunning the skill can diff their run against this contract and see what is missing before launch day, when there is still time to fix it. This mirrors the checklist-first discipline of the skill's other gates (the README audit in doc 05) and is the reason the checklist exists as a separate section rather than being folded into the phases.
