# 04 - Error-code discrimination

Scope: the Cloudflare API error codes the custom-connection skill has calibrated against, and what each code says about the stored connection row versus the request. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc).

## The core table

The source doc's calibration section distills its dead-row history into an error-code discrimination table (source doc):

- `6111`, "Invalid format for Authorization header": the stored Authorization value is malformed. This is a row defect. Stop retrying; only re-creating the row changes it (source doc).
- `9109`, "Invalid access token": the token expired or was revoked. The row needs re-creation, not retry either, but the cause is different from 6111: the stored value was once valid (source doc).
- Both codes are calibration signals about the row, not transient errors (source doc).

Two more codes appear in the source doc's account-inventory and patterns sections:

- `1000`, "Invalid API Token": returned by `GET /client/v4/user/tokens/verify` against this account-scoped credential. It signals an endpoint-credential scope mismatch, not a dead row (source doc; see doc 03).
- `7003`, "not a valid route": returned by `GET /accounts/{id}/domains`, which is not a valid API route at all (source doc; see doc 08).

## Why the discrimination matters operationally

A session that misreads the codes wastes calls or, worse, trusts a broken row. The four 6111 rows existed for weeks while every retried call kept failing with the same defect (source doc). The rule the skill encodes: on 6111, stop and mark the row dead immediately; on 9109, mark the row dead and plan re-creation; on neither, retry.

Dig corroboration: the 6111 message is real and reproducible outside this environment. A Cloudflare workers-sdk issue report records "Invalid format for Authorization header [code: 6111]" when a malformed Authorization value is sent (https://github.com/cloudflare/workers-sdk/issues/5175, jev 0.51). Cloudflare publishes per-product error-code references, which is the shape of source to consult when a code is new to you (https://developers.cloudflare.com/realtime/realtimekit/core/error-codes/, jev 0.93, though that page covers the Realtime product, not the core API).

## Reading a failure, step by step

1. Note the code and the endpoint. 1000 on the verify endpoint is a scoping artifact; the same credential returns 200 on `/accounts` (source doc).
2. If the code is 6111, the row's stored value is malformed. Stop retrying, mark the row dead in the connection table (doc 07), and switch to a known-working row (source doc).
3. If the code is 9109 on a previously-working row, the token expired or was revoked. Mark the row dead, and re-run the health check through the next candidate row (source doc).
4. If the code is 7003, the route itself is wrong; the credential may be fine (source doc).
5. Update the dead/working table in the same session the failure is observed (source doc).

## The distinction the table protects

Row defects (6111) and token expiry (9109) are both "this row is dead", but they fail differently downstream: a 6111 row can be created again through the correct flow and work immediately, while a 9109 row needs its upstream token re-issued before re-creation helps. The source doc's 2026-09-21 resolution note records exactly this: the four 6111 rows were created through ad-hoc or OAuth flows that stored the credential badly, while the row created through the standard connector worked (source doc; expanded in doc 09).
