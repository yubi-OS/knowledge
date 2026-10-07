# Token Format and Serialization

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). The strongest external confirmation here is the OpenAI embeddings documentation (weight 0.73, authoritative).

## Scope

The canonical JSON token envelopes per class, the versioning rule, the serialization rule, and the three inline test vectors. This is the substrate's wire contract: the thing that makes paired skills interoperate.

## Why a wire contract exists

The source doc closes Gap 1 (output serialization format unspecified) with this section. Without a canonical format, paired skills cannot interoperate: `context-isolation`'s token-passing pattern (a parent passes a token instead of full text to a fresh-context subagent) only works if both sides agree on the envelope shape.

## The three envelopes

**Hash tokens** serialize as a hex-encoded string of the digest bytes:

```json
{
  "class": "hash",
  "algo": "sha256",
  "digest": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "length_bytes": 32
}
```

**Embedding tokens** serialize as a base64-encoded float vector with a model identifier and version stamp:

```json
{
  "class": "embedding",
  "model": "sentence-transformers/all-MiniLM-L6-v2",
  "model_version": "1.0.1",
  "vector_b64": "iVBORw0KGgoAAAANSUhEUgAA...=",
  "dim": 384,
  "metric": "cosine"
}
```

**Hybrid tokens** combine both, with optional metadata:

```json
{
  "class": "hybrid",
  "hash": { "algo": "sha256", "digest": "e3b0c44..." },
  "embedding": { "model": "sentence-transformers/all-MiniLM-L6-v2", "model_version": "1.0.1", "vector_b64": "...", "dim": 384, "metric": "cosine" },
  "metadata": { "source_path": "<placeholder>", "intake_ts": "2026-07-31T21:30:00Z" }
}
```

The embedding envelope's design mirrors production practice: embedding APIs return vectors as JSON arrays over a transport where base64-style encodings carry binary payloads (https://developers.openai.com/api/docs/guides/embeddings, weight 0.73, authoritative). Base64 itself is the standard binary-to-text encoding that uses 64 printable characters to represent each 6-bit segment of a byte sequence (https://en.wikipedia.org/wiki/Base64, weight 0.25, weak). The float32 carrier matters at scale: a pervasive ecosystem issue with vector storage is float bloat, where implementations store vectors at more precision than the model produced (https://bonsai.io/blog/float-bloat/, weight 0.23, weak). The NumPy float32 dtype is the canonical in-memory representation the base64 field would wrap (https://numpy.org/doc/stable/user/basics.types.html, weight 0.19, weak; https://numpy.org/, weight 0.29, weak).

## The versioning rule

Every token carries the model and model_version it was derived from. A token's `compare()` verdict is only valid between tokens of the same model_version, or between tokens both marked as `legacy` with explicit cross-version semantics. When the embedding model is upgraded, all old tokens get a `legacy: true` flag and a `legacy_model_version` reference; new tokens use the new model (source doc).

This is the substrate's migration story (expanded in doc 06). The practical consequence: two tokens with identical text but different model_version values must not be compared by default. The similarity score would be numerically produced but semantically meaningless.

The external analogue is the metric-learning pattern of backward-compatible training, updating embedding models while keeping new embeddings comparable with previously stored representations (https://distilledpatterns.org/patterns/metric-learning/, weight 0.30, weak). The substrate takes the opposite, simpler stance: never silently comparable; cross-version compare requires explicit caller consent.

## The serialization rule

All tokens are JSON objects with at minimum `class` (one of `hash`, `embedding`, `hybrid`) and the class-specific required fields. Optional fields like `metadata` are caller-defined and must not be required by the substrate. Unknown fields are ignored by the substrate but preserved on round-trip through `recall()` (source doc).

JSON is the right carrier for this rule: it is an open standard file format and data interchange format, language independent (https://en.wikipedia.org/wiki/JSON, weight 0.20, weak; https://www.json.org/json-en.html, weight 0.15, weak). The preserve-on-round-trip clause is what lets callers stash arbitrary provenance in the envelope without breaking forward compatibility.

## The three test vectors

The substrate ships three canonical test vectors, embedded inline in the source doc (this closed Gap 7; the previous text referenced an external `references/test-vectors.json` that did not exist):

1. **Hash test vector.** Input: `"hello world"`. Output (sha256): `{"class":"hash","algo":"sha256","digest":"b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9","length_bytes":32}`. Hash tokens round-trip exactly.
2. **Embedding test vector.** Input: `"hello world"`, model `sentence-transformers/all-MiniLM-L6-v2` v1.0.1, dim 384, metric cosine. The envelope shape is canonical; exact byte values depend on the runtime. Embedding tokens round-trip with a tolerance of 1e-6 for float precision.
3. **Hybrid test vector.** Input: `"hello world"`. Hash token + embedding token + empty metadata, combined per the hybrid envelope.

The tolerance asymmetry is deliberate: hashes are exact by construction, embeddings are floats and therefore approximate.

## Wire-contract properties

Three properties the contract gives callers:

1. **Self-describing.** A consumer can determine the class, model, and version of any token without consulting the producer.
2. **Strict compare semantics.** Same-model-version tokens compare; cross-version tokens need explicit legacy semantics.
3. **Lossless round-trip of unknown fields.** The substrate never silently drops caller metadata on `recall()`.

These properties are what make the token the unit of cross-context transfer: a token that arrives over the wire carries everything needed to decide how it may be used, and nothing that forces the receiver to read the source text.
