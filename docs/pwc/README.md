# yubiOS PWC Knowledge Corpus (docs/pwc)

Knowledge corpus minted from the yubiOS PWC doctrine document. Ground source of record: [yubi-OS/yubiOS docs/PWC.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/PWC.md) (9182 B fetched 2026-10-07, commit d719e0ba). The corpus explicates and deepens the doc; it does not replace it.

## Docs

| NN | doc | scope |
| --- | --- | --- |
| 01 | [01-program-and-control.md](01-program-and-control.md) | The inherited PAC model: a program plus a separate control plane that watches and intervenes (init supervisors, IAM, host agents, policy engines, PR review); the three structural costs (the controller is itself a program and a privileged target, the controller only sees its own vantage, and the controller converts a property into a procedure). |
| 02 | [02-control-by-construction.md](02-control-by-construction.md) | The strongest PWC mechanism: the unsafe state does not exist to be reached (immutability, capability narrowing, no mutable alias); control by construction has no runtime dependency on any process behaving. |
| 03 | [03-verification-at-use.md](03-verification-at-use.md) | The check and the use are the same act: dm-verity in the read path, verified boot chains, TOCTOU elimination; a poisoned byte fails to read rather than being quarantined after the fact. |
| 04 | [04-control-by-record.md](04-control-by-record.md) | Append-only evidence as the controller-free alarm: audit ledgers, attestation, transparency logs; falsifiability without a gatekeeper, and its limits versus prevention. |
| 05 | [05-pwc-in-yubios.md](05-pwc-in-yubios.md) | Mapping the doctrine to the yubiOS implementation: dm-verity on /usr, composefs signed catalog, atomic A/B updates, LUKS2-FIDO2 hmac-secret binding vs TPM-PCR as PAC, the Rego build gate as admission filter. Internal-record: grounded in the source doc and the repo docs it cites. |
| 06 | [06-where-pac-stays.md](06-where-pac-stays.md) | The boundary: PWC dissolves the controller only where the controller would be a program. Physical presence, irreversible operations, recovery paths stay PAC with the owner as controller, on purpose. Internal-record. |
| 07 | [07-evidence-and-pinned-assumptions.md](07-evidence-and-pinned-assumptions.md) | The mandatory second half of PWC: evidence as the alarm that replaces the watcher, pinned assumptions (kernel floors, signer behavior, format stability), honest scope (a PWC claim names the mechanism that replaced the watcher). Internal-record. |
| 08 | [08-related-doctrines.md](08-related-doctrines.md) | Prior art and adjacent doctrines: capability security (Dennis and Van Horn, Levy), Saltzer-Schroeder complete mediation, self-stabilizing systems, formal verification (seL4), zero trust contrast; what each shares with and misses from PWC. |

## Research summary

- Results collected and weighted: 40 (5 web-shaped subtopics x 8 kept; the second seed query per subtopic was fetched but discarded by the 8-per-subtopic collection cap, recorded per dig).
- Weight split: high (>= 0.5) 7 / low (< 0.5) 33. Strong external backing landed on: USENIX TCB minimization (0.63), ScienceDirect TCB (0.52), CWE-367 TOCTOU (0.75), and the Saltzer-Schroeder principle set (0.81 / 0.70 / 0.65 / 0.51). Most other results are weak backing and every external claim in the docs is labeled accordingly; the source doc carries the normative spine of every doc.
- Docs kept/skipped: 8 / 0. All 8 subtopics validated load-bearing by the outline score (1.55-2.00 on the 0-2 scale); none dropped.
- Digs skipped by design: 3 internal-record subtopics (05, 06, 07), no dig per the docs-mint variant speed optimization 4.
- jev requests: 6 (1 preflight probe, 1 outline score validation with 8 questions, 4 result-weighting batches of 12). Usage: input 5686 / output 702 tokens. Model: clef (typesafe/jev-1.13) via api.defapi.org, DefAPI direct per the docs-mint speed optimizations; worker relay fallback not needed.
- Redos: 0 (no dig fell below the thin-dig floor; all 40 results weighted, 0 unweighted).
- Recorded gaps: the capability-security dig returned only weak sources (doc 02 carries weak-backing labels on both external claims and grounds the capability claim in the source doc instead); the append-only-record dig skewed to vendor/implementation posts, all weak (doc 04 grounds the mechanism in the source doc's own contract); the PAC-model and prior-art claims in doc 08 outside the Saltzer-Schroeder line are deliberately shape-analysis only (no weighted results, so no external facts asserted).

## Research DB

`research-db/` contains preflight.json, outline.json, archive.json (40 weighted results with full decision records), jev-log.json (one entry per jev HTTP request), db.ts (schema v2 interfaces), and digs/ (one record per subtopic, 8 files).

Preflight 2026-10-07: campaign preflight healthy (orchestrator); agent-side probe skipped for speed (docs-mint variant). searxng probe returned 104 results (11 unresponsive engines, 7 suspended IP-level: brave too-many-requests, fastbot/fireball/google/privacywall/searchmysite/yep access-denied; diversity carried the dig: 40/40 results kept across 10 queries). Decisions via clef (typesafe/jev-1.13) on api.defapi.org.
