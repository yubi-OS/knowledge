# prior-art-state-of-art

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/prior-art-state-of-art-2026-07-30.md`.

Topic: a prior-art convergence scan for an immutable-OS project: bootc composefs backends, RHEL sealed container images, and LUKS2 hardware unlock upstream state, establishing what the state of the art already covers.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-bootc-composefs-backend.md](01-bootc-composefs-backend.md) | Upstream bootc composefs backend: how sealed images are produced (composefs digest embedded in the signed UKI cmdline), experimental-to-stabilization status, and fsverity-vs-dm-verity as the sealing primitive. |
| 02 | [02-rhel-sealed-images.md](02-rhel-sealed-images.md) | Red Hat sealed images (RHEL 10.x tech preview): end-to-end integrity for image-mode RHEL via composefs + fsverity + signed UKI, vendor-managed keys, and why it is the closest enterprise cousin. |
| 03 | [03-luks2-hardware-unlock.md](03-luks2-hardware-unlock.md) | LUKS2 hardware unlock upstream state: systemd-cryptenroll (systemd 248+) enrolling FIDO2 / TPM2 / PKCS#11 tokens, the FIDO2 hmac-secret extension, and distro-level support (NixOS, Fedora). |
| 04 | [04-immutable-os-competitors.md](04-immutable-os-competitors.md) | Competing immutable-OS stacks that ship a sealed/trusted boot story: secureblue-sealed and Kairos trusted boot, and how their primitive stacks compare (signed UKI, TPM2 vs YubiKey, composefs). |
| 06 | [06-hardware-root-of-trust-formal.md](06-hardware-root-of-trust-formal.md) | Formal and industrial treatments of hardware root of trust for Linux systems: vendor secure-boot stories, academic surveys, and the confidential-computing (SEV-SNP, TDX) boundary where design spaces diverge. |
| 07 | [07-yubikey-platform-identity-novelty.md](07-yubikey-platform-identity-novelty.md) | The owner-held YubiKey as platform identity root: why no public project stacks it (TPM2 is the default everywhere, FIDO2 hmac-secret only landed in systemd 248 in 2021), and the resulting novelty claim. |

Subtopic numbering follows the post-validation outline: subtopic 05 (superseded-mechanisms) scored 0 on the outline validation and was dropped, so the kept docs carry NNs 01, 02, 03, 04, 06, 07.

## Research summary

- Results collected: 83 across 12 seed queries (2 per subtopic), kept top 6 per query.
- Weight split: 52 results at weight >= 0.5 (primary/official), 31 below 0.5, 0 unscored.
- Jev: 17 requests to /api/decide (clef), usage 14655 input / 0 output tokens.
- Redos: 1 (subtopic 06 dig was thin at 3/12 high and was redone with different queries per the REDO rule, recovering to 9 high-weight results).
- Skipped docs: none. All 6 kept subtopics had digs strong enough to author honestly.
- Notes: one searXNG 429 on a weighting batch was retried after 30s per the decide-failure REDO rule and succeeded. One collected result (kairosacademies.org, weight 0.58) was off-topic (a school, not the Kairos OS project) and is recorded in archive.json but cited for no claim.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
