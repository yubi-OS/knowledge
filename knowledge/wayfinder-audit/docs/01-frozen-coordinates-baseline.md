# Frozen coordinates: baselines that pin the fitted frame

Scope: how the wayfinder v0.2 audit freezes fitted coordinates, why seed-only reuse cannot pin a fitted coordinate system, and how baseline_id, frame_id and instrument_id now divide that responsibility.

## The defect

The pre-audit wayfinder treated "same seed" as "same coordinate system". A run fitted PCA centering, axes and thresholds for the input map, and fitted placement normalization, PCA and lift for the placement side. Reusing the seed alone did not freeze any of those fitted quantities: they are outputs of the previous run's data, not functions of the pseudo-random generator. A comparison run that re-derived them was silently comparing maps in two different frames.

The repair stores an explicit baseline. `baseline_id` reuses the actual stored frame rather than recomputing anything from the seed. `frame_id` and `instrument_id` are checked independently of the changed input fingerprint, so a changed corpus cannot silently invalidate the frame identity, and a changed frame cannot masquerade as a changed corpus.

## Why seeds alone are not determinism

The reproducibility literature is blunt that a fixed random seed is necessary but not sufficient. The AAAI reproducibility survey recommends that "fixed random number seeds should be used and published to make ML experiments more reproducible and control a number of sources of inherent nondeterminism" (https://onlinelibrary.wiley.com/doi/pdf/10.1002/aaai.70002, jev weight 0.876; mirrored at https://arxiv.org/html/2406.14325v3, weight 0.836). The same survey treats the seed as the first value initializing the pseudo-random number generator, which by construction only controls the stochastic part of a pipeline.

The systems side of machine learning converged on the same conclusion for inference itself. SGLang documents that "fully deterministic inference" requires batch-invariant operators, not just a fixed seed, "while maintaining compatibility with chunked prefill, CUDA graphs, radix cache, and non-greedy sampling" (https://docs.sglang.io/docs/advanced_features/deterministic_inference, weight 0.803). llama.cpp added an opt-in deterministic mode that makes CUDA inference "bit-identical for identical inputs, independent of batch size, prompt chunking, or concurrency" (https://github.com/ggml-org/llama.cpp/pull/16016, weight 0.506). In other words: identical outputs come from identical operators on identical inputs, and the seed is only one input among many.

Neural network training adds randomness deliberately; "neural networks use randomness by design to ensure they effectively learn the function being approximated" (https://machinelearningmastery.com/reproducible-results-neural-networks-keras/, weight 0.781). A fitted coordinate system inherits exactly that sensitivity: run-to-run refits differ in legitimate ways, so freezing them requires storing them, not reseeding them.

## The division of responsibilities

The audited design now separates three identities:

1. The baseline. `baseline_id` names the stored frame: the centering, axes, thresholds, normalization, PCA basis and lift as fitted at capture time. Reuse replays the frame byte for byte.
2. The frame. `frame_id` identifies the geometric frame itself, checked on every comparison. A frame change is a reportable event, not an implicit recomputation.
3. The instrument. `instrument_id` identifies the measurement instrument version, also checked independently.

None of the three is keyed on the input fingerprint. That is the point. When the corpus changes, the input fingerprint changes and the frame stays put, which is what makes before-and-after comparison on a moving corpus meaningful. A frame that silently refits itself on every input change would make every comparison a comparison of two different rulers.

## What this buys the audit

With a frozen frame, the run series in the audit record (identical rerun preserving 10 anchors with zero bit flips, the 159-document full-corpus run, and the exact no-op replay with 159 cache hits) are all statements about the same measuring device. Without it, "zero displacement" between two runs would be unfalsifiable: any displacement could be explained away by the refit. The frozen baseline converts displacement from an artifact of the pipeline into a measured quantity.

Weak-backing note: the general claim that stored configuration must be versioned and checked, rather than rederived, is supported here by primary documentation of deterministic inference systems at weights 0.803 and 0.506. The claim that seed-only reuse cannot freeze fitted coordinates comes from the audit record itself and is not web-verifiable; it is the project's own finding.
