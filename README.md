# yubi-OS knowledge

jev-weighted knowledge corpora minted from requests via the
`knowledge-corpus-mint` skill. Layout:

```
knowledge/<ref>/README.md       corpus index (doc list + scopes)
knowledge/<ref>/<NN>-<slug>.md  the docs, outline order
knowledge/<ref>/research-db/    archive.json + digs/*.json + db.ts
```

Every factual claim in a doc carries a source URL and the jev-1.13
quality weight that backed it. `research-db/` holds the full collection
record (per-result weights, task_ids, costs) so any corpus is auditable
months later.

Minted 2026-09-29: [`yubios`](./yubios/README.md)
