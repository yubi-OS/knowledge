# 02 The Substrate: refs/*.md over the GitHub Contents API

Scope: what the skill enumerates, the single listing endpoint it uses, how pagination and per-file fetches work, the file-size aggregation weight, the naming convention, and the API budget. Source doc: yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md.

## One endpoint, paginated

The source doc specifies a single sub-corpus source, corpus_as_ref, via GET /repos/{r}/contents/refs?per_page=100, returning name, size, sha, and type per file plus path. For each file the full body comes from GET /repos/{r}/contents/refs/{name} (Contents API) or GET /repos/{r}/raw/refs/{name} (raw). The list endpoint's size field is the file's byte length and is used as the weighted-aggregation weight in the 9-D coverage roll-up.

Official GitHub documentation confirms the endpoint surface. The Contents API reference covers "Get repository content", which returns a file or directory listing, and notes a 1,000-file upper limit per directory listing, with the Git Trees API recommended beyond that (weight 0.62, docs.github.com/en/rest/repos/contents). The pagination reference documents per_page and page parameters and the Link header, which is included automatically, with scripting guidance for fetching multiple pages (weight 0.44, weak, docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api). A community discussion confirms default page sizes vary by endpoint but the per_page maximum is 100 across the REST API (weight 0.10, weak, github.com/orgs/community/discussions/69826). This matches the source doc's note that 130+ file repos require pagination via ?per_page=100&page=N and that the skill auto-paginates.

## Per-file full body fetch is mandatory

The source doc's architectural choices are explicit: never use the list endpoint's truncated fields; always fetch the full doc, because the Contents API returns content base64-encoded and the raw endpoint returns it plain. The 9-D coverage regexes (see doc 03) run on body text, which the list response does not carry. The source doc also records that size: 0 files exist in refs/ (cycle stubs awaiting fill) and must not be skipped: their coverage is the zero vector, and sparse-cell detection surfaces them correctly.

## Naming convention

Per PROJECT_RULES.md line 43 (memory/github-yubios-KS9n5GAT), refs/ files are named lowercase-hyphenated-topic-name-YYYY-MM-DD.md: topic first, date last. Examples from the source doc: bootc-upgrade-rollback-sysext-portable-test-spec-2026-08-04.md, hyperspherical-harmonic-curve-2026-08-05.md, repo-history-skill-cycle-4-2026-08-07.md. The reverse pattern (YYYY-MM-DD_topic_name.md) is the general documents/ rule and does not apply to refs/. Subagents that propose doc names with the wrong pattern need a rename before push (source doc, Key Assumptions item 9).

## Observed corpus shape

The source doc records the yubiOS refs/ corpus as of 2026-08-07: 129 files, 1.55 MB total, all dated 2026. The top-15 topic prefixes by first dash-segment: repo 7, yubios 6, curve 5, systemd 5, arm64 4, bootc 4, learned 4, days 3, prior 3, workflow 3, adr 2, customer 2, docker 2, external 2, first 2. The corpus is wide but shallow: many topics, each with 1 to 7 docs; the largest file is slsa-l3-sbom-cosign-integration-spec-2026-08-04.md at 82 KB and the median is about 8 KB. The deep-research hook exists precisely to fill sparse cells: when a topic is underrepresented (1 doc or none), the cycle dispatches parallel subagents to author a new doc.

## API rate-limit budget

The source doc states the authenticated GitHub rate limit is 5,000 requests per hour and that a full yubiOS refs/ sweep costs about 130 calls (1 listing + 129 fetches), well under budget. External corroboration: GitHub's rate-limit documentation states 5,000 requests per hour for authenticated REST use (weight 0.28, weak, docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) and an older docs page confirms 5,000 per hour authenticated versus 60 per hour unauthenticated (weight 0.40, weak, docs.github.com/en/enterprise-server@2.21/rest/overview/resources-in-the-rest-api). The community discussion adds that GitHub Enterprise Cloud orgs get 15,000 per hour for OAuth apps (weight 0.08, weak, github.com/orgs/community/discussions/163553). Treat the dig corroboration as weak backing; the 5,000 figure itself is stated in the source doc.

## Credential assumption

The source doc pins the credential: conn_3h7rj41VF6hs ("MASTER GIT SU", fine-grained PAT, verified live 2026-07-24, expires 2027-07-25), the sole GitHub credential per PROJECT_RULES.md line 33. If the PAT lacks Contents: Write or Metadata: Read, the cycle fails before Stage 1 and must be surfaced, not worked around (source doc, Key Assumptions item 2).

Note on source quality: only 1 of the 12 dig results for this subtopic weighted 0.62 (the Contents API reference); the rest weighted below 0.5 and are labeled weak. Claims from the source doc are attributed to it and are the grounding spine of this doc.
