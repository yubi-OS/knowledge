# 09 Research CI and non-workflow YAML

**Scope:** the 6 workflows serving the papers/ and tools/ research corpus, what makes them a group, and the one non-workflow YAML file in the census. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## The 6 workflows

The source doc (source doc) lists the `research` group as:

- `lean-check.yml`: Lean CI. Machine-checks CurvedCorpus.lean plus sections 10 through 13 on push to `main` or `lean-check-*` branches (path-scoped) or on dispatch; also runs verify-measurements (published constants) and verify-tools (tool selftests, including the edge-standard suite added 2026-10-05). 3 jobs (check with 20 steps, verify-measurements with 4, verify-tools with 15) on `ubuntu-latest`.
- `lean-run.yml`: real-corpus CI companion. Asserts the published corpus level and statement distribution on the real refs/ corpus. 2 jobs (run-real-corpus with 10 steps, run-real-statements with 2). Added to the `research` and `all` groups on 2026-10-06 (commit `e46a3cb8`) to clear a reachability orphan.
- `phonon-followups.yml`: runs `papers/scripts/phonon_followups.py` on push to `phonon-followups-*` (path-scoped) or dispatch. Same 2026-10-06 orphan fix. 1 job.
- `zernike-lens.yml`, `zernike-caustics.yml`, `zernike-spectrum.yml`: the Zernike program's 3 single-job runners (lens recon/classify, caustic fold classification, spectral channel). The lens and spectrum workflows declare no inputs.

All 6 run on hosted `ubuntu-latest`; none publish anything (source doc).

## The group's status history

Before 2026-10-06 the group existed only in the app's hand-maintained taxonomy, dispatch-limited to the members directly, with the 4 research stragglers (lean-check, lean-run, phonon-followups, and the 3 zernike workflows counting as display-only rows) recorded in the straggler table (source doc, doc 10). Commit `e46a3cb8` made `research` a real orchestrator dispatch target, so the app now dispatches them through the orchestrator like any other group (source doc).

## External grounding

Lean is the proof assistant behind the check lane. The lean-action GitHub Action provides standard Lean CI, using the Lake workspace to decide which steps to run when `auto-config` is set (github.com/leanprover/lean-action, https://github.com/leanprover/lean-action, jev weight 0.17, weak). Lean's own reference documentation recommends running lean4checker as part of CI for protection against bugs in Lean's handling of declarations, and notes that lean-action provides this (lean-lang.org, "Validating a Lean Proof", https://lean-lang.org/doc/reference/latest/ValidatingProofs/, jev weight 0.11, weak). Lake, Lean's build system, exposes `lake check`, which builds the root package's default targets and replays the result through Lean's kernel, reporting the axioms used and failing if any are outside the allowed set (lean-lang.org, "Lake", https://lean-lang.org/doc/reference/latest/Build-Tools-and-Distribution/Lake/, jev weight 0.15, weak). That axiom-reporting behavior is the mechanism a machine-checked corpus CI would assert on.

The Zernike workflows reference the Zernike polynomials, a sequence of polynomials orthogonal on the unit disk named after Frits Zernike, used throughout optics to describe wavefronts and aberrations (en.wikipedia.org, "Zernike polynomials", https://en.wikipedia.org/wiki/Zernike_polynomials, jev weight 0.1, weak; University of Arizona optics notes, https://webs.optics.arizona.edu/gsmith/Zernike.html, jev weight 0.05, weak). All of these external citations are weakly-backed context for what the workflows operate on; the workflows' own behavior is grounded in the source doc.

## Non-workflow YAML: .github/FUNDING.yml

The census includes exactly 1 non-workflow YAML file: `.github/FUNDING.yml` (26 B), the GitHub Sponsors configuration. The source doc (source doc) is explicit that it is not an automation; it is listed in the census because the tracker covers every `.yml` in the repo and must be able to say so honestly. In ci-launchpad it is inventoried in the `/api/yml-inventory` endpoint with kind, path, and blob sha, but not run-tracked, since it has no Actions surface (source doc).

This is a small but deliberate accounting decision: a census that silently excluded FUNDING.yml would have to explain a 39-versus-40 mismatch somewhere else, and the honest listing costs one row (source doc).

## Composes with

The research group composes with the orchestrator (real dispatch target since 2026-10-06, source doc, doc 02) and is downstream of the papers/ and tools/ corpus that the research work maintains. Its push triggers are the only push lanes outside the 3-workflow count the census records (lean-check and lean-run share a lane on main plus `lean-check-*`; phonon-followups has its own), which is why the census counts exactly 3 push-triggered workflows (source doc, doc 01).
