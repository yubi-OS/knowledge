# 05 - the GitHub Actions REST API surface

Scope: the endpoints the SKILL.md documents for listing workflows, triggering runs, polling status, fetching logs, re-running, cancelling, and listing jobs, with the auth posture and status-code semantics yubiOS relies on.

## Auth posture

All Actions API calls use the same auth as the `github-api` skill: a `Bearer` token, `Accept: application/vnd.github.v3+json`, `Content-Type: application/json`, against `https://api.github.com/repos/yubi-OS/<repo>` (source doc). In yubiOS the token comes from the MASTER GIT SU connection; an Actions: Write permission on that token is sufficient for every endpoint in this doc (source doc, doc 04). The API root for the whole surface is documented at https://docs.github.com/en/rest/actions (w 0.97).

## List workflows

`GET /repos/{owner}/{repo}/actions/workflows` returns the workflows array with `id`, `name`, `path`, and `state` per entry (source doc). A repo with no `.github/workflows/` directory returns an empty array with `total_count: 0`, which is the diagnostic signal that the directory is missing rather than that auth failed (source doc). The endpoint reference is https://docs.github.com/en/rest/actions/workflows (w 0.97).

## Trigger a run (workflow_dispatch)

`POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches` with a body of `{"ref": "main", "inputs": {...}}` queues a run on the chosen branch or tag (source doc). Status semantics the SKILL.md pins:

- 204 No Content means queued.
- 404 means the workflow file does not exist yet.
- 422 means the workflow's `on:` block does not declare `workflow_dispatch`.

The `workflow_id` accepts the filename (`ci.yml`), the workflow name, or the numeric id from the list endpoint (source doc). The dispatch endpoint is part of the workflows API (https://docs.github.com/en/rest/actions/workflows, w 0.97). Declared inputs are optional and must match the workflow's `inputs:` block (source doc).

## Read run state

`GET /repos/{owner}/{repo}/actions/runs` lists runs with filters such as `branch=main`, `status=completed`, and `per_page` (source doc). Each run carries `id`, `name`, `status`, `conclusion`, and `created_at`. The status vocabulary is `queued`, `in_progress`, `completed`; conclusion is `success`, `failure`, `cancelled`, `skipped`, or `null` while the run is not done (source doc). The workflow-runs API is the documented home for view, re-run, cancel, and log operations (https://docs.github.com/en/rest/actions/workflow-runs, w 0.97; the docs source itself at https://github.com/github/docs/blob/main/content/rest/actions/workflow-runs.md, w 0.91).

`GET /repos/{owner}/{repo}/actions/runs/{run_id}` returns a single run with `status`, `conclusion`, and `html_url` (source doc). The SKILL.md's polling pattern loops every 10 seconds until `status === 'completed'` and returns the conclusion, with a 5 minute ceiling by default (source doc).

## Logs

`GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs` returns a 302 redirect to a zip archive; follow the redirect and read the stream (source doc). The zip contains one log txt per job, named `<job_number>_<job_name>.txt` (source doc). This is the download endpoint documented in the workflow-runs reference (https://docs.github.com/en/rest/actions/workflow-runs, w 0.97).

## Mutations on a run

Three POSTs cover the mutation surface (source doc):

- `POST .../runs/{run_id}/rerun` re-runs the whole run.
- `POST .../runs/{run_id}/rerun-failed-jobs` re-runs only the failed jobs.
- `POST .../runs/{run_id}/cancel` cancels a run.

`GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs` lists the jobs of a run with `id`, `name`, `status`, `conclusion` per job (source doc).

## How yubiOS automation composes these

The typical agent loop the SKILL.md implies: dispatch a workflow by filename against `main`, poll the run id until complete, read the conclusion, and on failure fetch the logs zip and the per-job list to localize the failing step. The rerun-failed-jobs endpoint is the cheap retry for flaky steps; cancel is the guard against stuck queues (source doc).

Two cautions from the broader ecosystem, both weakly weighted and used only as pointers: third-party wrapper actions exist for dispatch-and-find-run-id flows (https://github.com/marketplace/actions/dispatch-workflow, w 0.51), and guides exist for driving the API from orchestrators such as Airflow (https://www.getorchestra.io/guides/githubaction-rest-api-endpoints-for-workflow-runs, w 0.1, weak backing: content marketing). yubiOS does not need either: the endpoints above are sufficient from a script, and any action used inside a workflow must clear the approved SHA allowlist anyway (doc 01).
