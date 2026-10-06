# Assessment Template

Scope: the migration assessment deliverable template the cloudflare-one-migrations skill ships, what each section asks for, and which earlier workflow stages feed it.

Grounding spine: the source doc is `yubi-OS/yubiOS skills/cloudflare-one-migrations/SKILL.md`. This doc is an internal-record subtopic: it explicates a template that lives entirely inside the source doc, so no searXNG dig was run and no external claims are made. Every claim below is attributed to the source doc.

## The template

The source doc defines the assessment deliverable as a markdown block with 10 sections:

```markdown
## Migration Assessment

Source stack:
Artifacts reviewed:
Assumptions / missing exports:
Recommended Cloudflare One target:
Mapping summary:
Risks / partial mappings:
Not migrated:
Pilot plan:
Validation:
Rollback:
```

## What each section records

- **Source stack**: which of the source stacks the skill recognizes (Zscaler ZIA, Zscaler ZPA, Palo Alto NGFW/Prisma/GlobalProtect, legacy VPN/SWG/SD-WAN, or other) are in play. This is workflow step 1's output.
- **Artifacts reviewed**: the exports and logs actually received. Per workflow step 2, these should be structured exports; listing them makes the assessment auditable against the exports checklist.
- **Assumptions / missing exports**: everything the assessment had to assume because an export or log was absent. This section is the honesty mechanism: it converts silent gaps into declared ones.
- **Recommended Cloudflare One target**: the target architecture, including the legacy VPN pattern (Access plus Cloudflare One Client/WARP plus Tunnel or Mesh) versus Cloudflare WAN for site-to-site, per the skill's mapping heuristics.
- **Mapping summary**: the output of workflow step 4, the mapping plan with confidence levels and prerequisites.
- **Risks / partial mappings**: where the skill's trap analysis found no exact equivalent (caution/warn behavior, App-ID granularity, TLS/decryption exceptions), each recorded as a partial mapping rather than a forced equivalence.
- **Not migrated**: the explicit Not Migrated rows required by workflow step 7, each with reason and security impact.
- **Pilot plan**: which groups/sites pilot first, drawn from the rollout readiness assessment prompts.
- **Validation**: which validation gates will run and when, drawn from the validation gates doc.
- **Rollback**: the explicit rollback paths (disable by prefix, restore source routing, revert pilot group/site) and the rollback owner from the rollout readiness prompts.

## How the template closes the loop

The template is the convergence point of the skill: every stage of the workflow deposits its output into exactly one template section, and every readiness dimension of the assessment prompts resolves into a template line. That structure is deliberate: an assessment that cannot fill a section identifies precisely which stage was skipped or which export is missing, rather than producing a vague narrative.

The template also serves the rule-accounting obligation. "Mapping summary", "Risks / partial mappings", and "Not migrated" together cover the three dispositions the accounting table allows (mapped, partial, not migrated), while "Validation" and "Rollback" carry the stage-gate commitments that make the accounting trustworthy.

## Usage discipline

Per the source doc, the template is produced as part of the assessment, before implementation. Its sections are commitments, not summaries: "Pilot plan", "Validation", and "Rollback" bind the author to the staging and gate behavior defined elsewhere in the skill, and "Assumptions / missing exports" bounds the reliability of everything above it.
