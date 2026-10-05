# systemd-analyze security as a hardening gate

## Scope

Using systemd-analyze security exposure scores as a measurable regression gate for unit hardening: what the score is, what it does not measure, and how a CI gate can enforce a threshold.

## What the score is

The systemd-analyze security command gives systemd service units an automated security rating, listing each service unit with a security exposure score, and serves as a starting point for hardening work (ctrl.blog, https://www.ctrl.blog/entry/systemd-service-hardening/). The score runs from 0 (safe) to 10 (exposed), and by default most services score 9 or higher before hardening (gntech, https://blog.gntech.me/posts/2026-05-24-systemd-service-hardening-linux/). As of version 233, the underlying review ran 77 tests against the unit's directives (ctrl.blog, https://www.ctrl.blog/entry/systemd-service-hardening/), which is why the score moves in visible increments when a directive like NoNewPrivileges or ProtectSystem lands.

## What the score does not tell you

The manual is explicit that a high score does not mean a service is vulnerable: the tool measures configured sandboxing settings, it cannot see the service's actual runtime behaviour, and settings must be combined to be effective (secure-os.org, https://secure-os.org/articles/systemd-service-hardening/). The score is therefore an exposure metric, not a vulnerability metric. A gate built on it enforces hardening hygiene, not exploit-resistance; the distinction matters when a unit legitimately scores 10 because its function requires privileges.

## From score to enforceable policy

The score converts into practice as a before-and-after discipline: use systemd-analyze security to score and prioritise hardening work, then apply directives via drop-in override files so they survive package updates (intramweb, https://www.intramweb.com/linux-security/systemctl-security-linux/). The dev.to hardening guide treats the score as the prioritisation input, evaluating a unit against sandboxing and privilege-related settings and reporting an exposure score with detailed findings to decide what to harden first (dev.to, https://dev.to/lyraalishaikh/harden-linux-services-with-systemd-analyze-security-from-score-to-enforceable-policy-5415).

## CI enforcement exists as a pattern

The gate is mechanically simple and has shipped as an open pattern: a CLI plus GitHub Action that fails CI when required systemd service units in a repository exceed a security exposure threshold, using systemd-analyze security in offline mode (teunlao/systemd-security-gate, https://github.com/teunlao/systemd-security-gate; README at https://github.com/teunlao/systemd-security-gate/blob/main/README.md). Offline mode is the property that makes CI integration possible: the analysis runs without booting the unit.

## The gate discipline for a fleet

The measurable contract for a unit-hardening change is: record the exposure score before the change and after, in the PR body, and fail the change if the score regresses without a written justification. This is exactly the flip condition the source decision records: unit hardening would be relaxed per-unit only with a systemd-analyze security score recorded before and after in the PR body. The gate turns that condition from convention into CI enforcement, with the threshold as the tuned knob and the per-unit score history as the audit trail.
