# skills/bootc-images - knowledge corpus

Explication of the yubi-OS/yubiOS **bootc-images** skill (source of record: `yubi-OS/yubiOS skills/bootc-images/SKILL.md`): building, installing, upgrading, and managing bootc-compatible OCI images, Containerfile design, composefs/fsverity configuration, filesystem semantics, and atomic upgrades and rollbacks.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-bootc-model.md](01-bootc-model.md) | What bootc is: booting a full Linux system from an OCI image, OSTree+composefs staging, atomic A/B deployments |
| 02 | [02-image-requirements.md](02-image-requirements.md) | Mandatory containers.bootc label, kernel at /usr/lib/modules, no /boot content, /ostree not required since 1.1.3 |
| 03 | [03-composefs-backend.md](03-composefs-backend.md) | prepare-root.conf enablement, read-only EROFS root, verity mode limits, kernel CONFIG_EROFS_FS |
| 04 | [04-filesystem-semantics.md](04-filesystem-semantics.md) | /usr immutable, /etc 3-way merge and transient option, /var VOLUME semantics, /opt handling |
| 05 | [05-containerfile-patterns.md](05-containerfile-patterns.md) | Containerfile design: digest-pinned base, package landing zones, drop-in config, tmpfiles.d |
| 06 | [06-install-commands.md](06-install-commands.md) | bootc install to-disk and to-filesystem, systemd-boot, Secure Boot key enrollment |
| 07 | [07-upgrade-rollback.md](07-upgrade-rollback.md) | Staged upgrades, download-only maintenance windows, bootc switch, rollback, auto-update timer |
| 08 | [08-lint-validation.md](08-lint-validation.md) | bootc container lint checks and the CI gate |
| 09 | [09-selinux.md](09-selinux.md) | SELinux labeling of OCI images: semanage over chcon, default_t trap |

## Research summary

- Results collected: 80 (top 6 per query across 18 searXNG queries, deduplicated per subtopic)
- Weight split: 59 results at weight >= 0.5 (authoritative backing), 21 below (weak, labeled as such in the docs that cite them)
- Jev: 7 requests (1 outline score + 6 noul weighting batches), usage 8924 input / 1603 output tokens, via DefAPI direct (api.defapi.org), zero 429s, zero redos
- Skipped docs: none. The two marginally-scored subtopics (08 lint-validation, 09 selinux) stayed because their digs returned high-weight primary sources (bootc.dev and github.com/bootc-dev/bootc at 0.86-0.88)

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-run); jev via https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13), 200 OK on all 7 requests.

Ground source fetched 2026-10-06: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/bootc-images/SKILL.md (15626 bytes).
