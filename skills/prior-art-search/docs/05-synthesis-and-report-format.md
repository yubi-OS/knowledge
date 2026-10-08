# 05 Synthesis and the prior-art report format

Scope: the report template the skill produces: the four category sections, per-entry fields, the Sources section, and the header metadata. Internal-record subtopic, no dig: the template is defined entirely by the source doc.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md` (all claims in this doc come from the source doc's "The Output" and "The Process" sections).

## Internal-record note

This subtopic is the source doc's own output contract. The dig phase for this corpus deliberately skipped web research for it (recorded as "internal-record subtopic, no dig" in `research-db/digs/05-synthesis-and-report-format.json`); every claim below cites the source doc.

## Header metadata

Every report starts with:

```markdown
# Prior Art: [topic]

Date: YYYY-MM-DD
Source: prior-art-search (web research)
Queries run: N
Hits fetched in depth: N
```

The header makes the run auditable: a reader can see the date, that the source was this skill's web-research pass, and whether the budget (3 to 5 queries, 2 to 3 fetches) was actually respected.

## Search anchor

Under "## Search anchor" the report prints the one-sentence question the report answers. This is the step 1 anchor restated at the top, so every later entry can be judged against the question it claims to address.

## The four category sections

The report body is organized into four fixed categories, which map one to one onto the four query angles:

1. **Direct competitors / equivalents.** Products or projects solving the same problem.
2. **Failed attempts.** Products or projects that tried and stopped, with the reason.
3. **Academic / formal.** Research papers, surveys, formal analyses.
4. **Adjacent / historical.** Earlier or related efforts that informed the space.

Each entry carries the same four fields: name, one-line description, source URL, and a key observation stating what this entry tells us about the current idea. The template line is:

```markdown
- **[Name]** — [one-line description]. [Source URL]
  - Key observation: [...]
```

The failed-attempts entries carry an extra obligation: they state what was tried and why it stopped. The verification checklist requires at least 1 entry in failed attempts if any exist, so a category can be empty only when the search genuinely found nothing for it.

## The Sources section

The report closes with "## Sources": a list where each line pairs a URL with what it told us ("[URL 1] — [what it told us]"). This is the citation spine of the document; the anti-patterns section makes "Sources not cited" a named failure, and the red-flag list repeats it ("Saving the report without citing sources").

## Synthesis rules behind the format

Three process rules shape what lands in the template:

1. **Depth before synthesis.** Step 4 requires fetching 2 to 3 hits in depth because "search snippets are shallow. Without fetching 2 to 3 hits in depth, the report is a list of titles, not a synthesis."
2. **Selection symmetry.** The philosophy section states that surfacing only successful prior art is worse than no report, so failed attempts are mandatory content, not decoration.
3. **Per-entry observations.** The "key observation" field forces every entry to translate to the current idea; the separate "What this means" section (doc 06) then aggregates those translations.

## Format invariants

The format is stable across uses: the same heading names, the same entry fields, the same sources list. That stability is what makes reports comparable across topics and what lets downstream skills (idea-kill in particular) consume the "Why previous attempts failed" section mechanically. The in-repo touchpoints the source doc claims for itself (Philosophy, When to Use, The Process, The Output) are exactly the sections this template depends on.

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md` (sole source; internal-record subtopic, no dig)
