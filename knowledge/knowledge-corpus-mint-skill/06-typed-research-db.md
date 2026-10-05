# 06. The typed research database

Scope: Designing the typed research database that ships with a corpus: preflight record, outline with validation answers, per-result archive with decision records, per-dig records, and a request log, with TypeScript interfaces mirroring each JSON shape.

A minted corpus ships with a research DB alongside its docs, and the design problem is a provenance data model. The canonical conceptual model is W3C PROV: PROV-DM is the conceptual data model that forms the basis for the W3C provenance family of specifications, and PROV-JSONLD is a serialization of PROV in JSON that uses JSON-LD to define a semantic mapping (weight 0.92, https://www.w3.org/submissions/prov-jsonld/). The PROV model itself is a non-cyclic DAG based on three main object types: Entity, Activity, and Agent (weight 0.66, https://ogcincubator.github.io/bblock-prov-schema/). Mapping that model onto a mint research DB: entities are the search results and the docs, activities are the digs and the jev decisions, and agents are the decision model and the author subagents. The mint research DB does not adopt the PROV-JSONLD serialization, but it inherits the shape: every produced artifact carries a pointer back to the activity and agent that produced it.

A lighter-weight precedent for shipping provenance as a JSON file inside a repo exists in the ML lineage. The model_provenance.json specification contains guidelines for documenting data, features, hyperparameters, and evaluation for time-based predictive ML problems under ML 2.0 principles (weight 0.64, https://github.com/HDI-Project/model-provenance-json). The mint's research DB applies the same idea at the corpus scale: one directory of JSON files, one per concern, checked into the repository next to the docs they explain.

The six-file layout is as follows, each file with a matching TypeScript interface so the shapes are checked rather than assumed:

1. `preflight.json`, interface `PreflightRecord`: the date, the searXNG probe URL with result count and any unresponsive engines, and the decide endpoint URL with its model name and probe answer. This is the health snapshot taken before any real work.
2. `outline.json`, interface `OutlineRecord`: the topic, the subtopic list with number, slug, scope, and seed queries, and the full validation block: metric name, criteria list, model, per-question answers with score, probabilities, confidence, and legend, usage tokens, and the dropped and kept subtopic lists.
3. `archive.json`, interface `DugResult[]`: one entry per collected result with its query, title, url, snippet, collection timestamp, weight (null until weighted), the full decision record including the raw answer object and usage tokens, and a `redo_of` index when the entry was rescored.
4. `digs/<NN>-<slug>.json`, interface `DigRecord`: per-dig record with queries attempted (query, attempt number, raw count, kept count), redo count, a redo log with reasons, the kept result URLs, and an outcome of authored or skipped with a skip reason.
5. `jev-log.json`, interface `JevLogEntry[]`: one entry per jev HTTP request with timestamp, endpoint, state, model, question count, question names, metric types, and usage tokens.
6. `db.ts`: the TypeScript interface definitions themselves, with a comment mapping each file to its interface.

The choice of TypeScript interfaces rather than JSON Schema is grounded in the language's own documentation: interfaces describe the shape of an object so the type checker can catch missing or mismatched fields (weight 0.94, https://www.typescriptlang.org/docs/handbook/interfaces.html), and TypeScript is the typed superset of JavaScript that makes such static shape checking the default development experience (weight 0.96, https://www.typescriptlang.org/; additional documentation entry point at weight 0.95, https://www.typescriptlang.org/docs/). Interfaces are a compile-time construct, which is the right strength here: the JSON files are data, but the db.ts file makes the contract explicit and greppable without imposing a runtime validator.

For teams that do want portability across tool chains without infrastructure, the dataprov library documents the position that simple, portable provenance should work across heterogeneous tool chains including Python, R, and shell scripts, and non-Git workflows (weight 0.75, https://github.com/RI-SE/dataprov). Plain UTF-8 JSON satisfies that portability requirement for the mint DB: no base64-encoded file content, no proprietary serialization, parseable by any standard JSON reader.

Two anti-patterns are excluded by design. Document databases with optional schemas, such as MongoDB as commonly deployed, would hide the schema instead of stating it (weight 0.14, weak backing, https://handwiki.org/wiki/Software:MongoDB). And generic metadata vocabularies describe the content rather than the decision trail; the research DB exists specifically to store the decisions, including their probabilities and usage tokens.

## Sub-claims

1. PROV-DM is the conceptual provenance model and PROV-JSONLD its JSON serialization (weight 0.92, https://www.w3.org/submissions/prov-jsonld/).
2. PROV is a DAG over Entity, Activity, and Agent object types (weight 0.66, https://ogcincubator.github.io/bblock-prov-schema/).
3. Shipping provenance as a JSON file next to the artifact is an established ML 2.0 practice (weight 0.64, https://github.com/HDI-Project/model-provenance-json).
4. TypeScript interfaces make data shapes statically checkable and greppable (weight 0.94, https://www.typescriptlang.org/docs/handbook/interfaces.html).
5. Portable provenance should not require infrastructure dependencies (weight 0.75, https://github.com/RI-SE/dataprov).
6. Plain UTF-8 JSON with no base64 content keeps the DB parseable by any standard reader (mint contract; enforced by post-push re-parse verification).
