# 03 - Recovery mechanism: the 5-step procedure

Scope: the playbook's step-by-step recovery mechanism, from confirming the pin is dead through re-dispatching the builder at the new head, with the exact commands the source doc records.

Grounding spine: source doc yubi-OS/yubiOS playbooks/digest-bump-recovery.md. External mechanisms (GitHub Actions REST API, OCI manifest negotiation, skopeo) are grounded in searXNG digs with URL and jev weight; sub-0.5 results are labeled weak backing.

## The full procedure

The source doc records this command sequence verbatim (source doc):

```bash
REPO=yubi-OS/yubiOS

# 1. confirm the pin is actually dead
DIGEST=$(grep -oE 'sha256:[0-9a-f]{64}' Containerfile | head -1)
curl -sSI "https://quay.io/v2/fedora/fedora-bootc/manifests/${DIGEST}" \
  -H 'Accept: application/vnd.oci.image.index.v1+json' | head -1

# 2. fire the recovery group (204 = accepted)
curl -sS -X POST \
  "https://api.github.com/repos/${REPO}/actions/workflows/ci.yml/dispatches" \
  -H 'Accept: application/vnd.github+json' \
  -d '{"ref":"main","inputs":{"group":"fetches","reason":"stale fedora-bootc digest"}}'

# 3. verify the INNER runs, not just ci.yml
curl -sS "https://api.github.com/repos/${REPO}/actions/runs?branch=main&per_page=10" \
  | jq -r '.workflow_runs[] | "\(.id)\t\(.name)\t\(.path)\t\(.conclusion)"'

# 4. confirm the bump landed
curl -sS "https://api.github.com/repos/${REPO}/commits?path=Containerfile&per_page=1" \
  | jq -r '.[0] | "\(.sha[0:8]) \(.commit.message)"'

# 5. re-dispatch the builder at the new head
curl -sS -X POST \
  "https://api.github.com/repos/${REPO}/actions/workflows/ci_dev_image.yml/dispatches" \
  -H 'Accept: application/vnd.github+json' \
  -d '{"ref":"main","inputs":{"Docker_push":"false"}}'
```

(source doc)

## Step 1: confirm the pin is actually dead

The digest is extracted from the `Containerfile` with a `sha256:[0-9a-f]{64}` grep (source doc), then probed with an HTTP HEAD against `quay.io/v2/fedora/fedora-bootc/manifests/<DIGEST>` carrying the OCI image-index Accept header (source doc). The Accept header matters because registries negotiate manifest representation by requested media type; the OCI image spec defines the digest as a REQUIRED descriptor property of the targeted content (https://specs.opencontainers.org/image-spec/descriptor/, jev weight 0.66, high), so the probe is asking the registry for exactly the content object the pin names. A 404 here means the manifest is gone and the recovery must run; a 200 means the pin is alive and the failure lies elsewhere.

## Step 2: fire the recovery group

The recovery is a workflow dispatch against `ci.yml` with `inputs.group = fetches` (source doc). GitHub documents that workflows configured for the `workflow_dispatch` event can be run via the REST API (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow, jev weight 0.26, weak backing) and that the Workflows REST API covers triggering and inspecting repository workflows (https://docs.github.com/en/rest/actions/workflows, jev weight 0.17, weak backing). The playbook's own marker for a successful POST is an HTTP 204 accepted (source doc). The dispatch-discipline rules in doc 04 govern what may follow a 204 that has not been confirmed.

## Step 3: verify the inner runs, not just ci.yml

The playbook insists on listing workflow runs on `main` and reading the inner workflow names and conclusions, not just the orchestrator run (source doc). The source doc's own cross-references make this non-optional: the dispatch-chain-verification playbook says step 3 is not optional (source doc, see doc 08). The jq projection prints id, name, path, and conclusion for each run so the agent can see which inner workflow (`fetch-fedora-bootc-manifest.yml` and friends) actually picked up the group.

## Step 4: confirm the bump landed

The bump is confirmed by fetching the most recent commit that touched `Containerfile` (source doc). This closes the loop opened in step 2: the fetch group's job was to produce one commit on `main` that bumps `Containerfile` + `PINNED.md` together (doc 02), and this step reads that commit's short sha and message. If the latest `Containerfile` commit is not a fresh bump, the recovery has not happened yet and step 5 must not fire.

## Step 5: re-dispatch the builder at the new head

The failed builder workflow (usually `ci_dev_image.yml`) is re-dispatched at `main` with `Docker_push=false` (source doc). Running at the new head means the build consumes the bumped pin. The input-name caution belongs to the rules (doc 04): the child workflow declares `ci_Docker_push`, not `Docker_push`.

## Supporting tooling from the digs

The mechanism leans on two external mechanisms the digs ground. First, the GitHub Actions REST API surface: workflow dispatches and run listings are documented endpoints (https://docs.github.com/en/rest/actions/workflows, jev weight 0.17, weak backing; https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow, jev weight 0.26, weak backing). Second, registry manifest inspection via skopeo: `skopeo inspect` returns the top-level manifest Digest among low-level image information (https://man.archlinux.org/man/skopeo-inspect.1.en, jev weight 0.50; https://github.com/podman-container-tools/skopeo/blob/main/docs/skopeo-inspect.1.md, jev weight 0.29, weak backing). The adjacent-case doc (doc 05) uses that same primitive to resolve a dev tag to a digest before VM dispatches.

## What this doc adds beyond the source doc

The dig results confirm each external mechanism the procedure touches: the OCI digest contract behind the HEAD probe (0.66, high), the documented REST API endpoints for dispatch and run listing (0.17 and 0.26, both weak), and skopeo's manifest Digest output (0.50). Nothing in the digs contradicts the source doc's procedure; they supply the standards-level grounding for why each step works.
