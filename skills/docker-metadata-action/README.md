# skills/docker-metadata-action knowledge corpus

Explicates the yubiOS skill **docker-metadata-action** (ground source: yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md, fetched 2026-10-06, 8887 B): generating OCI-compliant Docker image tags and labels automatically from Git metadata (branch, tag, SHA, PR) in GitHub Actions, and the tag-generation discipline the skill teaches.

## Docs

- [01-when-to-use.md](01-when-to-use.md) — when the action is the right tool: the hardcoded-tags problem, placement before build-push-action, trigger surface, multi-registry behavior, and the v5 to v6 upstream drift.
- [02-tag-types.md](02-tag-types.md) — the tag rule table: ref branch and PR tags, semver patterns, sha short and long, schedule, raw latest, and what GitHub context each reads.
- [03-outputs-integration.md](03-outputs-integration.md) — the five outputs (tags, labels, version, bake-file, json), the required step id, wiring into build-push-action and bake-action.
- [04-auto-oci-labels.md](04-auto-oci-labels.md) — the five auto-generated org.opencontainers.* labels, the yubiOS additions (containers.bootc=1, source, description, licenses), and annotations versus labels.
- [05-oci-annotation-spec.md](05-oci-annotation-spec.md) — the OCI image-spec annotations standard, the reserved org.opencontainers namespace, and the v1.1 drift.

## Skipped (outline validation dropped)

- yubios-supply-chain-pattern (score 0.29) — dropped by jev score validation; its facts are covered inside docs 01, 03, and 04, attributed to the source doc.
- primitive-placement (score 0.06) — internal-record subtopic (10-primitive coverage notes and changelog audit trail from curve-guided-rsi cycles 5 to 7); no dig, dropped as padding. The source doc carries this content.

## Research summary

- Results collected: 60 (top 6 per query, deduped by URL within subtopic, 10 queries over 5 web-shaped subtopics).
- Weight split: 37 high (>= 0.5) / 23 low (< 0.5).
- jev requests: 6 (1 outline score validation with 7 questions + 5 noul weighting batches of 14/14/14/14/4 questions), usage 6636 input / 1269 output tokens. Weighting ran on DefAPI direct (https://api.defapi.org/api/v1/decisions); zero 429s; the worker relay was not needed.
- Redos: 0. Digs came back healthy on the first pass.
- Skipped docs: 2 (see above). Gaps: none beyond the dropped outline entries.
- Internal-record subtopics: none authored (the one candidate, primitive-placement, was dropped at validation); all authored docs are web-research-shaped with digs.

## Metrics

score (outline) / noul (weighting) via typesafe/jev-1.13 on https://api.defapi.org/api/v1/decisions (DefAPI direct; steady-orbit /api/decide held as fallback, unused).

## Source attribution

Every doc cites the ground source doc for its grounding spine (yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md) plus dig results with URL and jev weight. Dated corrections: upstream README and Docker docs now pin metadata-action@v6 (source doc pins v5); the OCI v1.1 spec note. Weak (< 0.5) sources: none cited in body text.

## Preflight

2026-10-06: searXNG 559 results across 10 queries healthy; /api/decide (typesafe/jev-1.13 via DefAPI direct) 200 on all 6 requests.
