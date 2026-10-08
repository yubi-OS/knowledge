# 03 Step 1: Detect Stack and Versions

Scope: reading dependency manifests to identify the exact framework versions before any implementation, and asking the user instead of guessing when versions are missing or ambiguous.

## The mapping table

The ground skill opens its process with detection: read the project's dependency file to identify exact versions (source doc: yubi-OS/yubiOS skills/source-driven-development/SKILL.md). Its mapping table:

- package.json: Node, React, Vue, Angular, Svelte
- composer.json: PHP, Symfony, Laravel
- requirements.txt / pyproject.toml: Python, Django, Flask
- go.mod: Go
- Cargo.toml: Rust
- Gemfile: Ruby, Rails

The skill then requires the agent to state what it found explicitly, in a "STACK DETECTED" block naming each version and its file origin, followed by which documentation will be fetched (source doc). Example from the source doc:

```
STACK DETECTED:
- React 19.1.0 (from package.json)
- Vite 6.2.0
- Tailwind CSS 4.0.3
```

## Why exact versions, not ranges

A manifest records intent; a lockfile records what actually resolved. npm's own documentation describes package-lock.json as "automatically generated for any operations where npm modifies either the node_modules tree, or package.json" (https://docs.npmjs.com/cli/v12/configuring-npm/package-lock-json/, jev weight 0.07, weak backing). The supply-chain domain formalizes this: an SBOM (software bill of materials) provides "detailed visibility into their software ecosystems by representing comprehensive inventories of software components, dependencies, and relationships", including "first-party and third-party libraries, their versions, and their hierarchical interconnections" (https://cyclonedx.org/capabilities/sbom/, jev weight 0.81, primary backing). The CycloneDX standard treats version inventories as a first-class security artifact, not a convenience (https://cyclonedx.org/, jev weight 0.81, primary backing).

OWASP's dependency-graph cheat sheet pairs the two ideas: an SBOM "inventories software components; a dependency graph records their relationships", and recommends capturing both "in a standard machine-readable format" so vulnerable components can be located in releases and deployments (https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html, jev weight 0.53, primary backing). The same machine-readable version inventory that answers "is this pattern deprecated here?" also feeds vulnerability triage downstream.

Ecosystem-specific tooling confirms the pattern is universal: the CycloneDX Gradle plugin records "the components and relationships Gradle selected after conflict resolution, substitution, constraints, and transitive dependency resolution" (https://github.com/CycloneDX/cyclonedx-gradle-plugin, jev weight 0.75, primary backing), meaning the resolved graph, not the manifest's declared ranges, is the truth the docs must match.

## The ask-don't-guess rule

The skill is explicit: "If versions are missing or ambiguous, ask the user. Don't guess - the version determines which patterns are correct" (source doc). It is also the first of the skill's 2 numbered guidelines (source doc). The logic is direct: a pattern documented for React 19 may be wrong for 18; a hook documented as current may be deprecated in a newer minor. Guessing the version makes the later fetch verification meaningless, because the fetch is only authoritative for the version it documents.

## Practical discipline

A detection step that produces no output is incomplete. The skill's STACK DETECTED block is the contract: name the stack, name the versions, name the files they came from, then announce the fetch. That block is also what makes the later citation step auditable, because the reader can check each cited doc page against the detected version rather than against whatever the model remembers (source doc).
