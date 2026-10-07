# Setup and source of truth

Scope: the preconditions of a unit round. AGENT.md is the source of truth, two connections are required, every fetch carries a User-Agent header, the selftest must pass before any result is trusted, and the round stops rather than guesses.

## The source of truth is a file, not a habit

A unit round begins with a fetch, not with a memory. The source of truth is `/AGENT.md` on the steady-orbit worker, served at https://steady-orbit.systems-a.workers.dev/AGENT.md and mirrored at `yubi-OS/yubiOS tools/point-map/AGENT.md` (source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md). The operator fetches it first, every round. If it cannot be read, the round stops. It does not guess at the contract from a prior session's recollection (source doc).

Endpoint contracts live elsewhere: the `jev-corpus` skill owns the scorer/endpoint contracts themselves, and the `steady-orbit-deploy` skill owns worker deploys. The unit-round skill explicitly declares both out of scope (source doc). This is a boundary discipline, not a courtesy: an operator who improvises an endpoint shape mid-round is measuring with an unverified instrument, and every downstream gate statistic inherits that error.

## Connections and header discipline

Two connections are prerequisites (source doc):

1. `Steady Orbit jev operator` for all `/api/jev/*` plus `/api/map*` plus `/api/outcomes` calls.
2. `MASTER GIT SU` for the GitHub side of the round (pin, commit chain, PR).

Every fetch carries a `User-Agent` header. Without it, Cloudflare returns error 1010 and GitHub returns 403 (source doc). This is not incidental configuration. HTTP requests carry headers that identify the client and carry request metadata, and servers use them to gate automated access (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview, jev weight 0.90). A client that omits the header looks like a scanner, and the round dies at step 1 of 13 with a 1010 it cannot distinguish from a real outage. Bake the header into every call once and never think about it again.

## The selftest gate

`GET /api/jev/corpus/selftest` must be all-pass before any result from the engine is trusted (source doc). The guideline that backs this is blunt: selftest before trusting any engine result; fixtures are the truth (source doc). The selftest is a known-answer check of the scorer and audit machinery itself. If the instrument is broken, no amount of careful roundflow will produce a meaningful gate decision, because the gate statistic would be measuring the instrument's failure rather than the corpus change.

The ordering matters. The selftest runs before the baseline check, not after it. A frozen baseline built on a broken scorer is not recoverable later by re-checking; the whole round's measurement frame would need to be re-derived. The cost of running the selftest first is one GET. The cost of skipping it is an entire round of untrustworthy measurements that may not be detectable until a keep decision has already shipped.

## Stop, do not guess

The round's posture toward uncertainty is conservative by design. The source-of-truth file that cannot be read stops the round. The selftest that does not pass stops the round. Nothing in the runflow authorizes proceeding on a plausible reconstruction of the contract (source doc). This inverts the usual engineering instinct to make progress, and it is the right inversion for a measurement loop: the deliverable of a round is a defensible number plus a kept or reverted change, and a defensible number cannot rest on guessed contracts.

## What this record does not claim

This record does not describe the AGENT.md contents themselves, the endpoint request and response shapes (owned by the `jev-corpus` skill), or the deploy mechanics (owned by the `steady-orbit-deploy` skill). It records only the setup discipline the unit-round runflow imposes before step 1 can begin.

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc); MDN HTTP overview (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview, weight 0.90); Wikipedia, Reproducibility (https://en.wikipedia.org/wiki/Reproducibility, weight 0.52) for the general principle that a measurement procedure must be documented well enough to be re-executed.
