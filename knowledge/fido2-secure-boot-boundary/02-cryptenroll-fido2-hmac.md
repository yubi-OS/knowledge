# 02: systemd-cryptenroll --fido2-device and the hmac-secret LUKS2 credential

Scope: the mechanics of binding a LUKS2 volume to a FIDO2 token through systemd-cryptenroll, the hmac-secret extension that produces the unlock secret, and what the LUKS2 header stores.

## What cryptenroll does

`systemd-cryptenroll` is a tool for enrolling hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot (source: https://www.freedesktop.org/software/systemd/man/systemd-cryptenroll.html , jev noul 0.94). The man page lists the three supported token families: smartcards (PKCS#11), FIDO2 security tokens that implement the hmac-secret extension, which covers most FIDO2 keys including YubiKeys, and TPM2 security devices (source: https://man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html , jev noul 0.74). ArchWiki mirrors this and documents the practical enrollment and crypttab wiring (source: https://wiki.archlinux.org/title/Systemd-cryptenroll , jev noul 0.73).

Lennart Poettering's systemd 248 post describes the design: cryptenroll works with any LUKS2 volume and embeds a small piece of meta-information into the LUKS2 header with the parameters necessary for the unlock, so the token binding travels with the volume rather than in a side config (source: https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html , jev noul 0.93). ArchWiki's updated page confirms the token metadata lives in the LUKS2 JSON header area and is consumed by systemd-cryptsetup at boot (source: https://wiki.archlinux.org/title/Systemd-cryptenroll , jev noul 0.73).

## The hmac-secret extension

The secret comes from the FIDO2 Client-to-Authenticator Protocol. Kudelski Security's research describes CTAP as the standardized protocol defining the exchange between security keys, also called authenticators, and the host (source: https://kudelskisecurity.com/research/luks-disk-encryption-with-fido2 , jev noul 0.85).

Yubico's SDK documentation defines the mechanism precisely: the hmac-secret and hmac-secret-mc extensions enable creation of a symmetric secret value scoped to a credential, supported depending on YubiKey firmware version (source: https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html , jev noul 0.85). The scoping matters: the secret is derived from a salt sent by the host and the token's internal credential secret, so the volume stores only the salt and the expected result, never the raw key material.

The independent fido2-luks project frames the model directly: the package lets you use a FIDO2 token with the hmac-secret extension as a strong single factor for LUKS full disk encryption, naming YubiKey FIDO2 models, Google Titan, Nitrokey FIDO2, and SoloKey as examples (source: https://github.com/nyancient/fido2-luks , jev noul 0.68). Before systemd had native support, this project showed the same shape: disk unlock requires possession of a token that answers a challenge with a derived secret.

## Why a touch and no PIN beats a PIN and a decrypt

The source problem family rejects PKCS#11 PIV unlock for the disk because PIV needs a PIN at every boot and an RSA or EC decrypt on the token, while FIDO2 hmac-secret needs a touch and no PIN. The tooling evidence backs the interaction asymmetry: the PKCS#11 path surfaces PIN prompts at boot time in systemd-cryptsetup flows (see systemd issue reports of disk-unlock prompts asking for the PIV module PIN, source: https://github.com/systemd/systemd/issues/23479 , jev noul 0.86), whereas the FIDO2 path's visible user action is the physical touch on the capacitive sensor that Yubico's own login documentation describes (source: https://support.yubico.com/s/article/Ubuntu-Linux-login-guide-U2F , jev noul 0.90).

## The enrolment moment is the one root moment

Enrollment itself requires root on the target machine and an existing unlock credential, since cryptenroll must add a keyslot to the LUKS2 header. Fedora Magazine documents the user-facing flow where systemd-cryptenroll ships in Fedora Workstation by default, making alternative unlock methods for LUKS partitions fairly accessible (source: https://fedoramagazine.org/use-systemd-cryptenroll-with-fido-u2f-or-tpm2-to-decrypt-your-disk/ , jev noul 0.68). After enrollment, boot-time unlock runs from the initrd, which is exactly why the initrd must itself be covered by the signed UKI: the FIDO2 unlock inherits its trust from the verification chain above it.
