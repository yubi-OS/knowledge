# FIDO2 authentication with systemd-homed

Scope: FIDO2/YubiKey authentication for homed homes via the hmac-secret extension, the homectl enrollment flags and COSE algorithms, and the single-device limitation.

## How FIDO2 unlock works

For LUKS2-backed homes the FIDO2 path uses the hmac-secret extension: the token computes an HMAC over a random salt stored in the user record, and the resulting secret unlocks the LUKS2 volume. This is the same primitive the wider LUKS ecosystem adopted when systemd 248 added FIDO2-based LUKS unlocking, which works with any FIDO2 token including YubiKeys (source: https://www.guyrutenberg.com/2022/02/17/unlock-luks-volume-with-a-yubikey/, weight 0.29, weak backing: a personal tutorial, but the systemd 248 fact is also corroborated by the primary 0pointer release writeup at weight 0.91 in the PKCS#11 doc of this corpus). The fido2-luks project documents the mechanism independently: a FIDO2 token with hmac-secret serves as a strong single factor for LUKS full-disk encryption, supported by all FIDO2 YubiKey models, Google Titan keys, Nitrokey FIDO2, and SoloKeys (source: https://github.com/nyancient/fido2-luks, weight 0.57).

## Enrollment flags

Enrollment happens at create time or afterward via `homectl authenticate`:

```bash
# at create time
homectl create jenny --storage=luks \
  --fido2-device=auto \
  --fido2-with-client-pin=yes \
  --fido2-with-user-presence=yes

# after creation
homectl authenticate jenny --fido2-device=auto \
  --fido2-with-client-pin=yes \
  --fido2-with-user-presence=yes
```

--fido2-device=auto auto-detects the plugged-in hidraw device; --fido2-with-client-pin=yes requires the FIDO2 PIN at every login; --fido2-with-user-presence=yes requires a physical touch on the token (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.86; https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93). The COSE credential algorithm is selectable, with es256 as the default and rs256 and eddsa as alternatives:

```bash
homectl create jenny --fido2-credential-algorithm=es256
```

(source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93)

The FIDO2 user-verification model these flags map onto is standard: user presence is a touch, user verification is PIN or biometric, both evaluated on the authenticator itself (source: https://www.yubico.com/authentication-standards/fido2/, weight 0.57).

## Enrollment-time behaviors worth knowing

Two upstream issues document rough edges in the enrollment flow. During FIDO2 setup of a new user, after the token PIN is entered and user presence confirmed, homectl requests a password to finish setup, and one report shows that stage being time-sensitive in certain flow states, meaning setup can fail if the password entry takes too long (source: https://github.com/systemd/systemd/issues/24281, weight 0.87). Separately, when two FIDO2 tokens are enrolled on the same LUKS2 volume and exactly one requires a client PIN, booting with only the no-PIN token plugged in should unlock on user presence alone, but a 2026 report documents the PIN requirement masking an EAGAIN error in that scenario (source: https://github.com/systemd/systemd/issues/43342, weight 0.82). The general lesson for scripted enrollment is to keep the enrollment window human-paced and to avoid mixing PIN-required and PIN-free tokens on one volume.

## The single-device limitation

Only one FIDO2 device can be enrolled per homed home at a time. The upstream issue tracking multi-key support, systemd issue 28893 ("Allow multiple FIDO2 devices for a given home directory w/ systemd-homed"), has been open since 2023 with no merged fix (source: https://github.com/systemd/systemd/issues/28893, weight not dig-scored: carried from the source reference doc, the issue URL is primary upstream). This is a real constraint for any backup-token story: a user cannot enroll both a primary and a backup YubiKey at the homed layer.

Workarounds operate below homed. The approach used in the yubiOS reference implementation enrolls backup keys at the LUKS2/cryptenroll layer instead of the homed layer, since systemd-cryptenroll itself can hold multiple FIDO2 slots on a volume; that workaround needs re-verification whenever homed-based homes are actually adopted for interactive users (source: https://github.com/systemd/systemd/issues/28893, weight not dig-scored; the cryptenroll-multi-slot behavior is documented by the hmac-secret LUKS ecosystem at https://github.com/nyancient/fido2-luks, weight 0.57).

## FIDO2 vs PKCS#11 for homed

FIDO2 enrollment is the strongest consumer-facing option, but it has a discoverability gap: FIDO2 does not let the system identify the user before authentication, whereas PIV-based PKCS#11 tokens expose their identity before auth so the username can be derived from the plugged-in token. The tradeoff and the PKCS#11 enrollment path are covered in the PKCS#11 doc of this corpus (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93).
