# 03 Storage and data products

Scope: the "I need to store data" decision tree from the source doc, the selection criteria behind each row, and doc-backed detail on the three products the dig reached most deeply.

## The tree as the source doc states it

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) routes storage by data shape:

- Key-value for config, sessions, cache: kv/
- Relational SQL: d1/ (SQLite), or hyperdrive/ for existing Postgres or MySQL
- Object or file storage, S3-compatible: r2/
- Versioned file trees such as repos, build outputs, checkpoints: artifacts/
- Message queue for async processing: queues/
- Vector embeddings for AI and semantic search: vectorize/
- Strongly consistent per-entity state: durable-objects/ (DO storage)
- Secrets management: secrets-store/
- Streaming ETL to R2: pipelines/
- Managed Apache Iceberg catalog on R2: r2-data-catalog/
- Serverless SQL analytics over Iceberg tables: r2-sql/
- Persistent cache with long-term retention: cache-reserve/

The criteria are shape (key-value, relational, object, queue, vector), consistency class (eventual versus strongly consistent per entity), sensitivity (secrets get their own store), and analytics layering (raw objects, catalog, SQL).

## KV: the doc-backed selection guidance

The storage-options docs (weight 0.94, https://developers.cloudflare.com/workers/platform/storage-options/, updated days before collection on 2026-10-06) give the concrete KV rule: use Workers KV for storing session data, credentials (API keys), and configuration data that are read at high rates (thousands of RPS or more), are not typically modified (within KV's 1 write per second per unique key limit), and do not need to be immediately consistent. That sentence supplies the three-axis test the tree implies: read rate, write rate, consistency requirement. Note that the docs recommend KV for credential-shaped data while the source doc routes secrets to secrets-store/; the docs row is about the KV access pattern, the tree row is about secret lifecycle, and both can apply to the same value.

## The Iceberg stack: Pipelines, catalog, SQL

Three high-weight docs confirm the bottom rows of the tree as one connected stack. The R2 SQL end-to-end pipeline tutorial (weight 0.94, https://developers.cloudflare.com/r2-sql/tutorials/end-to-end-pipeline/, updated 2026-09-04) demonstrates a complete data pipeline using Cloudflare Pipelines, R2 Data Catalog, and R2 SQL. The R2 SQL get-started docs (weight 0.95, https://developers.cloudflare.com/r2-sql/get-started/) show the enabling step: on an R2 bucket's Settings tab, enable R2 Data Catalog, then note the Catalog URI and Warehouse name. The Cloudflare data platform product page (weight 0.51, https://www.cloudflare.com/products/data-platform/) describes the same stack at the marketing layer: stream events via Pipelines, catalog tables with Apache Iceberg, query with R2 SQL or any compatible engine, without egress fees. The R2 SQL engineering post (weight 0.89, https://blog.cloudflare.com/r2-sql-deep-dive/) positions R2 SQL as a built-in, serverless way to run ad-hoc analytic queries against an R2 Data Catalog, built as a distributed engine with a metadata-driven planner and parallel execution.

## Weak comparators, labeled

The remaining dig results for the KV versus D1 versus R2 versus Durable Objects comparison are all weak (0.08 to 0.17). Cited as weak backing only: https://flaviocopes.com/tools/cloudflare-storage-chooser/ (weight 0.17), which frames the four primitives as optimized for different shapes and warns that picking wrong shows up as stale KV reads, D1 write limits, R2 used like a session store, or one hot Durable Object melting down; https://blog.birdor.com/cloudflare-tutorial-part-6-kv-r2-d1-storage/ (weight 0.13); https://eastondev.com/blog/en/posts/dev/20260422-cloudflare-workers-kv-guide/ (weight 0.12); https://stackharbor.com/en/knowledge-base/cf-workers-kv-d1-r2-decision/ (weight 0.10); https://www.cipher.co.th/en/blogs/cloudflare-storage-services-explained/ (weight 0.10); https://zairalabs.ai/guide/tools/cloudflare-pipelines/ (weight 0.08), which describes Pipelines use cases (clickstream ingestion with SQL filtering, log normalization before landing in R2, IoT telemetry with schema validation); and the community post (weight 0.09, https://community.cloudflare.com/t/r2-sql-query-r2-data-catalog-tables-with-r2-sql-from-the-dashboard/938802) noting a dashboard SQL editor for R2 SQL. None of these contradict the high-weight docs; they are orientation, not authority.

The one structural takeaway: the tree's rows are not rivals. KV, D1, R2, queues, and the DO store answer different shapes, and the Iceberg stack (pipelines, r2-data-catalog, r2-sql) is a pipeline over R2 rather than a fourth blob store.
