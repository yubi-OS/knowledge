# Supersolid program next steps [SOLO]

Knowledge corpus minted in the 22-corpus `refs/` mint wave (Lane 2).

- **Corpus slug:** `supersolid-program-next-steps-solo`
- **Ground-source document:** `yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md`
- **Local source copy:** `session/refs_wave22/sources/supersolid-program-next-steps-solo.md`

## Documents

| NN | File | One-line scope | Clef outline score |
|---|---|---|---|
| 01 | [01-problem-statement.md](01-problem-statement.md) | Problem Statement: externally dug (searXNG + clef) | 1.7719 |
| 02 | [02-inventory-what-exists-vs-where-it-lives.md](02-inventory-what-exists-vs-where-it-lives.md) | Inventory (what exists vs where it lives): externally dug (searXNG + clef) | 1.6759 |
| 03 | [03-recommended-direction.md](03-recommended-direction.md) | Recommended Direction: internal-record explication of the ground source | 1.6839 |
| 04 | [04-key-assumptions-to-validate.md](04-key-assumptions-to-validate.md) | Key Assumptions to Validate: internal-record explication of the ground source | 1.6627 |
| 05 | [05-mvp-scope.md](05-mvp-scope.md) | MVP Scope: internal-record explication of the ground source | 1.7088 |
| 06 | [06-not-doing-and-why.md](06-not-doing-and-why.md) | Not Doing (and Why): internal-record explication of the ground source | 1.5396 |

Outline scores come from `research-db/outline.json` (`validation.answers.t01..t06.score`), the clef `score` metric over 3 levels lowest-first (padding / marginal / load-bearing). No subtopic was dropped.

## Research summary

- **20 results collected** (2 searXNG seed queries for docs 01 and 02, 10 kept results each).
- **Quality weighting (clef noul):** high >= 0.5: **0**; low < 0.5: **20** (from `meta.stats`).
- **5 jev requests** to `/api/decide`, **0 redos**, **0 skips**.
- Docs 01 and 02 cite dig results inline with their exact clef weight; sources below 0.5 are labelled weak backing. Docs 03 to 06 are internal-record subtopics explicated directly from the ground source with no external web dig.

## Dig highlights (top 3 by clef weight)

- **Doc 01:** [Random sequential adsorption: An efficient tool for investigating the ...](https://www.sciencedirect.com/science/article/pii/S000186862200094X) (0.2926, weak); [Jamming states in random sequential adsorption of diffusion-limited ...](https://arxiv.org/html/2608.23905v1) (0.2187, weak); [Random Sequential Adsorption: Jamming & Rényi Parking](https://www.iris.joshua-becker.com/lab/random-sequential-adsorption-rsa/) (0.2154, weak)
- **Doc 02:** [Usage-and Risk-Aware Falsification Testing for Cyber-Physical ...](https://link.springer.com/chapter/10.1007/978-3-031-42626-1_9) (0.3171, weak); [The Falsifiability Crisis in Contemporary Physics...: QNFO Papers](https://papers.qnfo.org/papers/falsifiability-crisis) (0.2616, weak); [Reproducibility of Scientific Results](https://plato.stanford.edu/entries/scientific-reproducibility) (0.2137, weak)

## How to read this corpus

1. Start with docs 01 and 02: they frame the subtopic and pair every ground-source claim with the external dig, citing each result inline with its exact clef weight. Anything below 0.5 is explicitly labelled weak backing and is used for context only, never as authority.
2. Docs 03 to 06 explicate the ground source section by section (equations, parameters, gates, and empirical records), with no external web dig. Treat `yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md` as the authority for every number in them.
3. Each 01/02 doc ends with a `Sources Considered` table listing all 10 dig results and their weights, so the evidence base is auditable without re-running the dig.
4. Writing conventions: numbers as digits, no em dashes, headings for wayfinding, and honest gaps stated rather than padded.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
