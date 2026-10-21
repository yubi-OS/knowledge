# 02. Class rules

**Scope:** Class rules: detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md.

Ground source: `yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md`. Dig queries: `content-addressed repository synchronization git tarball`; `allowlist regex identifier linting CI gate`.

## Overview

The spec defines five class rules, R1 to R5, one per dead or wrong path class found by the audit. Each rule names the pattern, the replacement, and when to leave a hit alone. Rules are deliberately narrow: they change path strings and prescribed clause wording only.

## R1: connection ids

- `conn_6rp6oRY9DBJG`, the rock1 bridge that died and was deleted 2026-09-24, becomes `conn_W36n4EetFoNp` in radio-queue, play-audio-on-rock1, and ascii-uart-animator.
- In `custom-connection`, five dead Cloudflare rows (`conn_GgxyXnYTg53J`, `conn_3q0lnKopzUjk`, `conn_WvQf4m8LKf1s`, `conn_IDyE2Xmk0AsM`, `conn_x7vt48bbDCmj`) are replaced by the working row `conn_pd_apn_1KhdoD7` (managed auth, account `b57ee20cd90ebc4e4db28728e450a4b8`, workers.dev subdomain `systems-a`), with a note that the dead rows were removed from Settings.
- Truncated `conn_pd` references are completed to the live id: `conn_pd_apn_Jjhzk0j` for Linear, `conn_pd_apn_1KhdoD7` for Cloudflare, chosen by context.
- All other ids are live and left alone.

## R2: retire `yubi-OS/agent-skills`

Following Jenny's instruction to "change it to upstream refs directly":

- Operative instructions (push targets, workflow steps) get a single target: `yubi-OS/yubiOS` on `main` via the Git Data API or Contents API. "Push to both repos" language is removed.
- Citations of artifacts that were mirrored byte-identically are repointed to the `yubi-OS/yubiOS` equivalent when one exists, after checking plausibility.
- Pure historical changelog citations with no yubiOS equivalent are kept, with "(repo retired 2026-09-24; historical)" appended.

## R3: space dirNames

- `skills/personal-WbtUgeUv/...` paths, deleted by the 2026-09-24 retirement, become in-repo paths (`<skill>/scripts/...`, `<skill>/examples/...`) or `yubi-OS/yubiOS/skills/<skill>/...`.
- `skills/github-yubios-KS9n5GAT/<skill>/...` self-links become the repo-truth form `yubi-OS/yubiOS/skills/<skill>/...`.
- `memory/personal-WbtUgeUv/<file>` in operative instructions becomes role wording ("the operator's personal memory space, `memory/<personal-dirname>/<file>`"); historical citations are unchanged.

## R4: session and documents paths

Each hit takes one of three decisions: (a) repoint to repo-truth when the artifact was pushed (RSI artifacts to `yubi-OS/yubiOS/refs/...`, corpora to `yubi-OS/knowledge/...`, sources of record to `papers/...` or `tools/...`); (b) rewrite as runtime capture when the path describes where output should land; (c) leave and annotate `(session artifact, not repo-truth)` when purely historical. Vendor and upstream reference docs are excluded (`cloudflare/**`, `sandbox-*/**`, `agents-sdk/**`, `workers-best-practices/**`, `brag/slim.md`, docker `cache/attestations`), because their "session", "work", and "cache" strings are product concepts.

## R5: broken `../../references/*.md` links

Five skills (security-and-hardening, shipping-and-launch, performance-optimization, test-driven-development, using-agent-skills) link to checklists never committed. The rule: try once to source canonical files from the public `anthropics/skills` repo; if found, ship them at `<skill>/references/<file>.md` and fix the link; if not, replace the link with "(reference checklist not shipped with this skill)". The local copy of using-agent-skills still points at `references/definition-of-done.md`, which illustrates the class.

## Allowlist versus denylist

