# 06 Cross-milestone items with no parent

Scope: the work items the source doc records outside the four milestones, with no parent issue in the milestone structure. Internal-record subtopic: no dig, all claims from the source doc. Grounding spine: source doc yubi-OS/yubiOS docs/MILESTONE.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MILESTONE.md.

## Why these exist as a category

The source doc gives this section its own heading, "Cross-milestone (no parent)", and it matters for a corpus explicating the doc because these items are not owned by any of the four milestones yet still appear in the planning surface (source doc). They fall into three classes: mirror infrastructure, standalone validation, and longer-horizon research.

## Mirror infrastructure

Two Done items document the doc's own existence (source doc):

- **OMN-44 (MILESTONE.md mirror, Done P4)**: the issue that created and maintains this doc as the repo-native mirror of the Linear execution project.
- **OMN-64 (this doc's draft, Done P4)**: the drafting issue for the doc itself.

The source doc also quotes OMN-44's own framing: "This is a planning-only repository documentation task, per OMN-44's own framing: revisit implementation only after repo-side coding work resumes on each milestone." (source doc). This is a load-bearing constraint for anyone consuming the doc: it is a planning artifact, and its maintenance cadence is tied to when coding work resumes per milestone, not to a continuous schedule.

## Standalone hardware validation

- **OMN-42 (real-hardware FIDO2 validation, Backlog P2)**: parent to OMN-63 (Done P2). The source doc records it as "Standalone; feeds into Gate 3 not any specific milestone." (source doc). This is the only item in the doc with an explicit gate-level (rather than milestone-level) destination, which is why it sits outside the milestone structure even though its subject matter (FIDO2) touches milestone 2's scope. The relation to milestone 2 is adjacency, not ownership: milestone 2's B-REAL-FIDO2 blocker awaits a human owner with physical hardware, and OMN-42/OMN-63 are the separate validation track that produced the 12 scenarios informing that work.

## Hygiene item

- **OMN-96 (fTPM /dev/tpm0 CI, In Progress, P0 where P0 means "No priority")**: the source doc labels it "real surface work; hygiene gap. Recommend relabel priority." (source doc). Two things are notable: the item is actually in progress on a real surface (unlike most backlog items in the doc), and its priority label is broken in the Linear sense, P0 here carries the meaning "No priority" rather than the conventional urgent meaning. The doc's recommendation to relabel is itself a record worth keeping: it shows the mirror treats priority-label integrity as part of planning hygiene.

## Longer-horizon research

- **OMN-97 / OMN-100 / OMN-108 (vGPU CI / libvfio-user / GPU trust boundary)**: all Backlog, and the source doc classifies them as "longer-horizon research." (source doc). These three form a coherent cluster: virtual GPU support in CI (OMN-97), the user-space VFIO library that would underpin device passthrough (OMN-100), and the trust boundary question for GPU workloads (OMN-108). None has a parent, none feeds a milestone gate as the doc records it, and together they represent the next planning horizon beyond the four milestones.

## How this category is consumed

A reader of MILESTONE.md should treat the cross-milestone section as the doc's appendix of live-but-unparented work. The corpus keeps it separate from the milestone docs because the four milestones carry status percentages, blockers, and critical-path analysis; these items carry none of that machinery. The one status signal the doc records for them is the priority/state pair on each issue, reproduced above as stated.
