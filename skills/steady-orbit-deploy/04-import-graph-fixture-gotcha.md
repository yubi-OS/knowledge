# 04 - Import graph verification and the fixture module gotcha

Scope: `node --check` plus import-graph resolution before every upload, and the path-qualified fixture part that a missing import turns into a whole-deploy rejection.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## Step 5 of the sequence: check imports before upload

Before any multipart PUT, the source doc requires two checks on the overlay set:

1. `node --check` on every part. This catches syntax errors in each module in isolation.
2. Resolve the import graph. Every `import` statement in every part must resolve to a part that is also being shipped.

The second check is the one that has actually bitten. On 2026-10-01, the jev-corpus deploy failed because a part imported `./fixtures/x.mjs` and the fixture module was not shipped as a part with its path-qualified name. Cloudflare rejected the whole upload with error 10021, "No such module".

## Why path-qualified names matter

In a multipart worker, a relative import like `import ... from "./fixtures/corpus-math-fixtures.mjs"` inside a module is resolved by the runtime against the uploaded part names. The part name must therefore match the import specifier including its directory path. The source doc shows the exact upload form:

```
-F "fixtures/corpus-math-fixtures.mjs=@file;filename=fixtures/corpus-math-fixtures.mjs;type=application/javascript+module"
```

The part name and the filename in the form field both carry the `fixtures/` prefix. Flattening the extracted tree would silently break this: the import would still say `./fixtures/...` while the shipped part would be named `corpus-math-fixtures.mjs`, and the platform would reject the upload.

The platform contract behind this: in a module-syntax worker, the uploaded parts form the module graph, and the runtime resolves imports across those parts. Cloudflare's module documentation describes how local modules and imports work in the module format, and the migration guide to module workers covers how the module graph replaces the single-script model [0.59](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/). The multipart metadata page defines the JSON metadata that accompanies such uploads [0.54](https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/).

## What 10021 means in practice

Cloudflare groups deploy-load failures under error 10021, covering what happens when the platform attempts to load and run the worker's top-level scope [0.45](https://developers.cloudflare.com/workers/observability/errors/) (weak backing on the exact boundary). Community reports of the same error number include "Main module name is not present in bundle", which is the same family: the upload parsed but the module graph or entry did not resolve [0.07](https://stackoverflow.com/questions/79448964/cannot-upload-worker-script-using-cloudflare-api-main-module-name-is-not-pr) (weak backing).

For steady-orbit the operative reading is the source doc's: a missing imported module rejects the entire upload, not just the importing part. There is no partial multipart deploy to limp along on.

## The pre-upload checklist distilled

The source doc's checklist before any PUT:

1. `node --check` every part that changed (and any part whose dependencies changed).
2. Walk the import graph of every shipped part. Every specifier must map to a part name in the same upload.
3. For path-qualified imports, confirm the part is uploaded with the path-qualified name and the module MIME type (`application/javascript+module`).
4. Only then run the upload (doc 05 covers what comes after).

One steady-orbit specific wrinkle from the source doc: the `jev-corpus-math.js` selfTest skips `visco_*` fixture kinds, which is why the fixture module's contents, not just its presence, matter to downstream behavior. The fixture part is part of the contract, not dead weight.

## Redo discipline for import failures

A 10021 "No such module" rejection is not a partial failure to patch after the fact. The correct response is to stop the deploy, re-run the import-graph resolution against the extracted tree, add or correct the path-qualified part, and re-PUT. The 2026-10-01 incident is the recorded precedent: the fixture part was added with its path-qualified name and the upload then succeeded.
