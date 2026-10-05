# 09 - systemd-homed FIDO2 legs

Scope: systemd-homed LUKS2-protected home directories as the second unlock surface a FIDO2 test design must cover, alongside the root volume.

## What homed encrypts and how

A systemd-homed user home directory is stored in a Linux file system inside an encrypted LUKS volume inside a loopback file or on removable media; the mechanism is selected with --storage=luks to homectl (ArchWiki, https://wiki.archlinux.org/title/Systemd-homed, weight 0.575). The architecture is user-record based: systemd-homed.service manages human user home directories and embeds JSON user records directly in the home directory images (systemd.io, https://systemd.io/USER_RECORD/, weight 0.529). That per-user JSON record is what distinguishes the homed leg from the root-volume leg of a FIDO2 test: the unlock target is a per-user image, enrolled and unlocked through the user record and PAM rather than through /etc/crypttab.

The feature has been available in distributions for years; Gentoo documents homed support becoming available around February 2021 with migration instructions from traditional home layouts (Gentoo Wiki, https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.730).

## The FIDO2 authentication path

Per-user authentication for homed images can use GPG cards or FIDO2 tokens in addition to passwords (Amir Islampanah tutorial, https://amireslampanah.com/tutorials/systemd-homed-portable-home-dirs.html, weight 0.302, weak backing). A general overview puts it directly: homed turns the home directory into a portable LUKS-encrypted blob that can move between machines and unlock with FIDO2 (sumguy.com, https://sumguy.com/systemd-homed-portable-homes/, weight 0.396, weak backing). Both are secondary sources; the primary-adjacent anchors are the ArchWiki storage mechanics and the systemd.io user record page, and a test design should derive exact enrollment syntax from the homectl man page at test-writing time rather than from tutorials.

## Interaction with PAM and the password fallback

A documented behavior matters for test design: in one reported configuration, if the account password is enrolled as a LUKS key it is sufficient to unlock the home container, so pam_systemd_home may never query the U2F token, leaving FIDO2 login optional in practice (Unix StackExchange, https://unix.stackexchange.com/questions/674453/systemd-homed-with-fido2-login-from-tty-still-possible-with-password-only, weight 0.089, very weak backing). An open feature request on systemd-homed makes the underlying design tension explicit: authenticating the user with just the FIDO2 token, without the password, would mean using the FIDO2 credential for its hmac-secret and also checking the signature it generates with the public key stored in the user record, effectively duplicating pam-u2f behavior inside homed (GitHub issue via archive, https://ghostarchive.org/archive/AxynM, weight 0.154, very weak backing). For a test suite, these two reports define the negative space: a homed FIDO2 test must distinguish between the token being enrolled, the token being queried, and the token being required, and should assert which of the three the configuration under test actually produces.

## Relation to the root-volume legs

The homed leg shares protocol machinery with the root leg: both derive secrets through the CTAP2 hmac-secret extension of the same token (Yubico CTAP2.1 spec, https://developers.yubico.com/CTAP/CTAP2.1.html, weight 0.860, as documented in doc 03), and both rely on the same token enumeration. They differ in lifecycle: root-volume enrollment happens at image build or provisioning time through systemd-cryptenroll, while homed enrollment happens per user through homectl and re-locks on logout, suspend, and migration (Gentoo Wiki, https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.730; ArchWiki, https://wiki.archlinux.org/title/Systemd-homed, weight 0.575). A CI design that only tests the root leg therefore leaves the suspend-resume and logout re-lock paths of the homed leg untested.

## Test design summary

The homed leg's assertions are: create a --storage=luks home with a FIDO2 token enrolled, lock and unlock the home across a full logout and login cycle, verify the user record JSON inside the image, and verify the failure behavior when the token is absent at login time. The evidence base for this subtopic is thinner than for the cryptenroll and boot-unlock legs: the strongest sources are the Gentoo wiki, the ArchWiki, and systemd.io in the 0.52 to 0.73 band, with the PAM interaction details resting on community reports below 0.16 that are labeled weak here and should be confirmed against current homectl documentation before being encoded as hard assertions.
