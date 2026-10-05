# sbsign PKCS#11 UKI signing and validation

Knowledge corpus minted from yubi-OS/yubiOS refs/sbsign-pkcs11-validate-2026-07-23.md. Topic: the systemd-sbsign PKCS#11 signing interface, the YubiKey PIV slot 9c module path, the canonical SoftHSM2 software-token pattern, cross-version OpenSSL token traps, the verification recipe, mkosi integration, CI validation gates, and the legacy sbsign migration rule.

## Docs

| NN | doc | results kept | primary (>= 0.5) | redos |
|---|---|---|---|---|
| 01 | [01-systemd-sbsign-pkcs11-interface.md](01-systemd-sbsign-pkcs11-interface.md) | systemd-sbsign interface: --private-key-source engine/provider forms and the PKCS#11 URI |
| 02 | [02-yubikey-piv-ykcs11.md](02-yubikey-piv-ykcs11.md) | YubiKey PIV slot 9c through ykcs11 and p11-kit module discovery |
| 03 | [03-softhsm-canonical-pattern.md](03-softhsm-canonical-pattern.md) | SoftHSM2 as the canonical software-token dry-run pattern and its fail-closed boundary |
| 04 | [04-cross-version-token-traps.md](04-cross-version-token-traps.md) | Engine vs provider split and the Ubuntu noble sbsign/libp11 regression |
| 05 | [05-ukisign-verification-recipe.md](05-ukisign-verification-recipe.md) | sbverify and osslsigncode verification recipe and the rebuild trap |
| 06 | [06-mkosi-systemd-sbsign-integration.md](06-mkosi-systemd-sbsign-integration.md) | mkosi SecureBootKeySource, the pkcs11 profile, and issue 3033 |
| 07 | [07-yubikey-ci-signing-validation.md](07-yubikey-ci-signing-validation.md) | CI signing validation gates and the fixture-before-release discipline |
| 08 | [08-legacy-sbsign-migration.md](08-legacy-sbsign-migration.md) | Legacy sbsign engine path and the migration rule to systemd-sbsign |

## Research summary

- Results collected: 109 (deduped per doc; includes 20 results from 2 redo digs)
- Weight split: high (>= 0.5) 45 / low (< 0.5) 64
- Jev requests: 25 (1 preflight probe, 2 outline-validation runs of which the first was superseded after a state-write failure, 22 noul weighting batches), usage 25352 input / 0 output tokens
- Redo counts: doc 04 one redo (first dig returned 0 high-weight sources), doc 05 one redo (first dig returned only 2 high-weight sources)
- Skipped docs: none; all 8 subtopics authored
- Outline validation (score metric, clef): all 8 subtopics scored 0.92 to 1.92, none dropped; docs 06 and 08 were marginal and kept because their digs came back with 5 high-weight sources each

## Preflight

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

11 searXNG engines reported suspended or captcha-limited at preflight time (google, duckduckgo, brave and others); the dig still returned 41 to 58 raw results per query through the remaining engines.
