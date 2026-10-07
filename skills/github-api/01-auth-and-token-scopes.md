# 01 auth-and-token-scopes

Scope: how every GitHub REST call in the yubi-OS org authenticates: the personal access token (PAT) Bearer pattern, the fixed header set, fine-grained PAT permissions, and the single-credential discipline the source doc mandates.

## Ground spine

Every claim in this corpus grounds in the source doc `yubi-OS/yubiOS skills/github-api/SKILL.md` (fetched 2026-10-07) plus searXNG dig results weighted by the jev-1.13 decision model. The source doc cites https://docs.github.com/en/rest as its upstream reference.

## The Bearer pattern

The source doc fixes the header set for all GitHub calls: `Authorization: Bearer <PAT>`, `Accept: application/vnd.github.v3+json`, and `Content-Type: application/json`, with the org base URL `https://api.github.com/repos/yubi-OS/yubiOS` (source doc). This is the pattern the source doc repeats in every subsequent code sample, so it functions as the skill's contract for how requests are framed, not just one optional configuration.

GitHub's own REST documentation confirms the token-first framing: "To authenticate your request, you will need to provide an authentication token with the required scopes or permissions" and lists the ways to obtain one: create a personal access token, generate a token with a GitHub App, or use the built-in GITHUB_TOKEN in a workflow (https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api, weight 0.97). For yubi-OS the first of those three options is the operative one, because the skill is used from scripts and agent sessions rather than inside Actions workflows.

## Fine-grained PATs and permissions

The source doc describes the credential as a fine-grained PAT and resolves the `workflow` scope constraint in its favor. GitHub's fine-grained PAT documentation adds the mechanism behind that constraint: "Permissions define what resources the token can access via the API", and to help choose correct permissions the REST API returns an `X-Accepted-GitHub-Permissions` header in responses (https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens, weight 0.94). That header is a practical diagnostic: when a call fails with an authorization error, the response tells you which permission the missing token needed, which turns scope debugging from guesswork into reading one header.

The fine-grained model is what makes the single-credential rule workable: the token carries exactly the repo scopes the org automation needs, so the same connection can be passed on every call without over-granting.

## Single-credential discipline

The source doc is explicit: the ONLY GitHub credential is `conn_3h7rj41VF6hs` ("MASTER GIT SU", a fine-grained PAT), it must be passed on every GitHub call, and there is no fallback. The note records that the connection was re-established 2026-08-12 (source doc). The org constants section repeats the same rule: the sole token applies to ALL GitHub calls, including `.github/workflows/*.yml` writes (source doc).

Two practical consequences follow from the source doc's wording:

1. No secondary token, no ambient `GITHUB_TOKEN` fallback, no per-service split. A script that needs to touch GitHub reaches for MASTER GIT SU or does not run.
2. Because one credential covers everything, a scope problem on one call type (for example a workflow-file write) is a token-configuration problem, not a reason to mint another credential. The fix path is re-scoping the same fine-grained PAT.

## What the dig surface looked like

The dig for this subtopic returned 12 results across 2 queries. Ten of the twelve were homepage, sign-in, blog, or social pages with jev weights from 0.05 to 0.20, all correctly rejected by the noul weighting as not citable. The two authoritative GitHub docs carried the content above at weights 0.97 and 0.94. The signal-to-noise ratio here is the expected shape for a topic dominated by a single vendor's documentation: the official docs rank first for quality even when the raw result list is cluttered, and the weighting pass is what makes that separation mechanical rather than editorial.

## Failure behavior to expect

The source doc's error-handling section does not list a 401 branch, but its posture implies one: an auth failure means the request was framed without the credential or with a token missing the needed permission. The response header named above (X-Accepted-GitHub-Permissions, weight 0.94) is the fastest way to distinguish those two cases without touching credential configuration.
