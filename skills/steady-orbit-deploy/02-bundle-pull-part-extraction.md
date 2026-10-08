# 02 - Bundle pull and part extraction

Scope: pulling the live multipart bundle as the rollback source and part source of record, splitting it into one file per part, and the overlay discipline that keeps unchanged parts byte-identical.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## Step 1 of the sequence: pull the live bundle

The source doc's deploy sequence begins with `GET /accounts/{account}/workers/scripts/steady-orbit`, which returns the multipart bundle. The response carries the module parts split on the response boundary, with each part's name in its `Content-Disposition` header. The doc's instruction is unconditional: save it unmodified before every change.

The saved bundle serves two roles at once:

1. Part source of record. The extraction from this bundle is what the next upload is built on top of, so the deployed set of parts is always derived from what is actually live, not from anyone's memory of it.
2. Rollback source. A rollback is a re-PUT of exactly this artifact (see doc 07).

The "never deploy from memory of the part list" guideline in the source doc is rule 1 in its guidelines section, and it exists because the part set drifts: 37 parts on 2026-10-02, 43 parts on 2026-10-06. An out-of-date local copy of the part list silently drops parts on the next upload.

## Extraction: one file per part name

Extraction splits the bundle response on the multipart boundary and writes one file per part, named by the part's `Content-Disposition` name. Two source-doc specifics matter here:

- The fixture part is not at the top level. It ships under the path-qualified name `fixtures/corpus-math-fixtures.mjs`, so the extracted tree must preserve that path, not flatten it (see doc 04 for why).
- Extraction must not transform bytes. The overlay step depends on the extracted files being byte-exact copies of the live parts, because unchanged parts ship byte-identical.

The platform's model of worker content supports this exactly: Cloudflare documents that a worker can be composed of multiple modules uploaded as separate parts, with modules that cannot be inlined into a bundle shipped alongside the entry [0.69](https://developers.cloudflare.com/workers/wrangler/bundling/).

## The overlay pattern

Step 3 of the source-doc sequence is the overlay: copy each new or edited part over the extracted set. Everything else ships byte-identical. This is the discipline that makes deploys reviewable and rollbacks exact:

- The diff for a deploy is exactly the files that were copied over the extracted tree. Nothing else changed.
- If an edit is wrong, reverting is mechanical: re-PUT the saved bundle.
- The 2026-10-06 router deploy illustrates the pattern at scale: 1 new part (`jev-router.js`) plus 6 patched parts (`jev-main.js`, `routes-jev.js`, `jev-decide.js`, `jev-verify.js`, `jev-gate.js`-related inline changes, and the corpus family updates), with the remaining roughly 36 parts untouched.

Overlay also enforces the entry-module rule: unless a new page route requires it, `solar-rbs-entry.mjs` is simply not in the overlay set, so it cannot drift.

## Version semantics behind the pattern

Cloudflare's versions and deployments model records every code or configuration change as a version, and the default wrangler flow creates a version and deploys it to 100 percent of traffic in a single step [0.74](https://developers.cloudflare.com/workers/versions-and-deployments/). Upload and deploy can be decoupled so a version is uploaded independently and released deliberately [0.79](https://developers.cloudflare.com/workers/versions-and-deployments/). The REST overlay flow is effectively the manual version of that decoupling: the pull is the current version's content, the overlay defines the new version's content, the PUT creates it, and verification (doc 05) confirms it.

Trigger-level changes are tracked separately from code on the platform: Cloudflare routes trigger changes (routes, domains, cron triggers) through their own management path rather than the script content upload [0.8](https://developers.cloudflare.com/workers/versions-and-deployments/deployment-management/). That is why the source doc verifies schedules as a distinct post-upload step instead of assuming the upload carried them.

## Failure modes this step prevents

- Deploying against a stale part list: prevented by always pulling first.
- Accidentally editing the entry module or unrelated parts: prevented by the overlay being the only write path.
- Losing the rollback artifact: prevented by saving the bundle unmodified before any change.
- Misnaming parts: prevented by deriving file names from `Content-Disposition` rather than assumptions.

The extraction step is cheap; skipping it is how a deploy becomes unrecoverable. The source doc treats it as mandatory, and the incident history behind the rules (Sep 21 entry replacement, the fixture-module 10021 failure of 2026-10-01) is what makes the cost of skipping it real.
