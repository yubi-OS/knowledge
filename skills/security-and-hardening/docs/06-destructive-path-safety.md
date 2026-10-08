# 06: Destructive Operations on Derived Paths

Scope: the safety contract for delete, move, and overwrite operations whose target path is built from data: allowlisted root after symlink resolution, minimum depth below the root, and ownership evidence read before the operation, plus the 2 documented limits on the check. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## The core claim: arrival is not authorship

The source doc's thesis is that a destructive operation is only as safe as the value that names its target. Reading the path from the kernel, a job payload, or a sibling service proves where it arrived from, not who wrote it: another process's command line is as attacker-controlled as a form field. A shape check such as "absolute path, at least one directory deep" proves well-formedness only, and gets mistaken for authorization. That mistake is how a cleanup routine deletes the root instead of the leaf.

## The 3-part pre-condition

Before any destructive call, the source doc requires all 3 of:

1. **Allowlisted root, resolved.** The resolved target must sit under an allowlisted root, compared after resolving symlinks, never on the raw string.
2. **Minimum depth.** The target must be at least one level below that root, so a root is never itself the target.
3. **Ownership evidence, read early.** The target must carry evidence that it is yours, read before the operation and before any teardown that removes it. Otherwise "absent" and "not mine" are indistinguishable, and a missing marker cannot tell you whether to proceed.

On refusal, log the rejected target and stop. A cleanup that falls back to a broader default path is the failure this contract guards against.

## The vulnerability classes this contract maps to

The MITRE CWE catalog anchors the failure classes. CWE-22, Improper Limitation of a Pathname to a Restricted Directory (weight 0.95), is the path traversal class, and its entry walks an allowlist-then-delete example that fails because validation and use act on different path representations (https://cwe.mitre.org/data/definitions/22.html). CWE-61, UNIX Symbolic Link (Symlink) Following (weight 0.93), is the class where an attacker spoofs a symbolic link so a privileged operation acts on a different file than the code believes (https://cwe.mitre.org/data/definitions/61.html). The CWE program itself (weight 0.96) is the reference index tying these classes together (https://cwe.mitre.org/).

A published GitHub security advisory (weight 0.87) shows the compound failure: path traversal and symlink-follow in the skillctl tool "allow arbitrary file disclosure and deletion" (https://github.com/umanio-agency/skillctl/security/advisories/GHSA-wx3m-whqv-xv47). That is precisely the pair the source doc's contract addresses: unresolved paths plus symlink-following turn a cleanup tool into a deletion primitive.

## Limit 1: the marker is self-attestation

The source doc's first stated limit: a marker file inside the tree is self-attestation, because anything that can write into the tree can write the marker. The expected owner therefore has to come from authenticated state, and the marker itself needs integrity protection, restrictive ownership or a MAC, before it counts as authorization. A marker that only proves "someone with write access to this directory was here" proves nothing.

## Limit 2: the check/use race

The second limit: resolving a path and then operating on the name is a check/use (TOCTOU) race wherever an untrusted process can swap an ancestor directory. On a shared volume, the source doc prescribes holding the target by descriptor and using no-follow, beneath-the-root operations, or ensuring the hierarchy cannot change for the duration of the operation. A weakly backed Snyk article (0.44, https://snyk.io/articles/safe-path-handling/) reaches the same conclusion, naming file-descriptor-based operations as the fix for path traversal, symlink attacks, and TOCTOU races; treat that as corroboration at weak weight.

## Where this sits in the skill's tiers

The checklist and verification sections both carry this contract. The checklist input section requires delete, move, and overwrite targets built from data to be checked against an allowlisted root, a minimum depth, and ownership evidence read before the operation. The verification section requires that destructive filesystem operations resolve symlinks, then verify allowlisted root, minimum depth, and ownership before running. The red flags list names the anti-pattern directly: a delete, move, or overwrite whose target comes from a payload, config value, or another process's command line, guarded only by a shape check on the path.

## Provenance

Source doc claims: the arrival-versus-authorship thesis, the 3-part contract, the refusal-and-log rule, both limits, and the checklist and verification placements. Dig-backed claims: CWE-22 allowlist-then-delete failure mode (0.95), CWE-61 symlink-following class (0.93), the CWE index (0.96), and the skillctl advisory pairing traversal with symlink-follow (0.87). Weakly backed corroboration (labeled): the Snyk file-descriptor guidance (0.44), rsync's path confinement layering (0.31, https://deepwiki.com/RsyncProject/rsync/7.1-path-confinement-and-symlink-hardening), and a TOCTOU defenses writeup (0.23, https://www.systemshardening.com/articles/cross-cutting/toctou-vulnerability-defences/).
