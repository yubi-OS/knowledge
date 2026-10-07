# 09: Inputs audit and verification: anti-patterns, red flags, and the 6 checks

Scope: how an Inputs declaration is audited: the anti-pattern list, the red-flags table, the six verification checks for a cycle-9 patch, and when the patch counts as a NO verdict.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md`. Dig material: none used; this is an internal-record subtopic, no dig (the audit protocol is the source doc's own verification and red-flags sections).

## The anti-patterns

The source doc lists 9 anti-patterns for Inputs sections:

1. Inputs without a channel: "the script reads X" without saying whether X is CLI, env, or config; worse than no section because it pretends to be a declaration.
2. Required with a default: `required: true` plus `default: 30` makes the default make it not required while the flag misrepresents it.
3. ENV that should be ARG: a build-only value such as `BASE_IMAGE_TAG` in ENV persists in the image and ships to every consumer.
4. ARG that should be ENV: a runtime value such as `YUBIOS_RELEASE` in ARG is unavailable at runtime.
5. Secrets in ENV: persists the secret in the image and in `docker inspect` output; use BuildKit `--mount=type=secret`, systemd `EnvironmentFile=` (mode 0600), or Kubernetes `Secret` / `SealedSecret`.
6. "Compatible with X" instead of a verdict: "validates inputs" without naming which inputs, in what shape, with what precedence, is filler.
7. Cross-channel aliasing without precedence: two env vars, two config files, or two CLI flags setting the same key with no stated winner.
8. Prerequisites in a footer: "Requires Python 3.12" at the bottom of a README will be missed; move it into `prerequisites:`.
9. An Inputs section that does not name the file's own parameters: a cycle-9 patch that adds `## Inputs` to a Containerfile but does not list `BASE_IMAGE_TAG` and `ENABLE_SYSEXT` is a placeholder and counts as a NO verdict.

## The red-flags table

The source doc's operational table maps observations to meanings:

| Observation | Meaning |
|---|---|
| `## Inputs` section lists zero concrete names | the section is a placeholder |
| `required: true` AND `default: ...` on the same field | contradictory declaration |
| A secret appears in an `ENV`, an `ARG`, or a log line | secret leakage |
| Two channels claim the same key with no precedence rule | cross-channel collision |
| "Requires Python 3.12" in a footer instead of `prerequisites:` | prerequisite lost |
| A field's `type:` does not match the validation rule | schema drift |
| An `## Inputs` patch lands but the next NSS sweep still flags inputs as the top gap | the patch did not close the gap |
| The Inputs section is identical across 100+ files | templated, not inspected, likely wrong for at least one |

## The 6 verification checks

For each cycle-9 patch that closes an NSS-inputs gap, the source doc requires:

1. The patch adds ONE `## Inputs` section (or the file-type-aware equivalent: `# Inputs` for Containerfile/Makefile, `# Inputs` in a Python triple-quoted docstring, `# Inputs` for shell comments, `<!-- Inputs -->` for markdown, `<!-- Inputs (workflow_call inputs:) -->` for GitHub Actions YAML).
2. The section names at least one concrete input with channel, type, required/default, and precedence; a placeholder with zero concrete inputs counts as a NO verdict.
3. Secrets are absent from `ENV` / `ARG` / log lines; a documented secret must reference `--mount=type=secret`, systemd `EnvironmentFile=`, or Kubernetes `Secret`.
4. Prerequisites are listed in `prerequisites:`, not in a footer.
5. Precedence is stated when more than one channel can supply the same input.
6. The next NSS sweep on the same file does NOT re-flag inputs as the top Extend gap; if it does, the patch did not close the gap and the cycle-9 lens is a NO verdict.

## Closing the gap: one section, one file, one cycle

Guideline 11: the atomic cycle-9 patch for any file with an NSS-inputs Extend gap is ONE `## Inputs` section, file-type-aware comment syntax, with the seven-channel table or its markdown equivalent. One section, one file, one cycle. The constraints add: do not stack multiple `## Inputs` blocks in one file, do not nest Inputs inside another section heading, and no silent defaults (document a default or write `default: none` explicitly).

## When the same gap keeps reappearing

The source doc's composition table records what to do when verification check 6 fails repeatedly: recursive-self-improvement's self-mode should re-isolate the editor before the next attempt, because same-author bias on inputs sections is the most common cycle-9 failure mode. Templating is the related red flag: an Inputs section identical across 100+ files is templated, not inspected, and is likely wrong for at least one of them.
