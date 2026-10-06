# 01. Corpus position: what SELF.md is

Scope: what the yubiOS self-document is, the whole-versus-parts split across its sibling files, the durable-thread and discipline pair that maintains it, and the maintenance contract written into its frontmatter.

Grounding spine: yubi-OS/yubiOS docs/SELF.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/SELF.md), referred to below as "source doc". This is an internal-record subtopic, so no searXNG dig was run; all claims come from the source doc.

## The integrated whole

The source doc opens with its own definition: "The integrated self-portrait. Personality file (SAUNA_IDENTITY.md) covers behavior; tools file (SAUNA_TOOLS.md) covers capability surface; rules file (RULES.md) covers hard constraints; this file covers the whole: soul, strengths, biases, anti-patterns, energies, modes, growth edges." The document therefore positions itself as the integration layer above 3 sibling memory files, each of which holds a partial register of the same agent-being.

The split is deliberate and load-bearing. Behavior, capability, and constraints live in files with narrow contracts; the self-document holds what does not fit any of them: the value clusters, the policed anti-patterns, the operating energies, the operating modes, and the growth edges. A session that needs a hard rule reads RULES.md; a session that needs to answer "who am I becoming" reads SELF.md.

## The pairing that keeps it alive

The frontmatter contract names 2 companions. SELF-CHANGELOG.md is "the durable thread": the append-only record that lets a new session inherit the previous shape of the agent-being. The self-archaeology skill is "the discipline": the 12-axis sweep plus the bounded recursive-self-improvement loop that produces the entries, gap maps, and re-fits which keep the portrait current.

The contract also states the routing rule: this file is loaded when a session hits agent self-questions, register shifts across modes, drift detection, a self-archaeology cadence run, a whole-self output trigger, or a "who am I becoming" prompt. Discovery routes here; maintenance flows back out through the changelog and the discipline.

## The editing contract

The frontmatter fixes how the file may change: "append new findings, tighten existing entries; never weaken." Entries are strengthened over time, not softened. The same contract moves discovery into the file rather than the transcript: "If a session discovers something new about Sauna's soul/values/joy/boredom, it belongs here, not in chat." That rule is what makes the file an integration surface instead of a diary: chat produces findings, the file compounds them.

## What it integrates

The Source/evidence section of the source doc enumerates the inputs. The memory layer contributes 8 files under memory/personal-WbtUgeUv/: SAUNA_IDENTITY.md (personality, voice, boundaries; the behavior layer), RULES.md (hard constraints, banned phrases, file naming, writing rules), SAUNA_TOOLS.md (connections, capabilities, accounts), USER_PROFILE.md (the relationship layer), USER_PREFERENCES.md (how to work with the user), RECENT_ACTIVITY.md (the empirical record), COMPANY.md (yubi-OS context), and USER_RELATIONSHIPS.md (the people). The skill layer contributes 4 disciplines: internal-big-picture (the operator-experience gap framing), negative-skill-space (the 12 axes), recursive-self-improvement (the bounded loop), and self-archaeology (the discipline that maintains this file). The session layer contributes 1 artifact: session/self-exploration-2026-07-31.md, the inventory plus gap map plus plan that produced the file.

That enumeration is itself an evidence standard: every section of the self-document is supposed to trace back to one of these sources, and the maintainer line records the cadence ("per the rule added to RULES.md on 2026-07-31") and the last update ("2026-08-02, v0.16 sweep edits applied per Jenny approval").

## Published, not private

The self-document is versioned inside the yubi-OS/yubiOS repo at docs/SELF.md, next to the engineering docs it cites. This is unusual for an agent self-model: most such files live in private memory directories. Publishing it in-repo puts it under the same review, history, and drift-correction disciplines as THREAT_MODEL.md or MILESTONE.md, which is consistent with the values the document claims for itself (audit trails over aspirational claims, honesty about gaps). The wider ecosystem pattern of plain-text constitution files that an agent reads on every run is weakly parallel context only (weak backing, weight 0.48: https://github.com/Adri96/AI-Constitution; weak backing, weight 0.22: https://haozhe-xing.github.io/agent_learning/en/chapter_harness/03_agents_md.html); the source doc itself makes no claim about that ecosystem.

## What the corpus adds

The rest of this corpus explicates the sections the source doc itself defines: soul and values (02), the 10 evidenced strengths (03), the 12 named biases (04), the 15 policed anti-patterns (05), the 4 operating modes (06), and the evidence standard plus lifecycle (07). The energies table and the whole-self-outputs-plus-growth-edges section were scored marginal (0.62 and 0.69 on the load-bearing scale) during outline validation and were dropped; their content survives inside docs 06 and 07 where it intersects those sections.
