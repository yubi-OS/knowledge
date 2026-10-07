# 05 Profiles and mkosi.conf.d Dropins

Scope: how yubiOS expresses per-profile configuration through `mkosi.conf.d/` and the `[Match]` section, and how profiles are selected at build time.

## The yubiOS profile shape

The source doc (`yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`) shows the yubiOS profile living at `mkosi.conf.d/yubiOS/mkosi.conf`:

```ini
# mkosi.conf.d/yubiOS/mkosi.conf  (profile)
[Match]
Profile=yubiOS

[Distribution]
Distribution=debian
Release=trixie

[Content]
Packages=
    pam-u2f
    yubikey-manager
    libfido2-dev

[Output]
KernelCommandLine=rd.luks.options=fido2-device=auto
```

Selected with `mkosi --profile=yubiOS build` (source doc). The pattern carries three ideas: a `[Match]` gate that activates the file only when the named profile is requested, section settings that augment the base `mkosi.conf`, and a `KernelCommandLine=` that injects profile-specific boot options (here the FIDO2 LUKS unlock option that pairs with the FIDO2 enrollment performed in the finalize stage, doc 06).

## How upstream models profiles and dropins

The upstream man page documents the `[Match]` section with a `Profiles=` matching option and states that the configuration files and directories of each profile are included after parsing the `mkosi.conf.d/*.conf` drop-in configuration (weight 0.91, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md). That ordering matters for yubiOS: profile settings always win over generic drop-ins, so the profile is the right place for security-relevant overrides like the kernel command line.

The same man page documents `UnifiedKernelImageProfiles=` (or `--uki-profile=`) as the separate, later feature for building multiple UKI variants: it takes a comma-separated list of paths to UKI profile config files and may be used multiple times (weight 0.92, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md). Do not confuse the two: `mkosi.conf.d/<name>/` profiles vary the whole image build, while UKI profiles vary the unified kernel image contents. Config files in `mkosi.uki-profiles/` are picked up automatically and all configured UKI profiles are added to each UKI built (weight 0.91, same man page).

## Configuration precedence

A secondary survey source describes the parse order from lowest to highest precedence: `mkosi.conf` first, then the `mkosi.conf.d/` drop-in directory, then matching profile files (weight 0.15, https://deepwiki.com/systemd/mkosi/2.1-configuration-files; weak backing, below the 0.5 threshold, consistent with the man page's statement that profile configs are included after drop-ins).

## Why yubiOS uses profiles here

The yubiOS profile in the source doc exists to keep the security-sensitive additions separable from the base image:

1. `pam-u2f`, `yubikey-manager`, and `libfido2-dev` are the FIDO2/PIV package set; a non-yubiOS profile build can omit them entirely.
2. `rd.luks.options=fido2-device=auto` on the kernel command line is what makes the enrolled FIDO2 credential usable at boot; it belongs to the profile, not the base config, because images built without the profile are not FIDO2-unlockable.
3. Distribution settings repeated in the profile (`Distribution=debian`, `Release=trixie`) keep the profile self-contained when it is read on its own.

A community example of profiles in active use is ArchWiki's note that mkosi ships a built-in `mkosi-vm` profile that adds the packages needed to run a system, maintained by the mkosi maintainers (weight 0.53, https://wiki.archlinux.org/title/Mkosi). The mkosi repository itself advertises related profiles for measured boot and mkosi-kernel workflows (weight 0.93, https://github.com/systemd/mkosi).

## Verification before build

- `mkosi summary` shows the effective configuration; confirm the profile was matched (source doc command table, doc 01).
- `mkosi cat-config` prints every loaded config file with its name, so you can see the base config, dropins, and profile contributions in order (weight 0.90, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md).

## Sources

- Source doc: `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (the yubiOS profile block and `--profile` invocation)
- https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md (weight 0.91, 0.92, 0.90)
- https://github.com/systemd/mkosi (weight 0.93)
- https://wiki.archlinux.org/title/Mkosi (weight 0.53)
- https://deepwiki.com/systemd/mkosi/2.1-configuration-files (weight 0.15, weak backing)
