# Equations B and C: exact local isolation-change identities

Scope: the exact graph identities for how the isolated-point count changes under an ADD and under a CHANGE point-map operation, the neutral-ADD explanation they produce, and their retrospective verification status.

## The graph being edited

The wayfinder map uses an undirected radius graph over embedded points: `A_ij = 1[i != j and ||p_i - p_j||_2 < r]` with radius `r = 0.095`, degree `d_i = sum_j A_ij`, and isolation count `I = sum_i 1[d_i = 0]`. Degrees are row sums of the adjacency matrix, so every isolation statement here is a statement about neighborhoods (adjacency matrix reference, https://en.wikipedia.org/wiki/Adjacency_matrix, weight 0.69; neighborhood of a vertex, https://jhu-dsa.github.io/notes/27-graph-search/step01.html, weight 0.69; basic graph theory notes on vertices and degrees, https://faculty.etsu.edu/gardnerr/5347/Notes/Pearls-GT-1-1.pdf, weight 0.59). Graph-toolkit APIs expose exactly these neighborhood quantities (igraph neighborhood analysis, https://igraph.org/python/tutorial/0.9.8/analysis.html, weight 0.56; igraph ego/neighborhood reference, https://r.igraph.org/reference/ego.html, weight 0.55).

## Equation B: exact ADD identity

Add one point `q` with incident indicators `e_i = 1[||p_i - q||_2 < r]`, holding all old points and edges fixed. Then:

`Delta I = 1[sum_i e_i = 0] - sum_i 1[d_i = 0] e_i`

The first term counts whether the new point itself is isolated (degree 0). The second counts how many old isolated points it connected to. This is a complete local account: no global recomputation is needed, and no hidden coupling exists because the graph definition is purely radial.

This identity explains the three neutral ADDs in the recorded PR 230 trail: each of those new points had degree 2 and connected zero old isolated points, giving exactly zero isolation change. A new document can be fully represented and leave the isolated count unchanged (internal research record, maps 51 through 61).

When to use it directly: show a proposed text's actual post-embedding location and the old isolated points it would touch before committing that text. Predictions should name intended neighbors rather than only an abstract bit pattern. If the candidate touches already-connected points, return a neutral geometric result while preserving its separate task check.

## Equation C: exact CHANGE identity

For one moved vertex `i` with old and new incident indicators `a_j, a'_j`, every other vertex satisfies `d'_j = d_j - a_j + a'_j` for `j != i`, and `d'_i = sum_{j != i} a'_j`. Therefore:

`Delta I = 1[d'_i = 0] - 1[d_i = 0] + sum_{j != i} (1[d_j - a_j + a'_j = 0] - 1[d_j = 0])`

Only the moved point and the union of its old and new neighbors can change isolation status. This is a local, inspectable witness for every resulting count change. Its precondition is that no other point's incident relationships change. Mismatched frames or multiple moving points must reject the one-vertex certificate or use a correctly composed multi-vertex ledger.

## Verification status

Exhaustive ADD and CHANGE checks on small simple graphs covered 38,172 cases, all passing. The exact local formulas reproduced all 10 recorded PR 230 transitions, including the neutral ones, from actual stored coordinates. This is retrospective identity verification. Zero new pre-edit forecasts were tested (internal research record, validate_map_math.py and map-math-validation.json).

The distinction matters: an exact identity verified retrospectively is a bookkeeping guarantee about the graph arithmetic, not evidence that a proposed edit will improve the map in any semantic sense.

## Sources considered

| source | weight |
|---|---|
| https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/refs/wayfinder-loop-results-2026-09-09.md (internal research record) | record |
| https://en.wikipedia.org/wiki/Adjacency_matrix | 0.69 |
| https://jhu-dsa.github.io/notes/27-graph-search/step01.html | 0.69 |
| https://faculty.etsu.edu/gardnerr/5347/Notes/Pearls-GT-1-1.pdf | 0.59 |
| https://igraph.org/python/tutorial/0.9.8/analysis.html | 0.56 |
| https://r.igraph.org/reference/ego.html | 0.55 |
| https://learngraphtheory.org/articles/vertices-and-edges.html | 0.37 (weak) |
| https://www.geeksforgeeks.org/dsa/add-and-remove-vertex-in-adjacency-list-representation-of-graph/ | 0.33 (weak) |
| https://en.wikipedia.org/wiki/Neighbourhood_(graph_theory) | 0.13 (weak) |
| https://www.geeksforgeeks.org/dsa/add-and-remove-vertex-in-adjacency-matrix-representation-of-graph/ | 0.11 (weak) |
| https://albexl.substack.com/p/an-introduction-to-graphs-ii | 0.10 (weak) |
| https://www.youtube.com/watch?v=fCfPjm8u89U | 0.20 (weak) |
| https://www.vrtx.com/ | 0.06 (weak, off-topic) |
