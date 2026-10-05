# who-pays-and-why

Knowledge corpus on customer segmentation and positioning for an open-source security product: who pays and why, segment selection discipline, and the rule that segment hypotheses stay unvalidated until real customer contact. Minted from yubi-OS/yubiOS `refs/who-pays-and-why-2026-07-25.md` on 2026-10-05.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-segment-selection-discipline.md](01-segment-selection-discipline.md) | How open-source and developer-tool companies choose their first target segments; wedge versus beachhead; cost of picking wrong. |
| 02 | [02-who-pays-in-open-source.md](02-who-pays-in-open-source.md) | Who pays money in open-source ecosystems; the buyer pyramid; free rider dynamics. |
| 03 | [03-economic-buyer-versus-champion.md](03-economic-buyer-versus-champion.md) | Economic buyer vs operational champion vs user; who approves spend; solo buyer-user cases. |
| 04 | [04-jobs-to-be-done-for-security.md](04-jobs-to-be-done-for-security.md) | Jobs-to-be-done applied to security products; job statement structure; job framing vs feature lists. |
| 05 | [05-bottom-up-gtm-plg.md](05-bottom-up-gtm-plg.md) | Product-led growth and bottom-up adoption for developer and security tools; limits for hardware products. |
| 06 | [06-public-interest-security-funding.md](06-public-interest-security-funding.md) | How schools, municipalities, newsrooms, and NGOs fund security: grants, funders, procurement realities. |
| 07 | [07-hardware-root-of-trust-market.md](07-hardware-root-of-trust-market.md) | FIDO2/passkeys adoption, YubiKey positioning, TPM and HSM contrast, positioning a consumer-priced hardware root of trust. |
| 08 | [08-unvalidated-hypothesis-discipline.md](08-unvalidated-hypothesis-discipline.md) | Why segment hypotheses stay unvalidated until real customer contact; The Mom Test; customer development. |

## Research summary

- Results collected: 132 archive entries (96 from the first dig pass, 36 from 2 redo digs), deduplicated to 127 unique entries.
- Weight split: 24 entries at weight >= 0.5 (authoritative backing), 103 entries below 0.5 (weak backing, labeled as such in the docs).
- Jev requests: 50 total (1 outline score request, 48 noul weighting requests, 1 preflight probe), usage 36103 input tokens, 0 output tokens. The weighting pass ran twice because the first pass's raw per-result answer records were not persisted before a container restart; both passes are logged in `research-db/jev-log.json`, and the archived decisions come from the second pass.
- Redos: 2 digs redone (07 hardware-root-of-trust-market and 08 unvalidated-hypothesis-discipline), 1 redo each, because their first-pass digs returned no source at weight >= 0.5 while their outline scores were marginal. Both redos came back strong and the docs were authored.
- Skipped docs: none.
- The docs cite sources with their jev weight inline; claims with weight >= 0.5 are marked authoritative backing, below 0.5 weak backing.

## Preflight

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

Session probe: searXNG returned 83 results on the preflight probe query; /api/decide (clef) answered the noul probe at 200. Details in `research-db/preflight.json`.

## Layout

- `NN-<slug>.md`: authored docs, numbered in outline order.
- `research-db/preflight.json`: endpoint health probe record.
- `research-db/outline.json`: topic decomposition and jev outline validation answers.
- `research-db/archive.json`: every collected result with its jev noul decision record.
- `research-db/digs/`: per-doc dig records (queries, redos, kept results, outcome).
- `research-db/jev-log.json`: one entry per jev HTTP request with usage tokens.
- `research-db/db.ts`: TypeScript interfaces for all stored shapes.
