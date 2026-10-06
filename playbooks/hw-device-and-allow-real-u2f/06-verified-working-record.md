# 06 - Verified working record (2026-08-01)

Scope: the recorded evidence that the two-flag mechanism works end to end: the guard PR, the 3 commits, and the green vm-e2e run.

This is an internal-record subtopic: every fact below comes from the source doc (yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md). No dig was run for this subtopic (internal-record subtopic, no dig, per the mint brief).

The playbook's "Verified working (2026-08-01)" section records:

- The guard `assert_passless_only` lives in `tests/vm/lib/real-u2f-guard.sh` and was shipped by PR #144. Its refusal on rock1 with a real key is the recorded correct behavior.
- Commit `5200f0b`, "fix(ci): add allow_real_u2f dispatch input + ALLOW_REAL_U2F env to passless CI tests", added the `allow_real_u2f` boolean input (default `false`) that sets `ALLOW_REAL_U2F=1`.
- Commit `5342867`, "fix(ci): forward ALLOW_REAL_U2F env to sudo invocations in passless CI test steps", added the explicit `sudo env ...` forwarding. Without it the flag was set in CI and invisible to the test.
- Commit `6dad3733`, "fix(tests/vm): shellcheck SC2034 on ALLOW_REAL_U2F in PR #144 followups", patched the shellcheck-disable that PR #144's inline `ALLOW_REAL_U2F=1` triggered. Shellcheck does not track cross-file consumers of a variable, so the inline assignment that a later script reads produced a SC2034 warning that had been disabled; the followup replaced the disable with the cross-file-safe form.
- All 3 commits were on `main` as of 2026-07-30.
- vm-e2e run #143 (run id `30523246025`, at commit `5342867`) was green end-to-end on rock1. The significant property of that run: the guard refusal is now opt-in by flag rather than by physically unplugging the key.

What the record establishes, per the source doc:

1. The full chain works: dispatch input to step env (`5200f0b`), step env through sudo to the test process (`5342867`), and the guard's refusal behavior verified against a real key on the actual self-hosted arm64 runner (vm-e2e #143).
2. The lint debt of the mechanism itself was paid (`6dad3733`), so the flag's plumbing does not depend on a shellcheck suppression.
3. The behavior change is operational, not just mechanical: before the fix, running the passless tests on a runner with a real key meant physically removing the key. After, the same safety property is expressed by the flag, and the recorded green run on rock1 is the evidence.

The commit messages quoted here are as recorded in the source doc. No dates, ids, or outcomes beyond what the source doc states have been added.
