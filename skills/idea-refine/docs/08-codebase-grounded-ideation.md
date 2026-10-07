# 08 Codebase Grounded Ideation

Scope: How the skill grounds ideation in an existing project by scanning with Glob, Grep, and Read, the companion artifacts it leans on, and the save pipeline for the final artifact.

Grounding spine: yubi-OS/yubiOS skills/idea-refine/SKILL.md (source doc).

## The in-repo behavior

The skill is mode-aware. "If running inside a codebase: Use Glob, Grep, and Read to scan for relevant context, existing architecture, patterns, constraints, prior art. Ground your variations in what actually exists. Reference specific files and patterns when relevant."

Three consequences follow. First, the variations in Phase 1 are not free-floating: they must be grounded in what the scan found. Second, the agent cites specific files and patterns, which makes its claims checkable. Third, the codebase is treated symmetrically: "the existing architecture is a constraint and an opportunity. Use it." The same scan that reveals why an idea is hard also reveals where the idea is cheap.

## Constraints sharpen rather than block

Working under existing constraints is the normal condition of software ideation. Research on how developers actually brainstorm notes that "existing brainstorming literature has consistently proven group brainstorming to be ineffective under the controlled laboratory settings" and that real developers brainstorm in groups under real constraints anyway, which the laboratory literature failed to predict (https://www.researchgate.net/publication/256177516_Brainstorming_Under_Constraints_Why_Software_Developers_Brainstorm_in_Groups, jev weight 0.56). The skill's design matches the field condition: it ideates inside the constraint set rather than pretending to a blank page.

Brownfield development makes the stakes explicit: working in an existing codebase means "existing constraints, existing conventions, and existing users who depend on the code behaving the way it currently behaves" (https://l3gj0n.github.io/ai_supported_software_development_hs_aalen/en/2026/03/30/lecture-3-from-greenfield-to-brownfield/, jev weight 0.20, weak backing). Conventions are what make an architecture legible to newcomers and to agents: "having strong conventions in your codebase makes various aspects of managing your architecture and model possible or much easier... Conventions make extracting architecture from your code easier" (https://nick-tune.me/blog/2026-09-08-architecture-and-model-diffs-via-conventions/, jev weight 0.22, weak backing). That is why the skill's scan step reads for patterns, not just for code.

## Prior art before design

The "what's been tried before" sharpening question has a research analogue: prior-art investigation "reveals a range of possible design solutions, provides the engineering and physical principles involved in existing devices, and clarifies what is truly novel about a project" (https://www.researchgate.net/publication/362729401_Prior_Art_Research_in_the_Capstone_Design_Experience_A_Case_Study_of_Redesigned_Online_and_In-person_Instruction/fulltext/637ea0052f4bca7fd08776a4/Prior-Art-Research-in-the-Capstone-Design-Experience-A-Case-Study-of-Redesigned-Online-and-In-person-Instruction.pdf, jev weight 0.44, weak backing). Inside a repo, the Glob/Grep/Read scan is the local version of that investigation: prior art includes the codebase's own history of solving adjacent problems.

## Companion artifacts and the save pipeline

The skill ships with three companion references in its directory, each pulled in selectively:

- **frameworks.md:** additional ideation frameworks for Phase 1, used selectively ("pick the lens that fits").
- **refinement-criteria.md:** the full evaluation rubric for the Phase 2 stress test.
- **examples.md:** examples of what great ideation sessions look like, for tone and depth calibration.

An optional bootstrap script initializes the ideas directory: `bash /mnt/skills/user/idea-refine/scripts/idea-refine.sh`. The final artifact saves to `docs/ideas/[idea-name].md`, and only after the user confirms both the direction and the save.

Peer practice validates the artifact-anchored approach: an ideation skill for engineering teams produces "a ranked, reasoned idea set as a saved file you can open, share, brainstorm from, or discard," and for software work pairs ideation with codebase audits ("what to improve in this repo") weighted against strategy documents (https://github.com/EveryInc/compound-engineering-plugin/blob/main/docs/skills/ce-ideate.md, jev weight 0.40, weak backing). The convergence on "save it as a file, ranked and reasoned" is the same insight the skill encodes in its one-pager.

## Boundary discipline

The skill closes with a scope rule: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job." When a request only names a trigger without the artifact it acts on, the agent routes to the owning surface instead of improvising. Codebase grounding expands what the skill can see; it does not expand what the skill is for.