R1 is in effect an allowlist decision: every connection id must be on a known-live list, and anything else is a finding. The enforcement lint makes that explicit with `lint_allowlist.json`. The general argument is well known: an allow list "fails anything unknown, a deny list passes it", which matters most for the unknown case [License gate in CI: allow list or deny list, which fits?](https://safeguard.sh/resources/blog/allow-list-or-deny-list-which-license-gate-fits) (clef weight: 0.1048) (weak backing, clef weight < 0.5). gitleaks applies allowlists and baselines to cut false positives in secret scanning [Allowlists & Baselines | gitleaks/gitleaks | DeepWiki](https://deepwiki.com/gitleaks/gitleaks/4.4-allowlists-and-baselines) (clef weight: 0.0578) (weak backing, clef weight < 0.5), and its default config shows rule-per-pattern regexes for tokens [gitleaks/config/gitleaks.toml at master · gitleaks/gitleaks · GitHub](https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml) (clef weight: 0.1343) (weak backing, clef weight < 0.5). MediaWiki's CI restricts test execution to users on an allow list [Continuous integration/Allow list - MediaWiki](https://www.mediawiki.org/wiki/Continuous_integration/Allow_list) (clef weight: 0.1288) (weak backing, clef weight < 0.5), and a VPN vendor explainer defines allowlisting for network access [Allowlisting: What is it, and how does it work? | NordVPN](https://nordvpn.com/blog/what-is-allowlisting/?msockid=1cc85dfb5a1365432f714a025bfc647d) (clef weight: 0.0556) (weak backing, clef weight < 0.5). All are weak backing. The design point the spec adds is that ids are never hardcoded in the generator; the allowlist file is updated alongside connection churn.

## Content-addressed sync

The audit worked from "a fresh tarball of main", and the ship step syncs local space copies after the push. A tarball pins the exact tree being audited. `git archive` builds such archives from any commit [Git - git-archive Documentation](https://git-scm.com/docs/git-archive) (clef weight: 0.1533) (weak backing, clef weight < 0.5), a gist shows the GitHub tarball shortcut [How to create a tarball of a git repository using "git archive" · GitH...](https://gist.github.com/simonw/a44af92b4b255981161eacc304417368) (clef weight: 0.0454) (weak backing, clef weight < 0.5), Baeldung covers downloading and unpacking one on Linux [Learn how to download a GitHub repository tarball in Linux.](https://www.baeldung.com/linux/github-download-tarball) (clef weight: 0.0516) (weak backing, clef weight < 0.5), and zsync advertises content-addressed code sync to remote boxes [GitHub - andrewgazelka/zsync: Sync code to remote boxes in seconds ...](https://github.com/andrewgazelka/zsync) (clef weight: 0.0773) (weak backing, clef weight < 0.5). All weak backing. A dictionary entry [CONTENT Definition & Meaning - Merriam-Webster](https://www.merriam-webster.com/dictionary/content) (clef weight: 0.0279) (weak backing, clef weight < 0.5) was noise.

## Sources Considered

All 10 Clef-weighted searXNG results from `dig_context_02.json`. Weight >= 0.5 is authoritative backing; < 0.5 is weak backing.

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | How to create a tarball of a git repository using "git archive" · GitH... | https://gist.github.com/simonw/a44af92b4b255981161eacc304417368 | 0.0454 | weak backing (< 0.5) |
| 2 | Learn how to download a GitHub repository tarball in Linux. | https://www.baeldung.com/linux/github-download-tarball | 0.0516 | weak backing (< 0.5) |
| 3 | Git - git-archive Documentation | https://git-scm.com/docs/git-archive | 0.1533 | weak backing (< 0.5) |
| 4 | CONTENT Definition & Meaning - Merriam-Webster | https://www.merriam-webster.com/dictionary/content | 0.0279 | weak backing (< 0.5) |
| 5 | GitHub - andrewgazelka/zsync: Sync code to remote boxes in seconds ... | https://github.com/andrewgazelka/zsync | 0.0773 | weak backing (< 0.5) |
| 6 | License gate in CI: allow list or deny list, which fits? | https://safeguard.sh/resources/blog/allow-list-or-deny-list-which-license-gate-fits | 0.1048 | weak backing (< 0.5) |
| 7 | Allowlists & Baselines / gitleaks/gitleaks / DeepWiki | https://deepwiki.com/gitleaks/gitleaks/4.4-allowlists-and-baselines | 0.0578 | weak backing (< 0.5) |
| 8 | Allowlisting: What is it, and how does it work? / NordVPN | https://nordvpn.com/blog/what-is-allowlisting/?msockid=1cc85dfb5a1365432f714a025bfc647d | 0.0556 | weak backing (< 0.5) |
| 9 | gitleaks/config/gitleaks.toml at master · gitleaks/gitleaks · GitHub | https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml | 0.1343 | weak backing (< 0.5) |
| 10 | Continuous integration/Allow list - MediaWiki | https://www.mediawiki.org/wiki/Continuous_integration/Allow_list | 0.1288 | weak backing (< 0.5) |
