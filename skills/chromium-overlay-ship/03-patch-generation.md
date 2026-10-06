# 03 - Patch generation

Scope: how a box commit becomes an overlay patch. The two generation modes (cumulative fixup diff vs new-member diff against the series base commit), the --binary flag for assets, and the file-ownership overlap check that proves a new member's files are genuinely new.

Source doc: yubi-OS/yubiOS skills/chromium-overlay-ship/SKILL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/chromium-overlay-ship/SKILL.md).

## The two modes

The pipeline recognizes exactly two patch situations, and each has its own diff recipe (source doc):

1. **Fixup to the HEAD series member**: the change amends work an existing patch already carries. Generate a cumulative diff from the previous box commit: `git diff <prev-box-commit>..HEAD --binary > /tmp/patch` (source doc). Cumulative means the regenerated patch replaces the old member's patch wholesale, so the overlay never accumulates fixup-on-fixup deltas.
2. **New series member**: the change touches files no earlier member touched. First verify ownership with `git log 507c6ee3e2..HEAD -- <file>` (empty output = clean), then generate `git diff 507c6ee3e2..HEAD -- <files>` (source doc).

The series base commit `507c6ee3e2` is the fixed anchor for mode 2; the previous box commit is the anchor for mode 1 (source doc). Mixing them up produces a patch that either drops earlier members' content or drags unrelated files in.

## --binary is mandatory for assets

The rule: use `--binary` whenever PNG, ico, or SVG assets are involved (source doc). Without it, git omits binary file content from the diff, and the pushed patch silently fails to carry the actual asset changes while looking textually plausible.

git's own documentation confirms the mechanism: the `--binary` option outputs a binary diff that can be applied with git-apply, rather than the default "Binary files differ" placeholder (https://git-scm.com/docs/diff-generate-patch, weight 0.89). Git in general is the version-control system both ends of this pipeline run on (https://git-scm.com/, weight 0.78). The source doc's rule is a specialization of that documented behavior to the specific asset types this series touches.

## The overlap check

Before generating a new member's patch, the pipeline proves the files are new to the series: `git log 507c6ee3e2..HEAD -- <file>` must be empty (source doc). The reasoning is structural. The overlay series is an ordered stack of patches; if two members modify the same file, applying them in order depends on both patch contents and order, and a later regeneration of one member can silently invalidate the other. An empty log against the base commit is the cheap, mechanical proof that the new member owns its files outright (source doc).

If the log is NOT empty, the file is already owned: the change is a fixup, and mode 1 applies, regenerating that earlier member cumulatively (source doc).

## Where the patch goes next

`/tmp/patch` on the box is not the deliverable. The next step (doc 05's pipeline predecessor) fetches it over the bridge in base64 chunks, validates it (byte count equals the box `wc -c`, first line starts `diff --git`, counted `diff --git` and `GIT binary patch` sections), and only then pushes it to the overlay via the Git Data API (source doc). The validation clause exists because long base64 blobs written via the write tool truncate and long heredocs break; chunked fetch is the reliable path (source doc).

## Worked examples

The source doc's example section is a single line that names the full chain for the most common case: ship a rebrand fixup via box commit, cumulative --binary patch, chunked fetch, Git Data API push with a SERIES row, CI dispatch and workflow-filtered verification, numbered Linear comment (source doc). Patch generation is the second link of that chain: it is the step that turns "I committed on the box" into "there is a patch artifact I can defend."

## Rules of thumb

- Pick the mode first, diff recipe second (source doc).
- Never generate a binary-bearing diff without --binary (source doc; mechanism documented at https://git-scm.com/docs/diff-generate-patch, weight 0.89).
- New member: empty `git log 507c6ee3e2..HEAD -- <file>` or stop (source doc).
- The patch is not trusted until the chunked fetch validation passes (source doc).

A patch generated wrong here does not fail loudly; it fails at apply time on some other consumer's checkout, or worse, applies with stale content. That is why the source doc's failure-history framing ("every default below encodes a failure that already cost a cycle once") applies with full force to this step (source doc).
