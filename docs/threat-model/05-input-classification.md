# 05 Input Classification

Scope: the model's classification of inputs into attacker-controlled, operator-controlled, and developer-controlled sets, and the rule that a compromised developer identity reclassifies everything in the third set. This is an internal-record subtopic: no searXNG dig was run for it.

Grounding spine: yubi-OS/yubiOS docs/THREAT_MODEL.md (source doc), https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/THREAT_MODEL.md

## Attacker-controlled inputs

The source doc lists the following as attacker-controlled (source doc):

- Network and registry responses.
- OCI metadata and layers, until authenticated by policy.
- Removable media and USB devices.
- On-disk partition tables, filesystems, ESP contents, and writable state after physical access.
- Untrusted application data.
- Packets to any enabled service.
- User-controlled files processed by privileged tools.
- Pull-request content executed by CI.

The doc adds a second tier of attacker-influenceable evidence: firmware tables, device trees, TPM event logs, and UEFI variables must also be treated as untrusted evidence whenever they originate below an unowned firmware boundary (source doc). This is stricter than a naive attacker list: it says that even structured attestation data is hostile input when the thing that produced it is not owner-controlled.

## Operator-controlled inputs

The source doc lists the following as operator-controlled (source doc):

- The target disk.
- Secure Boot key enrollment.
- YubiKey and recovery credential enrollment.
- PIN/touch decisions.
- Board Path A/Path B classification.
- Fuse-burning procedure.
- Fail-open versus fail-closed firmware checks.
- Selected release or upgrade.
- Emergency recovery actions.

The doc's key sentence about this class: these inputs are authorized but not automatically safe (source doc). An operator action is not attacker input, but operator error can still enroll attacker choices, which is why first-boot target identification and provisioning read-back appear in the attacker stories (source doc).

## Developer-controlled inputs

The source doc lists the following as developer-controlled (source doc):

- Source and configuration.
- `Containerfile` variants.
- mkosi profiles.
- `yubiOS.rego`.
- systemd units and scripts under `usr/lib/`.
- Workflow YAML.
- Dependency pins.
- Firmware component revisions.
- Test images.
- Release tags.
- Health criteria.
- Documentation that determines operator behavior.

## The reclassification rule

The source doc states the rule that gives this classification its teeth: a compromised developer identity turns these into attacker-controlled inputs (source doc). This is why the vulnerability-class list treats CI workflow injection and maintainer-account compromise as first-class rather than as trust violations of a privileged insider: the model does not trust the developer class at all, it only credits the current integrity of their identity.

## Consequences for review

Three review consequences follow directly from the classification (all source doc):

- Any code path that consumes an attacker-controlled input while holding privilege is a primary review target, regardless of how ordinary the code looks. Privileged parsers of partitions, filesystems, firmware tables, USB devices, and OCI metadata are named explicitly in the vulnerability-classes doc (source doc).

- Operator inputs need fail-closed handling rather than trust: the model requires enrollment steps to verify before burning, read back state, and provide a tested recovery or abort procedure (source doc).

- Developer-controlled inputs are protected by supply-chain controls (pinned inputs, policy, review), so the strength of the whole developer-input class collapses to the strength of those controls, which is where the model puts its critical-severity stories (source doc).
