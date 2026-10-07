# 05: mkosi inputs: config file, command line, and drop-in precedence

Scope: mkosi's three input surfaces (mkosi.conf, CLI flags, environment variables), the mkosi.conf.d drop-in rule, and mkosi's validation and failure behavior.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md` plus the searXNG dig (digs/05-mkosi-setting-mapping.json). Dig sources: the systemd/mkosi repository, mkosi manual pages, and mkosi documentation sites.

## One setting, three places

The source doc: mkosi exposes every setting in three places: a structured config file (`mkosi.conf`), the command line (`--some-setting=value`), and a few environment variables. The mkosi documentation site (weight 0.73) and the mkosi(1) manual pages (Arch manual page, weight 0.90; Debian manpages mirror, weight 0.87; the mkosi.1.md source in the systemd/mkosi repository, weight 0.87) all document the same three surfaces. The yubiOS rule: document the mapping between them rather than treating them as unrelated interfaces, which is what makes the cross-channel precedence of doc 03 applicable to a build tool.

## Drop-in files and the lex-order rule

The source doc instructs the author to specify whether `mkosi.conf.d/*.conf` snippets are read in lex order, lex-merged, or last-wins, and records the yubiOS rule: lex-sorted files, last-wins on duplicate keys. This is the cross-channel aliasing rule inside a single channel: two config files can both set the same key, and without a stated order the Inputs section cannot say which one is read last. The source doc's anti-pattern "Cross-channel aliasing without precedence" applies here directly.

## The yubiOS example, decoded

The source doc's Example 5 declares mkosi inputs in mkosi.conf.d syntax: `[Distribution]` section with `Distribution=fedora` (one of fedora/debian/centos, default fedora), `Release=45` (integer, matching the quay.io fedora-bootc:45 tag), `Architecture=x86_64` (one of x86_64/aarch64, default host arch); `[Output]` section with `Format=disk` (enum: disk/oci/directory/uki, default disk) and `ImageId=yubios` (used as the OCI tag, default yubios). Precedence: command line > this config > mkosi default. Validation: mkosi rejects unknown keys and incompatible combinations (the example: Format=disk with Architecture=aarch64 on a host without binfmt). Failure: mkosi exits non-zero with a single-line error naming the offending key.

## What the dig adds on validation

The mkosi man page (weight 0.90) and the repository documentation (weight 0.82) confirm that mkosi parses its configuration strictly: unknown settings cause failure rather than silent ignore, and the release notes (weight 0.89) and mkosi.news(7) page (weight 0.87) record how settings have been added, deprecated, and renamed across releases, which is why a documented Inputs section should pin the mkosi version it was written against (the prerequisite field of doc 02). The ArchWiki page (weight 0.76) gives usage-oriented coverage of the same settings but is secondary; the DeepWiki mirrors of the mkosi repo (weights 0.14 to 0.20, weak backing) were collected and recorded as low-weight.

## Why mkosi deviations from the canonical precedence are documented

Guideline 4 of the source doc: when a value can arrive through multiple channels, say which one wins. The yubiOS canonical order is CLI > env > config file > built-in default, but mkosi's order is CLI > config > mkosi default, a deviation the source doc names explicitly and doc 03's pipeline stage model explains: the config file in mkosi is the same tier as a CLI-supplied value in a script, so the mapping (not a borrowed rule) is what the Inputs section must record.
