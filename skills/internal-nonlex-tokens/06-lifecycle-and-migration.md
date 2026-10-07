# Lifecycle and Migration

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). The strongest external confirmation is the LWN article on Git's hash algorithm transition (weight 0.63, authoritative).

## Scope

The four migration cases that let tokens survive beyond the substrate's own version, the legacy-flag mechanics, and the Phase 2 `migrate()` note.

## Why migration is part of the contract

Tokens persist beyond the substrate's own version: the substrate ships in v1, embedding models change, hash algorithms get deprecated, serialization evolves. The source doc covers four migration cases so that a token minted today is still interpretable (or explicitly declared not-interpretable) tomorrow.

## Case 1: substrate version envelope

Every token carries an implicit `substrate_version` (the substrate spec version that produced it). New substrate versions add `substrate_version: <N>` to the token envelope; tokens without the field are v1 tokens. Cross-version comparison requires explicit re-fingerprinting or a `substrate_version_compat` flag; `compare()` defaults to strict same-version (source doc).

The substrate follows SemVer 2.0.0 for this field: the source doc pins its Knowledge Sources citation to https://semver.org/spec/v2.0.0.html and states that `legacy: true` and `substrate_version_compat` follow the major-version compatibility rules (semver.org, weight 0.23, weak in this dig's scoring). Software versioning as a discipline assigns unique version numbers to unique states of a system, which is the same principle applied to a token envelope (https://en.wikipedia.org/wiki/Software_versioning, weight 0.19, weak).

## Case 2: embedding model migration

When the embedding model changes (for example from `sentence-transformers/all-MiniLM-L6-v2` v1.0.1 to v2.0.0), all old embedding tokens get a `legacy: true` flag and a `legacy_model_version` reference. New tokens use the new model. `compare()` across the boundary requires the caller to explicitly request "compare-with-legacy-semantics"; the default rejects. The substrate never silently re-embeds; re-embedding is the caller's responsibility, available via `transform(token, op=reembed)` (source doc).

The strict-default stance matters because embedding spaces are model-private: a 0.9 cosine similarity between vectors from two different models is a number without meaning. Production vector formats face the same problem, which is why format specs emphasize self-describing identifiers (see doc 10).

## Case 3: hash algorithm migration

When the hash algorithm changes (for example from sha256 to blake3), hybrid and hash tokens are RE-FINGERPRINTED with the new algorithm on next use. Pure hash tokens are byte-stable across the algorithm swap only if the caller migrates them. The substrate does not auto-migrate; it surfaces a `legacy_algo: <old>` flag and a one-time `transform(token, op=rehash)` path (source doc).

The strongest external evidence for how disruptive this is comes from Git's own transition: Git planned a move from SHA-1 to SHA-256 and had to keep a translation table from SHA-1 to SHA-256 for all old objects (http://lwn.net/Articles/811517/, weight 0.63, authoritative). Git historically used SHA-1 and moved toward SHA-256 support from Git 2.29 onward (https://mdsanwarhossain.me/blog-git-internals-objects-commits-refs.html, weight 0.20, weak). The substrate's design inherits the lesson: rehashing is a batch, one-time, caller-triggered operation, not something to attempt lazily at compare time.

## Case 4: serialization format migration

When the JSON envelope shape changes (a new required field, a deprecated field), old tokens round-trip through `recall()` with `unknown_fields_preserved: true` (the serialization rule from doc 05). New tokens use the new shape. Cross-version recall requires both substrate versions to agree on `substrate_version_compat` (source doc).

## The default is rejection

The common thread across all four cases: the substrate's default behavior on a version mismatch is to refuse, not to guess. Cross-version compare defaults to reject; compare-with-legacy-semantics is opt-in; re-embedding and re-hashing are explicit `transform` operations; cross-version recall needs both sides to agree on compatibility. Every permissive path is an explicit caller decision, which is what keeps the audit trail honest.

## Phase 2 note

When the runtime lands, all four cases are operationalized as `migrate(tokens, target_version)`, a substrate operation that handles re-embedding, re-hashing, and re-serialization in one batch. Until then, migration is a caller discipline: re-fingerprint on swap, flag legacy tokens, reject cross-version compare by default (source doc).

## What an operator does in practice

1. On any model or algorithm change, stop minting tokens with the old identifier immediately; the version stamp in the envelope is the boundary marker.
2. Flag every existing token `legacy: true` with its `legacy_model_version` (or `legacy_algo`) reference. Do not delete or silently rewrite them.
3. When a cross-version comparison is genuinely needed, call it out in the calibration log (doc 08) as an explicit legacy-semantics operation.
4. Schedule a re-fingerprint pass (`op=reembed` / `op=rehash`) as a batch job, not as inline logic; this mirrors Git's translation-table experience of keeping old and new digests coexisting until the migration completes.

## Red flags this section prevents

The source doc's red-flag list includes "a `recall()` that returned different content than was originally fingerprinted (version drift in the content-addressed store)". The lifecycle rules are the structural fix: version stamps make drift detectable at the token level instead of being discovered as silently corrupted recall results.
