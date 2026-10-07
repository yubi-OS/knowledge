# 07 forks-and-org-repos

Scope: the two org-level patterns the source doc specifies: forking an upstream repository into the org, and listing all org repositories with their fork provenance.

## Ground spine

Source doc: `yubi-OS/yubiOS skills/github-api/SKILL.md`. External grounding from searXNG dig, weighted by jev-1.13 noul. Note: the initial dig returned only one authoritative result, so this subtopic took one redo round (2 more queries) to ground the org-repos side.

## Forking into the org

The source doc's fork pattern is `POST https://api.github.com/repos/<upstream-owner>/<repo>/forks` with a body of `{organization: "yubi-OS", default_branch_only: false}` (source doc). Two parameters carry the org-specific intent:

1. `organization` names the target org, so the fork lands under yubi-OS rather than under a personal account.
2. `default_branch_only: false` requests the full history, which matters for upstreams like the source doc's example (OP-TEE optee_os, an ARM Trusted Firmware ecosystem repository) where porting work needs tags and release branches, not just one branch line (source doc).

The fork endpoint is called against the upstream repo, not against the org: the path is `/repos/OP-TEE/optee_os/forks` and the body says where to put the result (source doc). GitHub's forks documentation describes the surface: "Use the REST API to manage repository forks" (https://docs.github.com/en/rest/repos/forks, weight 0.97).

## Listing org repos

The list pattern is `GET https://api.github.com/orgs/yubi-OS/repos?per_page=50&type=all`, and the source doc's example then inspects each repo's `fork` boolean and `parent.full_name` to print fork provenance: the upstream each fork came from (source doc). That provenance read is the org-maintenance payoff: one call inventory-boards every repository the org owns, flags which are forks, and names their upstreams.

GitHub's repositories documentation covers the repo-level surface (https://docs.github.com/en/rest/repos, weight 0.97, redo round) and the organizations documentation covers the org-level endpoints including the orgs resource itself (https://docs.github.com/en/rest/orgs/orgs, weight 0.97, redo round). Together they ground both halves of the pattern: the `/orgs/<org>/repos` listing lives under the organizations family, and the `fork`/`parent` fields come from the repositories family.

## Why this pattern matters for yubiOS

The yubiOS project depends on upstream ARM64 firmware sources (the source doc's OP-TEE example is one of them), and the fork-first flow is how those dependencies enter the org: fork with full history, then track the upstream in the fork's `parent` field for the life of the porting work (source doc). The listing pattern turns that into a recurring audit: any script can enumerate org repos and report fork provenance without a checkout (source doc).

## Redo log for this subtopic

- Attempt 1 (initial dig, 2 queries): returned the forks documentation at 0.97 but no authoritative org-repos endpoint doc; the second query's results were homepage and social noise.
- Redo round 2 (2 queries, different phrasing aimed at the official docs): recovered "REST API endpoints for repositories" (https://docs.github.com/en/rest/repos, 0.97) and "REST API endpoints for organizations" (https://docs.github.com/en/rest/orgs/orgs, 0.97).

Outcome: authored, with the fork side grounded from the initial dig and the org-repos side grounded from the redo.
