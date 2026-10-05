# 01: Radius clearance statistics and the strict edge test

Scope: how nearest-neighbour clearances act as a per-item classification statistic, why the strict edge test d<r matters for tie isolation, and how the indicator count I(r) is defined.

## Clearances as a classification statistic

An isolation instrument built on point data needs one number per item: its distance to the nearest other item. Call this the clearance c_i. The classification question is then a threshold question: is item i isolated at radius r? The nearest-neighbour method is the standard machinery for this, and the reference implementations document exactly this shape: scikit-learn's neighbors module frames nearest-neighbour methods as classification for discrete labels and regression for continuous labels, with the distance computation underneath doing the real work (source: https://scikit-learn.org/stable/modules/neighbors.html , jev weight 0.95). MATLAB's documentation shows the same structure with explicit support for custom distance metrics, which matters here because the wayfinder's chord function is a specific choice, not the default (source: https://www.mathworks.com/help/stats/classification-using-nearest-neighbors.html , jev weight 0.86).

The generality of the distance function is a real design axis, not an implementation detail. Research on k-nearest-neighbour queries in the plane treats general distance functions explicitly, which is the formal version of "the threshold semantics must be stated against the distance function actually used" (source: https://arxiv.org/abs/1805.02066v1 , jev weight 0.80). Applied work in 3D geological modelling makes the same point from the other side: boundary mapping quality depends on the classification rule and the distance geometry agreeing (source: https://www.sciencedirect.com/science/article/pii/S0013795226002401 , jev weight 0.79). Boundary-region error is also where point-cloud segmentation literature locates most misclassification, which is the practical warning behind keeping the boundary test exact (source: https://www.mdpi.com/2076-3417/13/6/4053 , jev weight 0.61).

## The strict edge test d<r

The operative test is strict: item i is isolated at radius r when the minimum distance d to any other item satisfies d<r, not d<=r. This is not pedantry. The distinction between strict and non-strict inequality is precisely the distinction between including and excluding the boundary value in the solution set, and a strict inequality is conventionally drawn with an open boundary (source: https://www.mathwords.com/s/strict_inequality.htm , jev weight 0.54).

For an isolation radius the consequences are concrete:

1. A tie exactly at the radius means the item is NOT isolated. Two items whose clearance equals r remain connected to each other, so both stay classified as non-isolated. The rule "ties remain isolated" in the indicator definition below is the tie-breaking direction of this same fact: when c_i equals r exactly, the count treats the item as still isolated only because the indicator uses r<=c_i, which is the complement of the strict edge test d<r.
2. Any statistic derived from the counts inherits this convention. A count computed with a non-strict test would silently differ at exact-equality points, and exact equality at a threshold is exactly the case a Float64 boundary analysis must anticipate (see doc 04).

## The indicator count I(r)

For a fixed radius r the diagnostic defines:

I(r) = sum over items of the indicator of (r <= c_i).

That is, I(r) counts the items whose clearance is at least r, which is exactly the number of items isolated under the strict edge test d<r evaluated for each item against its nearest neighbour. It is a step function of r: constant on intervals, jumping down at each distinct clearance value. Ties between equal clearances are handled by the convention above and do not create ambiguity in the count, because the indicator is evaluated per item against its own clearance.

The nearest-neighbour framing also fixes what "nearest" costs. kNN-style queries with general distance functions are the subject of dedicated algorithmic work (source: https://arxiv.org/abs/1805.02066v1 , jev weight 0.80), and the accessible summaries of kNN describe classification as "identify the closest points, then decide" (source: https://www.geeksforgeeks.org/machine-learning/k-nearest-neighbours/ , jev weight 0.78). The radius diagnostic uses only the k=1 case: the minimum over neighbours, not a vote among several.

## What this statistic does and does not claim

I(r) is a count of a deterministic function of the stored coordinates under the stored distance function. It is not a probability, not a confidence measure, and not a physical field. The diagnostic-only framing (doc 05) exists because the number is useful for observing an instrument without letting the number drive behaviour. The count is exact relative to the computed Float64 distances; whether those distances are themselves correct to some tolerance is a separate question that belongs to displacement and error bounds (again doc 05).

## Summary

1. The per-item statistic is the nearest-neighbour clearance c_i computed with the same chord function as the production core.
2. The classification rule is the strict edge test d<r; equality at the radius is excluded, so ties at exactly r stay non-isolated.
3. I(r) is the indicator count of items with r<=c_i, a step function of r, tie-safe by construction.
4. Boundary semantics matter more than usual here because thresholds are evaluated in Float64 where exact equality and near-equality are live cases.

Project record: the motivating implementation is the yubiOS wayfinder radius diagnostics, merged in https://github.com/yubi-OS/yubiOS/pull/233 .
