# 02. New fields in the autoinstall format since our file was generated

**Scope:** New fields in the autoinstall format since our file was generated: detailed analysis grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md.

Ground source: `yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md`. Dig queries: `jsonschema validation YAML null ubuntu-pro autoinstall`; `apt GPG key dearmored sources.list.d cloud-init`.

## Validation context

Before reading the new fields, it helps to know how they are checked. Canonical states that "autoinstall configurations are validated against a JSON schema before they are used" [Autoinstall configuration reference manual - Ubuntu Installation Guide](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html) (clef weight: 0.8678), and its validation how-to demonstrates pre-validating a config against that schema before it reaches an installer [Autoinstall Validation - Ubuntu installation documentation](https://canonical-subiquity.readthedocs-hosted.com/en/latest/howto/autoinstall-validation.html) (clef weight: 0.6281). An older Ubuntu Discourse thread explains why runtime validation is staged: early commands are loaded and validated and run first, then the config is reloaded and all sections are validated, so most validation errors can be reported after early commands have had a chance to modify the config [JSON schema for autoinstall config - Server Guide - Ubuntu Discourse](https://discourse.ubuntu.com/t/json-schema-for-autoinstall-config/16615) (clef weight: 0.1291) (weak backing, clef weight < 0.5). General JSON Schema material confirms that the `type` keyword can constrain an instance to null among other types [JSON Schema](https://json-schema.org/learn/getting-started-step-by-step) (clef weight: 0.0958) (weak backing, clef weight < 0.5), and the Python jsonschema library documents validating YAML by loading it to native types first [jsonschema 4.26.0 documentation](https://python-jsonschema.readthedocs.io/) (clef weight: 0.0510) (weak backing, clef weight < 0.5). Those last three are weak backing. The practical rule: any new field below can be pre-validated, and a typo in it would surface as a warning today.

## The new-fields table

The audit compared the yubiOS export against the current reference and listed 13 additions or clarifications:

| Field | Added | Relevance to yubiOS |
|---|---|---|
| `storage.layout.name: hybrid` | TPM-backed FDE flow; docs 2026-07-02 | Modern desktop FDE with `encrypted: yes`. yubiOS uses `lvm` plus passphrase LUKS, still valid. Not usable on the Rockchip flow (no TPM-backed FDE in that path) |
| `storage.layout.accepted-errors` | 2026-07-02 | Autoinstall equivalent of "Solution: Ignore" for TPM or FDE pre-install errors such as `running-in-vm`; honored only where snapd offers a `proceed` action |
| `storage.layout: direct` + `ptable: msdos` | 2025-01-31 | MBR instead of GPT |
| `reset-partition` / `reset-partition-only` | Code since 2024 | FAT32 partition with the full installer image for media-free reinstall; directly relevant to oem-2026 |
| `storage.swap` | Current | Curtin swap config, for example `size: 0` |
| `storage.layout.match` as ordered list | Subiquity 24.08.1 | First match wins; single-map form still valid |
| `apt.fallback` default `offline-install`; new `continue-anyway` | 2024-08-19 | yubiOS pins `abort` explicitly |
| `identity.groups` | 2025-11-02 | N/A; identity is interactive |
| `kernel-crash-dumps.enabled` | 2024-09-04 | Default `null` enables kdump dynamically on qualifying arm64 boxes |
| `snaps:` | Current | yubiOS installs snaps in `runcmd` instead |
| `zdevs` | 2025-02-03 | IBM Z only; irrelevant on arm64 |
| Keyboard multi-layout | 2026-07-01 | With TPM-FDE plus passphrase, only the primary layout unlocks |
| `oem.install: auto` | Current | yubiOS pins `false` |
| `apt.geoip: false` clarification | 2026-09-30 | Disables country-mirror selection only, not the lookup |

## The three that change behavior on yubiOS hardware

**`kernel-crash-dumps.enabled`.** On 24.10 and later the default is `null`, meaning dynamic enablement. On arm64 machines meeting minimum requirements, `kdump-tools` gets enabled. The audit's warning: on a small SBC this silently reserves crashkernel memory. If kdump is unwanted, set `enabled: false`. This is the one new field whose default quietly changes the installed system.

**`reset-partition`.** A FAT32 partition carrying the full installer image lets the box re-enter the installer from GRUB or EFI without media. `reset-partition: 12G` pins its size; `reset-partition-only: true` installs only that partition. The audit marks it directly relevant to the oem-2026 provisioning branch.

**`storage.layout.name: hybrid`.** This is the modern desktop path for TPM-backed full-disk encryption, but the Rockchip flow has no TPM-backed FDE support, so it is informational for yubiOS. Passphrase LUKS on `lvm` remains valid.

## apt sources and keys

Several new apt semantics touch the yubiOS sources setup. cloud-init's apt documentation shows mirror configuration with a `uri` or a `search` list, and per-source key handling [Configure APT - cloud-init 26.2 documentation](https://docs.cloud-init.io/en/latest/reference/yaml_examples/apt.html) (clef weight: 0.6347). The broader ecosystem moved away from `apt-key`: DigitalOcean describes replacing it with GPG keyrings for external repositories [apt-key Deprecation: Add Repositories with GPG on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-handle-apt-key-and-add-apt-repository-deprecation-using-gpg-to-add-external-repositories-on-ubuntu-22-04) (clef weight: 0.3090) (weak backing, clef weight < 0.5), It's FOSS describes dedicated keyring files [(Fixed) apt-key is deprecated. Manage keyring files in trusted.gpg.d](https://itsfoss.com/apt-key-deprecated/) (clef weight: 0.1473) (weak backing, clef weight < 0.5), and a Stack Overflow answer shows cloud-init fetching a key and marking a source as signed by it [Cloud-init: Fetch apt key from remote file instead of from a key server ...](https://stackoverflow.com/questions/72620609/cloud-init-fetch-apt-key-from-remote-file-instead-of-from-a-key-server) (clef weight: 0.0673) (weak backing, clef weight < 0.5). The yubiOS file already uses deb822 `sources`, which matches that direction. On `apt.fallback`, the default is now `offline-install` with a new `continue-anyway` option, but yubiOS pins `abort`, which fails the install rather than continuing without the network mirror. On `apt.geoip: false`, the 2026-09-30 clarification matters for privacy reasoning: it only disables country-mirror selection, not the geoip lookup itself. A music video [APT. - YouTube Music](https://music.youtube.com/watch?v=ekr2nIex040&list=OLAK5uy_k2YxpFz1nV_Iht8W3Y2SgJVGTBsnwZJaM) (clef weight: 0.0202) (weak backing, clef weight < 0.5) was dig noise.

## Fields that do not apply

`identity.groups` is not relevant because identity is interactive (`interactive-sections: [storage, identity]`) and no identity section exists. `zdevs` targets IBM Z. `oem.install: auto` is overridden by the explicit `false`. The ordered-list form of `storage.layout.match` is optional; the single-map form remains valid.

## Sources Considered

All 10 Clef-weighted searXNG results from `dig_context_02.json`. Weight >= 0.5 is authoritative backing; < 0.5 is weak backing.

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Autoinstall Validation - Ubuntu installation documentation | https://canonical-subiquity.readthedocs-hosted.com/en/latest/howto/autoinstall-validation.html | 0.6281 | authoritative (>= 0.5) |
| 2 | JSON schema for autoinstall config - Server Guide - Ubuntu Discourse | https://discourse.ubuntu.com/t/json-schema-for-autoinstall-config/16615 | 0.1291 | weak backing (< 0.5) |
| 3 | Autoinstall configuration reference manual - Ubuntu Installation Guide | https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html | 0.8678 | authoritative (>= 0.5) |
| 4 | jsonschema 4.26.0 documentation | https://python-jsonschema.readthedocs.io/ | 0.0510 | weak backing (< 0.5) |
| 5 | JSON Schema | https://json-schema.org/learn/getting-started-step-by-step | 0.0958 | weak backing (< 0.5) |
| 6 | apt-key Deprecation: Add Repositories with GPG on Ubuntu | https://www.digitalocean.com/community/tutorials/how-to-handle-apt-key-and-add-apt-repository-deprecation-using-gpg-to-add-external-repositories-on-ubuntu-22-04 | 0.3090 | weak backing (< 0.5) |
| 7 | Configure APT - cloud-init 26.2 documentation | https://docs.cloud-init.io/en/latest/reference/yaml_examples/apt.html | 0.6347 | authoritative (>= 0.5) |
| 8 | Cloud-init: Fetch apt key from remote file instead of from a key server ... | https://stackoverflow.com/questions/72620609/cloud-init-fetch-apt-key-from-remote-file-instead-of-from-a-key-server | 0.0673 | weak backing (< 0.5) |
| 9 | (Fixed) apt-key is deprecated. Manage keyring files in trusted.gpg.d | https://itsfoss.com/apt-key-deprecated/ | 0.1473 | weak backing (< 0.5) |
| 10 | APT. - YouTube Music | https://music.youtube.com/watch?v=ekr2nIex040&list=OLAK5uy_k2YxpFz1nV_Iht8W3Y2SgJVGTBsnwZJaM | 0.0202 | weak backing (< 0.5) |
