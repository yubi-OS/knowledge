# 07. Skill land-grab detection: reading corpus occupancy on the differential plane

Scope: reading which corpus populates which (u,v) territory, the corpus-typical v-axis signature, and how one-sided occupancy cells become expansion targets rather than conflicts.

## What a land grab means here

On the differential plane, every cell of the 21x21 grid is occupied by zero, one, or both corpora. A "land grab" is the reading of that occupancy map: which corpus claims which region of the shared coverage space, and what the asymmetry means. Unlike market or territory analysis, the corpora do not compete; a one-sided cell is an opportunity for the other corpus, not a conflict. The term fits because the geometry still shows claims: the yubiOS corpus claims 31 cells, the self-doc corpus claims 56, and the union has 360 empty cells ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

The occupancy counts from the 2026-08-04 run: 25 cells yubiOS-only, 50 cells self-doc-only, 6 jointly occupied, 360 empty. The self-doc corpus occupies nearly twice the territory of the skills corpus on the shared plane, despite having similar item counts proportionally weighted by spread ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## The corpus-typical signature

The differential exposes a clean structural signature along the v axis: self-doc items cluster in the upper half of (u,v) with v greater than 0.9, while yubiOS skills cluster in the lower half with v less than 0.6. The source doc's interpretation: the yubiOS skills' kept primitives are about technical depth (trust chains, least privilege, immutability), and the self-doc items' kept primitives are about audit-trail discipline (purpose, source, evidence, cadence), so the two corpora sit at different ends of the v axis ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

Concrete landmarks from the union-space projection: the highest-v yubiOS skills (curve-guided-rsi-self, dm-verity-and-integrity, docker-metadata-action, internal-big-picture) sit at (-2.121, 0.569), still below the self-doc cluster floor. The highest-v self-doc items (self_changelog v0.15 "playbooks/ seeded" at (1.890, 1.452), rules::Constraints at the same point) sit far above. The bands barely touch, which is exactly why only 6 cells are jointly occupied ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## Cross-corpus comparison methods

The differential is one instance of a general family: comparing two document collections in a shared low-dimensional space. Topic-modeling research does this by fitting topics over combined corpora and comparing collection-level topic distributions; a systematic review of topic models for short texts documents the standard combined-corpus fit as the baseline design for cross-collection comparison [w=0.92, https://link.springer.com/article/10.1007/s10462-023-10471-x]. Bidirectional topic matching quantifies thematic overlap between two corpora from each direction, finding that symmetric overlap measures surface asymmetric relationships that one-directional measures miss, which matches the differential's two-lane (yubiOS-only versus self-doc-only) reading [w=0.82, https://arxiv.org/html/2412.18376v1]. Probabilistic topic modeling for comparative analysis of document collections formalizes the shared-space comparison with per-collection distribution signatures [w=0.68, https://www.researchgate.net/publication/339692765_Probabilistic_Topic_Modeling_for_Comparative_Analysis_of_Document_Collections]. Transformer-embedding studies confirm that the choice of representation determines how sharply collections separate in a shared plane [w=0.86, https://hal.science/hal-05585771v1/document]. The differential's binary-primitive basis makes that separation extreme by construction, since each corpus zeros the other's columns.

Weak backing (marketing-grade, weights 0.07 to 0.17): the business literature on white-space analysis uses the same occupancy metaphor for market territories, which motivates the vocabulary but supports no technical claim here [w=0.17, https://hginsights.com/solutions-use-case/whitespace-analysis/, weak].

## Using the map: three readings

The land-grab map supports three operational readings ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary):

1. Territory audit: which corpus is denser where. The 50 self-doc-only cells versus 25 yubiOS-only cells show the audit-trail corpus spreads over more of the plane, meaning its items have more heterogeneous coverage patterns than the skills'.
2. Expansion targeting: the 25 yubiOS-only cells are the worklist for spawning self-doc coverage (an audit-trail item per occupied skill region), and the 50 self-doc-only cells are the worklist in the other direction. Each one-sided cell is a named, coordinate-addressable opportunity.
3. Drift watch: if a later run's occupancy map shifts, the corpus signature moved. Because the coordinates persist in the curve cache, the map is re-computable without re-fitting, so drift between runs is a diff of two maps, not a new analysis.

## Limits of the reading

Occupancy on the shared plane is not quality: a densely claimed territory can be low-value, and the 360 empty cells are mostly off-diagonal regions neither corpus needs. The map says where corpora live relative to each other, not whether what lives there is good. That judgment stays with per-item review and the RSI task-check gates ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).
