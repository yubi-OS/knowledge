# 03 Identity versus measurement: why the map needs a separate identity layer

Scope: why point-to-point identity needs a separate layer: measurement classes collide (2286 items to 176 classes, slugs collide), only the row ordinal is injective.

## The wall stated precisely

The source record names D6 `injective-mapping` as the fact that forces the split: 2286 items reduce to 176 measurement classes, and even slugs collide, with 2169 distinct slugs among 2286 items; only the row ordinal is injective (internal record). Point-to-point mapping on measurement alone is therefore class-to-class, never item-to-item. Any edge drawn between two items on the basis of measured features is an edge between their classes wearing item costumes. The design conclusion is that identity has to be a separate layer with its own injective key, independent of the measurement pipeline.

## The entity-resolution view of the same problem

The data-management literature treats exactly this split as its subject. Entity resolution is the task of identifying whether multiple records refer to the same real-world entity, recognized as critical across data management but unsolved as a general problem (https://arxiv.org/html/2503.08087v2, weight 0.85). Practitioner treatments group identity resolution, record linkage, and deduplication as one family of processes that decide whether records refer to the same thing (https://intelligencenotes.com/08-Guides--and--Manuals/OSINT-Methodologies/Entity-Resolution-Methodology, weight 0.38, weakly backed). The record's design choice is a strict specialization of this: instead of fuzzy-matching items into an inferred entity, it takes a deterministic, already-given key (the row ordinal) as the only injective identity, and leaves similarity entirely to the measurement layer.

## Why hash-style identity, not similarity-style identity

Cryptographic identity gives the model for the separate layer. A hash function maps bitstrings of any length onto a fixed-size output space (https://61600.csail.mit.edu/2026/lec/lec03.pdf, weight 0.69), and collision resistance is the property that finding two inputs with the same output is hard (https://en.wikipedia.org/wiki/Collision_resistance, weight 0.73). Deduplication systems rely on exactly this: content-addressed deduplication filesystems use collision-resistant cryptographic hash functions to identify the content of a record (https://comsec.ethz.ch/wp-content/files/dupefs_fast22.pdf, weight 0.83).

The analogy in the record is direct: the identity layer's key must be collision-free by construction (the ordinal), not collision-resistant by computation (a hash of content, which could collide, and which the record shows actually does collide when slugs are used: 2286 items, 2169 distinct slugs). Measurement-derived keys are worse still, since they compress 2286 items into 176 classes, a collapse of more than an order of magnitude.

## What lives on each side of the wall

Identity layer: which row is which. Injective, ordinal-keyed, stable across re-runs, carries no statistical meaning. Measurement layer: what the row looks like to the pipeline. Lossy by design (class formation), changes with the binarization rule, and supports only class-level statements. The record's rule is that the point map draws placements from the measurement layer but must never draw edges between items as if measurement could distinguish them; edges are class-to-class (atom moves, null trades) or bridge geodesics, and the certificate names which kind of statement it is (internal record).

## Consequences for the deployable

Three consequences follow. First, the tool must print the identity key on every artifact, because two runs with different row orderings are different identity worlds even if the measurement cloud is identical. Second, deduplication of the display is a presentation choice, not an identity claim: showing 176 class nodes is honest, labeling them as 2286 items is not. Third, any future Rekor-style log of edge certificates would anchor to the identity layer, since a transparency log needs stable identifiers for the objects it certifies (https://github.com/sigstore/rekor, weight 0.91), and only the ordinal layer supplies stability (internal record).

## What the literature says about getting this wrong

The entity-resolution field's own framing supports the caution: the task remains unsolved in general and active across industries (https://arxiv.org/html/2503.08087v2, weight 0.85). A design that refuses to solve it, by separating identity from measurement and refusing class-to-item inference, sidesteps the unsolved problem rather than shipping a guess about it. The weakly backed practitioner sources agree on the family resemblance (https://towardsdatascience.com/entity-resolution-identifying-real-world-entities-in-noisy-data-3e8c59f4f41c/, weight 0.13, weakly backed) but add nothing load-bearing.
