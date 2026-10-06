# 01 - Connection row inventory

Scope: the connection rows that exist for the Cloudflare provider, which row currently works, and the dated dead-row history that explains why the table looks the way it does. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc). This is an internal-record subtopic, no dig: the inventory documents the Sauna environment's own stored connection rows, and the source doc is the record of record.

## The shape of the inventory

Six connection rows exist for Cloudflare. As of 2026-09-21, exactly one works: the managed connector row `conn_pd_apn_1KhdoD7`, appName "Cloudflare", appSlug `cloudflare_api_key`, added 2026-09-21 and verified with a `GET /accounts` call returning 200 (source doc). The skill's instruction is to route every Cloudflare call through that row and to pin the header `X-Sauna-Connection-Id: conn_pd_apn_1KhdoD7` while the four dead same-host rows still exist (source doc).

The remaining five rows are all recorded as non-functional, each with a distinct failure signature (source doc):

- `conn_x7vt48bbDCmj` worked when it was added on 2026-09-04 and was verified through 2026-09-06. On 2026-09-21 every call returned `code 9109 Invalid access token`, meaning the token expired or was revoked. The source doc marks it "do not trust without a fresh `GET /accounts` check".
- `conn_GgxyXnYTg53J`, `conn_3q0lnKopzUjk`, `conn_WvQf4m8LKf1s`, and `conn_IDyE2Xmk0AsM` are dead: every proxied call returns 400 `error 6111: Invalid format for Authorization header`. The stored value is malformed. Both "Cloudflare (steady-orbit)" rows created on September 21 landed with the same defect, including the one created through the OAuth flow. The source doc's instruction: do not waste calls on them.

## Why the history matters

The table is not a static list of credentials; it is a lifecycle record. Three rows have held the "working" position across the file's history: the manual api_key row `conn_x7vt48bbDCmj` (working 2026-09-04 through 2026-09-06), and the managed connector row `conn_pd_apn_1KhdoD7` (working as of 2026-09-21). Two prior working rows died, which is why the skill teaches that the working row id churns and must never be pinned from memory (source doc).

The four 6111 rows are not transient failures. 6111 is a defect in the stored Authorization value, so no retry will fix it (source doc). Only re-creation of the row, through a flow that stores the credential correctly, changes a 6111 row's status. That is why the inventory separates "expired token" (9109, fixable by re-authentication) from "malformed stored value" (6111, fixable only by row re-creation).

## Operational rules derived from the inventory

1. Before any Cloudflare work in a session, re-run the health check `GET /client/v4/accounts` through the currently-listed working row; a fresh 200 is the only pass condition (source doc).
2. If the working row id has changed since the last session, update the dead/working table in the same session (source doc).
3. When a new row lands, date its line: added date, verification endpoint, and result (source doc).

The full resolution note for the OAuth-create defect and how it changes default row-creation strategy is covered in doc 09 (connector selection). The error codes themselves are covered in doc 04.
