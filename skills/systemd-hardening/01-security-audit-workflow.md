# Security Audit Workflow

Scope: how systemd-analyze security scores a service, what the score does and does not measure, and the audit-first workflow yubiOS expects before any hardening edit.

## Source-doc position

The yubiOS skill (source doc: yubi-OS/yubiOS skills/systemd-hardening/SKILL.md) makes auditing the first step: run `systemd-analyze security` to score all services on a 0.0 to 10.0 scale (0.0 secure, 10.0 fully exposed), audit a specific unit with `systemd-analyze security sshd.service`, and list the highest-impact unset directives with `systemd-analyze security --no-pager sshd.service | head -40`. Scores above 7.0 warrant hardening; the yubiOS target is below 4.0 on all services.

## What the exposure score measures

The score is an automated rating of a unit's use of sandboxing and privilege-related settings, not a vulnerability scan (https://www.ctrl.blog/entry/systemd-service-hardening/, jev weight 0.25). Each unset protective directive contributes exposure, so the number rises as a unit leaves systemd's security defaults untouched. One weak-backed source (0.15, https://dev.to/lyraalishaikh/harden-linux-services-with-systemd-analyze-security-from-score-to-enforceable-policy-5415) frames the score as evaluating a unit against sandboxing and privilege settings with detailed per-directive findings, which matches the source doc's use of the output to pick hardening targets.

A dated caution from a 2026 article (weak source, 0.25, https://secure-os.org/articles/systemd-service-hardening/): the systemd manual itself is explicit that a high score does not mean a service is vulnerable. The tool measures configuration coverage; it cannot see application-level bugs. yubiOS treats the score as a coverage metric toward the below 4.0 target, not as a threat assessment.

## Audit-first workflow in practice

The source doc fixes the order of operations: audit, then harden, then re-verify. The workflow:

1. `systemd-analyze security` over all units to rank exposure.
2. Per-unit detail for the worst offender, non-paginated, head-limited to the top unset directives.
3. Apply hardening incrementally (see doc 06).
4. Re-run the per-unit score and confirm the drop toward the target.

A weak-backed operational guide (0.18, https://mylinux.work/guides/systemd-hardening/) describes the same loop: directives restrict what a service can do with no containers, no SELinux policy writing, and no kernel recompilation, and the exposure score guides which service to touch first. Another weak source (0.16, https://runbook.academy/courses/linux/lessons/linux-systemd-analyze-and-blame/) recommends running the security audit regularly and integrating it into CI; yubiOS reaches the same end through its pipeline gates rather than a manual cadence.

## Reading the output

`systemd-analyze security <unit>` prints the overall exposure score plus a table of directives, each marked SAFE or UNSAFE with an exposure weight. Sorting is by impact, so the head of the list is where hardening pays off most; that is why the source doc pipes through `head -40` with `--no-pager`. The score line format is `Overall exposure level: N.N (safe|moderate|exposed)`, though agents should parse the per-directive lines rather than trusting the summary label alone.

## yubiOS rules of thumb

- Audit every unit, not only the famous ones: the source doc requires hardening for all services.
- Thresholds: above 7.0 needs work now, below 4.0 is the ship bar (source doc).
- Never harden blind: every phase of changes is followed by a fresh per-unit score (source doc, Verify Score section).

## Caveats

The score is directive-coverage based, so two services with equal scores can carry very different real-world risk (weak source, 0.25, https://secure-os.org/articles/systemd-service-hardening/). yubiOS resolves this by pairing the score with the primitive map: least privilege and attestation reviews (see doc 10) judge the runtime shape that the score cannot.

Sources: source doc plus 6 dig results (1 high weight at or above 0.5, 5 weak). The dig for this subtopic returned mostly secondary tutorials, so all non-source-doc claims above are labeled with their weak weights.
