# 06 - PR #148: The GH_TK Removal

Scope: the internal record of PR #148, the same-repo PAT cleanup that replaced 6 `GH_TK` references with `github.token` across 3 workflow files, and the secret deletion it unlocked. Internal-record subtopic, no dig: every claim here comes from the source doc.

## What landed

Per the source doc (yubi-OS/yubiOS playbooks/github-token-vs-secrets.md), PR #148 (branch `ci/remove-gh-tk-references`, commit `a49e95db`, 2026-07-29) replaced all 6 `GH_TK` references across 3 files with `github.token`:

| File | References | What was replaced |
|---|---|---|
| `fetch-dhi-manifest.yml` | 3 | checkout token, a dead env var, `git push` |
| `fetch-released-tag-ref.yml` | 2 | checkout token plus a compare endpoint env |
| `fetch-fedora-bootc-manifest.yml` | 1 | `git push` |

All 3 workflows declare `permissions: { contents: write, actions: write }` at workflow level, so `github.token` inherits write capability for the checkout, the compare call, and the push (source doc). The declared bound is what makes the substitution sound: doc 03's elevation rules, applied to a real family.

## Why it was possible

`GH_TK` was a same-repo PAT used where `github.token` would do (source doc). Every one of the 6 replaced references is a same-repo, single-run use: a checkout token, a push, an env var for a compare endpoint call. Under the decision matrix in doc 01, all 6 belonged to `github.token` all along. The PAT added risk with no capability the uses needed.

## Cleanup completion

After merge, `GH_TK` in repo Settings, Secrets is referenced by no workflow and can be deleted (source doc). The playbook treats this as part of the change, not an afterthought: removing the references halves the fix, deleting the orphaned secret closes it. Doc 04 records why an unreferenced secret is pure attack surface.

## Scope of the claim: hygiene, not a bug fix

The source doc is explicit about what PR #148 is not. It is hygiene, not a bug fix. The chain break it was believed to fix was actually fixed by the `actions/checkout` v6 to v7.0.1 SHA bump in PR #147 (commit `8b5b20b`), proven by smoke test run 30484718456 (https://github.com/yubi-OS/yubiOS/actions/runs/30484718456), which succeeded on `8b5b20b` while `GH_TK` was still in place (source doc).

That proof structure is the discipline the playbook teaches: run the smoke test on the commit where the suspected cause is still present, and the causal story is falsified in one run. The cross-reference the source doc draws is to the `dispatch-chain-verification` playbook, which calls this "read the patch, not the title".

## Related records

Per the source doc's cross-references: `docs/BLOCKERS.md` lists the old workflow-token-scope warning under "Not Current Blockers" and marks it obsolete, do not reinstate it; `PROJECT_RULES.md` carries the "GH_TK cleanup landed (PR #148, 2026-07-29)" entry; the related PRs are #148 (`a49e95db`) and #147 (`8b5b20b`) with run 30484718456; and the investigation behind the checkout fix lives in `refs/actions-checkout-v6-includeif-investigation-2026-07-29.md`.
