# Full-text measurement and ingestion hardening

Scope: how the v0.2 audit rebuilt document ingestion, from Unicode-safe chunked embedding to a checksum-validating TAR parser, and what the measurement honestly covers.

## From file sampling to full-text measurement

The audited pipeline embeds every supplied byte of every document. Each document is split into chunks of at most 400 bytes on Unicode-safe boundaries, each chunk is embedded with a BGE model and mean-pooled, then the chunk vectors are byte-weighted and L2-normalized per document. Content-keyed SHA256 caching means an unchanged document is never re-embedded: the model, protocol and content hash form the cache key.

Mean pooling over token representations is the standard way embedding models collapse a token sequence into one vector; late chunking work notes that "many embedding models apply mean pooling to these token representations to output a single vector" (https://github.com/jina-ai/late-chunking, weight 0.912). BGE-M3 itself is documented as supporting dense, multi-vector and sparse retrieval in one model (https://huggingface.co/BAAI/bge-m3, weight 0.871; https://bge-model.com/bge/bge_m3.html, weight 0.853). Pooling strategy is a real design axis with dimensionality trade-offs (https://mbrenndoerfer.com/writing/embedding-models-architecture-pooling-selection, weight 0.505).

The audit is explicit about what the resulting measurement means: coverage describes submitted bytes, not lossless semantic preservation. Chunk pooling is lossy by construction, and the audit records that as a standing limitation rather than claiming semantic completeness.

## The TAR ingestion defects

The pre-audit ingestion accepted archives too trustingly. Binary entries and padding were not skipped, header checksums were not validated, truncated payloads were accepted, byte budgets could be exceeded, and PAX extended headers with their byte-length rules and long-name encoding were handled incorrectly, which also meant full literal file paths did not always survive the pipeline. Oversize and empty inputs were not explicit errors.

The hardened parser does all of the above explicitly: it skips binary entries and padding, validates header checksums, rejects truncated payloads and exceeded budgets, handles PAX byte lengths and long names, accepts pinned commit URLs, and preserves full literal file paths end to end.

PAX format details carry weak backing in this dig: the PAX extended-header mechanism for overcoming standard tar header limits is described for node-tar (https://deepwiki.com/isaacs/node-tar/3.5-pax-extended-headers, weight 0.401, weak), and the POSIX pax format specifies that the checksum field is "a checksum of all the bytes in the header, assuming that the chksum field itself is all blanks" (https://www.mkssoftware.com/docs/man4/pax.4.asp, weight 0.424, weak). Python-family tarfile documentation also records that pax "uses extra headers for information that cannot be stored otherwise" and that real archives exist with miscalculated checksums for non-ASCII fields (https://www.jython.org/jython-old-sites/docs/library/tarfile.html, weight 0.353, weak). These three sources back the general format facts; the specific parser defects and their repairs come from the audit record.

## Why checksum validation is not pedantry

Header checksum validation is the guard against exactly the truncation and corruption classes the audit found. The pax checksum rule quoted above is a byte-exact contract; a parser that skips it accepts archives a strict reader would reject, and a truncated payload looks identical to a valid one unless lengths are checked against actual bytes read. Budget enforcement bounds the work per document so one hostile or malformed archive cannot dominate a run.

## What the release includes

The release packages the shared numerical module, the full-text ingestion modules, the Worker source template, the browser client, a reproducible build and regression suites. The legacy FIT API and the Sauna-hosted mirror remain separate systems; this release targets Cloudflare. Ingestion now also accepts pinned commit URLs, which ties ingested bytes to a specific commit rather than a moving branch head.

## Honest limits

Two limits are recorded rather than repaired away. First, chunk-level mean pooling followed by byte weighting cannot preserve everything a full-context embedding would see; the corpus documents this as lossy pooling. Second, raising the explicit document limit to 200K bytes was driven by a real finding: three references of 73 to 83 KB exceeded the inherited 60K window and would have been clipped. After the raise, the full 159-file corpus re-verified at 1,852,755 UTF-8 bytes across 4,712 chunks with no clipped files (audit record).
