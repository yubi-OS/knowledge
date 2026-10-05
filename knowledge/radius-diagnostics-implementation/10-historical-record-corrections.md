# 10: Record corrections and live verification

Scope: the dated errata appended to the historical GL note, the completed round-three record and its census duplicates, the merged PR and byte-identity receipts, and the live preview verification that closes the loop.

## Why corrections belong in the record

A long-running instrument accumulates a record: research notes, round summaries, and claims made in earlier states of knowledge. When a claim is later found wrong or incomplete, the honest move is not silent deletion but a dated correction appended to the historical document. The motivating implementation does exactly this: dated errata were appended to the historical GL note, and the round-three record was completed with the missing map 76 entry (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

## The GL errata

Two corrections were appended to the historical Ginzburg-Landau note, both mathematical:

1. Equal nonzero b=c can retain a Lyapunov functional under the stated deterministic and boundary assumptions. The Lyapunov-functional question for Ginzburg-Landau-type equations is a settled subject with a substantial literature: stability and bifurcation analysis of the Ginzburg-Landau equation is treated directly in the classical literature (source: https://link.springer.com/content/pdf/10.1007/978-1-4612-4724-1_15.pdf , jev weight 0.89), global existence and stability results for the complex Ginzburg-Landau equation with power nonlinearities and damping are proven in modern form (source: https://arxiv.org/pdf/1905.08521v2 , jev weight 0.77), and the special cases of the complex Ginzburg-Landau equation possessing a Lyapunov functional, with their basin-of-attraction subtleties, are the subject of dedicated study (source: https://repository.arizona.edu/handle/10150/282419 , jev weight 0.45, weak backing). The errata's point is scope discipline: the functional survives under the specific deterministic and boundary assumptions stated, and the correction names them rather than claiming the general case.
2. The quantity 2/9, approximately 0.2222, is an isotropic covariance floor, not a 0.78 ceiling. A correction that flips what a number means (a lower bound rather than a upper bound) is exactly the kind of error that propagates silently through later documents, which is why it is dated in place.

The errata also reiterate that existing corpus phase-transition falsifications remain retired: earlier falsified claims stay retired rather than being quietly revived.

## Completing the round-three record

The round-three record is completed with map 76: 176 items, 64 isolates, V2=0.31855. Completing a record has a bookkeeping subtlety that the record itself documents: it distinguishes eight ADDs and two runtime CHANGEs from the PR's eight added files and one modified file, and leaves one unaccounted runtime CHANGE explicitly unexplained rather than papering over it. An explicitly unexplained delta is the honest state; an explained-sounding gap is the dishonest one.

The census check found overlap: 66 census entries covering 62 unique items, with four cross-class duplicates. The isolate count is unchanged by the deduplication. Recording the duplicates rather than silently merging them keeps the census auditable: a future reader can recompute 62 unique from 66 entries and get the same answer.

## Merge receipts and byte identity

The change shipped as PR 233, merged as commit e9f999126db145ff481658d4fb6fb68f4b7cf649. Three CI runs are on the record: the proof-only branch run 34797739861 (doc 06), the integrated branch run 34799688203, and the merge run 34799911896, all passing all jobs (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

The deployment receipt is Cloudflare deployment 8fc5fed208814cdf9085033211c0b4da, live. Four updated public assets matched SHA256, and the core JavaScript and the homepage short-introduction source remain byte-identical to pre-change. This is the frozen-frame guarantee verified against the deployed artifact, not just the test suite: byte identity at deploy time is the strongest form of the nothing-else-changed claim (doc 09 covers the test-level golden masters).

Post-merge and post-deploy validation is itself a recognized discipline: the smoke check after deploy should be small, fast, and trusted precisely because it is small (source: https://stevekinney.com/courses/self-testing-ai-agents/post-merge-and-post-deploy-validati , jev weight 0.52).

## Live verification receipts

The live receipts verify the instrument against the historical corpus, on the deployed system (project record: https://github.com/yubi-OS/yubiOS/pull/233 ):

1. Historical map76 now returns the verified profile [74, 70, 64, 46, 38] at radii [0.075, 0.085, 0.095, 0.105, 0.115], with original bits, full points, and frame unchanged. The stored artifact is untouched; the profile is a new lens over it.
2. Live noop preview against old text baseline65: HTTP 200, canonical delta 0, 12 unchanged anchors, correctly bracketed same-sign interval, persisted=false.
3. Live change preview against old text baseline65: HTTP 200, canonical delta 2, 11 unchanged anchors, correctly bracketed same-sign interval, persisted=false.
4. Live add preview against old text baseline65: HTTP 200, canonical delta 1, 12 unchanged anchors, correctly bracketed same-sign interval, persisted=false.
5. Saved map count stayed 76 before and after the previews: zero new rows (the immutable-history guarantee of doc 07, verified live).
6. Radius override, zero distance-error bound, and negative coordinate bound each returned 422 (the fail-closed rejections of doc 05, verified live).

The receipts also carry their own honesty label: these candidate texts are mechanical smoke tests, not a new forecast-quality benchmark, and no +2 or +1 geometry change is presented as an improvement. A live preview that moved the canonical count by 2 is a measurement, not a victory.

## The verification chain as a whole

Assembled, the chain runs: local suites (doc 09) prove the instrument behaves; the kernel (doc 06) proves the mathematical claims; byte-identity proves the core did not move; CI runs prove the proofs still compile at each step; the deployment SHA256 receipts prove what actually shipped; and the live previews prove the instrument works against the real historical corpus on the deployed system. Each link is a different kind of evidence, and none of them is allowed to stand in for another.

## Summary

1. Dated errata correct the GL note in place: the b=c Lyapunov-functional claim is scoped to stated assumptions, and 2/9 is a covariance floor, not a ceiling.
2. The round-three record is completed with map 76 (176 items, 64 isolates, V2=0.31855), with the census's four cross-class duplicates recorded and one runtime delta explicitly left unexplained.
3. Merge, CI, and deployment receipts establish byte identity of the core and the integrity of updated assets.
4. Live receipts verify profiles, bracketed intervals, persistence-free previews, and fail-closed rejections on the deployed system, labeled as mechanical smoke tests rather than forecast benchmarks.

Project record: the motivating implementation's corrections and live verification receipts are recorded at https://github.com/yubi-OS/yubiOS/pull/233 .
