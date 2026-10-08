# 08 - Attestation Certificate Extraction

Scope: extracting FIDO2 and PIV attestation certificates from a YubiKey for audit and device inventory, covering the PIV attest action, the slot F9 attestation key, and FIDO2 enterprise attestation.

## What attestation proves

An attestation certificate is a signed claim that a key was generated on a genuine YubiKey, on that specific YubiKey. Yubico's PIV attestation documentation states that the YubiKey comes with a pre-loaded attestation certificate signed by a Yubico PIV CA (https://developers.yubico.com/PIV/Introduction/PIV_attestation.html, weight 0.86). On the FIDO2 side, Yubico's technical manual documents enterprise attestation (EA): it satisfies asset tracking requirements and can aid account recovery by allowing an end user to prove they have a specific FIDO2 device, and it requires support from the relying party and/or identity provider plus platform support in the form of CTAP 2.1 capabilities (https://docs.yubico.com/hardware/yubikey/yk-tech-manual/yk5-apps-fido.html, weight 0.94).

In the yubiOS skill this is the P1 attestation and P7 audit/evidence contribution: the attestation certificate is the evidence artifact for a key-ceremony audit (source doc: `yubi-OS/yubiOS skills/yubikey-operations/SKILL.md`).

## The PIV attest action

The PIV toolchain makes extraction a single command. Yubico's attestation page shows the pattern: `yubico-piv-tool --action=attest --slot=9a --out Slot9Aattestation.pem`, and then extract the intermediate signing certificate from slot f9 on the YubiKey (https://developers.yubico.com/yubico-piv-tool/Attestation.html, weight 0.88). The PIV Tool user guide documents the same action against any slot: get an attestation statement (an X.509 certificate) for a slot, where 9a is an example for the slot containing the key you generated and want to attest (https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-attestation.html, weight 0.92).

The chain has two parts: the per-slot attestation certificate (fresh, generated with the slot key) and the intermediate signing certificate from slot F9 that chains it to Yubico's CA. The slot F9 key is the same attestation key that Yubico's slots documentation describes as attesting that a key in slot 9A, 9C, 9D, 9E, or the retired slots 82 to 95 was generated on the YubiKey (https://docs.yubico.com/yesdk/users-manual/application-piv/slots.html, weight 0.93).

## What the factory attestation certificate carries

The factory-loaded attestation certificate in slot F9 carries Yubico-specific OIDs. The PIV attestation page documents OID 1.3.6.1.4.1.41482.3.11 as "CSPN Certified YubiKey", present only on the factory-loaded attestation certificate in slot F9, which is included as part of the attestation certificate chain (https://developers.yubico.com/PIV/Introduction/PIV_attestation.html, weight 0.86). The same page notes the pre-loaded attestation certificate can be overwritten by loading a new key, which is why the backup/restore discipline of doc 07 exports it before any re-enrollment.

## Inventorying beyond PIV: FIDO2 and metadata

For the FIDO2 applications, Yubico maintains attestation and metadata documentation: attestation certificates are often small and do not contain much information about the device model itself, so Yubico specifies a metadata format that maps attestation certificates to additional information about the device model and vendor, including product images (https://developers.yubico.com/U2F/Attestation_and_Metadata/, weight 0.81). For an audit, the workflow is: extract the attestation certificate, resolve it against the metadata service, and record the device model alongside the slot it protects.

Enterprise attestation on FIDO2 gives per-device identity for webauthn credentials. The enterprise attestation flow requires the RP or IdP to request it and the platform to support CTAP 2.1 (https://docs.yubico.com/hardware/yubikey/yk-tech-manual/yk5-apps-fido.html, weight 0.94). A community gist showing an enterprise attestation request script, at weak weight 0.25, demonstrates dumping the attestation statement and all known attestation certificate extensions from a FIDO2 device (https://gist.github.com/WillSmartYubico/3bfea840c02f5666068089f0bd8bf464, weight 0.25, weak backing).

## The audit workflow

Putting the pieces together for a yubiOS audit:

1. For each PIV slot in use (9a, 9c, 9d, retired generations), run the attest action and save the per-slot attestation PEM.
2. Export the slot F9 intermediate certificate once per device; it chains every per-slot attestation to the Yubico PIV CA.
3. Record the OIDs present on the factory certificate as device provenance signals (weight 0.86 source).
4. For FIDO2 credentials, use enterprise attestation where the RP supports it (CTAP 2.1 platform support required), and resolve attestation certificates against Yubico's metadata for device model inventory.
5. File the certificates with the key-use log so the audit trail ties each signature operation to an attested, on-device-generated key.

Step 5 is the source doc's P7 audit/evidence mapping made concrete: attestation extraction is what turns "this key lives on a YubiKey" from a configuration assumption into a verifiable claim.

## Tooling availability

Both yubico-piv-tool and ykman are Yubico-signed distributables; Yubico signs all distributables using an OpenPGP key, Windows code signing certificates, or Yubico code signing certificates issued by Apple for Mac (https://www.yubico.com/support/download/, weight 0.83). An audit tool that will itself attest devices should be fetched and signature-verified the same way.

## Takeaway

Attestation extraction is cheap (one command per slot plus the F9 intermediate) and it is the difference between believing and proving that keys were generated on the device. Pair it with the pre-enroll export in doc 07 and the key-use log, and a YubiKey ceremony produces its own evidence bundle.
