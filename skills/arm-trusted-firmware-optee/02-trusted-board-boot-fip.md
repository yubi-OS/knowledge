# 02 - Trusted Board Boot (TBB) and FIP packaging

Scope: how TF-A Trusted Board Boot authenticates every firmware image against the ROTPK, how the FIP archive bundles BL31, BL32, BL33 and the X.509 certificates, and the exact build flags that turn TBB on.

Grounding spine: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md (source doc).

## What Trusted Board Boot is

The official TF-A documentation defines Trusted Board Boot precisely: TBB prevents malicious firmware from running on the platform by authenticating all firmware images up to and including the normal world bootloader, establishing a Chain of Trust using Public-Key-Cryptography Standards (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/design/trusted-board-boot.rst, weight 0.87). The same design doc is published as versioned documentation at https://tf-a.docs.trustedfirmware.org/en/latest/design/trusted-board-boot.html (weight 0.87).

The TBB implementation spans both generic and platform-specific BL1 and BL2 code, plus host build tooling, and it is enabled through specific build flags rather than any runtime toggle (https://tf-a.docs.trustedfirmware.org/en/latest/design/trusted-board-boot.html, weight 0.87). This matters for yubiOS: enabling TBB is a build-time, per-platform integration decision, not a configuration file you flip on a running board.

## The certificate chain walk

Per the source doc, BL2 walks the certificate chain in this order:

1. Trusted Boot FW certificate.
2. Trusted and Non-Trusted Key certificates.
3. Content certificates for each image.

At each step the signature is checked against the ROTPK hash, and each image hash is checked against its now-trusted certificate before control transfers. The source doc is explicit that every image in the FIP is verified, not just the first stage.

## FIP and fiptool

The source doc defines FIP (Firmware Image Package) as a single archive bundling BL31, BL32, and BL33 plus the X.509 content and key certificates, built with `fiptool`. The build command in the source doc produces the FIP as the final step (`all fip`), which is why the TF-A build and the packaging step are one invocation in yubiOS's flow.

## The build flags, and why all three TBB flags must be present

The official build options documentation confirms the flag semantics the source doc relies on: `ROT_KEY` is used when `GENERATE_COT=1` and specifies the file containing the ROT private key in PEM format, and it enforces public key hash generation; `TRUSTED_BOARD_BOOT` must be set if `GENERATE_COT` is to be enabled (https://trustedfirmware-a.readthedocs.io/en/v2.3/getting_started/build-options.html, weight 0.81).

The source doc's canonical build line for a yubiOS ARM64 image is:

```sh
make -C arm-trusted-firmware \
  PLAT=<platform> \
  ARCH=aarch64 \
  SPD=opteed \
  BL32=<optee>/tee-header_v2.bin \
  BL32_EXTRA1=<optee>/tee-pager_v2.bin \
  BL32_EXTRA2=<optee>/tee-pageable_v2.bin \
  BL33=<u-boot>/u-boot.bin \
  TRUSTED_BOARD_BOOT=1 \
  GENERATE_COT=1 \
  MBEDTLS_DIR=<path-to-mbedtls> \
  ROT_KEY=<our-rotpk-private>.pem \
  MEASURED_BOOT=1 \
  EVENT_LOG_LEVEL=20 \
  all fip
```

The source doc's own flag glossary: `SPD=opteed` wires OP-TEE in as BL32; `TRUSTED_BOARD_BOOT=1` plus `GENERATE_COT=1` plus a real `ROT_KEY` enable TBB; `MEASURED_BOOT=1` makes BL1 and BL2 emit the event log; and TF-A needs mbedTLS for crypto.

The source doc's most important operational gotcha: TBB silently no-ops without all three of `TRUSTED_BOARD_BOOT=1`, `GENERATE_COT=1`, and a real `ROT_KEY`. A build that omits one produces an image that boots fine and verifies nothing. There is no error, no warning, and no enforcement. This is consistent with the documentation's statement that the feature is enabled only through the full set of build flags (https://tf-a.docs.trustedfirmware.org/en/latest/design/trusted-board-boot.html, weight 0.87).

## The ROTPK itself

Per the source doc, ROTPK (Root of Trust Public Key) is a keypair yubiOS generates itself. The SHA-256 of the public half is burned into SoC OTP/eFuse. The source doc marks this step as irreversible and directs teams to rehearse on a sacrificial board first. The factory-provisioning pattern this follows, where the root public-key hash is burned into OTP and the OTP is then locked, is described in a weakly backed external study guide on boot chain key management (https://sprchuoi.github.io/securebootloader/09-key-management-provisioning/, weight 0.11, weakly backed).

## What this buys yubiOS

The chain is enforcing: BL1 rejects anything that does not chain to the ROTPK, and bad code never executes (source doc, Path A description). That is the property that distinguishes TBB from the measured-only Path B: enforcement happens before control transfers, not after boot when an attestation verifier looks at the evidence.
