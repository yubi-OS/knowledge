# 07: Key loss, recovery keys, rotation, and the multi-key quorum

Scope: what happens when the sole anchor is lost, the recovery-key slot that keeps the loss survivable, the friction of enrolling multiple FIDO2 tokens, and the flip condition that would remove the passphrase path.

## The designed failure

The model's failure mode is intentional: remove the key and the machine boots to a locked disk. But intentional failure is only acceptable if the owner retains a legitimate path back in. The LUKS2 header supports multiple independent keyslots, and `cryptsetup luksAddKey` adds a keyslot protected by a new key, with an existing credential supplied interactively or via key file (source: https://man7.org/linux/man-pages/man8/cryptsetup-luksAddKey.8.html , jev noul 0.53). This slot structure is what makes any enrollment model composable: FIDO2, TPM2, PKCS#11, passphrase, and recovery key slots coexist on one volume.

## The recovery key is the first-class answer

systemd-cryptenroll has a native recovery-key mode. Poettering's systemd 248 post documents it: `systemd-cryptenroll --recovery-key` generates a key, enrolls it in the LUKS2 volume, shows it on screen, and generates a QR code to scan; the key has the highest entropy and can be entered wherever a passphrase can be entered (source: https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html , jev noul 0.93). Community walkthroughs of the same flow describe cryptenroll adding recovery-key unlock methods alongside TPM2, FIDO2, and PKCS#11, with token metadata stored in the LUKS2 JSON area (source: https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/ , jev noul 0.56). Fedora Magazine covers the user-facing version: systemd-cryptenroll ships by default in Fedora Workstation, making alternative unlock methods fairly accessible (source: https://fedoramagazine.org/use-systemd-cryptenroll-with-fido-u2f-or-tpm2-to-decrypt-your-disk/ , jev noul 0.68).

The recovery key's role in the source problem family is precise: the passphrase is rejected as the anchor but kept as the documented recovery path, and the recovery key is the high-entropy, non-compellable form of that path.

## Multi-token enrollment is possible but has friction

Enrolling two independent YubiKeys per machine is the source's flip condition for removing the passphrase path entirely. The tooling supports the concept, since keyslots are independent, but practice shows friction: a systemd issue report documents cryptsetup failing to enroll a second FIDO2 slot after a password slot exists, walking through enroll, test, and retry steps (source: https://github.com/systemd/systemd/issues/25128 , jev noul 0.54). Community setup notes describe the desired end state directly, using FIDO2 tokens for flexible access across different systems while keeping recovery options open (source: https://gist.github.com/Syderitic/23b9c22cb772e1b0e674ed4bb5a3abef , jev noul 0.53).

Rotation follows the same slot logic: `cryptsetup luksRemoveKey` removes a supplied passphrase from the LUKS device, so a lost key's slot is wiped while other slots survive (source: https://www.man7.org/linux/man-pages/man8/cryptsetup.8.html , jev noul 0.90). This is the property the TPM2 alternative lacks: a soldered chip cannot have its slot removed and replaced by the owner, while a lost YubiKey maps to a clean removal-and-replace operation.

## The quorum discipline

The source problem family sets the gate: the passphrase recovery path would be removed only after two independent YubiKeys are enrolled per machine. The logic is availability versus compellability. One token means a single lost device forces the recovery path into use, so the passphrase must stay enrolled. Two independent tokens mean loss of either is absorbed by the other, the recovery slot becomes redundancy rather than necessity, and the knowledge factor can be retired from the boot path. Until that quorum holds, the passphrase stays as the documented floor, and the anchor argument is stated honestly as "the YubiKey is the sole anchor for normal boots, with a passphrase path that exists only for loss recovery".
