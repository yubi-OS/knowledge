# 07 - Frontmatter Integrity: Parse, Don't Grep

Scope: the frontmatter validation contract the loop imposes on every cycle that touches a SKILL.md: js-yaml parsing instead of regex, the name regex, description length, angle-bracket checks, closing delimiter integrity, and hashline-anchored editing.

Ground spine: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md` (source doc).

## Why frontmatter is guarded

A SKILL.md opens with a YAML frontmatter block (delimited `---` ... `---`) carrying `name`, `description`, `license`, and `metadata`. The description is the skill's trigger surface: if it drifts or corrupts, downstream skills stop firing when they should, which the source doc classifies as a real gap, not cosmetics. Two of the skill's anti-patterns guard exactly this: editing the frontmatter block naively, and validating with regex instead of js-yaml.

## The corruption incident

The source doc records the empirical reason for the rule: a naive angle-bracket scrub once corrupted a `>-` block indicator in a YAML description. The failure mode is instructive: a string replacement that targeted `<` and `>` characters did not know that `>-` is a YAML folded block scalar indicator, so a purely textual cleanup destroyed valid YAML structure while leaving the text looking fine. The fix is a category fix, not a patch: parse the document, do not grep it.

## js-yaml

The validation tool named by the source doc is `js-yaml`, the JavaScript YAML parser and dumper. The canonical repository is https://github.com/nodeca/js-yaml (jev weight 0.82), whose README shows the basic contract: `import { load } from 'js-yaml'` and `load()` throws on invalid input, so a parse attempt is itself the validation. On npm the package is the YAML 1.2 parser and serializer, latest version 5.2.3 at collection time, used by 28231 other projects in the npm registry (https://www.npmjs.com/package/js-yaml, jev weight 0.68; version 3.2.4 of the package also remains indexed at https://www.npmjs.com/package/js-yaml/v/3.2.4, jev weight 0.67). YAML itself is the human-readable data serialization language commonly used for configuration files (https://en.wikipedia.org/wiki/YAML, jev weight 0.24, weak backing), which is why its grammar rules, including block scalar indicators like `>-`, are invisible to string-level tooling. A writeup on validating markdown frontmatter in JavaScript (https://www.mailslurp.com/blog/validate-frontmatter-markdown-seo-javascript/, jev weight 0.27, weak backing) describes the same parse-then-assert pattern for static-site metadata; the skill applies it to skill metadata instead of SEO metadata.

## The 4 checks

Per the source doc's Verification checklist, after every cycle that touched frontmatter:

1. **Name regex passes.** The `name:` value matches the skill-name convention (the description frontmatter fragment the skill once carried described it as a name regex plus description length and no angle brackets; that detail lives in the body, not the description).
2. **Description length within bounds.** The skill's own changelog records trimming the description to keep it at or under 1024 characters.
3. **No angle brackets.** Angle brackets are scrubbed from the description (without destroying block indicators, which is why the check is done on parsed YAML, not raw text).
4. **Closing `---` intact.** The delimiter closes the frontmatter block; a missing closing `---` corrupts the file.

The changelog also records frontmatter being restored from a missing state during a body consolidation (the prior v4 file had 4 `## Changelog` headers and a duplicated body half; the rewrite restored frontmatter and deduped to a single canonical copy), which is the reminder that frontmatter checks run even on cycles whose intent was body-only.

## Hashline-anchored editing

The editing mechanics are fixed too: edits go through `@tool/edit` with hashline anchors rather than regex or string replacement, and the Verification checklist requires the frontmatter block structure to be preserved. This is the mechanical complement to the parse rule: anchor-based editing makes the edit surface explicit, so the validation step can catch what slipped through.

## Where the check sits in the loop

Frontmatter validation is a per-cycle exit condition, not a final gate. The source doc's red-flag list includes skipping the js-yaml parse before declaring the cycle done. In self-mode the check matters doubly: the skill editing itself is the canonical case of an author corrupting its own trigger surface.

## Summary

Parse with js-yaml, check the name regex, the description length, the angle brackets, and the closing delimiter; edit with hashline anchors; never touch the frontmatter block with regex. The cost is 1 parse call per cycle; the avoided failure is a silently broken trigger surface.
