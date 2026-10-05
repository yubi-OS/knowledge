# 04: Float64 boundary hazards in radius computation

Scope: why the radius diagnostic computes distances with Math.hypot, why adjacent Float64 breakpoints and midpoint rounding make threshold evaluation hazardous, and why cells use their right endpoint and report explicit brackets.

## The distance function is part of the contract

The diagnostic computes clearances with the same Math.hypot chord function the production core uses. Sharing the function is a correctness requirement, not a convenience: if the diagnostic used a different distance implementation, its counts could disagree with the core at exactly the boundary cases the diagnostic exists to examine.

Math.hypot is specified as computing sqrt(x^2 + y^2) without undue overflow or underflow at intermediate stages (source: https://en.cppreference.com/cpp/numeric/math/hypot , jev weight 0.69). The hazard it exists to avoid is real: the Boost.Math documentation notes that with naive implementation the intermediate terms can overflow or underflow even though the final result is perfectly representable (source: https://www.boost.org/latest/libs/math/doc/html/math_toolkit/powers/hypot.html , jev weight 0.85). Oracle's numerics guide documents the same overflow/underflow distinction between naive squaring and careful implementations (source: https://docs.oracle.com/cd/E19957-01/806-3568/ncg_math.html , jev weight 0.69). Python's math.hypot is documented as returning the Euclidean norm (source: https://www.w3schools.com/python/ref_math_hypot.asp , jev weight 0.70), and the same design intent carries across language runtimes.

## Spacing between representable doubles

The threshold 0.095 is evaluated against Float64 distances. IEEE 754 defines the formats and rounding rules these computations run under (source: https://standards.ieee.org/ieee/754/6210/ , jev weight 0.96). The unit in the last place, ulp, is the spacing between two consecutive floating-point numbers, the value the least significant digit of the mantissa represents (source: https://en.wikipedia.org/wiki/Unit_in_the_last_place , jev weight 0.77).

Two consequences follow for a threshold instrument:

1. Adjacent representable values near a threshold differ by one ulp or a few ulps. Two clearances that are mathematically distinct can be represented as the same double, and two clearances that differ by one ulp can land on opposite sides of a threshold when the threshold itself is not exactly representable.
2. Equality and near-equality need deliberate handling. ULP-based comparison treats floats as separated by a count of representable values, for example "equal within 4 ulps" (source: https://jtempest.github.io/float_eq-rs/book/background/float_comparison_algorithms.html , jev weight 0.70), and ULP-based comparators exploit the ordered-integer property of the IEEE 754 bit layout (source: https://github.com/yur-spiridonov/fast-float-compare , jev weight 0.51). The diagnostic avoids these fuzzy comparisons entirely by keeping the strict edge test exact on computed doubles and reporting named witnesses at boundaries, so a human can see exactly which items sit at a bracket.

## The midpoint hazard and right-endpoint cells

Given two adjacent representable doubles a and b, their mathematical midpoint (a+b)/2 is generally not representable. It rounds to one of a or b. Which one depends on the rounding mode and on the bits of the midpoint's significand. For a diagnostic that partitions the radius domain into cells, this creates a specific failure if cells are identified by midpoints: a midpoint between adjacent representable floats can round onto the excluded left boundary of the cell, putting the cell's identity in the wrong bucket.

The diagnostic therefore uses right-endpoint cells: each cell's value is the count evaluated at the cell's right endpoint, never a midpoint. This convention is deterministic, reproducible, and conservative for isolation reporting, since the count at the right endpoint never overstates the isolation inside the open interval below it. The choice of midpoint versus endpoint as a modeling convention is documented as consequential in adjacent fields (source: https://link.springer.com/article/10.1007/s11367-014-0743-0 , jev weight 0.69); here it is consequential for a sharper reason, the rounding hazard itself.

## Why brackets and witnesses instead of tolerance bands

A common response to float thresholds is an epsilon tolerance: classify with d < r + eps. The diagnostic rejects this for a diagnostic instrument, for three reasons:

1. An epsilon moves the effective threshold and is invisible in the report. The reported radius would no longer be the evaluated radius.
2. The instrument's purpose is to observe boundary behaviour, so blurring the boundary defeats the purpose. Adjacent Float64 breakpoints are exactly what the test suite exercises (doc 09).
3. Exact evaluation plus named witnesses is auditable: the report names the items whose clearances sit at each bracket, capped at 8 shown with totals preserved, so a reviewer can check the bracket claims against the corpus rather than trusting a tolerance choice.

The diagnostic's boundary handling is therefore: compute with the shared hypot chord function, evaluate strict inequalities on the computed doubles, report explicitly bracketed intervals on the fixed grid, and name witnesses at boundaries. Nothing about this is a statistical confidence interval and nothing about it is an exact-arithmetic proof; it is exact relative to the computed Float64 distances, and displacement or error bounds on the coordinates remain caller assumptions (doc 05).

## Summary

1. Clearances use the same Math.hypot chord function as the core, which is specified to avoid intermediate overflow and underflow.
2. IEEE 754 double spacing (ulp) makes adjacent breakpoints and threshold equality live cases for a radius instrument.
3. Midpoints between adjacent representable floats can round onto the excluded left boundary, which is why cells use right endpoints.
4. Brackets and named witnesses, not epsilon tolerances, carry the boundary information, keeping the instrument auditable and the threshold honest.

Project record: the motivating implementation pins the shared chord function, right-endpoint cells and adjacent-breakpoint test cases, per https://github.com/yubi-OS/yubiOS/pull/233 .
