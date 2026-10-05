# 02 Fitting Everything Together: The Design Goals

Scope: the 11 design goals of Lennart Poettering's 2022 essay "Fitting Everything Together" and how they define the image-based immutable OS vision.

## The essay

"Fitting Everything Together" is the canonical statement of Poettering's ideal OS design, published on 0pointer.net (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). LWN's coverage on 2022-05-09 summarizes the core move: "the focus must be on an image-based design rather than a package-based one" for the OS (source: https://lwn.net/Articles/894396/, jev 0.81). The essay designs the system in great detail from firmware to applications, and it is the reference point every later systemd feature (repart, sysupdate, UKI, sysext, homed) plugs into (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## The 11 design goals

The essay lays out these goals, each mapped to concrete systemd tooling (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95):

1. Image-based over package-based. The OS is shipped as reproducible, immutable images; cattle, not pets. LWN quotes Poettering directly on the image-based focus (source: https://lwn.net/Articles/894396/, jev 0.81).
2. Trust chain from boot loader to apps. All code is cryptographically validated before execution, from UEFI firmware through kernel, initrd, and OS images down to services.
3. Offline security. Data is encrypted at rest and bound to TPM2 hardware, so a disk removed from the machine is unreadable.
4. Cryptographic measurement everywhere. Every boot step measures the next into TPM PCRs, enabling remote attestation of the running system.
5. Self-updating. A/B atomic upgrades via systemd-sysupdate, so a failed update is a reboot into the previous slot, not a broken system.
6. Robust against power loss. The A/B partition scheme means interrupted updates never leave a half-written OS.
7. Factory reset. systemd-repart can erase flagged partitions on request, returning a machine to a pristine vendor state.
8. Vendor/system/user separation. /usr is immutable and vendor-owned, while /etc and /var remain writable for local state.
9. Adaptive. systemd-repart creates missing partitions and grows undersized ones on first boot, so one image fits machines of many sizes.
10. No installer. Any image can run live; installing is dd-ing it to disk. A system installed this way is identical to one built in a factory.
11. Local key generation. Secrets are generated on the machine, not pre-provisioned, so the vendor never holds the user's keys.

## Boot flow implied by the goals

The essay's boot design follows from goal 2 and goal 1: a Unified Kernel Image is picked by systemd-boot, which chooses the newest version by version sort, so there is no mechanism required to explicitly switch to the newer version (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). On first boot systemd-repart creates the root filesystem, encrypts it, and enrolls a TPM2 key, which ties goals 3, 9, and 11 together (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). The essay's model keeps the A/B update slot decision automatic and version-sorted rather than configuration-driven (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## How the community received it

LWN readers and the essay itself generated substantial discussion; the LWN thread shows both strong interest and pushback on systemd-centric designs, with commenters criticizing what they saw as politicized systemd usage and deprecation of previously normal features (source: https://lwn.net/Articles/894429/, jev 0.84). The essay remained influential enough that 3 years later the FOSDEM 2025 talk "ParticleOS: Can we make Lennart Poettering run an image based distribution?" noted that Poettering himself ran a mostly stock Fedora system, and ParticleOS was created as an image-based distribution to close that gap (source: https://archive.fosdem.org/2025/schedule/event/fosdem-2025-4057-particleos-can-we-make-lennart-poettering-run-an-image-based-distribution-/, jev 0.73; video: https://av.tib.eu/media/72067, jev 0.51).

## Continuity into the systemd v261 era

The image-based goal is still the organizing principle in 2026. Poettering's v261 Mastodon story on extensions states that in a fully image based OS, extensions are the right way to insert additional code, connecting the original vision to the modern sysext tooling (source: https://mastodon.social/@pid_eins/116792552048067669, jev 0.39, low weight). The 2022 goals and the 2026 implementation are the same arc: repart, sysupdate, UKI, sysext, and cryptenroll each implement one numbered goal above (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).
