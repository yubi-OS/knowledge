# 05: PWC in yubiOS

*Where the doctrine is not aspiration but the existing architecture: five places yubiOS dissolved a controller into a structure, and one place it deliberately kept PAC.*

yubiOS does not implement PWC; yubiOS predates its name. The doctrine is mostly a description of choices the architecture already made. This doc maps each choice to the mechanism that carries it: construction, verification at use, or record.

## dm-verity on /usr: verification at use

The classic PAC answer to root filesystem integrity is a file-integrity daemon: a process that walks the tree, hashes files, and quarantines mismatches. yubiOS has no such watcher. Verification lives in the read path itself (ADR-007, SPEC.md principle 3): the control is the device-mapper mapping, and every byte of `/usr` is validated on read. A poisoned byte does not get quarantined by an agent after the fact; it fails to read.

This is the doctrine's cleanest instance of mechanism 2. The check and the use are the same act, so there is no gap between check and use and no TOCTOU to race. The integrity property does not depend on a watcher running, staying patched, or seeing the whole tree; it depends only on the mapper refusing what the root digest does not certify.

## Composefs and the signed catalog: the image is its own control

dm-verity verifies a block device. Composefs verifies the image as a unit: the catalog pins every file's digest and the mount refuses anything that does not match. No process compares hashes; the mount is the comparison.

The structural move is the same as dm-verity, lifted one level. Where a PAC design would run a checker that compares installed files against a manifest and alerts on drift, yubiOS makes the manifest part of the mount itself. There is no checker to kill, and no interval between checks in which a file could be swapped.

## Atomic A/B updates: rollback is structural

No controller watches an update for safety. There is no post-install daemon that inspects the new deployment and decides whether to keep it. The deployment either boots verified or the previous deployment is still there.

That is control by construction (mechanism 1) layered on verification at use. The unsafe state, a boot that silently replaces a good system with a bad one, does not exist to be reached, because the old deployment was never mutated in place. Rollback is not a supervisory action taken by an agent; it is the absence of the new deployment having displaced the old one. The watcher's entire job has been dissolved into the layout of the disk.

## LUKS2 bound to FIDO2 hmac-secret: construction vs PAC, head to head

ADR-011 is the sharpest side-by-side in the codebase, because it contains both models for the same problem: keeping disk unlock working across updates.

The chosen design binds the LUKS2 disk key to the YubiKey's hmac-secret. Updates cannot invalidate that binding, so update-survivability is achieved by construction: there is nothing for a controller to do after every update, because there is nothing to re-bind. The property lives in the structure.

The rejected alternative, TPM-PCR sealing, is textbook PAC. A measurement policy is a controller that must be re-tuned every time the measured world changes: every kernel update, every firmware refresh, every policy edit risks sealing the disk out from under its owner. The controller earns its cost on every update and delivers no property the token binding does not already deliver. When one of two designs requires a standing process to stay correct and the other requires nothing, PWC picks the second, and ADR-011 did.

## Build admission: the filter that replaces surveillance

The OPA/Rego gate ([yubiOS.rego](../yubiOS.rego)) is a filter, not a supervisor. It does not watch the build as it runs; it refuses to let the build start on unpinned or floating inputs (ADR-014/015, [PINNED.md](../PINNED.md)). Admission at the boundary replaces surveillance of the interior.

The MISSION.md statement is the same claim from the other direction: every base image and CI action is digest-pinned, mutable tags are rejected by build policy, every build passes the supply-chain gate before a single layer executes, and every build ships with SLSA provenance and SBOM attestations. A poisoned base image cannot be detected mid-build by a watcher; it is never allowed to become an input. And the provenance and SBOM that ship with the build are control by record: they leave evidence an independent auditor can replay, so the gate's verdict can be falsified after the fact without anyone having stood guard over the build.

## The doctrine in one sentence

Each of these mechanisms removed a watcher and kept the property. That is the whole doctrine: when you can move a control from a process into a structure, you must, because processes are attack surface and structures are not. The counterweight, and the subject of doc 07, is that every structural control rests on named assumptions (a kernel feature floor, a signer that behaves, a format that stays stable) and that PWC's evidence half is what detects the day an assumption stops holding.
