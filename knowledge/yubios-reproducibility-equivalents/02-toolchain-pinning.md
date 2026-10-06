# Pinning the image build toolchain

Scope: the three ways to pin an OS image build toolchain (Nix flake pin, fork plus git-SHA pin, version floor enforcement), what each constrains, and the tradeoffs an image project faces when choosing.

## The prior-art design: Nix flake pins

Edgeless's reproducible-mkosi is the canonical example of the Nix approach: the repository "shows how to use Nix to pin mkosi and required tools and build bit-by-bit reproducible OS images". [1] (weight 0.83) A flake pins mkosi to an upstream commit with a content hash, so the build tool itself becomes a declared, verifiable input rather than a mutable host dependency.

Nix's general model supports this well: it pins all inputs by default, and guides on reproducible server environments emphasize pinned toolchains and dev shells as the mechanism for team-wide tool consistency. [2] (weight 0.35, weak) [3] (weight 0.12, weak)

The cost is toolchain surface area. A Nix dependency adds an entirely second package ecosystem to a project that otherwise builds with one distro's tooling, and every contributor and CI runner must understand both.

## The fork plus SHA pin

yubiOS takes a different path: it maintains a yubi-OS/mkosi fork pinned at source commit b2b1ea6ad59621a6f955e4cbceee72580a91889a, recorded in PINNED.md, with MinimumVersion=26~devel enforcing mkosi v26 or newer, and a fetch-released-tag-ref.yml workflow that rolls the fork forward to new released tags while preserving yubiOS-specific commits. (per the yubiOS refs note, 2026-07-30)

Git SHA pinning achieves the same determinism property Nix provides for the tool itself: mkosi upstream documents that distributions' packaged versions lag, and that users should verify the version and install newer when needed. [4] (weight 0.88) A pinned commit is at least as deterministic as a Nix flake pin for this specific tool, and it integrates with existing automation instead of adding a second toolchain. The practical tradeoff: the fork must be maintained and rolled forward deliberately, and the roll-forward automation must preserve local patches.

## The version floor as a third mechanism

A version floor is weaker than a SHA pin but operationally cheap. mkosi upstream's own guidance is to require at least a known minimum version (v16 or newer in current docs) when installing from a distribution package manager. [4] (weight 0.88) A floor guarantees the presence of fixes merged by a certain version but does not guarantee a bit-identical tool; two runners on mkosi 26.1 and 26.4 both pass a MinimumVersion=26 floor yet are different programs.

That is why yubiOS pairs the floor with the SHA pin: the floor (MinimumVersion=26~devel) protects against silently running an ancient mkosi, the SHA pin (PINNED.md) makes the actual tool byte-identical across runners. (per the yubiOS refs note)

## What the pin actually buys

Reproducibility definitions make the dependency explicit: two independent clean builds produce byte-identical output only when starting from the same declared inputs, which include commit, source tree, toolchain, and environment. [5] (weight 0.12, weak) The toolchain is one of those declared inputs; an unpinned mkosi is an undeclared input that changes under the build.

Tool-level pins matter less when the tool's own output is version-stable, but mkosi's image-building path (package manager invocations, partition tooling, initrd assembly) has historically carried reproducibility bugs that only newer versions fix (see the upstream-fixes doc in this corpus). Pinning to a known-good SHA therefore is not bureaucracy, it is the mechanism that keeps those fixes active in every build.

## Verdict for an OS image project

The Nix flake pin is a tested pattern with high determinism and high adoption cost. The fork plus git-SHA pin with a version floor achieves equivalent rigor for a single-tool pipeline without adding a second package ecosystem. Choose Nix only if the project must build across multiple host distros with one toolchain definition; otherwise the fork pin is the smaller, sufficient surface.

## Sources

1. https://github.com/edgelesssys/reproducible-mkosi (weight 0.83)
2. https://mylinux.work/guides/nix-reproducible-server-environments/ (weight 0.35, weak)
3. https://oneuptime.com/blog/post/2026-01-25-nix-reproducible-environments/view (weight 0.12, weak)
4. https://github.com/systemd/mkosi (weight 0.88)
5. https://buglyst.com/learn/verification/clarity-verify-reproducible-build (weight 0.12, weak)
