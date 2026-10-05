# Identity keys for unlabeled corpus items

**Scope:** Identity keys for unlabeled corpus items: content hashing (FNV-1a, SHA-256), ordinal injectivity, and collision classes. The point-to-point latent map keys each item as `{ ordinal, fnv1a64(float32 bytes of its vector), label? }`; this doc grounds the hashing side of that contract in published practice.

## Design context

The map under study is one of many measurement instruments stacked on an unlabeled corpus. Because the corpus carries no primitive names, the only identity that cannot collide is the row ordinal. A 64-bit content hash over the item's float32 vector bytes gives a secondary, human-meaningful key; the map prints the collision histogram instead of hiding it. This doc collects what published sources say about the hashing primitives involved.

## FNV-1a: a non-cryptographic hash with a documented specification

FNV-1a is a non-cryptographic hash function, created by Glenn Fowler, Landon Curt Noll, and Phong Vo. The 64-bit variant multiplies the running hash by a 64-bit FNV prime and XORs each input byte after XOR-masking it, and the algorithm is specified in an active IETF internet draft, "The FNV Non-Cryptographic Hash Algorithm", which gives the reference parameters and test vectors for the 32-, 64-, 128-, 256-, 512-, and 1024-bit variants [https://www.ietf.org/archive/id/draft-eastlake-fnv-21.html, weight 0.83]. The draft documents the two multiplier steps (multiply by prime, then XOR with the byte) that distinguish FNV-1a from FNV-1, where the XOR comes first [https://www.ietf.org/archive/id/draft-eastlake-fnv-21.html, weight 0.83].

The Wikipedia summary of the function states that FNV is not a cryptographic hash: it is fast, simple, and useful for hash tables and checksums, but it does not resist deliberate collision construction [https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function, weight 0.81]. This matters for the map's identity layer: FNV-1a over float32 bytes is a fingerprint, not a guarantee. Two distinct vectors colliding is possible in principle, and the design treats the ordinal as the sole injective key.

Minimal reference implementations exist as small single-file libraries; one maintained JavaScript package implements FNV-1a in both 32- and 64-bit form with no dependencies [https://github.com/sindresorhus/fnv1a, weight 0.76]. That matches the deployment constraint of the map, which requires a dependency-free TypeScript module that runs identically in the browser and in a Cloudflare Worker.

## Collision behavior at 64 bits

The 64-bit FNV-1a output space has 2^64 values, and for random independent inputs the birthday bound puts expected first collisions on the order of 2^32 inputs. A public study repository collected empirical collision data for FNV-1a-64; the repository itself is informal and carries no peer review, so its measurements count as weak backing [https://github.com/pstibrany/fnv-1a-64bit-collisions, weight 0.30]. Weak backing: treat the collision counts there as anecdotal, not as a certified bound.

For an N-row corpus the practical exposure is the number of distinct hashes versus N, which the map reports as the collision histogram. With N in the low thousands the expected collisions at 64 bits are negligible under the random model; the histogram exists because the corpus is not adversarially random but clustered, and measurement classes can concentrate.

## Content hashing for deduplication: the SHA-256 alternative

Deduplication systems commonly use SHA-256 as the content identity. RelativityOne's processing documentation describes deduplication that hashes documents (MD5 and SHA-1 are listed as container-level choices in that product) so identical items collapse into one record keyed by the hash [https://help.relativity.com/RelativityOne/Content/Relativity/Processing/Deduplication_considerations.htm, weight 0.62]. A vendor engineering guide describes SHA-256 based file deduplication where the hash of file bytes becomes the storage key, making identical content addressable without a second copy [https://transloadit.com/devtips/efficient-file-deduplication-with-sha-256-and-node-js/, weight 0.56].

The same pattern is exactly what the map needs if the identity key must be stable across re-encodings: a cryptographic hash over canonicalized content bytes. The trade is cost: SHA-256 is slower than FNV-1a and is a 256-bit output, so the composite key grows. The design keeps FNV-1a-64 as the fast fingerprint and reserves cryptographic strength for the rule hash, which pins the binarization rule instead of an item.

## Hash generators and the reproducibility check

Standalone FNV-1a calculators let an operator reproduce a hash independently of the map's code path; one such tool computes both 32-bit and 64-bit FNV-1a from arbitrary text [https://freetoolscorner.com/hash-crypto-tools/fnv-1a-hash-generator/, weight 0.06, weak backing]. A second generator offers single and batch hashing [https://miniwebtool.com/fnv1a-hash-generator/, weight 0.58]. These are utility pages, useful for spot checks, not for normative claims.

## What the identity layer asserts

Three points survive contact with the sources:

1. FNV-1a-64 is a specified, fast, non-cryptographic fingerprint with an IETF draft reference and trivially portable implementations [https://www.ietf.org/archive/id/draft-eastlake-fnv-21.html, weight 0.83].
2. Non-cryptographic means collisions are possible by construction, so the ordinal remains the only injective identity; the histogram of hash collisions is measurement output, not an error [https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function, weight 0.81].
3. Where a stable cross-system content key is required, deduplication practice standardizes on SHA-256 over content bytes [https://transloadit.com/devtips/efficient-file-deduplication-with-sha-256-and-node-js/, weight 0.56].

## Sources considered

| Source | Weight |
|---|---|
| IETF draft-eastlake-fnv-21 | 0.83 |
| Fowler-Noll-Vo hash function, Wikipedia | 0.81 |
| sindresorhus/fnv1a (GitHub) | 0.76 |
| Deduplication considerations, RelativityOne | 0.62 |
| FNV-1a hash generator, miniwebtool | 0.58 |
| Efficient file deduplication with SHA-256, Transloadit | 0.56 |
| fnv-1a-64bit-collisions study repo | 0.30 |
| FNV-1a hash generator, freetoolscorner | 0.06 |
