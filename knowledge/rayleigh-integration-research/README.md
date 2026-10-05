# rayleigh-integration-research

**Topic:** Rayleigh's equation as an instrument for corpus wayfinding: what fits the Lean CI and Cloudflare API audit stack, what was excluded, and what is proved

Minted 2026-10-05 from yubi-OS/yubiOS refs/ source doc rayleigh-integration-research-2026-09-18.md (rayleigh/1). The corpus decomposes the source doc into 8 knowledge docs, each backed by a searXNG dig weighted by the clef decision model.

## Docs

| doc | scope |
|---|---|
| [01-rayleigh-quotient-variational.md](01-rayleigh-quotient-variational.md) | The Rayleigh quotient R(x)=x^T A x / x^T x and the Rayleigh-Ritz / Courant-Fischer variational characterization of eigenvalues: the mathematical base the instrument's readings stand on. |
| [02-ky-fan-principle.md](02-ky-fan-principle.md) | The Ky Fan maximum principle for sums of top-k eigenvalues and trace inequalities, the exact form behind the top-2 eigen-share and the frozen-frame gap reading. |
| [03-graph-laplacian-fiedler.md](03-graph-laplacian-fiedler.md) | The Rayleigh quotient of the graph Laplacian: Fiedler value, algebraic connectivity, Cheeger inequality, and the centered-indicator cut bound. |
| [04-components-isolates-nullity.md](04-components-isolates-nullity.md) | Laplacian nullity equals the number of connected components, isolates as size-1 components, and the use of lambda_2 = 0 as an exact disconnection certificate in spectral clustering prior art. |
| [05-excluded-physics-forms.md](05-excluded-physics-forms.md) | The Rayleigh forms that do not fit a corpus audit instrument: the inviscid shear-flow stability equation, Rayleigh-Plesset bubble ODE, and Rayleigh damping, and why they are excluded. |
| [06-fixed-margin-nulls.md](06-fixed-margin-nulls.md) | Fixed-margin checkerboard and permutation nulls for binary matrices, certified margins, and exclusion-only verdicts at resolution 1/(K+1). |
| [07-lean-spectral-provability.md](07-lean-spectral-provability.md) | What is elementary algebra provable in core Lean without Mathlib (PSD, cut identities, rational Rayleigh-Ritz witnesses) versus what needs the spectral theorem or Mathlib. |
| [08-drift-detection-rebaseline.md](08-drift-detection-rebaseline.md) | Embedding and corpus drift detection and re-baselining: frozen PCA frames, explained-variance shortfall as a drift signal, and when to rebuild a baseline. |

## Research summary

- Results collected: 108 (top 6 per query, 2 queries per subtopic; 1 redo dig for ky-fan-principle added 12 more)
- Weight split: 47 high (>= 0.5, authoritative backing) / 61 low (< 0.5, weak backing, labeled in text)
- jev requests: 46 (usage 33954 input / 0 output tokens)
- Redos: 1 dig redo (02-ky-fan-principle, first pass returned only 2 authoritative results among off-topic noise)
- Skipped docs: none. All 8 subtopics authored.
- Gaps: the Rayleigh damping form has no dig-backed external source in this corpus; doc 05 records its exclusion as resting on the project's recorded negative alone.

## Preflight

2026-10-05: searXNG 48 results on probe query, healthy (14 engines unresponsive at probe time, endpoint serving); /api/decide (clef) 200.

## Honesty boundary carried from the source

- lambda_2 is a float estimate; the exact objects are integer component/isolate counts and the rational witness.
- The Ky Fan gap is a frame-adequacy reading, not a quality verdict.
- The null randomizes bit margins, not content; K = 40 resolves nothing below 1/41.
- No Rayleigh stability, Rayleigh-Plesset or damping term is used; recorded physics negatives stand.
