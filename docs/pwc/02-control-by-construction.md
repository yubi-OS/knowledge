# 02. Control by Construction

*Scope: the strongest of the 3 PWC mechanisms. The unsafe state does not exist to be reached, so there is nothing for a controller to intervene on.*

## The defining move

Control by construction removes the state, not the access to it. A PAC architecture asks who may reach the dangerous state and who watches them. Construction asks a different question: can the dangerous state exist at all? When the answer is no, the entire supervisory layer becomes dead weight. There is no intervention to make because there is no intervention possible.

The source doctrine puts it precisely: "the writable surface was removed, the capability was never granted, the mutable alias was never created" (PWC.md, mechanism 1). Each phrase names a removal, not a restriction. A restriction is a rule some process must enforce. A removal is a fact about the system's shape.

## The 3 removals

**Removed writable surface.** If the bytes that matter cannot be written, no process can corrupt them and no watcher needs to detect corruption. The integrity property lives in the filesystem layout, not in a daemon.

**Capability never granted.** If a subject never holds the authority, there is no access to police. This is the capability-security move: authority exists only as an unforgeable reference, and if the reference was never handed out, the corresponding action is not merely forbidden but impossible. External background: the capability model treats every object reference as a capability that can be passed but not forged, following Mark Miller's Robust Composition line of work (weak backing: https://cosmonic.com/docs/platform-concepts/capabilities/, jev weight 0.42; related survey: https://en.wikipedia.org/wiki/Capability-based_security, jev weight 0.34). The grounding claim in this doc is narrower and comes from the source itself: the capability was never granted.

**No mutable alias.** If 2 names never point at the same mutable bytes, a write through one name cannot ambush a reader holding the other. The aliasing hazard is dissolved at design time, before any runtime check could even be scheduled.

## Why construction is the strongest

The source ranks the mechanisms explicitly: "Construction is the strongest form because it does not depend on any process behaving correctly at runtime" (PWC.md). This is the whole argument. A controller is a program, and programs must run, be patched, and be trusted not to be subverted. A structural property is not a program. It cannot be lied to, bypassed by a race, or switched off when its process crashes, because there is no process to crash.

PAC's first structural cost makes the same point from the other side: the controller is itself a program, and every controller is a privileged target (PWC.md). Construction deletes that target. It also deletes the third cost, where a controller converts a property into a procedure that evaporates when the watcher stops. A constructed property does not evaporate, because nothing is running that could stop.

## Where yubiOS already does it

The source names 4 yubiOS instances that are construction rather than supervision:

- **LUKS2 bound to FIDO2 hmac-secret** (ADR-011): update-survivability is achieved by construction. The disk key is bound to the token's secret, which updates cannot invalidate, so no controller re-binds anything after each update. The source contrasts this with the TPM-PCR alternative, which is PAC: a measurement policy that must be re-tuned whenever the measured world changes.
- **The composefs signed catalog**: the image is its own control. The catalog pins every file's digest and the mount refuses anything that does not match. No process compares hashes; the mount is the comparison.
- **Atomic A/B updates**: no controller watches an update for safety. The deployment either boots verified or the previous deployment is still there. Rollback is structural, not supervisory.
- **Build admission** (yubiOS.rego, ADR-014/015, PINNED.md): the OPA/Rego gate is a filter, not a supervisor. It does not watch the build; it refuses to let the build start on unpinned or floating inputs. Admission at the boundary replaces surveillance of the interior.

Each removed a watcher and kept the property.

## The honest cost

Construction is not free of assumptions, only of watchers. The source states the structural weakness plainly: "when a load-bearing assumption breaks, no one is watching, because there is no one" (PWC.md). A kernel feature floor, a signer that behaves, a format that stays stable: these are pins like any other input, named, dated, and re-checkable. A floor that silently shifts is a control that silently stopped. And every controller-free mechanism must still produce a detectable signal when an assumption breaks, because evidence is the second half of the claim (PWC.md). Construction removes the runtime dependency; it does not remove the obligation to prove the structure still holds.

## One-sentence doctrine

When you can move a control from a process into a structure, you must, because processes are attack surface and structures are not.

## Sources

| source | url | jev weight |
| --- | --- | --- |
| Capabilities (Cosmonic docs; Miller Robust Composition attribution) | https://cosmonic.com/docs/platform-concepts/capabilities/ | 0.42 (weak backing) |
| Capability-based security, Wikipedia | https://en.wikipedia.org/wiki/Capability-based_security | 0.34 (weak backing) |
