# 04. Open items not done in this deploy

**Scope:** Open items (not done in this deploy): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md, no external web dig

## Overview

The adoption record lists six open items. None was addressed in the deploy. They fall into three groups: calibrations computed on the old graph (items 1 and 4), scientific questions the new graph exposes (items 2 and 3), and repository hygiene that needs a decision from Jenny (items 5 and 6).

## 1. The 2.4 walk threshold

**What.** The 2.4 walk threshold in the pair bands, hierarchy-confirmed and hierarchy-spectral, was calibrated on the incomplete graph.

**Why it matters.** d_w values shifted by 2.6% to 16.6% on the gold set (doc 03). A threshold set against old values has no guaranteed meaning against new ones.

**Required before reliance.** Recalibration on canonical values before any real arrangement of 300 or more droplets relies on it. The 300-droplet floor is what currently keeps the threshold from touching any gold artifact except the gasket.

## 2. Walk-leg hierarchy sign

**Observation.** On the canonical graph at N = 366, the clean gasket has the LOWER d_w (2.90) compared with a jittered gasket (3.71) and uniform random points (3.83). The old graph already had the same ordering (2.77 against 3.33 and 3.45).

| Point set | d_w, old graph | d_w, canonical graph |
|---|---|---|
| Clean gasket | 2.77 | 2.90 |
| Jittered gasket | 3.33 | 3.71 |
| Uniform random | 3.45 | 3.83 |

**Why it is open.** The source states the sign is inverted on both graphs relative to what the hierarchy claim would need, and this deploy does not change it. The ordering is consistent across graphs, which suggests a property of the measurement rather than an artifact of missing edges.

**Required before any claim.** More seeds and a pre-registered sign. The prescription rules out the post-hoc move of choosing whichever sign the data happens to show.

## 3. Trefoil

**Observation.** The d_w jump under the trefoil arm is +1.45 on the canonical graph. It is carried by 10 long forced edges that the old graph omitted. Removing those edges takes the jump to +0.68.

**Why it matters.** The trefoil response is dominated by a handful of long edges. Forced edges are, by definition, in every valid triangulation, so they cannot be discarded as an implementation artifact. But a statistic that more than halves when 10 edges are removed is highly sensitive, and that sensitivity has to be understood before the trefoil arm can carry a verdict.

## 4. Falsification anchors

**What.** The spectral anchors in tools/spectral-standard, including C2 d_w 2.70487 and related walk gates, were computed on the incomplete graph.

**Required.** Re-anchoring on the canonical graph. Until then, any falsification gate that compares a live walk value against these anchors compares two different instruments.

## 5. Python source of record

**What.** tools/spectral-standard/centroid_walk.py still uses the Bowyer-Watson graph. The canonical Python twin is lane A2's delaunay_exact.py.

**Blocker.** Committing it to the repo needs Jenny to name the exact files.

**Why it matters.** The project relies on Python sources of record with JS parity. Right now the deployed JS and the repo Python disagree on the graph, so the parity guarantee does not hold in the repo until this lands. Lane A2 already showed the two languages agree on 33 of 33 sets with the exact implementation.

## 6. AGENT.md drift

**What.** This predates the deploy. The live KV copy of AGENT.md is 92,569 bytes; the git mirror tools/point-map/AGENT.md is 85,085 bytes. They first differ at byte 21,861.

**Rule violated.** The mirror rule says they must match.

**Status.** Neither copy was changed in this deploy. Jenny chooses the canonical copy.

## Dependency order

| Item | Depends on | Unblocks |
|---|---|---|
| 5 Python twin | Jenny names files | 4 re-anchoring in Python, repo parity |
| 4 Anchors | 5 | Falsification gates on canonical graph |
| 1 Threshold | Canonical values (available now) | Router reliance at 300+ droplets |
| 2 Hierarchy sign | Pre-registration, more seeds | Any walk-leg hierarchy claim |
| 3 Trefoil | Analysis of long forced edges | Trefoil arm verdicts |
| 6 AGENT.md | Jenny's choice | Mirror rule compliance |

## Risk if left open

- Items 1 and 4: silent miscalibration of gates and routes, worst on large real arrangements.
- Items 2 and 3: overclaiming hierarchy or trefoil signals from a sensitive statistic.
- Items 5 and 6: drift between deployed code, repo source of record, and agent docs.

## What the record does well

Every item names the exact artifact, value, or byte offset, and none is softened. The deploy shipped a correctness fix while explicitly declining to claim the downstream calibrations were also fixed.
