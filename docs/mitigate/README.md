# docs/mitigate

Knowledge corpus explicating **yubi-OS/yubiOS `docs/MITIGATE.md`** (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MITIGATE.md): the Faux Phy Qualcomm attack-chain mitigations on the Surface laptop, the hardware bring-up discipline, and the mitigation matrix. The source doc is the primary source of record; every doc here cites it as the grounding spine and adds searXNG-dug external sources for the mechanisms it names.

## Index

| NN | doc | scope |
|---|---|---|
| 01 | [01-faux-phy-attack-chain.md](01-faux-phy-attack-chain.md) | the three phase Faux Phy supply chain attack chain and the cryptographic-validation posture |
| 02 | [02-step2-pre-init-hijack.md](02-step2-pre-init-hijack.md) | signed initrd, kernel lockdown, IMA, CoreSight, dm-verity /usr, usrhash=, generators, DPS fallback |
| 03 | [03-step3-runtime-control.md](03-step3-runtime-control.md) | faux ACPI, no TEE dependency, Computrace detection, radio persistence, proc scrubbing controls |
| 04 | [04-attack-surface-coverage-matrix.md](04-attack-surface-coverage-matrix.md) | internal-record: the 21 surface coverage chart and mermaid attack flow |
| 05 | [05-prevention-gaps-hardware-boundary.md](05-prevention-gaps-hardware-boundary.md) | the five declared gaps and hardware selection escape routes |
| 06 | [06-primary-mitigations-matrix.md](06-primary-mitigations-matrix.md) | threat model assumptions and the threat by threat residual-risk table |
| 07 | [07-firmware-validation-hardening-discipline.md](07-firmware-validation-hardening-discipline.md) | chipsec first boot service, WPBT scan limits, systemd hardening notes, out of scope list |

## Research summary

- Results collected: 84 (weights: 22 high >= 0.5, 62 low < 0.5)
- jev requests: 8 scored requests (1 outline score validation, weighting batches) plus 1 duplicate request from a client-side log crash; usage 10652 input / 1763 output tokens
- Redos: 1 (doc 01 first dig returned no >= 0.5 result; redo dig produced Securelist MoonBounce at 0.62)
- Skipped docs: none; 2 outline subtopics dropped at validation (original nn 02 step1-oem-vendor-persistence, score 0.47 -> 0; nn 08 platform-risk-split-arm64-x86-64, score 0.37 -> 0). Their content is carried by docs 01, 03, 06 and 07.
- Doc 04 is an internal-record subtopic: no dig, authored from the source doc itself.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); DefAPI typesafe/jev-1.13 decide healthy (campaign preflight, orchestrator).
