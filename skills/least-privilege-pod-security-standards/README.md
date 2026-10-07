# least-privilege-pod-security-standards

Knowledge corpus explicating the yubiOS skill `least-privilege-pod-security-standards` (ground source: `yubi-OS/yubiOS skills/least-privilege-pod-security-standards/SKILL.md`, 3998 bytes). Topic: Pod Security Standards restricted baseline plus OPA Rego policies for least-privilege enforcement on yubiOS, with PSS admission logs and OPA decision logs as audit artifacts. The skill is the corpus-additive anchor for the least-privilege primitive (P2) in the 10-primitive spine, added in cycle-9.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-pss-restricted-profile.md](01-pss-restricted-profile.md) | The three PSS levels, the restricted profile controls, Pod Security Admission namespace labels, and the enforce/audit/warn modes |
| 02 | [02-opa-rego-least-privilege.md](02-opa-rego-least-privilege.md) | OPA Gatekeeper as the recommended admission-control path, the `kubernetes.admission` deny-rule structure, and the yubiOS.rego embodiment of the Rego leg |
| 03 | [03-lp-keyword-mapping.md](03-lp-keyword-mapping.md) | The canonical LP keyword set: 8 keywords times 2 frameworks equals 16 binding cells, grounded in the NIST least-privilege definition and the Kubernetes security context |
| 04 | [04-audit-artifacts.md](04-audit-artifacts.md) | PSS admission logs and OPA decision logs as the P6 evidence surfaces, plus Gatekeeper batch audit |
| 05 | [05-primitive-placement.md](05-primitive-placement.md) | Placement on the 10-primitive spine (P2 primary, P3, P6), the internal-big-picture bridge, and downstream consumers. Internal-record subtopic, no dig |
| 06 | [06-complementary-hardening.md](06-complementary-hardening.md) | systemd-hardening as the host-level complement to pod-level least privilege, and the layered-defense picture |

## Research summary

- Ground source fetched: `https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/least-privilege-pod-security-standards/SKILL.md` (3998 bytes, 2026-10-06).
- Outline: 9 subtopics proposed, jev score-validated in 1 request; 3 dropped (t06 ci-admission-gate 0.45, t07 corpus-context 0.12, t09 usage-and-boundaries 0.29), 6 kept and authored.
- Results collected: 78 (60 from the 10 first-attempt queries, 12 from the subtopic-06 redo dig, 6 from the subtopic-03 redo dig).
- Weight split: 17 at weight >= 0.5 (primary/official), 61 below 0.5. 0 unweighted.
- jev requests: 8 (1 outline score validation, 5 weighting batches of 12, 2 redo weightings), all against DefAPI direct (`https://api.defapi.org/api/v1/decisions`, model `typesafe/jev-1.13`). Usage: 10710 input tokens, 1571 output tokens.
- Redos: 2 digs redone, 1 per affected subtopic (03: NIST SP 800-53-focused query, which returned the SP 800-53 Rev. 5 page at weight 0.94; 06: official-source-focused systemd and defense-in-depth queries, which returned systemd.io at 0.61 and github.com/systemd at 0.55).
- Docs kept/skipped: 6 kept / 0 skipped for thin digs (the 3 dropped subtopics were dropped at outline validation, before digging; their internal-record material is carried by the source-doc citations in docs 01, 02, 03, and 05).
- Gaps: none.

## Research-db

`research-db/` (schema v2): `preflight.json`, `outline.json`, `archive.json` (78 entries, every one weighted), `digs/01-pss-restricted-profile.json`, `digs/02-opa-rego-least-privilege.json`, `digs/03-lp-keyword-mapping.json`, `digs/04-audit-artifacts.json`, `digs/06-complementary-hardening.json`, `jev-log.json` (8 requests), `db.ts`.

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side; agent digs returned 41 to 55 raw results per query); DefAPI `/api/v1/decisions` 200 on all 8 agent calls.
