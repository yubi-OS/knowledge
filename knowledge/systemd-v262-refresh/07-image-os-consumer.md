# 07 Which v262 interface changes matter to an image-based OS consumer

Scope: the cross-cutting reading of the v262 changes for image-based OS consumers (bootc-style golden images, mkosi-built UKI pipelines, provisioning flows), the upstream image-building doctrine, and the consolidated verdict for yubiOS.

## The upstream doctrine for building images

The systemd project documents how to build "golden" OS images for systemd-based OSes, noting that most of the recommended points are implemented by the mkosi OS image builder developed and maintained by the systemd project (source: https://github.com/systemd/systemd/blob/main/docs/BUILDING_IMAGES.md, jev weight 0.65). The published version of the same document covers provisioning image settings: while systemd systems can boot safely with unpopulated /etc trees, it is sometimes desirable to set basic settings after dd-ing the image to disk but before first boot, for which the tool is systemd-firstboot (source: https://systemd.io/BUILDING_IMAGES/, jev weight 0.75).

The image tooling side is documented in mkosi: users can add their own customizations in /etc/mkosi-initrd, a full self-contained UKI is built and installed, and the mkosi plugin is enabled by writing `initrd_generator=mkosi-initrd` and `layout=uki` to /usr/lib/kernel-install.conf or /etc/kernel-install.conf (source: https://github.com/systemd/mkosi, jev weight 0.71). Config files in the mkosi.uki-profiles/ directory are picked up automatically, and all configured UKI profiles are added as additional UKI profiles to each UKI built by mkosi (source: https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md, jev weight 0.85).

## Mapping the v262 changes onto the consumer

Five v262-cycle changes have consumer impact, each developed in its own doc in this corpus:

1. `/run/boot-loader-entries/` removal (doc 02, primary text at https://github.com/systemd/systemd/blob/main/NEWS, jev weight 0.92): runtime-generated boot loader entries go away; per-boot customization belongs in ESP-resident BLS entries and UKI add-ons. An image-based consumer that bakes entries into the ESP at build time is unaffected.
2. systemd-sysupdated D-Bus API removal, positioned for v263 in the release-notes text captured in this dig (doc 03, https://github.com/systemd/systemd/releases, jev weight 0.94): host tooling speaking the experimental D-Bus API must move to Varlink against systemd-sysupdate; updatectl clients are reworked by upstream.
3. `ukify inspect --json=` output shape change (doc 04, primary shape docs at https://www.freedesktop.org/software/systemd/man/ukify.html, jev weight 0.85): build pipelines parsing inspect JSON must revalidate; the specific v262 shape change is only weakly backed in this dig.
4. Credential SRK pinning (doc 06, primary at https://www.freedesktop.org/software/systemd/man/latest/systemd-creds.html, jev weight 0.92): credentials encrypted by v262-or-later are incompatible with earlier systemd versions. This is the one change with a hard version-coupling consequence: a golden image and its runtime stack must cross the v262 boundary together for encrypted credentials.
5. `tpm2-measure-bank=` crypttab option removal (doc 05, removal claim source-doc-asserted, surrounding landscape primary-confirmed at https://www.freedesktop.org/software/systemd/man/latest/crypttab.html, jev weight 0.95): only affects images that set the option; TPM-free trust models are untouched.

Weakly backed community evidence of the build pattern this all feeds: the snosi project describes protected builds where the builder chunks the candidate image, the bootc layer computes the authoritative OCI composefs digest, and a MOK-signed Type #2 UKI plus MOK-signed systemd-boot are constructed (source: https://github.com/frostyard/snosi, jev weight 0.33, weak backing). It illustrates the exact surface area (UKI, boot loader signing, composefs digests) that v262 changes touch, but is not an authority on the changes themselves.

## Consolidated verdict for yubiOS

The source doc's standing verdict at the 2026-09-13 refresh: no new yubiOS dependency or breakage surfaced by v262-rc2. This dig strengthens that verdict in three directions. First, the boot-loader-entries removal is primary-confirmed (NEWS, 0.92) and yubiOS has no dependency per the 2026-07-14 audit. Second, the credential SRK pinning is primary-confirmed (0.92) and lands as an adoption decision at the next image refresh, not a breakage. Third, the release timeline moved: v262 stable has shipped per LWN (0.88), so the refresh trigger the source doc defined has fired and the next refresh should be cut from v262 stable rather than rc snapshots. The remaining open item carried across this corpus is the Poettering v262 stories series, still unobserved as of 2026-10-05.
