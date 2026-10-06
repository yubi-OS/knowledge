# 09 - Cross-references and open gaps the playbook records

Scope: what the playbook points at (blockers, Linear items, ADRs, sibling docs) and the gaps it declares open.

Internal-record subtopic: the cross-reference map and gap list are stated entirely inside the source doc (yubi-OS/yubiOS playbooks/sealed-uki-vm-debug.md), so this doc ran no searXNG dig and cites the source doc throughout.

## The blocker: B-BOOTC-SEAL

The playbook's primary see-also is `docs/BLOCKERS.md` entry B-BOOTC-SEAL (source doc). Its recorded state: the Phase 1 artifact split shipped in PR #143 (`a1940330`), while Phase 2, the install-time BLSConfig wiring plus the Secure Boot and negative-tamper evidence, is still open (source doc). That open half is the structural reason row 8 (doc 07) exists: until Phase 2 lands, the lane cannot prove what the negative tamper tests exist to prove.

## The Permanent CI-Evidence Patterns entry

`docs/BLOCKERS.md` also carries a Permanent CI-Evidence Patterns entry the playbook points to (source doc). It is the standing collection of the CI debugging patterns this playbook instantiates; the playbook is the lane-specific application of that collection.

## Linear and ADR anchors

The playbook names the Linear chain: OMN-43 (parent), OMN-52, OMN-47, OMN-53, OMN-150 (Phase 2), and OMN-116 (ADR-008) (source doc). It names three ADRs: ADR-008, ADR-022, and ADR-032 (source doc). Two of these are load-bearing inside the decision tree: OMN-116 / ADR-008 is the citation for choosing `provider:pkcs11` over `engine:pkcs11` in row 2 (doc 04), and OMN-53 is the item under which PR #155 filled in the workflow stub (doc 08).

## Sibling refs and playbooks

The playbook cross-references four refs docs: `refs/sealed-uki-vm-test-2026-07-30.md` (the 3 jobs and 6 assertions of the lane, the assertion inventory doc 01 defers to), `refs/bootc-composefs-sealed-flow-2026-07-22.md`, `refs/kernel-rootfs-split-2026-07-29.md`, and `refs/sbsign-pkcs11-validate-2026-07-23.md` (source doc). It also names the two workflows this playbook leans on: `ci_mkosi-installer.yml` as the canonical signing pattern and `ci_fork_edk2.yml` as the OVMF artifact source (source doc).

Two sibling playbooks are named. `dispatch-chain-verification.md` is the playbook row 0 applies: the parse-state-before-step-logs rule is that playbook's pattern applied to this lane (source doc). `fido2-vm-e2e-recipe.md` is the sibling end-to-end recipe lane (source doc).

## Gaps 1 and 12

The playbook closes with two declared gaps (source doc):

- Gap 1 and gap 12: there is no `tests/vm/test-secure-boot-tamper.sh`, and negatives 2 and 3 are TODO-only. In other words, the negative tamper assertions (2 of the 6) are declared but not implemented as a real test script.
- The standing proposal: a `yaml.safe_load` pre-dispatch gate would have caught the V37 and V38 parse failures for free (source doc, doc 03).

## How to use this map

The cross-reference map has a use order. For "why does this row exist", start at B-BOOTC-SEAL Phase 2. For "what exactly does the lane assert", start at `refs/sealed-uki-vm-test-2026-07-30.md`. For "which ADR decided the provider choice", start at ADR-008 / OMN-116. For "what has not been built yet", the gaps list: the tamper test script, the TODO negatives, and the pre-dispatch YAML gate. Each of these is recorded by the playbook as open; none of them is resolved inside the playbook itself.

## Which corpus doc each reference feeds

The references map onto this corpus one to one. B-BOOTC-SEAL and Permanent CI-Evidence Patterns feed doc 07 and the doctrine in doc 02: the open Phase 2 work is the structural cause of row 8, and the evidence-patterns collection is the general form of the playbook's rules. `refs/sealed-uki-vm-test-2026-07-30.md` feeds doc 01, which defers the 6-assertion inventory to it rather than inventing the list. The refs chain (`bootc-composefs-sealed-flow-2026-07-22.md`, `kernel-rootfs-split-2026-07-29.md`, `sbsign-pkcs11-validate-2026-07-23.md`) feeds docs 04 and 05: they are the prior validation records for the signing path and the PKCS#11 lane this playbook debugged. `ci_mkosi-installer.yml` and `ci_fork_edk2.yml` feed docs 01, 04, and 07 as the canonical diff target and the OVMF artifact source respectively. The sibling playbooks feed doc 03 (row 0 applies dispatch-chain-verification) and doc 01 (fido2-vm-e2e-recipe as the parallel e2e lane). The gaps feed doc 09's closing note and doc 03's pre-dispatch-gate proposal (source doc for all of the above).
