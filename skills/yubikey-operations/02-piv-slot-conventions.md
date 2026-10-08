# 02 - PIV Slot Conventions

Scope: the PIV applet slot map, what each yubiOS slot is for, and how slot 9c and the retired slots 82-95 carry generation history.

## The PIV slot surface

The PIV applet on a YubiKey exposes slots that hold X.509 certificates together with their accompanying private keys. Yubico's PIV introduction states that a PIV-enabled YubiKey NEO holds 4 distinct slots while a YubiKey 4 and 5 hold 24, as specified in the PIV standards document, and that the four standard slots are technically very similar but used for different purposes (https://developers.yubico.com/PIV/Introduction/Certificate_slots.html, weight 0.92).

yubiOS uses a stable convention so anyone walking up to the machine knows which slot holds what (source doc: `yubi-OS/yubiOS skills/yubikey-operations/SKILL.md`):

| Slot | Name | yubiOS purpose |
|---|---|---|
| 9a | PIV Authentication | SSH user auth via PKCS#11 (ssh -I /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so); age decryption fallback |
| 9c | PIV Digital Signature | UKI signing (mkosi PIV/PKCS11), Git commit/tag signing, age encryption |
| 9d | PIV Key Management | TLS client auth (rare), S/MIME |
| 9e | PIV Card Authentication | Reserved; yubiOS does not assign it |
| 82-95 | PIV Retired Keys 1-3 | Generation history, used by YubiKey Manager for key rotation |

## Slot 9c: the signing root

Slot 9c is yubiOS's signing root. Yubico's SDK documentation describes slot 9C as the key named "Digital Signature", which you would use to sign emails, git commits, or other data (https://docs.yubico.com/yesdk/users-manual/application-piv/slots.html, weight 0.93). A third-party guide, at weak weight 0.20, concurs that slot 9c is the digital signature slot used any time a digital signature is needed, such as signing documents or files, and notes that slot 9d is called the Key Management slot but is used when encryption is required (https://securew2.com/blog/yubikey-piv-certificate-slot-configuration, weight 0.20, weak backing).

Slot 9a is the user-auth root. The separation matters enough that the source doc lists it as an anti-pattern to use slot 9c for SSH auth: slot 9c is for signing, not auth, and signing commits and authenticating SSH are different operations with different attestation requirements (source doc).

## The attestation key: slot F9

Alongside the four standard slots, Yubico documents an attestation key in slot F9 used to create an attestation statement, an X.509 certificate attesting that a key in slot 9A, 9C, 9D, 9E, or one of the retired slots 82 to 95 was generated on the YubiKey (https://docs.yubico.com/yesdk/users-manual/application-piv/slots.html, weight 0.93). This is the mechanism behind the attestation certificate extraction covered in doc 08: the F9 key is what makes per-slot key provenance provable.

## Retired slots 82-95: generation history

Slots 82-95 are generation history. When you regenerate slot 9c, the old key moves to slot 82, or 83 and 84 if those are already populated (source doc).

Yubico's own documentation positions these slots slightly differently: an Information Security StackExchange answer, at weak weight 0.10, quotes that retired slots are only available on the YubiKey 4 and 5 and are meant for previously used Key Management keys so earlier encrypted documents or emails can still be decrypted (https://security.stackexchange.com/questions/258518/using-retired-extra-slots-82-95-on-yubikey, weight 0.10, weak backing). yubiOS extends the idea to signature keys and uses the retired range as the migration target for rotated signing keys. Where the dig world describes retired slots as decryption-only history and the yubiOS convention treats them as generation history for any slot, the yubiOS convention is the stricter, deliberate choice; the dig context is background, not a contradiction.

## Tooling for slot operations

Two CLIs drive the slot map. yubico-piv-tool manages PIV credentials with actions that can be chained, for example --action=verify-pin followed by --action=request-certificate, and takes a slot argument (https://www.mankier.com/1/yubico-piv-tool, weight 0.28, weak backing). ykman, the YubiKey Manager CLI, exposes subcommands including ykman piv certificates export, generate, import, and request, plus ykman piv info and ykman piv keys (https://docs.yubico.com/software/yubikey/tools/ykman/, weight 0.93). For moving keys between slots specifically, Yubico documents a key move action: yubico-piv-tool -a move-key -s 9c --t (target slot), which moves a key from one PIV slot to another and requires YubiKey 5.7 or higher (https://developers.yubico.com/yubico-piv-tool/Actions/key_move.html, weight 0.85).

Both tools are signed distributables; Yubico states it signs all distributables using an OpenPGP key, Windows code signing certificates, or Yubico code signing certificates issued by Apple for Mac distributables (https://www.yubico.com/support/download/, weight 0.83). Verify signatures when provisioning the tooling you will use to touch the identity root.

## Why a stable convention matters

The convention's value is auditability. Because slot 9a is always user auth and slot 9c is always signing, a reader of any yubiOS machine's configuration can tell what a given PKCS#11 or yubico-piv-tool invocation touches without inspecting the key. The retired slots then preserve the generation trail: the current 9c signs, the 82 slot holds the prior generation, and the attestation chain in slot F9 ties each generation to the physical device. This is the mechanism that makes the backup/restore discipline of doc 07 and the attestation extraction of doc 08 possible.
