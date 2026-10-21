# 01. Status of our seed files

**Scope:** Status of our seed files: detailed analysis grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md.

Ground source: `yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md`. Dig queries: `Ubuntu Subiquity autoinstall user-data cloud-init schema`; `curtin storage layout netplan autoinstall Ubuntu 26.04`.

## What was audited

The yubiOS seed files live at `Deploy/ubuntu/{user-data,meta-data,network-config,vendor-data}`. They are identical across three provisioning branches (Docker, oem-2026, Docker-Dev-26.04), and oem-2026 adds one extra variant, `user-data-arm64-desktop-minimal-2026`. The audit grounded them against canonical/subiquity `doc/reference/autoinstall-reference.rst` at main, a 2026-09-30 head that targets 26.04 development. The rendered form of that file is the Autoinstall configuration reference manual [Autoinstall configuration reference manual - Ubuntu Installation Guide](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html) (clef weight: 0.7475).

## How the four files fit together

The four filenames are the NoCloud data source convention used by cloud-init: `user-data` carries configuration, `meta-data` instance identity, `network-config` networking, and `vendor-data` vendor defaults. Subiquity, the Ubuntu installer, reads its configuration from an `autoinstall:` section inside user-data. Canonical's explanation of the cloud-init and autoinstall interaction is the most precise source here: cloud-init runs in the ephemeral installer environment, "then becomes inert for every subsequent reboot", and any `#cloud-config` module keys provided at top level modify that ephemeral system, while directives meant for the installed system must go elsewhere [Cloud-init and autoinstall interaction - Ubuntu Installation Guide](https://canonical-subiquity.readthedocs-hosted.com/en/latest/explanation/cloudinit-autoinstall-interaction.html) (clef weight: 0.8320). That split is why the yubiOS user-data mixes installer keys (under `autoinstall:`) with cloud-config keys such as `bootcmd` and `runcmd`.

