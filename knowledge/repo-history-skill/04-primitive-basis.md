# Deriving and validating a primitive basis for event corpora

Scope: deriving and validating a binary primitive-coverage basis (has_sha, has_linear_ref, has_state_progression and kin) for event corpora, with regex detection and spot-check validation.

## What a primitive basis is

A primitive basis turns every corpus item into a fixed-length binary vector: each bit answers one structural question about the item. A corpus then becomes a set of points in a hypercube, which makes coverage gaps measurable: a cell of the cube that no item occupies is a kind of structure the corpus lacks. The gensim corpus model makes the same move generically: convert the entire corpus to a list of vectors, then train and evaluate models on the vectors rather than the raw documents (https://radimrehurek.com/gensim/auto_examples/core/run_core_concepts.html, noul 0.751). Feature engineering tutorials make the same argument for tabular data: better features make better models, and the features are the unit of iteration (https://www.kaggle.com/learn/feature-engineering, noul 0.8095).

For repo history events, a concrete 9-primitive starter basis looks like this:

| # | Primitive | Question it answers |
|---|---|---|
| p0 | has_purpose | Does the item state what it is for? |
| p1 | has_sha | Does it carry a 40 character commit SHA? |
| p2 | has_pr_ref | Does it reference a pull request by number or URL? |
| p3 | has_linear_ref | Does it reference a tracker issue by key, URL, or id? |
| p4 | has_state_progression | Does it record a state change over time? |
| p5 | has_author | Does it carry author identity? |
| p6 | has_cross_corpus_link | Does it join at least 2 of the git and tracker corpora? |
| p7 | has_evidence | Does it carry a measured number or a verification claim? |
| p8 | has_temporal_anchor | Does it carry a parseable creation, update, or merge timestamp? |

## Deriving the detectors

Each primitive needs a detection rule, and for event corpora the rules are mostly regex-shaped over text fields plus structural checks over typed fields.

1. has_sha: match the commit field against the 40 lowercase hex character pattern. This is structural, not textual: the SHA comes from the API object, not from prose.
2. has_purpose: on the git side, look for a summary or what-this-changes section in the PR body; on the tracker side, a goal or intent section in the issue body. For commits, the Conventional Commits specification is the strongest available convention: it requires commit messages structured as type, scope, and description (https://www.conventionalcommits.org/, noul 0.9565), so a conventional prefix in the first line is strong evidence of stated purpose.
3. has_pr_ref and has_linear_ref: regex over body text and event text for pull request numbers and tracker keys, with URL-pattern fallbacks.
4. has_state_progression: compare state fields across snapshots. GitHub's typed issue events make this reliable: the event types enumerate state changes with per-type object properties, and each event type declares whether it applies to pull requests, issues, or both (https://docs.github.com/en/rest/using-the-rest-api/issue-event-types?apiVersion=2022-11-28, noul 0.9567).
5. has_temporal_anchor and has_author: presence checks on ISO-parseable timestamps and author fields.

Reference dictionaries show the value of shipping detection rules as data: a machine-readable events data dictionary for a security sensor exports every event field to CSV and Markdown for downstream consumers (https://github.com/erickatwork/CrowdStrike-Falcon-Events-Data-Dictionary, noul 0.613). An event archive should do the same: the regexes and field checks belong in a published Detection section, versioned with the basis.

## Validating the basis

Derivation without validation produces confident nonsense. Two validation moves are cheap and effective.

1. Spot-check sampling. Sample a small percentage of items, manually verify that each primitive's bit matches observed structure, and correct the regexes. Pull request datasets built for machine learning show what well-validated event corpora look like: PR4Code collects 4,508 Java and 8,831 Python curated pull requests from GitHub, each enriched with metadata, commit histories, and detailed code changes (https://www.semanticscholar.org/paper/PR4Code%3A-A-Pull-Requests-Dataset-for-AI-Code-Donato-Mariani/1d83b7dca6c867b9f69c803d8f8f1d9f2990f037, noul 0.8675), and PReview labels 300 pull requests from 6 well-known repositories with outcome flags (https://openreview.net/forum?id=cdwp8BXTVV, noul 0.674). Their curation pipelines (collect, filter, enrich, verify) are the template for validating a basis at corpus scale. Security-focused event corpora validate the same way: Bugdar evaluated against a dataset of real-world GitHub pull requests with known vulnerabilities across multiple languages (https://arxiv.org/html/2503.17302v1, noul 0.9174).
2. Feedback from the fit. After the first curve fit, primitives that are near-constant across the corpus carry no information and should be dropped or merged; primitives whose bits flip wildly under small regex changes are unstable detectors. The basis is re-derived per corpus, not assumed universal.

## Coverage analysis as a first-class tool

Binary coverage analysis has serious tooling precedent in adjacent domains. The bcov work built efficient binary-level coverage analysis with a tool that measures which parts of a program are exercised (https://dl.acm.org/doi/10.1145/3368089.3409694, noul 0.7999; https://arxiv.org/pdf/2004.14191, noul 0.7508). A corpus coverage pass is the same shape of question with text instead of code: which cells are exercised, which are not, and where is the measurement itself too slow to run at scale. That last concern motivates keeping the basis small (9 to 12 primitives) so the coverage pass is linear in corpus size.

## Weak spots to expect

Weak-backing sources in this area tend to be blog-level summaries of commit metadata extraction (https://skills.rest/skill/git-commit-metadata-extraction, noul 0.1778, weak backing; https://fast.io/resources/metadata-extraction-from-git-repositories/, noul 0.1382, weak backing). They are useful as evidence that the problem is common, not as authority for detector semantics. Detector semantics should come from primary sources: the platform event type documentation (noul 0.9567) and the commit convention spec (noul 0.9565).

## Design summary

1. Define 9 to 12 binary primitives over event items, mixing structural checks (SHA, timestamps, author) with regex checks (references, purpose sections) (https://radimrehurek.com/gensim/auto_examples/core/run_core_concepts.html, noul 0.751).
2. Ship the detectors as versioned data, the way event field dictionaries are shipped (https://github.com/erickatwork/CrowdStrike-Falcon-Events-Data-Dictionary, noul 0.613).
3. Validate by spot-check sampling against curated PR datasets as the gold standard (https://www.semanticscholar.org/paper/PR4Code%3A-A-Pull-Requests-Dataset-for-AI-Code-Donato-Mariani/1d83b7dca6c867b9f69c803d8f8f1d9f2990f037, noul 0.8675).
4. Re-derive the basis per corpus from the first fit: drop near-constants, fix unstable detectors (https://www.kaggle.com/learn/feature-engineering, noul 0.8095).
