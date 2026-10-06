# Printable checklist design

## Scope

One-page printable checklist artifact design: name/date/host/arch header, one checkbox per line grouped in numbered sections, and a final decision block with PASS/FAIL and signoff.

## The one-page constraint

The yubiOS trust-proof checklist compresses the 14-section playbook onto a single printable page. The compression rule: one checkbox per line, no prose, sections numbered to match the playbook's axes. The page opens with a header row recording Name, Date, Host, and Architecture (x86-64 or arm64), and closes with a final decision block of 4 checkboxes (image source verified, signed boot chain verified, enrolled secrets confirmed, recovery proven), a Trust decision PASS/FAIL field, and a signoff line (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

The final decision block is deliberately smaller than the 10 sections above it. The 4 boxes restate the minimum pass condition from the playbook, so the operator cannot reach a PASS without the four independent verifications: source, boot chain, secrets, recovery.

## Section structure

The 10 numbered sections on the page map 1:1 to the playbook axes:

1. Build provenance: 5 boxes, including fill-in blanks for the exact image digest and source ref/commit, plus attestation verified, SBOM verified, digest matches approved release.
2. Artifact pinning: 3 boxes (PINNED.md reviewed, approved digest matches running image, booted system matches pinned artifact).
3. Boot integrity: 4 boxes (Secure Boot enabled, signed UKI verified, modified boot artifact refused, boot chain fails closed on tamper).
4. Storage integrity: 3 boxes (root filesystem immutable or measured, root state matches expected booted image, no silent rewrite of trusted root).
5. Key ownership: 4 boxes, including a fill-in blank for the YubiKey serial.
6. Enrollment audit: 6 boxes (log reviewed, then one per enrolled function: PIV signing, FIDO2 unlock, SSH, PAM, plus explicit-in-logs).
7. Recovery path: 3 boxes (documented, tested on disposable install, works without vendor intervention).
8. Rollback safety: 4 boxes (upgrade tested, rollback tested, trust state unchanged or explicitly updated, no silent drift after rollback).
9. Platform clarity: 3 boxes (platform-specific trust story reviewed, ARM64/x86-64 differences documented, firmware assumptions understood).
10. Failure behavior: 4 boxes, one per tamper test (wrong image, missing key, modified UKI, corrupted boot artifact), each "failed closed".

(source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source, all 39 checkbox lines)

## Design properties that matter

- Fill-in blanks force evidence capture at the point of execution. The digest is written on the page, not recalled later; that line becomes the record an auditor can compare against the pin.
- Serial numbers and digests on paper tie the worksheet to the physical artifact and the exact image, which is what makes two worksheets from different hosts comparable.
- The signoff line converts the sheet from notes into an attestation: a named person asserts the boxes on a date.

Checklist-as-artifact tooling supports the same shape generically: checklist artifacts where users "work through" items to ensure required aspects of a task have been addressed (source: https://sparxsystems.com/enterprise_architect_user_guide/17.1/modeling_languages/checklart.html, weight 0.635, authoritative backing). Generic audit checklists are likewise structured documents that guide reviewers through all necessary steps with section-based layouts (source: https://www.template.net/checklists/audit, weight 0.090, weak backing).

## Print and filing

The yubiOS note's first recommended next step is generating a printable PDF of the one-page checklist for an A4 printout the operator signs and files, with two copies: one filed with the operator's record, one filed with the evidence bundle (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). Paper is not nostalgia here: a signed paper worksheet is a tamper-evident, vendor-independent record that pairs with the digital evidence package covered in the evidence-packaging-signoff doc.
