# The four-dimension audience model and its controlled vocabulary

**Scope:** the Audience axis models every file with four dimensions (role, proximity, interaction, mode) drawn from small controlled vocabularies, and it forbids free-form labels because unenforced tags decay into decoration.

## The core question

The Audience axis of the negative-skill-space sweep asks a sharper question for every file than "who is this for?" (source doc: yubi-OS/yubiOS skills/nss-audience/SKILL.md): which reader, in which situation, is expected to use this file to accomplish which job, and what evidence shows the corpus actually supports that reader. A flat role label is not enough to answer it. A header that says "for users" without a role, a proximity level, and a job is documentation theatre, and the skill treats such a file as unknown rather than served.

The model combines four dimensions (source doc):

1. Role: end user, developer, operator, CI or automation, maintainer, incident responder, architect or evaluator, support.
2. Proximity: novice, general, expert, unknown.
3. Interaction: human, machine, mixed, unknown.
4. Mode, in the Diataxis sense plus operational modes: tutorial, how-to, reference, explanation, runbook, policy, ADR, unknown.

A file that says "this is for operators" but reads like a developer integration guide is an audience gap. A page that targets CI by listing shell commands but never states exit codes, env vars, or inputs is a gap even though it mentions automation. An operator runbook that explains architecture instead of telling the operator what to do is a mode mismatch, and that is also an audience gap (source doc).

## Why mode is a separate axis

Mode is a distinct dimension from role. Diataxis divides documentation into 4 modes: tutorials, how-to guides, reference, and explanation, each corresponding to a different user need (https://ubuntu.com/blog/diataxis-a-new-foundation-for-canonical-documentation, weight 0.33, weak). The framework prescribes approaches to content, architecture, and form that emerge from a systematic study of documentation practice (https://github.com/evildmp/diataxis-documentation-framework, weight 0.48, weak; https://diataxis.fr/, weight 0.43, weak). Its application guidance is explicit that tutorials are learning-oriented experiences, how-to guides are goal-oriented directions, reference is information-oriented technical description, and explanation is understanding-oriented discussion (https://diataxis.fr/application/, weight 0.53). Practitioner guides built on the framework treat this division as the primary axis of information architecture (https://qiskit.github.io/qiskit_sphinx_theme/intro/diataxis.html, weight 0.51).

The skill extends the 4 Diataxis modes with runbook, policy, ADR, and unknown, because an operator corpus needs modes Diataxis does not name (source doc). A runbook is a structured set of predefined steps for handling specific incidents or scenarios (https://betterstack.com/docs/uptime/runbooks/, weight 0.45, weak), and that operational mode is exactly what an architect-oriented explanation page must not be confused with.

## Why role and proximity come from the technical-writing canon

The role-plus-proximity pair is the audience model from Google's technical writing course: defining the audience involves identifying their roles and proximity to the subject matter, considering technical expertise and project familiarity (https://developers.google.com/tech-writing/one/audience, weight 0.69). That source grounds the strongest anti-pattern in the skill: inferring audience from author. Google's guidance is that documentation exists so the audience can perform a task given their existing knowledge and skills, which makes the reader's situation, not the writer's identity, the basis of classification (https://developers.google.com/tech-writing/one/audience, weight 0.70).

## The DITA precedent for machine-readable audience metadata

The vocabulary is not invented from nothing. DITA's `<audience>` metadata element has encoded audience as structured, machine-readable data for years. The OASIS 1.2 specification says that for each audience you can identify the high-level task the reader is trying to accomplish and their experience level (https://docs.oasis-open.org/dita/v1.2/os/spec/langref/audience.html, weight 0.77). The element indicates the intended audience through its `@type` attribute, and a topic can carry multiple `<audience>` elements when it serves several reader groups (https://www.oxygenxml.com/dita/1.3/specs/langRef/base/audience.html, weight 0.76). The 2.0 language reference defines an audience as the group of readers for whom a piece of content is intended (https://dita-lang.org/2.0/dita/langref/base/audience, weight 0.87), and the 1.3 reference places it inside the prolog metadata alongside author and category (https://dita-lang.org/1.3/dita/langref/base/audience, weight 0.86). Tooling follows the spec: FrameMaker lets a topic carry multiple audience elements, each with a task and experience level (https://help.adobe.com/en_US/framemaker/using/using-framemaker/dita-1.3-source/langRef/base/audience.html, weight 0.82).

The yubiOS vocabulary inherits the same shape: a fixed role list, an experience list, an interaction list, a mode list, and a jobs list (`evaluate, install, configure, develop, test, deploy, monitor, troubleshoot, migrate, extend, maintain, recover, unknown`), all closed (source doc). New values require a vocabulary revision, not a one-off addition.

## Permit unknown and mixed

The skill permits `unknown` and `mixed` in every dimension (source doc). Forcing a single role where a file genuinely serves several readers manufactures false precision and hides the real gap. An ADR is read by maintainers, architects, and developers simultaneously, so the correct declaration is a multi-role list with a note explaining which section serves which role, not a single tidy role. Mixed is allowed; lying is not (source doc).

This is also the position of classical audience analysis: audience analysis gets complicated by mixed audience types for one document and wide variability within an audience (https://alg.manifoldapp.org/read/open-technical-communication/section/415d5b4f-758e-49ac-8149-18d4c3c4c10c, weight 0.18, weak), and primary versus secondary versus hidden audiences are a standard distinction in technical communication (https://writingcommons.org/article/audience-analysis-primary-secondary-and-hidden-audiences/, weight 0.16, weak). The controlled vocabulary makes those distinctions machine-checkable instead of rhetorical.

## The jobs vocabulary ties role to demand

Roles without jobs cannot be prioritized. The 13-job vocabulary (source doc) is what lets the coverage matrix score cells by risk and demand rather than file count, and it matches the DITA idea that each audience declaration names the task that audience is trying to accomplish (https://docs.oasis-open.org/dita/v1.2/os/spec/langref/audience.html, weight 0.77). The jobs-to-be-done frame behind it holds that users hire a product for a specific job (https://www.nngroup.com/articles/personas-jobs-be-done/, weight 0.40, weak), which is the demand side the matrix multiplies against coverage.
