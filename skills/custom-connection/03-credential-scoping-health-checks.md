# 03 - Credential scoping and health checks

Scope: why the stored Cloudflare credential is account-scoped rather than a user-level API token, which endpoints fail for that reason, and which endpoint is the correct whoami and health check. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc).

## The scoping fact

The credential behind the working Cloudflare row is account-scoped, not a user-level API token (source doc). Scoping determines which API surface the token can address, and therefore which endpoint works as a health check. Cloudflare's own permission model scopes API tokens to user, account, and zone resource classes, with a separate permission set per class (https://developers.cloudflare.com/fundamentals/api/reference/permissions/, jev 0.94).

## The three failures that are expected, not errors

The source doc records three endpoint failures that this account-scoped credential produces, and warns against misreading any of them as a broken connection:

- `GET /client/v4/user/tokens/verify` returns `{"code":1000,"message":"Invalid API Token"}`. This always fails on this credential and must never be used as the health check (source doc).
- `GET /client/v4/user` returns 9109; user-level scope is absent (source doc).
- `GET /client/v4/memberships` returns 9106; user-level scope is absent (source doc).

The verify failure is the classic false positive. Cloudflare documents `/user/tokens/verify` as the standard way to test a user API token: the token creation flow even shows the curl command to run against it (https://developers.cloudflare.com/fundamentals/api/get-started/create-token/, jev 0.95). The endpoint is built for user-level tokens, so an account-scoped credential is structurally the wrong input for it. The failure says nothing about whether the account-scoped credential still works.

## The correct health check

`GET /client/v4/accounts` returns 200 with the account list on a working credential (source doc). That is the whoami and health check to use, every session, before trusting the row. A fresh 200 is the only pass condition (source doc).

This maps to the general rule for scoping-aware health checks: pick a whoami endpoint that lives at the same scope level as the credential. For an account-scoped Cloudflare token, that is an account-level route like `/accounts`, not a user-level route like `/user` or `/user/tokens/verify`.

## The health-check quirk, stated as a rule

The source doc titles this "health-check quirk (don't misread it as broken)" (source doc). The operational form:

1. Never validate a Cloudflare connection row with `GET /client/v4/user/tokens/verify`. A code 1000 failure there is a scoping mismatch, not a dead credential (source doc).
2. Never validate with `/client/v4/user` (9109) or `/client/v4/memberships` (9106). Same scoping reason (source doc).
3. Validate with `GET /client/v4/accounts`. A 200 plus a non-empty account list is the pass condition (source doc).
4. If `/accounts` itself returns 9109, the token is expired or revoked and the row needs re-creation; that reading belongs to the error-code table in doc 04 (source doc).

The account the credential addresses, and how to inventory what that account holds, is doc 05's subject.
