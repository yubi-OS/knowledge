# 06: Network-bound disk encryption (Tang/Clevis) as the rejected alternative

Scope: how NBDE binds a LUKS2 volume to a Tang server that Clevis queries at boot, what the model buys, and why moving the anchor from a token in the owner's pocket to a server on the network loses for a laptop boundary.

## The mechanism

Network-Bound Disk Encryption is a subcategory of Policy-Based Decryption that allows binding encrypted volumes to a special network server; the current implementation consists of a Clevis pin for the Tang server and the Tang server itself (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/security_hardening/configuring-automated-unlocking-of-encrypted-volumes-using , jev noul 0.86). At boot, Clevis on the client contacts Tang, unwraps a policy key, and opens the mapper without a typed passphrase, when Tang is reachable on the network (source: https://www.golinuxcloud.com/network-bound-disk-encryption-tang-clevis/ , jev noul 0.52).

The protocol is minimal on the client side. The latchset clevis README shows the Tang pin needing only the URL of the Tang server as its parameter, and describes the encryption process requesting the key advertisement from the server to bind the policy (source: https://github.com/latchset/clevis , jev noul 0.86). Red Hat's NBDE technology overview describes provisioning as a key exchange when a node with encrypted disks is configured through Clevis to be unlocked using a Tang server (source: https://access.redhat.com/articles/6987053 , jev noul 0.84). Oracle's documentation frames the intent the same way: Tang and Clevis automate decryption of LUKS-encrypted devices on trusted networks (source: https://docs.oracle.com/en-us/iaas/oracle-linux/nbde/nbde-about-network-bound-disk-encryption.htm , jev noul 0.88).

## What the model actually buys

NBDE's genuine strength is datacenter-scale automation: thousands of VMs or bare-metal nodes can reboot unattended and still open their disks, because the unlock decision is delegated to infrastructure the operator controls. The Red Hat chapter documents the operational tooling around this, including clevis-luks-unlockers and the tang pin man pages as the maintenance surface (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/security_hardening/configuring-automated-unlocking-of-encrypted-volumes-using , jev noul 0.89). It also composes with TPM2: Ubuntu Server documents Clevis with dracut for automated TPM-backed LUKS decryption, the same framework bound to a different anchor (source: https://ubuntu.com/server/docs/how-to/security/tpm-backed-luks-decryption-with-clevis/ , jev noul 0.95).

## Why it loses for the laptop boundary

The rejection is about where the anchor lives. The source problem family states it as: the anchor becomes a server, and a server is an OEM by another name for a laptop. The mechanism documents support this reading. Unlock depends on Tang reachability on the network at boot time (source: https://www.golinuxcloud.com/network-bound-disk-encryption-tang-clevis/ , jev noul 0.52), and the binding is to a special network server the operator runs (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/security_hardening/configuring-automated-unlocking-of-encrypted-volumes-using , jev noul 0.86). Three properties follow for a machine that leaves the network:

1. The unlock anchor is not in the owner's possession. A token travels with the laptop; a Tang server does not.
2. The availability model inverts. A token is available offline by construction; NBDE is available offline only through fallback credentials, which reintroduces the passphrase the design removed.
3. The control point moves to whoever runs the server. Whoever controls Tang controls unlock policy for every bound client, which is exactly the OEM-shaped trust the boot chain was built to exclude.

For the owner-held root of trust family, the anchor must be something the owner physically holds and can revoke by removal. Tang/Clevis is the correct tool for the fleet boundary it was designed for, and the wrong tool for the personal boot boundary.
