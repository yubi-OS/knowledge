# 03 - Metadata from live settings and bindings

Scope: rebuilding multipart metadata from the live settings endpoint, the `keep_bindings` error 10021 trap, and what bindings mean at deploy time.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## Metadata comes from live settings, never from memory

Step 4 of the source-doc sequence: `GET .../scripts/steady-orbit/settings` returns the worker's live settings, and the multipart metadata is rebuilt from that response:

```
jq -c '{main_module:"solar-rbs-entry.mjs",
        compatibility_date:.result.compatibility_date,
        bindings:.result.bindings}' settings.json > meta.json
```

Three fields, no more. The guideline behind it (guideline 2 in the source doc) is "metadata comes from live settings; bindings are never hand-typed". The worker carries 13 bindings as of 2026-10-01 (AI, DB, SITE, VEC, EVEC, WEBSITE_RATE_LIMIT plus 7 `secrets_store_secret` entries), and hand-typing any of them risks a deploy that passes syntactically but breaks at runtime.

The two settings fields are stable platform concepts. Cloudflare documents `compatibility_date` as the setting that pins which runtime behavior a worker gets [0.75](https://developers.cloudflare.com/workers/configuration/compatibility-dates/), and compatibility flags are set through the request body's metadata field on the Workers Script API [0.67](https://developers.cloudflare.com/workers/configuration/compatibility-flags/). Bindings are how a worker reaches account resources without the worker holding credentials; the platform embeds the permission in the binding itself so secrets never appear in worker code [0.7](https://developers.cloudflare.com/workers/runtime-apis/bindings/).

## The keep_bindings trap

The source doc is categorical: do NOT include `keep_bindings` in the metadata. The reason is a type error: invalid type mix, Cloudflare error 10021. A metadata object built from a settings response naturally contains structured binding objects; adding `keep_bindings` to the same object produces a mixed type the API rejects.

Error 10021 is a deploy-time error family in the Workers platform: Cloudflare documents it as covering errors that occur when the platform attempts to load and run the worker's top-level scope after a deploy attempt [0.45](https://developers.cloudflare.com/workers/observability/errors/) (weak backing on the exact 10021 boundary, but it confirms the family is deploy-load related). Community reports show the same error number surfacing for malformed module bundles, including the classic "Main module name is not present in bundle" upload failure [0.07](https://stackoverflow.com/questions/79448964/cannot-upload-worker-script-using-cloudflare-api-main-module-name-is-not-pr) (weak backing).

The practical rule: the metadata for this worker is exactly the three fields above. Anything else added to the PUT metadata is untested territory and has a recorded failure behind it.

## Bindings at deploy time versus runtime

The source doc draws a hard line: secrets never ride the upload. They resolve from the Secrets Store bindings at runtime via `await env.BINDING.get()`. The platform design supports this: Secrets Store stores account-level secrets encrypted across all Cloudflare data centers, and workers reach them through bindings rather than inline values [0.62](https://developers.cloudflare.com/secrets-store/integrations/workers/).

There is also a deploy-time coupling the source doc turns into a rule: bindings referencing a not-yet-existing Secrets Store secret fail the whole deploy with CF error 10182. Add the binding only after the secret lands. This is consistent with the platform's access model, where binding a secret to a worker is treated as an operation on the secret itself and requires edit rights to it [0.31](https://developers.cloudflare.com/secrets-store/access-control/).

The runtime side is equally explicit in the source doc: secrets resolve lazily at runtime through `await env.BINDING.get()`, so the upload payload contains binding names only. Workers secrets documentation describes the same separation between secret storage and worker configuration [0.69](https://developers.cloudflare.com/workers/configuration/secrets/).

## Why verbatim matters

The instruction to copy `bindings:.result.bindings` verbatim is load-bearing. Two failure shapes are on record:

1. Hand-typed bindings drift from live settings (a renamed KV namespace, a rotated secret id) and the deploy succeeds while the worker breaks at first request.
2. Transformations of the settings response (dropping fields, reordering, wrapping in json.dumps-style serialization) introduce types the API rejects.

The rebuild is deliberately a single jq projection of three scalar fields plus one verbatim array. The less code that touches the bindings array, the fewer deploys it breaks.
