# 07. Sparse cells and the point-map memory discipline

Scope: The corpus audit lens: per-artifact coverage vectors placed on a sphere, with sparse cells driving the next proposals, and the point-map rules the memory layer adopts instead of naive embedding dedupe.

## Gap maps: the audit lens's shape

The audit lens builds a coverage map over the corpus and proposes work where the map is thin. The research-synthesis literature gives the pattern a name: an evidence gap map is a systematic, visual overview of research on a topic, built as a matrix of interventions against outcomes, where each cell shows how many studies cover that combination (source: https://systematicreviewwritingservices.org/blog/evidence-gap-map, jev weight 0.13, weak). The interactive-tool variant walks four steps: load the studies, configure the map axes, view the interactive matrix, then review prioritised research gaps (source: https://academy.evalcommunity.com/tools/interactive-evidence-gap-mapper/, jev weight 0.09, weak).

The loop's version replaces interventions-and-outcomes with the 9-D primitive coverage vector per audited artifact: each item maps to a point on a sphere, and the cells of the resulting coverage are inspected for sparsity. The prioritization rule, from the learned-latent-curves paper's appendix B, is that sparse cells drive the next proposals: what to audit next is decided by where coverage is thinnest, not by what is easiest.

## Sampling where the map is thin

A related problem appears in cellular network engineering: constructing a coverage gap map, where a pivoting scheme is introduced to choose the best locations for sampling, with an acknowledged drawback when there are too few samples to anchor the map (source: https://www.sciencedirect.com/science/article/pii/S1574119224001238, jev weight 0.83). The parallel is exact enough to be useful: sparse regions are where sampling effort should go, but sparse regions are also where estimates are least stable, so the sparse-cell lens must be read together with the fit-quality gate of doc 03 before any placement claim is trusted. A replicability effort makes the trust argument concrete: knowing that others are using exactly the same implementation is what lets them reliably compare with and build on existing techniques (source: https://www.replicabilitystamp.org/, jev weight 0.50).

## Point-map memory discipline

The memory layer (a vector store over embeddings) adopts point-map's frozen-frame rules instead of naive dedupe. The pieces:

1. Identity keys: each entry carries an ordinal plus a hash, so identity is structural, not similarity-based.
2. rule_hash: every embedding batch is stamped with the hash of the rules that produced it, so a batch can be tied to the exact procedure that generated it.
3. changed_input_names versus quantization_silent_names: a distinction between inputs whose content changed (learning happened) and inputs whose coordinates merely moved under quantization (nothing was learned). Reporting them separately prevents silent churn from being counted as progress.
4. A named-neighbour ledger for recall at propose time: when the loop proposes a directive, the memory layer answers "this was tried on a given date, with outcome X" from named neighbours rather than anonymous vector hits.
5. The matched-null placement discipline from doc 04 for any geometric claim.

## Why content-hash identity, from real failures

The dig found both support and warning. Support: dedupe mechanisms in embedding pipelines use content hashing to identify identical inputs and skip redundant embedding generation (source: https://deepwiki.com/bradleygolden/hexdocs-mcp/8.2-content-deduplication-strategy, jev weight 0.31, weak), and two-level strategies use document-level hashing to identify unchanged documents before re-embedding (source: https://deepwiki.com/redis-applied-ai/redis-sre-agent/3.2.4-deduplication-and-embedding-reuse, jev weight 0.46, weak). A practitioner account describes the versioning subtlety: a matching content key means the previously committed embedding can be referenced, while a changed extraction or chunker version deliberately creates new work (source: https://dev.to/finnianfox8297/6-nodejs-tenant-guardrails-for-cheap-invoice-rag-count-embeddings-and-llm-spend-570g, jev weight 0.39, weak); that is the same distinction the rule_hash and changed-vs-silent separation encode.

The warning is a real bug: a deduplication check that queries existing rows by content_hash but then compares the wrong keys, storing database row ids and filtering against them instead of the hashes, so dedup fails silently (source: https://github.com/simonw/llm/issues/1397, jev weight 0.79). That failure mode is the reason point-map insists identity keys (ordinal plus hash) be compared to themselves and never be confused with storage row ids: a memory layer that silently fails to dedupe will both waste embedding calls and, worse, count duplicate entries as independent observations, corrupting any downstream null built over them.

## Placement

The sparse-cell lens belongs to the proposal side of the loop (what to do next), and the point-map discipline belongs to the memory module (doc 08, module C on Vectorize). They share one requirement: both need the identity and hashing rules above to hold, because a coverage map over misidentified artifacts, or a neighbour ledger polluted by failed dedupe, produces confident-looking proposals for work that was already done.
