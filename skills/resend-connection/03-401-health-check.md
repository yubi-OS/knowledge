# 03. Reading the 401 as a health check

**Scope.** Why a restricted_api_key 401 is positive evidence that the credential path works end to end, how it differs from genuinely bad key errors, and how to use it as a probe without shipping a broken send.

## The inference chain

The source doc states the reasoning directly: the restricted_api_key error proves that the proxy injected the credential and that Resend authenticated it. The chain has three links, and each one is required for the signature to appear:

1. The proxy injected a credential into the request. A request with no credential cannot produce a scope error; it produces a missing-key error instead.
2. Resend parsed and accepted the key as a real key. An invalid key would produce an invalid-token error, not a scope error.
3. Resend evaluated the key's scope and found it insufficient for the read endpoint. Only a valid, authenticated, narrower-scoped key reaches this branch.

So the error sits at the end of the longest successful path a read request can take. It is failure at the scope check, which is exactly what the key was configured to do.

## What the alternatives look like

Resend's errors reference distinguishes the two 401 cases. A missing key returns "Missing API key in the authorization header" with the suggested action to include an Authorization header of the form Bearer YOUR_API_KEY (https://www.resend.com/docs/api-reference/errors, weight 0.91). The API reference introduction documents the expected header shape as Bearer re_xxxxxxxxx, where re_xxxxxxxxx is the API key (https://resend.com/docs/api-reference/introduction, weight 0.85). The source doc compresses this into its own rule: a genuinely bad key returns a different error, missing or invalid token.

A third-party error taxonomy makes the same cut from the debugging side: no Authorization header at all is the most common variant, often caused by a proxy or SDK stripping headers, and a header that is not in Bearer form is a separate failure mode (https://genace.ai/errors/missing-api-key, weight 0.05, weak backing, cite only as a checklist hint). In this workspace the proxy performs the injection, so the practical mapping is: missing-key errors point at the passthrough step (doc 06), while restricted_api_key errors point at nothing, because nothing is wrong.

## Using it as a probe

Because the signature is deterministic, it works as a cheap liveness probe for the whole chain: proxy, injection, Resend auth, and key validity all in one call. The probe costs one request to any read endpoint, for example `GET /domains`, and a restricted_api_key body is a pass. The full Resend error catalog is also published in machine-readable form through the docs llms-full endpoint (https://resend.com/docs/llms-full.txt, weight 0.57), which is useful when classifying an unexpected signature against the documented set.

Two cautions from the source doc. First, do not "fix" the error; it is by design, and the only correct response is to proceed with the send path. Second, the probe proves the credential path, not the send path. It says nothing about whether the from address is on a verified domain (doc 05), so a green probe does not remove the confirmation step before the first real send.

## Why this matters in practice

Without this reading, a natural failure loop looks like: call a read endpoint, see 401, conclude the connection is broken, escalate, and re-test. Each cycle wastes time and can end in someone requesting a broader key, which converts a deliberate least-privilege setup into an over-scoped one. With the reading, one call settles the question: the connection is alive and correctly scoped.
