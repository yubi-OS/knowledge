# 03: What triggers a MAJOR, MINOR, or PATCH bump

Scope: mapping the SemVer increment rules onto an OS image project: protocol breaks, feature additions, pipeline fixes, and the pre-1.0 caveat.

## The spec-level triggers

SemVer 2.0.0 fixes the trigger mapping in one paragraph: increment MAJOR for incompatible API changes, MINOR for backward compatible functionality additions, PATCH for backward compatible bug fixes [1]. A second spec rule completes the policy: when MAJOR is incremented, MINOR and PATCH MUST be reset to 0 [2]. Version numbers therefore encode a claim about the change class, and the bump decision is a policy question of what counts as an incompatible change for this project.

## Translating "API" for an OS image project

For a library, the public API is function signatures. For an OS image, the "API" is every interface a user or integrator depends on: install commands, disk unlock flows, boot artifact formats, and verification paths. Practitioner guides generalize the same way: major bumps when there are breaking changes, meaning any change that breaks existing functionality or changes the public API, and minor bumps when adding new functionality in a backward compatible way [3] (weak backing, weight 0.09). The yubiOS decision instantiates this by naming its concrete incompatible surfaces: changes to the bootc install protocol, the LUKS2 FIDO2 unlock protocol, the signed UKI format, or any dm-verity root hash computation change that forces user re-enrollment each trigger MAJOR.

The corresponding MINOR list in that decision includes new sysext overlays, new portable services, new CI gates that do not change install behavior, and new architecture decision records that affect design but not the running artifact. PATCH covers build-pipeline fixes that do not change the produced image, test-surface fixes, and CI workflow fixes. This instantiation is the codification step most projects skip: the spec gives three verbs, the policy names which surfaces those verbs attach to.

## The pre-1.0 carve-out

SemVer 2.0.0 section 4 states that major version zero (0.y.z) is for initial development, anything may change at any time, and the public API should not be considered stable [1]. The npm semver maintainers discuss the consequence in issue threads: many authors treat a 0.x version as effectively no stability promise at all [4] (weak backing, weight 0.26). A 0.y.z essay puts it sharply: module authors are not allowed to make breaking changes in the minor or patch numbers once past 1.0, but below 1.0 the guarantee is thinner [5] (weak backing, weight 0.40).

For an OS project this has a concrete consequence: a MAJOR-style breaking change made before 1.0 only requires a MINOR bump by convention, not by spec force. The policy must state explicitly that pre-1.0 releases carry the anything-can-change caveat, so consumers do not infer a stability contract the series has not made yet. The yubiOS decision does exactly this: all v0.x.y releases are declared pre-1.0 with the SemVer 2.0.0 section 4 caveat attached, and v1.0.0 is named as the launch target where the full contract begins.

## Enforcement in practice

A versioning policy is only as good as its audit trail. Wikipedia notes semantic versioning is the commonly adopted three-part scheme for assigning version numbers to software states [6] (weak backing, weight 0.19), but adoption does not enforce consistency; compliance checking is a separate discipline covered in doc 07. The npm node-semver issue tracker shows real-world ambiguity around 0.x handling, evidence that teams hit the edge cases early [7] (weak backing, weight 0.06).

## Application to the yubiOS decision

The yubiOS bump policy follows the spec triggers with an explicit surface list per class, a pre-1.0 disclaimer citing SemVer 2.0.0 section 4, and a boundary decision matrix (see doc 05). The release history confirmed the mapping held: the 0.7.x to 0.8.0 transition was treated as a MINOR bump because no breaking change was claimed, consistent with the policy.

## Sources

1. https://semver.org/spec/v2.0.0.html (jev weight 0.95, authoritative)
2. https://semantic-versioning.org/ (jev weight 0.34, weak)
3. https://www.devtools.tools/blog/semantic-versioning-guide (jev weight 0.09, weak)
4. https://github.com/npm/node-semver/issues/344 (jev weight 0.26, weak)
5. https://www.forbeslindesay.co.uk/post/53849897522/semver-0yz (jev weight 0.40, weak)
6. https://en.wikipedia.org/wiki/Software_versioning (jev weight 0.19, weak)
7. https://github.com/npm/node-semver/issues/79 (jev weight 0.06, weak)
