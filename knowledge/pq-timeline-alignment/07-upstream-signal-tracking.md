# 07 - Upstream signal tracking

Scope: how an OS project tracks upstream signals (release notes, RFC milestones, vendor roadmaps, CI experiments) and translates them into adoption sequencing.

## Why tracking is a first-class discipline

An OS project does not control any of its PQ timelines; it reacts to upstream ones. Sequencing therefore reduces to a reading problem: which upstream documents carry the signal, and what state in those documents means what for the distro. The dig for this subtopic found the strongest material in the standards world, where the signal semantics are formalized.

## The IETF signal ladder

The IETF defines a document lifecycle with named stages, and each stage is a usable adoption signal. The IETF chairs' document lifecycle resource "provides an overview of the various stages of an Internet-Draft (I-D) document, how a document progresses from one stage to another, and the roles different individuals and groups play at each stage" (https://chairs.ietf.org/documents/lifecycle, weight 0.95; the extended version is at https://chairs.ietf.org/en/documents, weight 0.91).

The states a tracker should watch:

1. Individual submission: a draft exists but no working group has claimed it. This is the earliest weak signal; the X25519MLKEM768 hybrid group spent time here as draft-kwiatkowski-tls-ecdhe-mlkem (see doc 02).
2. Working group adoption. RFC 7221's updated handling document states that working group drafts "are documents that are subject to IETF working group revision control, with advancement for publication as an RFC requiring rough consensus in the working group and then in the broader IETF" (https://www.ietf.org/archive/id/draft-carpenter-gendispatch-rfc7221bis-02.html, weight 0.77). WG adoption is the point where the community has bet on the work.
3. Publication: the RFC publication process "begins when an Internet-Draft is approved by one of the publication streams," with IETF-stream documents submitted by the IESG per RFC 2026 and successors (https://authors.ietf.org/en/rfc-publication-process, weight 0.92).

Two cautions come from the IETF's own self-examination. Working group charters are required to establish a timetable of milestones, and those milestones "facilitate the Area Director's tracking of working group progress" (https://www.ietf.org/proceedings/123/slides/slides-123-procon-milestones-00.pdf, weight 0.75). But a 2024 update draft argues charter milestones "are often sufficiently out of date that they no longer provide value" and proposes making them optional (https://www.ietf.org/archive/id/draft-schinazi-update-on-milestones-03.html, weight 0.68). The tracking lesson: charter milestone dates are weak schedule signals; document state transitions are the stronger ones. The stream-state reference for tracking individual drafts through adoption calls is at https://datatracker.ietf.org/doc/help/state/draft-stream-ietf/ (weight 0.74).

## Open source project signals

Outside standards bodies, the signal surface is releases and roadmaps. The CNCF's contributor-growth guidance defines a project roadmap as "a strategic plan that outlines the project's vision, goals, and major milestones over a specific period," serving as a navigational guide for contributors and stakeholders (https://contribute.cncf.io/projects/best-practices/community/contributor-growth/open-source-roadmaps/, weight 0.85). For a downstream OS project, a dependency's roadmap is exactly that: a schedule of upstream intent to diff against distro needs.

Release-notes-centric guidance makes the operational version: vendor-neutral guides cover writing release notes, changelog best practices, semantic versioning, and automating it all from GitHub (https://release-notes.dev/learn, weight 0.44, weak backing), and release-monitoring tooling tracks "software releases, security patches, and breaking changes across your whole dependency stack" via release-note feeds (https://pagecrawl.io/blog/software-update-tracker-release-monitoring, weight 0.13, weak backing). The weak weights reflect that these are practitioner guides rather than normative sources, but the pattern is standard: for most dependencies the release note is the only signal available, so the tracker must be automated.

A worked example of the release-changelog-as-signal pattern is a platform changelog entry that consolidates release notes per release pipeline (https://linear.app/changelog/2026-06-18-agent-assisted-project-updates, weight 0.95; note this is a product changelog, cited as a pattern example, not a PQ source).

## Translating signals into adoption posture

The synthesis for an OS sequencer is a mapping from upstream state to distro posture:

| Upstream signal | Meaning | Distro posture |
|---|---|---|
| Individual draft / vendor experiment | Direction visible, nothing committed | Track only; no image dependency |
| WG adoption / roadmap milestone set | Community has committed | CI experiments; feature-flagged builds |
| Publication (RFC) / final standard | Stable contract | Package and ship, possibly non-default |
| Upstream default flip (library defaults, release notes) | Everyone gets it by update | Adopt default; audit override paths |

The OpenSSL 3.5 default-group flip (doc 04) is the live example of the last row: the signal that matters was not a new release, it was a default change inside an LTS release, and it propagates to any distribution that links against it.

## Keeping the tracker honest

Two practices fall out of the sources. First, prefer state transitions over dates: the IETF milestone criticism (weight 0.68) applies to internal roadmaps too, and a tracker keyed on "expected in Q3" entries rots faster than one keyed on merge-and-release events. Second, record the signal source with the decision: every adoption decision in the corpus docs carries its upstream URL and weight so a later reader can re-check whether the signal has moved.
