# 06 - Status labels: preview language versus production support

Scope: Maturity and status labeling: technical preview, groundwork, beta versus production support language in READMEs and SECURITY.md supported-versions tables.

## The supported-versions table is the support envelope

GitHub's documentation treats the security policy as the place where support status is declared: a SECURITY.md should carry information about supported versions of the project and how to report a vulnerability [1] (jev weight 0.92). The standard template convention, weakly weighted, states the purpose plainly: the supported-versions section tells people which versions of the project are currently being supported with security updates [2] (jev weight 0.12, weak backing). Together these define the exact contract: a version either appears in the table or it receives no security-update promise. Any campaign language implying production support for a version outside the table is claiming against the project's own policy.

## Preview labels carry a defined, limited promise

Red Hat's Technology Preview scope-of-support page is the sharpest available definition of preview semantics: Technology Preview features provide early access to upcoming product innovations, enabling customers to test functionality and provide feedback during the development process [3] (jev weight 0.65). The label is a promise about the kind of feedback loop, not about reliability or support. A campaign surface may therefore say "technical preview" and describe what testers can exercise; it may not attach production-support language, because the preview definition itself excludes it.

The transferable rule for any project: pick one of the recognized labels (technical preview, groundwork, beta, release candidate, stable), and let the bounding documents (SECURITY.md table, README status badge) carry the definition. A label plus a definition in a governed document is a claim; a label alone is an invitation to assume.

## Disclosure process language

GitHub's own SECURITY.md demonstrates the disclosure posture that pairs with honest status: report vulnerabilities through coordinated disclosure, and do not report security vulnerabilities through public GitHub issues, discussions, or pull requests [4] (jev weight 0.21, weak backing). A weakly weighted guide on writing repository security policies describes the document as operational: it tells security researchers how to contact you safely, tells users which versions you still support, and tells everyone what kind of response process they can reasonably expect [5] (jev weight 0.39, weak backing). The operational reading matters for claims: the SECURITY.md is the project's own statement of what support and response actually look like, which makes it the reference for any status-flavored marketing sentence.

## The three-label discipline

Synthesizing across the sources:

1. Status lives in governed files: README status badge and SECURITY.md supported-versions table [1] (jev weight 0.92).
2. Preview has a bounded meaning: early access for testing and feedback, not production support [3] (jev weight 0.65).
3. Claims about support must match the table: an unsupported version cannot be marketed as supported, and a preview cannot be marketed as production [3] (jev weight 0.65).
4. Disclosure expectations are part of the status: private coordinated disclosure channels, not public issue trackers [4] (jev weight 0.21, weak backing).

A campaign surface writing "groundwork" or "technical preview" should be checked against this list before publishing, exactly as the source doc for this corpus requires any production-support language to be absent from preview-status surfaces.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | GitHub Docs, adding a security policy: https://docs.github.com/code-security/getting-started/adding-a-security-policy-to-your-repository | 0.92 |
| 2 | Repository SECURITY.md examples gist: https://gist.github.com/bayudwiyansatria/3aa6a865aad8d45d69cdb80090bea7c7 | 0.12 (weak) |
| 3 | Red Hat, Technology Preview Features scope of support: https://access.redhat.com/support/offerings/techpreview | 0.65 |
| 4 | github/.github SECURITY.md: https://github.com/github/.github/blob/master/SECURITY.md | 0.21 (weak) |
| 5 | Tenthirtyam, writing an effective security policy: https://tenthirtyam.org/dispatches/2026/04/21/how-to-write-an-effective-security-policy-for-github-repositories/ | 0.39 (weak) |
