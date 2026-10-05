# 02. Sparse-cell detection: finding the gaps across corpora

Scope: the sparse-cell detector, its radius parameter, the per-cell corpus-occupancy breakdown, and the difference between true gaps and corpus-specific artifacts.

## What a sparse cell is

The curve fit maps every corpus item to a 2-D (u,v) coordinate. Sparse-cell detection overlays a 21x21 cell grid on that plane and flags cells whose L∞-ball of radius 0.05 contains no neighbor item. An item landing in such a cell is "isolated": no other item shares its coverage neighborhood, so it marks a structural gap in the corpus rather than a cluster member ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

The parent fit on 77 yubiOS skills found 6 sparse cells; the offshoot fit on 131 self-doc items found 7. These isolated items are the gap-list candidates that feed the next RSI cycle. In the parent's Stage 1, the isolated skills were docker-login-action (0.775, 0.565), internal-nonlex-tokens (0.516, 0.193), observability-and-instrumentation (0.306, 0.000), pr-launch (0.410, 0.905), shipping-and-launch (0.629, 0.766), and the-follower (0.000, 0.660) ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## The occupancy breakdown: whose gap is it

Sparse-cell detection on the differential runs on all three planes (parent, offshoot, differential) and reports a per-cell corpus-occupancy breakdown. A cell can be:

1. Sparse in yubiOS but populated by self-doc items: a corpus-specific artifact, not a true gap. The skill side has nothing there, but the self-doc side does, so the region of coverage space is not empty.
2. Sparse in self-doc but populated by yubiOS: the mirror case.
3. Sparse in both: a true architectural gap. No item of either corpus occupies that coverage neighborhood.

The source doc lists "single-corpus sparse-cell detection on the union" as an anti-pattern: the union's sparse count is the baseline, but only per-corpus detection can tell which corpus is actually contributing a gap ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## The 0/208 headline

On the differential plane the sparse-cell count is 0 out of 208. The L∞ radius 0.05 always has at least one neighbor once both corpora share the plane. The interpretation given in the source doc is that the union is denser than either parent: placing the two corpora in the same coordinate system fills in each corpus's gaps with the other's population. Concretely, the union coverage is dense enough that no item is isolated ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

This has an important consequence for audit discipline: the 6/77 and 7/131 gap lists remain valid per-corpus RSI targets, but the differential's 0 sparse cells is the gap-free baseline that future RSI cycles should be measured against. If a later per-corpus RSI cycle pushes an item into a region where the other corpus has no population, the differential will develop sparse cells again, and that drift is detectable.

## External grounding for the detector family

Sparse-cell detection is a bin-grid instance of density-based outlier detection: isolation is defined by neighbor absence in a fixed radius, the same principle that underlies density-based outlier methods. A survey of outlier detection methodologies organizes the field by exactly this principle (distance- and density-based isolation of points that lack neighbors) [w=0.88, https://eprints.whiterose.ac.uk/id/eprint/767/1/hodgevj4.pdf]. A 2025 review of advances in density-based outlier detection algorithms confirms that local-neighborhood absence remains the standard signal for structural outliers in embedded data [w=0.66, https://www.sciencedirect.com/science/article/pii/S1877050925015388]. Weak backing (aggregator-grade, weight 0.11): a coverage-matrix gap-analysis writeup frames the same audit idea in test-engineering terms, a coverage matrix mapping assets to requirements with explicit gap cells [w=0.11, https://github.com/carrollj8471-ux/enterprise-detection-engineering-program/blob/main/engineering/05-coverage-matrix-and-gap-analysis.md]. That weak source supports the framing only, not any technical claim.

## Discipline notes

Two rules from the source doc govern the detector's use: never re-fit the curve mid-run, because that invalidates the sparse-cell snapshot; and always report the per-cell occupancy breakdown, because a bare count hides which corpus owns each gap ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).
