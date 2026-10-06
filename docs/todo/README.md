# docs/todo - the yubiOS TODO ledger

Knowledge corpus minted from the yubi-OS/yubiOS ground source docs/TODO.md (fetched 2026-10-06, 29130 bytes). The corpus explicates the doc: the recorded work items, their states and preconditions, the lanes they organize, and what the ledger structure teaches about tracking work in a hardware-coupled OS project.

## Docs

- [01-ledger-evidence-header.md](01-ledger-evidence-header.md) - the dated evidence header, the latest-pointer chain, and the canonical run discipline at the top of TODO.md (internal-record, no dig).
- [02-future-coverage-map.md](02-future-coverage-map.md) - how each FUTURE.md roadmap section is tied to active TODO lanes, with promotion and quarantine rules (internal-record, no dig).
- [04-documentation-lane.md](04-documentation-lane.md) - the documentation task lane: dated refs, PINNED.md as the digest source of truth, and the composefs/dm-verity reconciliation that remains open (internal-record, no dig).
- [05-roadmap-research-lanes.md](05-roadmap-research-lanes.md) - the SecTime, Frost, Net, and promotion-gate research lanes and their open hardware preconditions (digged, mostly weak backing).
- [06-ci-lane.md](06-ci-lane.md) - the CI task lane: PQ TLS visibility, EFI zboot gating, the B-VGPU-VM-UNZIP host-deps gap, and the sealed composefs promotion condition (digged; IETF MLKEM drafts and RFC 10024 authoritative).
- [08-ledger-discipline.md](08-ledger-discipline.md) - the Watch List, retired items, the 2026-08-01 BLOCKERS.md review diff, drift checks, and what the ledger lifecycle teaches (digged; GitHub self-hosted-runner docs authoritative).

## Research summary

- Results collected: 72 (36 attempt 1 + 36 attempt 2 redos), weighted 72: high 5 / low 67.
- Jev requests: 7 (1 outline score + 6 noul weighting), usage 10255 input / 1588 output tokens, via DefAPI direct (https://api.defapi.org/api/v1/decisions), no fallback needed.
- Outline validation: 8 subtopics scored, 6 kept, 2 dropped (03 adr-governance 0.47, 07 hardware-supply-chain 0.33, both padding-argmax on the continuous 0-2 scale).
- Redos: 3 (05, 06, 08 each redug once with different queries after a 0-of-12 first attempt).
- Skipped docs: none; 3 subtopics (01, 02, 04) are internal-record with no dig by design, recorded in research-db/digs.
- Ground-source discipline: every doc cites yubi-OS/yubiOS docs/TODO.md as its spine; dig claims carry URL + noul weight, results under 0.5 labeled weak.

Preflight 2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed.