Secondary write-ups describe the same pipeline. One notes that installer logs in `/var/log/installer` are copied into the target and that the autoinstall section consumed by curtin is saved as `/autoinstall.yaml` [Ubuntu Autoinstaller: Subiquity, Cloud-Init and Curtin](https://sebastianerfort.github.io/notes/public/tech/linux/Subiquity_CloudInit_Curtin/) (clef weight: 0.2732) (weak backing, clef weight < 0.5). A tutorial frames autoinstall as Subiquity's replacement for the Debian preseed system, read from a cloud-init user-data file served over HTTP or from local media [How to Use Subiquity to Automate Ubuntu Server Deployments](https://oneuptime.com/blog/post/2026-03-02-subiquity-automate-ubuntu-server-deployments/view) (clef weight: 0.0942) (weak backing, clef weight < 0.5). A community skill repository covers config sections for Ubuntu 24.04 through 26.04 [GitHub - cominotti/ubuntu-autoinstall: Ubuntu autoinstall.yaml ...](https://github.com/cominotti/ubuntu-autoinstall) (clef weight: 0.2262) (weak backing, clef weight < 0.5). These are weak backing and only corroborate the canonical docs.

## Verdict 1: version 1 is still the only version

`autoinstall: version: 1` remains the only version. No v2 exists. The audit's headline is that nothing in the yubiOS files is invalid against the current schema. The canonical schema reference presents the schema as a single document usable for manual pre-validation, while noting that runtime validation "is more involved" [Autoinstall schema - Ubuntu installation documentation](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-schema.html) (clef weight: 0.9365). That caveat matters: passing the static schema is necessary but does not guarantee a clean install.

## Verdict 2: the file is a Desktop installer export

The user-data's `autoinstall:` section is an export from the Ubuntu Desktop installer, produced by 24.04-era export machinery. As a result it already carries the 24.04+ fields:

| Field | Role |
|---|---|
| `interactive-sections` | Leaves named sections (here `storage` and `identity`) for the human at install time |
| `mirror-selection` | Mirror candidates for apt |
| `error-commands` | Commands run when the install fails |
| `oem`, `codecs`, `drivers` | Desktop extras toggles |
| deb822 `sources` | Modern apt source format |

Being an export rather than a hand-written file explains both its strengths (it uses current field names) and its risks (it may carry fields a human would not choose, and it hard-codes decisions made on the exporting machine).

## Verdict 3: storage is a curtin superset

The user-data uses a named storage layout (`lvm` with `encrypted: yes`). Under the hood, Subiquity accepts storage configuration in a syntax "that is a superset of that supported by curtin" [Autoinstall configuration reference manual - Ubuntu Installation Guide](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html) (clef weight: 0.7475), and curtin's own storage documentation describes the action-based format for partitions, RAID, LVM, and filesystems that MAAS and others use to customize machines [Storage - curtin 23.1.1 documentation - Read the Docs](https://curtin.readthedocs.io/en/latest/topics/storage.html) (clef weight: 0.5683). A community reference on storage layouts adds XFS, btrfs, and LUKS or TPM examples [ubuntu-autoinstall/references/storage-config.md at main · cominotti ...](https://github.com/cominotti/ubuntu-autoinstall/blob/main/references/storage-config.md) (clef weight: 0.3249) (weak backing, clef weight < 0.5). Doc 02 covers the newer layout options the audit flagged.

## Verdict 4: unknown keys warn today, fail later

In version 1, unrecognized keys produce warnings. The audit records that in future versions they will be a fatal validation error, so the file should be kept free of typos now. Because the file is an export, a stray or misspelled key would not be caught by hand review; a schema pre-validation step (doc 02) is the practical defense.

## Network and noise

`network-config` follows netplan YAML, Ubuntu's default network configuration format; a 26.04-focused netplan guide covers the essentials [Netplan Configuration Guide on Ubuntu 26.04 - LinuxConfig.org](https://linuxconfig.org/netplan-configuration-guide-on-ubuntu-26-04) (clef weight: 0.0878) (weak backing, clef weight < 0.5) (weak backing). The audit raised no network-config findings. The Ubuntu download page [Download - Get Ubuntu](https://ubuntu.com/download) (clef weight: 0.0346) (weak backing, clef weight < 0.5) was dig noise.

## Sources Considered

All 10 Clef-weighted searXNG results from `dig_context_01.json`. Weight >= 0.5 is authoritative backing; < 0.5 is weak backing.

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Cloud-init and autoinstall interaction - Ubuntu Installation Guide | https://canonical-subiquity.readthedocs-hosted.com/en/latest/explanation/cloudinit-autoinstall-interaction.html | 0.8320 | authoritative (>= 0.5) |
| 2 | Autoinstall schema - Ubuntu installation documentation | https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-schema.html | 0.9365 | authoritative (>= 0.5) |
| 3 | How to Use Subiquity to Automate Ubuntu Server Deployments | https://oneuptime.com/blog/post/2026-03-02-subiquity-automate-ubuntu-server-deployments/view | 0.0942 | weak backing (< 0.5) |
| 4 | Ubuntu Autoinstaller: Subiquity, Cloud-Init and Curtin | https://sebastianerfort.github.io/notes/public/tech/linux/Subiquity_CloudInit_Curtin/ | 0.2732 | weak backing (< 0.5) |
| 5 | Download - Get Ubuntu | https://ubuntu.com/download | 0.0346 | weak backing (< 0.5) |
| 6 | GitHub - cominotti/ubuntu-autoinstall: Ubuntu autoinstall.yaml ... | https://github.com/cominotti/ubuntu-autoinstall | 0.2262 | weak backing (< 0.5) |
| 7 | Netplan Configuration Guide on Ubuntu 26.04 - LinuxConfig.org | https://linuxconfig.org/netplan-configuration-guide-on-ubuntu-26-04 | 0.0878 | weak backing (< 0.5) |
| 8 | ubuntu-autoinstall/references/storage-config.md at main · cominotti ... | https://github.com/cominotti/ubuntu-autoinstall/blob/main/references/storage-config.md | 0.3249 | weak backing (< 0.5) |
| 9 | Autoinstall configuration reference manual - Ubuntu Installation Guide | https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html | 0.7475 | authoritative (>= 0.5) |
| 10 | Storage - curtin 23.1.1 documentation - Read the Docs | https://curtin.readthedocs.io/en/latest/topics/storage.html | 0.5683 | authoritative (>= 0.5) |
