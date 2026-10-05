# 03: systemd-homed FIDO2 homes and pam-u2f login gating

Scope: how systemd-homed binds a LUKS2 home directory to a token-backed credential, how pam-u2f gates interactive login with the YubiKey touch, and the lockout interaction between the two when the mapping file lives inside the encrypted home.

## systemd-homed's encrypted home model

systemd-homed manages user home directories as portable, encrypted images. ArchWiki documents the core behavior: homed encrypts the home directory using the user's password, which means SSH configured for public key authentication cannot mount it or read authorized_keys; a workaround is adding authorized keys to the user record and requiring both public key and password for authentication (source: https://wiki.archlinux.org/title/Systemd-homed , jev noul 0.67). The same portability shows up in migration practice: the Gentoo homed wiki describes copying the home directory file plus the `private.local` and `public.local` files under `/var/lib/systemd/home` to a new system (source: https://wiki.gentoo.org/wiki/Systemd/systemd-homed , jev noul 0.65).

The design lineage traces to the same Poettering posts that anchor this corpus: one practitioner writeup describes a full setup with Secure Boot, TPM2 or token-based LUKS, and systemd-homed, explicitly drawing inspiration from Poettering's "Authenticated Boot and Disk Encryption on Linux" and the systemd 248 unlocking post (source: https://swsnr.de/install-arch-with-secure-boot-tpm2-based-luks-encryption-and-systemd-homed/ , jev noul 0.64). In the yubiOS shape, homed binds its LUKS2 home the same way the root volume is bound: through the FIDO2 hmac-secret credential rather than a bare passphrase.

## pam-u2f as the login gate

pam-u2f implements PAM over U2F and FIDO2, providing a way to integrate a YubiKey or other compliant authenticator into existing PAM infrastructure (source: https://developers.yubico.com/pam-u2f/ , jev noul 0.94). Enrollment pairs the token with the user: Yubico's Ubuntu login guide describes touching the capacitive touch sensor to confirm the association while the device flashes, and storing the result in the u2f_keys mapping file (source: https://support.yubico.com/s/article/Ubuntu-Linux-login-guide-U2F , jev noul 0.90). Gentoo's YubiKey/PAM page covers the packaging side: `sys-auth/pam_u2f` provides the PAM module plus tools to assist configuration, and adding modules to PAM is straightforward because PAM is modular by design (source: https://wiki.gentoo.org/wiki/YubiKey/PAM , jev noul 0.71).

## The circular lockout failure mode

The sharpest documented hazard sits exactly at the intersection of the two halves of this doc. The pam_u2f man page states it plainly: using pam-u2f to secure login to a computer while storing the mapping file in an encrypted home directory will result in the impossibility of logging into the system (source: https://developers.yubico.com/pam-u2f/Manuals/pam_u2f.8.html , jev noul 0.92). The mapping file authenticates the login, the login unlocks the home, the home contains the mapping file: a cycle the key cannot break because the key is needed before the file that names the key is readable.

This is the boundary's designed failure shape in miniature. Remove the key and the machine boots to a locked disk and a gated login. The mitigation direction is placement: Yubico's support guide notes you can relocate the u2f_keys output to an area of the OS where it is readable before the home mounts (source: https://support.yubico.com/s/article/Ubuntu-Linux-login-guide-U2F , jev noul 0.90), and homed setups that need SSH-in must carry authorized keys in the user record itself rather than inside the encrypted image (source: https://wiki.archlinux.org/title/Systemd-homed , jev noul 0.67).

## Why homed stays on the FIDO2 path

The source problem family records why homed stays with FIDO2 rather than PIV: homed already expects the FIDO2 credential shape, and the touch-no-PIN interaction keeps the login gate compatible with the disk unlock gate, so the same gesture pattern covers both boundaries. The passphrase remains as the documented recovery path beneath both.
