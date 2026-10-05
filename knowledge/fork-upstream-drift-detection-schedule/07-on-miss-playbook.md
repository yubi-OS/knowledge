# 07 The On-Miss Playbook: Responding to Drift

Scope: the response playbook when a fork has drifted: confirm the lag, decide merge or rebase, check security urgency, bump the pin, and close the loop.

## Step 1: confirm the lag

The drift issue reports a behind count from an automated compare; the responder confirms it by hand. GitHub documents the fork sync flow: configure a remote for the fork, fetch data from the upstream repository, merge the upstream branch into the local branch, and push (docs.github.com syncing a fork, weight 0.95). The GitHub compare view renders the same gap as "This branch is X commits ahead, Y commits behind" (Stack Overflow, weights 0.12 and 0.41, weak backing), which is the fastest human cross-check of the automated count.

## Step 2: decide merge or rebase

Two ways to bring the lag in, and the fork's local-commit situation picks between them:

- Merge upstream into the fork branch. Low risk, preserves both histories, produces a merge commit. The documented sync flow defaults to this (docs.github.com syncing a fork, weight 0.95).
- Rebase the fork's local commits on top of the upstream tip. The git rebase documentation defines it as reapplying commits on top of another base tip (git-scm.com git-rebase, weight 0.87), with git-scm itself as the canonical reference for rebase semantics (weight 0.74). Rebase rewrites local commit SHAs, which matters here: a fork whose pins reference its own local commits will need those pins re-derived after a rebase.

Third-party guides converge on the same fork-plus-rebase-and-push flow with GitHub's Sync fork button as the low-effort variant (codersnexus, weight 0.26, weak backing; thoughtbot, weight 0.40, weak backing; mrsaynothing, weight 0.08, weak backing). For a fork carrying a real patch series (as all 8 forks in the documented schedule do), prefer rebase when local commits are few and clean, merge when they are many or tangled.

## Step 3: check security urgency before anything else

Drift is not uniformly urgent, and the playbook's first triage question is whether the drifted range contains a security fix. CISA's BOD 26-04 establishes prioritizing security updates based on risk (cisa.gov BOD 26-04, weight 0.59), and CISA maintains the Known Exploited Vulnerabilities (KEV) catalog, adding entries as vulnerabilities are confirmed actively exploited (cisa.gov KEV alert, weight 0.70). A KEV-listed CVE fixed in the drifted range outranks ordinary drift by any prioritization framework that combines severity, exploit data, and asset context (armorcode, weights 0.05 and 0.35, weak backing; safeguard.sh, weight 0.21, weak backing; thehgtech, weight 0.21, weak backing).

Concretely: scan the drifted commit range for security keywords and CVE references before scheduling the merge. If a KEV-listed CVE is in range, the pin bump jumps the queue; otherwise the fork follows the normal update cadence.

## Step 4: bump the pin and re-run CI

The pin bump is a PINNED.md edit plus a full re-run of the fork's CI family, because the whole point of the exercise is that the fork's builds now include the upstream changes. The bump PR should reference the drift issue, and the issue is closed only when a later daily report shows the fork as synced. That last condition closes the loop the cron opened: detection without a verified-synced signal lets a "resolved" fork stay silently broken.

## Step 5: record the incident

Log the drift episode: date first flagged as drifted, date synced, peak behind count, and whether a security fix was in range. This is the baseline data that Phase 2 of the schedule (tightening the threshold from 10 to 5 commits after 30 days) is supposed to consume. A playbook that fixes forks but never records lag duration cannot answer whether the threshold is right, and the tuning decision degenerates into guesswork.

## Anti-patterns

- Auto-merging upstream on drift. The fork exists precisely because it carries local changes; an unreviewed upstream merge defeats that.
- Treating all drift equally. A 40-commit drift containing a KEV CVE and a 40-commit drift of refactor commits need different response times.
- Closing the issue on intent. The issue closes on a synced verdict from a later report, not on the merge being pushed.
