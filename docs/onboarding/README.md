# yubiOS Contributor Onboarding (docs/onboarding)

Knowledge corpus minted 2026-10-06 from the yubiOS onboarding ground source: yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md, 4957 bytes, last reviewed 2026-07-11). The corpus explicates the doc: the onboarding path, what a new contributor needs to know, the environment and tooling setup, and the first-tasks structure. The doc's own sections dictated the outline. The source doc is the primary source of record; this corpus deepens it and does not replace it.

## The docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-read-first-path.md | The ordered 5-step reading path (README, SPEC, PINNED, ADR, dated planning-cycle note) and why the order moves from stable to volatile. |
| 02 | 02-local-requirements.md | Local toolchain expectations: Docker Buildx, recent systemd, YubiKey 5 series, and the TEST-only CI carve-out for SoftHSM and swu2f. |
| 03 | 03-bootc-install-model.md | The bootc to-filesystem install experiment model: mount-first workflow, the podman command shape, flag-by-flag explication, and the destructive-disk safety rule. |
| 04 | 04-yubikey-setup-checklist.md | The 6-step YubiKey checklist: FIDO/CCID enablement, FIDO2 PIN, LUKS2 and homed enrollment, backup key, offline recovery key, PIV 9c separation. |
| 05 | 05-development-rules.md | Standing rules: ARM64-first hardware-root planning, x86-64 asymmetry, PINNED.md pin hygiene, RestrictFileSystems distinction, dated refs/ notes. |
| 06 | 06-recovery-expectations.md | The recovery-before-production-ready doctrine across 5 lockout surfaces: disk unlock, homed, Secure Boot enrollment, U-Boot console protection, first-boot gates. |
| 07 | 07-information-routing.md | The 8-destination routing table for new information (PINNED, ADR, SPEC, FUTURE, MITIGATE, refs/, BLOCKERS, TODO) and the content classes it separates. |
| 08 | 08-coverage-layers.md | The doc's attestation, trust-chain, least-privilege, and continuous-monitoring coverage declarations plus the 2026-09-18 drift checks. |

## Research summary

- Results collected: 69 search results (12 searXNG queries over 6 web-shaped subtopics, 2 queries each, top 6 kept per query; 2 internal-record subtopics skipped digs by design and cite the source doc only).
- Weight split: 9 high (>= 0.5) / 60 low (< 0.5). Claims backed at >= 0.5 are treated as authoritative; every weaker claim is labeled "weak backing" in the doc text.
- Jev requests: 7 (1 score validation over 8 subtopics + 6 noul batches), usage 9041 input / 1528 output tokens. Weighting ran against https://api.defapi.org/api/v1/decisions directly (typesafe/jev-1.13) per the 2026-10-06 speed optimization; zero retries needed.
- Redo counts: 0 dig redos, 0 weight redos (one extraction-time fix: the noul probability field is named "noul" in the answer object; raw answers were re-parsed, not re-requested).
- Skipped docs: none.

## Notable dig observations

- The ykman interface-config documentation carried the strongest weights of the mint (0.69, 0.65, 0.59), matching how concrete the checklist step is.
- The recovery-expectations dig returned 1 spam result (weight 0.01), retained in archive.json as collected-and-weighted evidence; it backs no claim.
- bootupd measurement (named in the attestation coverage section) has no dig corroboration in this mint; it is recorded as a source-doc claim.

## Gaps / skips

None skipped. The 2 internal-record subtopics (01, 07) carry no dig by design and cite the source doc as their grounding spine.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-side); /api/decide campaign preflight healthy (orchestrator-side), agent-side probe skipped for speed; agent-side weighting endpoint api.defapi.org/api/v1/decisions returned 200 on all 6 batches.
