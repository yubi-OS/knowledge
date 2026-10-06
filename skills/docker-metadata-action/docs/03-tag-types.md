# 03. The tag types reference

Scope line: this doc explicates the source doc's "Tag types reference" table, the vocabulary that makes a tags block declarative, and the trigger-to-output mapping for each type.

## The table

The source doc gives eight tag-type rows. Reproduced with their triggers and example outputs:

| Type | Trigger | Example output |
|---|---|---|
| `type=ref,event=branch` | push to branch | `main`, `feat-fido2` |
| `type=ref,event=pr` | PR open | `pr-42` |
| `type=semver,pattern={{version}}` | tag `v1.2.3` | `1.2.3` |
| `type=semver,pattern={{major}}.{{minor}}` | tag `v1.2.3` | `1.2` |
| `type=sha` | any push | `sha-a1b2c3d` (short) |
| `type=sha,format=long` | any push | `sha-a1b2c3d4e5f6...` (full) |
| `type=schedule` | cron trigger | `nightly` |
| `type=raw,value=latest` | any push | `latest` (use sparingly) |

Read the table as three families. Ref types project the Git ref (branch name or PR number). Semver types project a Git tag through a pattern template: `{{version}}` strips the leading `v`, `{{major}}.{{minor}}` truncates to two components. Sha types project the commit SHA, short by default and full with `format=long`. Schedule and raw are special: schedule fires on cron and emits `nightly`, and raw emits a literal value regardless of event, which is why the source doc attaches the caveat "use sparingly" to `type=raw,value=latest`.

## The discipline the table teaches

The yubiOS lesson (source doc) is that every tag a workflow emits should be traceable to a rule in this table. A tag that is not one of: a ref name, a PR number, a semver projection, a sha projection, or a deliberate raw value, is a hardcoded tag that doc 01's discipline removes. The `raw,value=latest` row exists so that a genuinely intended moving tag can still be declared explicitly, in one auditable line, rather than smuggled in as a default.

The semver pair also encodes a release convention: publishing both `1.2.3` and `1.2` from a single `v1.2.3` tag gives consumers a pinned patch tag and a minor-tracking tag from one build. The source doc's action reference includes exactly that pair.

## Sha tags and PR head SHA behavior

The short `sha-a1b2c3d` form is what a human scans for in a registry listing; `format=long` is what digest pinning consumes, and doc 06 shows why yubiOS prefers the long form for supply chain compliance. The upstream README additionally documents a boolean input for pull request events: "If true, set associated head SHA instead of commit SHA that triggered the workflow on pull request event" (https://github.com/docker/metadata-action, jev 0.91). For yubiOS PR builds this is the knob that decides whether the sha tag points at the merge commit or the PR head; the source doc's table does not cover this input, so it is recorded here as a dig-sourced addition dated 2026-10-06.

## The action reference block in context

The source doc's action reference combines the ref, semver, and schedule types into one block:

```yaml
tags: |
  type=schedule
  type=ref,event=branch
  type=ref,event=pr
  type=semver,pattern={{version}}
  type=semver,pattern={{major}}.{{minor}}
  type=sha
```

That block is the survey sample: one rule per family that emits on its own trigger and stays silent on the others. On a branch push it yields the branch name and a sha tag; on a `v1.2.3` tag push it yields the semver pair plus sha; on cron it yields `nightly` plus sha. The yubiOS pattern (doc 06) narrows this to sha long, branch ref, and semver version, dropping the pr and schedule rows for its supply chain critical images.

## Source quality notes

Backing: the action repository (0.91 for this subtopic's queries), the Docker docs domain (0.93), and the GitHub Marketplace listing for the action (0.48, weak, labeled as such: it confirms the action's public listing but is a marketplace page, not a primary technical source). Docker product pages (0.28 to 0.60) and GeeksforGeeks (0.12) were weighted low and carry no claims. Both seed queries returned 42 or more raw results with 6 kept each; no redo.
