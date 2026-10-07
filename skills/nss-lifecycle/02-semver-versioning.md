# 02 - SemVer as the compatibility rule, not the lifecycle model

Scope: what SemVer 2.0.0 actually prescribes, how the version coordinates (introduced_in, last_changed_in, deprecated_in, removed_in, current_version) relate to it, and why a version number alone cannot express stage obligations.

Grounding spine: the source doc `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 1.

## What SemVer 2.0.0 prescribes

The SemVer specification defines the scheme: given a version number MAJOR.MINOR.PATCH, increment the MAJOR version when you make incompatible API changes, the MINOR version when you add functionality in a backward compatible manner, and the PATCH version when you make backward compatible bug fixes; additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format (https://semver.org/, jev 0.89). The spec is a set of rules and requirements that dictate how version numbers are assigned and incremented (https://github.com/semver/semver, jev 0.83).

The nuance worth keeping: the general meaning of PATCH, MINOR, and MAJOR is defined by the spec, but the specific interpretation depends on the class of resource being versioned. An API, a schema, or an application all interpret "when to bump" a bit differently (https://semantic-versioning.org/, jev 0.85). In that interpretation, MINOR covers new functionality added to the public API in a backwards compatible way, including new information in return values, while MAJOR covers any change to the public API that breaks backwards compatibility (https://semantic-versioning.org/, jev 0.85).

One hard rule from the spec is directly lifecycle-relevant: even when you realize you have broken the Semantic Versioning spec, the fix is to release a new minor version that corrects the problem and restores backwards compatibility; it is unacceptable to modify versioned releases (https://semver.org/spec/v2.0.0-rc.2.html, jev 0.86). That is the standard basis for the yubiOS rule that released versions must not be modified in place (source doc).

## The version coordinates the Lifecycle block records

The lifecycle block records both the version coordinates and the reason and user action associated with each transition (source doc). The fields:

- `introduced_in`: the version where the file, symbol, or endpoint first appeared (source doc).
- `last_changed_in`: the version of the most recent functional change (source doc).
- `deprecated_in`: the version when deprecated; null if not deprecated (source doc).
- `removed_in`: the version when removed; null if still present (source doc).
- `current_version`: the version coordinate under the declared versioning rule (source doc).

The versioning rule itself is also declared: semver-2.0.0, calver, epochs, or none (source doc). yubiOS workflow_call inputs and outputs follow MAJOR.MINOR, per the GitHub Actions example block (source doc).

## Why the version number cannot carry the obligations

The source doc is explicit: a version number cannot express "stable but deprecated for 6 months," "beta may break in a minor release," or "removed from code but retained in the archived documentation" (source doc). SemVer tells you the compatibility increment of a release; it does not tell you whether an API is experimental, whether it is still supported, when it will be removed, or how to migrate (source doc). A public API deprecation itself requires a MINOR release, and removal normally belongs in a later MAJOR release (source doc, consistent with the SemVer scheme above).

A public API deprecation requires SemVer 2.0.0's precondition of a declared, precise public API (source doc). This is why the nss-lifecycle skill treats the Lifecycle block, not the version string, as the layer where obligations live: obligations are state-machine facts (stage, transition, notice period, migration), and the version coordinates merely locate them on a timeline.

## Practice notes from the yubiOS surface

- For scripts, the top-of-file `## Lifecycle` block carries stage, introduced_in, last_changed_in, conventional-commit compatibility, and exit-code semantics on stage transitions (source doc).
- For refs/notes, frontmatter carries `stage:`, `stage_since:`, `introduced_in:`, `last_changed_in:`, `supersedes:`, `superseded_by:`, `owner:`, `next_review:` (source doc).
- The example blocks in the source doc always pair the version fields with a deprecation record and review cadence, e.g. a deprecated script records introduced_in 0.9.0, last_changed_in 1.4.0, deprecated_in 1.5.0, removal_in_version 2.0.0, sunset_at 2027-02-12 with a 180-day notice_period (source doc).

## Sources

- Source doc: `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, section "Standards the section encodes" item 1, "What Lifecycle covers" field table, "Lifecycle and the yubiOS surface", Examples 3 and 5.
- https://semver.org/ (jev 0.89)
- https://semver.org/spec/v2.0.0-rc.2.html (jev 0.86)
- https://semantic-versioning.org/ (jev 0.85)
- https://github.com/semver/semver (jev 0.83)
