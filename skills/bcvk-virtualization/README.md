# bcvk Virtualization - Knowledge Corpus

Explication corpus for the yubiOS skill `skills/bcvk-virtualization/SKILL.md` (yubi-OS/yubiOS). The corpus explicates the bcvk (bootc virtualization kit) skill: what it does, the commands it teaches, the mechanisms behind them, and the CI wiring it encodes. The SKILL.md remains the primary source of record; every doc cites it as grounding spine and adds searXNG-dig sources with jev weights.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-overview-stack.md](01-overview-stack.md) | bcvk as a Rust toolkit running bootc images as VMs via podman + QEMU + virtiofsd, unprivileged; the command decision matrix |
| 02 | [02-ephemeral-vms.md](02-ephemeral-vms.md) | ephemeral VM lifecycle: run, ssh, detach, port forward; VM disappears on stop; production-likeness caveat |
| 03 | [03-disk-image-creation.md](03-disk-image-creation.md) | bcvk to-disk: boots an ephemeral VM and runs bootc install to-disk inside it; raw/qcow2, disk size, filesystem |
| 04 | [04-native-to-disk.md](04-native-to-disk.md) | bare metal flash through a privileged podman container; safety checklist; --yes and --rootful |
| 05 | [05-libvirt-persistent-vms.md](05-libvirt-persistent-vms.md) | persistent named VMs: libvirt run/list/ssh/stop/start; defaults and the --filesystem caveat |
| 06 | [06-yubikey-usb-passthrough.md](06-yubikey-usb-passthrough.md) | QEMU u2f-passthru with hidraw; udevadm discovery; libvirt USB hostdev XML; the pamu2fcfg hang issue |
| 08 | [08-luks-tpm-gotcha.md](08-luks-tpm-gotcha.md) | LUKS + TPM enrollment fails in VMs (PCR mismatch); two-stage workaround; CI variant |
| 09 | [09-ci-workflow-quality.md](09-ci-workflow-quality.md) | the GitHub Actions job (mkosi build, ephemeral boot test with timeout, FIDO2 enrollment test) and bcvk REVIEW.md code quality rules |

## Research summary

- Results collected: 156 (108 initial, 36 redo round 1, 12 redo round 2 for the fido2-emulators subtopic)
- Weight split: 47 high (>= 0.5), 109 low (< 0.5)
- Per doc (total / high / low): 01: 12/6/6, 02: 12/5/7, 03: 12/6/6, 04: 12/8/4, 05: 12/2/10, 06: 12/9/3, 07: 36/2/34, 08: 24/6/18, 09: 24/3/21
- jev: 13 requests (score outline validation x1, noul weighting x12), usage 31222 input / 4519 output tokens. Weighting used the DefAPI direct endpoint (https://api.defapi.org/api/v1/decisions) per the speed optimization; no request fell back to the worker relay.
- Redos: 3 (07 x2, 08 x1, 09 x1)
- Skipped docs: 07-fido2-software-emulators. The dig never came back strong across 2 redos (highest result 0.53, a VirtualBox ticket; the emulator projects themselves weighted 0.22 to 0.61). Per the REDO rule the doc is skipped rather than padded. The source doc's emulator facts remain available in the SKILL.md itself.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide via DefAPI direct (typesafe/jev-1.13) 200 on all 13 requests. Agent-side probe skipped for speed per mint brief.

## Gaps

- 07-fido2-software-emulators: skipped (thin digs after 2 redos, see above).
- Doc 05 carries only 2 high-weight results (bcvk repo, virsh man page); the libvirt layer itself is thin in the dig but the primary sources cover the subtopic's claims.
