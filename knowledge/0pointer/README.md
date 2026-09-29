# 0pointer knowledge corpus

Minted 2026-09-29 from the request "research the 0pointer blog" via the
`knowledge-corpus-mint` skill (second run, first on a fully healthy searXNG).
A knowledge space on Lennart Poettering's blog canon (0pointer.net): the
systemd-ecosystem essays that underpin image-mode OS design and that yubiOS
builds on.

## Docs (9 of 10 outline candidates, 1 dropped by jev outline validation)

1. [01-fitting-everything-together](./01-fitting-everything-together.md) - the keystone 2022 essay: image-based OS, hermetic /usr, DPS, UKIs, first-boot instantiation
2. [02-uki-pcr-trusted-boot](./02-uki-pcr-trusted-boot.md) - Brave New Trusted Boot World: UKI, PCR ownership split, signed-PCR sealing, rollback protection
3. [03-dps-and-repart](./03-dps-and-repart.md) - Discoverable Partitions Spec + systemd-repart: partition grammar, first-boot provisioning, A/B sets
4. [04-luks2-hardware-unlock](./04-luks2-hardware-unlock.md) - the systemd-248 essay: TPM2 vs FIDO2 vs PKCS#11, cryptenroll, threat-model ledger
5. [05-authenticated-boot-encryption](./05-authenticated-boot-encryption.md) - the 2021 threat-model essay: per-resource authenticate/encrypt matrix, three attack scenarios
6. [06-stateless-factory-reset](./06-stateless-factory-reset.md) - stateless/volatile/stateful + factory reset mechanics from 2014 to today
7. [07-portable-services-sysext](./07-portable-services-sysext.md) - portable services, sysext/confext, nspawn-off-host-/usr as one modularity ladder
8. [09-modern-systemd-features](./09-modern-systemd-features.md) - v254-v261 wave: sysupdate, soft-reboot, ukify, run0, sysinstall, boot secrets, LUO/KHO
9. [10-mkosi-casync-ammutable](./10-mkosi-casync-ammutable.md) - mkosi + casync + Ammutable: the build-to-boot pipeline and its commercial continuation

Dropped: 08-systemd-homed (jev outline score 0.78, below the 0.8 keep line; homed content is covered inside docs 01, 02, and 05).

## Provenance

- Outline jev-validated: 9/10 kept (0.82-1.78).
- 18 searXNG queries, 108 results, all jev-weighted (mean quality 0.49; 37 primary-quality >= 0.8).
- Docs grounded primarily in the blog posts themselves plus systemd.io / UAPI / freedesktop man pages; version-sensitive claims are marked in text.
- research-db/ holds the full collection record (outline verdicts, dig results with weights, author provenance, costs).
