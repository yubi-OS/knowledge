# 02 - Decision: two flags, opted into independently, never inferred

Scope: the decision rule the playbook encodes, the 3 canonical dispatch states, and the 422 refusal on undeclared forwarding.

The source doc states the rule in one line: two flags, opted into independently, never inferred (source doc: yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md). Neither flag may be derived from the presence of the other or from the state of the runner; each is a separate, explicit dispatch input.

The playbook enumerates 3 canonical states:

- Unattended or self-mode: `hw_device: ''`, `allow_real_u2f: false`. Nothing destructive, nothing real-hardware (source doc).
- Destructive: explicit `hw_device: /dev/sdX` plus Jenny's approval for that run (source doc).
- Runner with a physical key: `allow_real_u2f: true`, or the guard refuses, and the playbook is explicit that the refusal is correct safety behavior, not a bug (source doc).

The scope of the second flag is deliberately narrow. Only the 2 workflows (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) declare `allow_real_u2f`. Forwarding it to any other child workflow (`ci_test_rootless-docker.yml`, `ci_test_pq_tls_verify.yml`, `ci_test_sealed-uki-vm.yml`, `ci_test_bootc-filesystem.yml`) returns 422 (source doc).

External backing for the declared-inputs requirement comes from GitHub's own workflow syntax reference: `workflow_dispatch` inputs must be declared in the workflow file under `on.workflow_dispatch.inputs`, which is the property that makes forwarding an undeclared input to a child workflow invalid (https://docs.github.com/en/enterprise-cloud@latest/actions/reference/workflows-and-actions/workflow-syntax, jev weight 0.91). The 422 status itself is recorded as observed behavior in the source doc; the dig corroborates the mechanism (inputs must be declared for a dispatch API call to accept them) without contradicting it.

The "never inferred" clause is the load-bearing part of the decision. Inference would be tempting in both directions: a runner detection script could auto-set `allow_real_u2f` when it sees a Yubico device, and a convenience default could auto-fill `hw_device` from the first unmounted disk. The source doc rejects both. Auto-setting `allow_real_u2f` would remove the operator's acknowledgment that the physical key is in play; auto-filling `hw_device` would turn an unattended dispatch into a potentially destructive one with no human approval. The destructive shape therefore carries 2 independent gates: an explicit device name and a per-run human approval (source doc).

For operators the practical summary is: pass exactly what you intend, per run, per workflow. The symptom table in the source doc (05) maps the failure modes of getting this wrong, and the guard mechanism (03) is what enforces the `allow_real_u2f` half of the contract at test time.
