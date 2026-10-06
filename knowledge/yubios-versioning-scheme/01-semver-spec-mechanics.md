# 01: SemVer 2.0.0 mechanics and the v prefix

Scope: what SemVer 2.0.0 actually mandates for a release tag: the MAJOR.MINOR.PATCH grammar, pre-release and build-metadata suffixes, and where the v prefix comes from.

## The increment rules

The SemVer 2.0.0 spec defines a version number as MAJOR.MINOR.PATCH and fixes what each increment means: MAJOR version when you make incompatible API changes, MINOR version when you add functionality in a backward compatible manner, and PATCH version when you make backward compatible bug fixes [1]. This is the load-bearing rule set for any OS project that formalizes its versioning: the three numbers are not decoration, they are a contract about what changed.

## Pre-release suffixes

A pre-release version is denoted by appending a hyphen and a series of dot separated identifiers immediately following the patch version [3]. Identifiers MUST comprise only ASCII alphanumerics and hyphen, and MUST NOT be empty. Numeric identifiers MUST NOT include leading zeroes. So v0.7.1-rc1 and v0.7.1-beta.2 are both spec-shaped suffixes. Precedence: when major, minor, and patch are equal, a pre-release version has lower precedence than the normal version, so 1.0.0-alpha < 1.0.0 [2]. This matters for tooling that compares tags: an rc tag sorts below the final release of the same triple.

## Build metadata

Build metadata MAY be denoted by appending a plus sign and a series of dot separated identifiers immediately following the patch or pre-release version [3]. The critical property: build metadata MUST be ignored when determining version precedence, so two versions that differ only in build metadata have the same precedence [2]. A tag like v0.7.1+arm64-only is therefore equal in precedence to v0.7.1. An OS project that encodes build variants in the metadata segment must not rely on metadata for ordering or deduplication logic, because the spec says consumers ignore it [3].

## The v prefix

The v prefix is convention, not specification. The SemVer FAQ added a clarification in 2019 that the v prefix is "a common way to indicate a version number" while noting that strictly speaking v1.2.3 is not itself a valid SemVer string [4]. GitHub's own tagging suggestions tell users it is common practice to prefix version names with the letter v and give v1.0 and v2.3.4 as examples [5] (weak backing, weight 0.04). Tooling literature agrees that Git projects almost universally prefix the tag with a lowercase v purely as convention, and that SemVer itself does not require it but most tools and GitHub Releases expect it [6] (weak backing, weight 0.14).

The formal decision to adopt v-prefixed tags is therefore a project-level choice that rides on top of spec compliance: it trades strict SemVer string validity for human-readable tag names that every release tooling surface already handles.

## Tag mechanics in git

Git tags can be lightweight or annotated, and GitHub Releases are built on top of a tag [7] (weak backing, weight 0.41). Tools like git-semver exist specifically to derive the next SemVer version from git tags [8] (weak backing, weight 0.46), which only works when the tag naming is disciplined. This is the practical argument for codifying the scheme: automated bump tooling cannot infer MAJOR vs MINOR vs PATCH unless the project states the mapping.

## Application to the yubiOS decision

The yubiOS versioning decision (yubi-OS/yubiOS refs/yubios-versioning-scheme-2026-08-04) adopts exactly this shape: Semantic Versioning 2.0.0 for human-facing release tags as vMAJOR.MINOR.PATCH, optional dot-separated pre-release suffixes per SemVer 2.0.0 section 2, and build metadata suffixes allowed but rarely used. The first formal v-prefixed tag was v0.7.1 on 2026-08-01. The web sources above back the spec-level rules that decision relies on.

## Sources

1. https://semver.org/spec/v2.0.0.html (jev weight 0.95, authoritative)
2. https://semver.org/ (jev weight 0.91, authoritative)
3. https://semver.org/spec/v2.0.0-rc.2.html (jev weight 0.72, authoritative)
4. https://stackoverflow.com/questions/21639437/git-flow-release-branches-and-tags-with-or-without-v-prefix (jev weight 0.02, weak)
5. https://stackoverflow.com/questions/37781073/why-github-suggest-prefix-your-version-names-with-the-letter-v (jev weight 0.04, weak)
6. https://learn.programmingline.com/learn/git/git-semantic-versioning (jev weight 0.14, weak)
7. https://topictrick.com/blog/git-tagging-releases-versioning (jev weight 0.41, weak)
8. https://github.com/mdomke/git-semver (jev weight 0.46, weak)
