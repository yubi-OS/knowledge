# 01 - Context: the two destructive-capable workflows

Scope: why the yubiOS hw_device and allow_real_u2f flags exist, which 2 workflows carry them, and why the pairing matters on self-hosted runners.

The yubiOS playbook "hw_device + allow_real_u2f - the two-flag opt-in" (dated 2026-08-01) applies when dispatching `ci_test-vm.yml` or `ci_test-vgpu-vm.yml`, especially in self-mode against the arm64 self-hosted `rock1` runner (source doc: yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md). Per the source doc, these are the only 2 workflows in the fleet whose dispatch body can physically wipe a runner disk (`hw_device`) and the only 2 that can silently mask a regression behind a real YubiKey (`allow_real_u2f`).

The 2 flags have very different characters:

- `hw_device` is DESTRUCTIVE. It names a spare block device for the hardware install leg of the CI run. An empty value means the leg is skipped (source doc).
- `allow_real_u2f` is a safety opt-in. It is required when a physical Yubico device is on the host (source doc).

The context that makes this pairing necessary is the nature of self-hosted runners. GitHub's documentation describes self-hosted runners as machines that you host and manage yourself, running jobs from your own repositories (https://docs.github.com/en/actions/concepts/runners/self-hosted-runners, jev weight 0.90). Unlike ephemeral hosted runners, a self-hosted machine persists across jobs, so a destructive dispatch body pointed at the wrong device has consequences that outlive the run. The yubiOS runner fleet includes exactly this class of machine: the arm64 `rock1` box named in the source doc as the self-mode target.

State persistence on long-lived self-hosted runners is a known operational concern beyond yubiOS: the actions/runner project tracks reports of cleanup and update bloat accumulating on self-hosted runners over time (https://github.com/actions/runner/issues/2708, jev weight 0.64). The yubiOS playbook addresses the sharper end of the same problem: not stale state, but a dispatch input that can destroy disk contents.

The two flags also interact. The source doc's dispatch shapes show all 3 realistic combinations: a hosted dispatch with no real key passes `hw_device: ""` and `allow_real_u2f: "false"`; the `rock1` runner with a real key attached passes `allow_real_u2f: "true"` while still leaving `hw_device: ""`; and the fully destructive shape passes an explicit `/dev/sdX` plus `allow_real_u2f: "true"`, and requires Jenny's approval for that run (source doc).

The corpus takes the playbook's own framing: the two flags are the mechanism by which real-hardware testing stays deliberate. Every other workflow in the fleet is safe to dispatch unattended; these 2 are not, because one can wipe a disk and the other can quietly change what a test is actually testing. The sections that follow (02 through 08) unpack the decision rule, the guard mechanism, the env plumbing, the preflight checks, the recorded evidence, the tradeoffs, and the cross-references that the source doc binds together.
