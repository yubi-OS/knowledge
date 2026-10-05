# 04 Shift-factor measurement

Scope: the measurement method: segmenting response history into per-policy-version windows, building response curves per window, and computing per-version shift factors by superposition fitting along log time.

## Step 1: segmentation by policy window

The first operation is segmenting the response history into windows, one per policy version. Time-series segmentation aims to identify segment boundary points and to determine the dynamical properties corresponding to each segment, and one established route is a Bayesian change-point model (weight 0.91, https://pmc.ncbi.nlm.nih.gov/articles/PMC6312324/). Segmentation in general identifies potential change-points so the original sequence is partitioned into homogeneous subsequences, which is exactly what non-stationary series need before per-segment models are fit (weight 0.82, https://arxiv.org/html/2404.07451v1).

For the corpus study the segmentation is not statistical but administrative: the boundary of each window is the timestamp where a policy version became active, taken from the audit event log. The statistical machinery is still useful, because when the audit log is incomplete the change-point methods can recover approximate boundaries from the data itself: the classical approaches look for change points such as a large jump in the average value of the signal (weight 0.51, https://en.wikipedia.org/wiki/Time-series_segmentation). A validator addition like the v4 to v5 change should appear as a jump in the resend.send outcome distribution, and a detected jump is evidence about where the boundary lies even without a stamped timestamp.

## Step 2: response curves per window

Within each window the study builds the response curves: approve latency distribution, gate verdict distribution, retry behavior, audit cadence. Tooling exists for the estimation step. One published method determines optimum shift factors in time-temperature superposition of accelerated-aging data by an unsupervised procedure that minimizes the vertical arclength to obtain the master curve (weight 0.90, https://www.osti.gov/servlets/purl/1817993). The standard calculator form of the same idea shifts isothermal modulus curves and estimates log(aT) shift factors to produce a viscoelastic master curve (weak backing, weight 0.44, https://metricgate.com/docs/time-temperature-superposition/).

The arclength-minimizing formulation is the closest published analog to what the study needs: it takes curves collected under different conditions, finds the translation that best merges them, and treats the residual misfit as the signal that superposition is imperfect. Translated to the gate, the "conditions" are policy versions, the "curves" are the four response curves, and the translation is along wall-clock (or log-wall-clock) time.

## Step 3: fitting a_T(v)

The shift factor per version is then the fitted translation. The procedure mirrors published practice: segment (weight 0.91, https://pmc.ncbi.nlm.nih.gov/articles/PMC6312324/), build curves per segment, and estimate the horizontal shift that minimizes misfit between each version's curves and the v_ref curves (weight 0.90, https://www.osti.gov/servlets/purl/1817993). A single software library bundles more than 30 segmentation algorithms covering change point detection and state detection under one API (weak backing, weight 0.43, https://fchavelli.github.io/tsseg/), so the mechanical parts of step 1 and step 3 are commodity tooling.

## What the data gate looks like

The method is executable only after the data exists. Today the corpus-runs history spans a single policy window, and a single-window series cannot test superposition across versions because there is nothing to superpose against. The measurement plan therefore has a data precondition, stated in the instrumentation doc: policy_version stamped on every run row, plus a policy changelog with version timestamps. After about 2 policy versions of accumulation, steps 1 to 3 run as written, and after more versions the a_T(v) series itself becomes a curve that can be compared against a WLF-like law, should one emerge.
