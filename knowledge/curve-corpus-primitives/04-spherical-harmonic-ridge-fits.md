# Spherical-harmonic ridge fits

Scope: fitting a degree-3 real spherical-harmonic basis with ridge regularization to the corpus point cloud on S², and the ablation evidence that keeps the sphere basis honest.

## The fit

The lifted corpus is a point cloud on the unit sphere. The audit curve is a scalar function over that surface, fitted as a linear combination of real spherical harmonics up to degree 3, with ridge regularization penalizing coefficient magnitude. Degree 3 bounds the parameter count so the fit can be compared fairly against a flat 2-D Fourier surface of matched capacity (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

Real spherical harmonics are a standard basis for functions on the sphere. The SHTOOLS library uses 4π-normalized spherical harmonic functions excluding the Condon-Shortley phase factor by default, with Schmidt semi-normalized, orthonormalized, and unnormalized variants selectable per routine (https://shtools.github.io/SHTOOLS/real-spherical-harmonics.html, jev high 0.9348). The choice of normalization is a convention, not a result; what matters for the audit is that the basis is real-valued, orthogonal on the sphere, and indexed by degree and order so the parameter count is explicit.

## Fitting irregularly sampled points

Corpus points are irregularly sampled, not on a grid. The classical tool is a least-squares inversion: SHTOOLS' SHExpandLSQ determines the spherical harmonic coefficients of an irregularly sampled function using a least-squares inversion, returning the coefficient matrix and the chi-squared of the fit (https://shtools.github.io/SHTOOLS/pyshexpandlsq.html, jev high 0.7762). The corpus fit is the same inversion with a ridge term added, because a degree-3 basis on a small corpus can overfit single-file spikes if left unregularized.

Ridge regularization on spherical data has recent precedent. A 2025 PheWAS application embeds phenotypes onto the unit sphere and fits a joint spherical-harmonic map across variants via weighted ridge regression (https://www.biorxiv.org/content/biorxiv/early/2025/10/28/2025.10.27.684843.full.pdf, jev high 0.7738). A 2026 paper develops spectral Bayesian regression on the sphere using spherical harmonics and the Laplace-Beltrami operator, with posterior contraction as a diagnostic (https://arxiv.org/pdf/2601.20528, jev high 0.75). Regularization design on the sphere is an active topic: sparse isotropic regularization for spherical-harmonic representations connects coefficient sparsity to compressed sensing and signal analysis (https://arxiv.org/pdf/1801.03212, jev high 0.8725). The corpus method's ridge is the plainest member of that family: an L2 penalty, chosen for determinism and simplicity rather than sparsity.

## What the fit is used for

The fitted function is a density, not a classifier. High values mark regions where many files with similar primitive patterns sit; low values mark thin regions. The equal-area cell partition then turns the continuous surface into countable cells, and a cell whose member files are few and whose fitted value is low becomes a sparse cell, the raw material for a coverage lens (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

A practical fitting note transfers from the SH literature: when the underlying data distribution on the sphere satisfies antipodal symmetry, fitting only even orders guarantees the reconstruction follows the same symmetry, and different observation noise levels call for different fitting regimes (https://kvttt.github.io/files/Spherical_Harmonics_Fitting.pdf, jev high 0.5075). The corpus method does not assume symmetry, but the note matters as a warning: a degree-3 fit will happily render an artifact if the corpus has mirror structure the analyst did not intend to encode.

## The ablation that justifies the sphere

The sphere basis replaced a flat 2-D Fourier surface on PC1 and PC2, and the replacement was decided by matched-parameter ablation, not taste. On the corpora where the comparison ran, the ablation delta was +0.98 and +1.34 in the first comparison, then +0.74 and +0.52 in a later configuration, in favour of the sphere basis. On some corpora the ablation delta is near zero: there the sphere buys nothing, and a file that reports that honestly is doing its job (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

This honesty clause is structural. Because the sphere adds a lift and a curved basis to the pipeline, it must earn its keep per corpus. The flip condition is explicit: the sphere basis is dropped for flat if the matched-parameter ablation goes negative on the holdout across 3 seeds. A basis that cannot beat the flat fit of equal capacity on held-out data should not carry an audit verdict.

## Degree 3 as a budget, not a limit

Degree 3 on a real spherical-harmonic basis gives 16 coefficients (degrees 0 through 3, with (2l+1) real functions per degree l). That is the parameter budget against which the flat Fourier baseline is matched. Raising the degree buys finer spatial detail at the cost of the clean comparison and of overfitting small corpora; the method keeps 16 as the ceiling and treats any need for more degrees as a sign the corpus should be split rather than the basis enriched (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).
