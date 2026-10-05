# Homed architecture and user records

Scope: how systemd-homed makes a home directory carry its own identity, the JSON user record model, NSS synthesis without /etc/passwd, and the userdb lookup surface.

## The core property: the home carries the account

systemd-homed.service manages human user home directories and embeds the full JSON user record directly inside the home's own storage (source: https://systemd.io/USER_RECORD/, weight 0.92). Each managed home encapsulates both the data store and the user record of the user, so it comprehensively describes the account and is naturally portable between systems without any further external metadata (source: https://systemd.io/HOME_DIRECTORY/, weight 0.96).

The practical consequence: the account and the home directory are the same object. Moving the home's storage medium moves the account. This is the design property behind the "home on a stick" workflow: a LUKS2 image on removable media carries its own signed identity, and any machine that trusts the signing key can activate it (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.80; https://systemd.io/HOME_DIRECTORY/, weight 0.96).

## No /etc/passwd entries: users are synthesized at runtime

Homed-managed users do not get classic /etc/passwd entries. Instead, each home directory managed by systemd-homed.service synthesizes a local user and group, made available to the system through the User/Group Record Lookup API via Varlink, browsable with userdbctl (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.86).

The compatibility layer is nss-systemd. It is a glibc NSS plugin that synthesizes classic NSS records from the JSON records, providing full backwards compatibility with classic UNIX APIs both for lookup and enumeration (source: https://third-party-mirror.googlesource.com/systemd/+/refs/heads/master/docs/USER_RECORD.md, weight 0.15, weak backing: this is a mirror of the upstream doc, treat the fact as corroborated by the primary at https://systemd.io/USER_RECORD/ with weight 0.92). nss-systemd also serves name resolution for Varlink-based providers such as systemd's own DynamicUser= feature (source: https://www.man7.org/linux/man-pages/man8/nss-systemd.8.html, weight 0.82).

userdbctl is the primary entry point for user/group record clients: it lets a client ask a single service for lookups instead of querying all running services in parallel, and userdbctl itself uses that aggregation service unless --with-nss= or --service= select finer control (source: https://www.freedesktop.org/software/systemd/man/247/userdbctl.html, weight 0.80).

## The JSON user record format

The JSON User Records design goes beyond the classic UNIX (glibc NSS) struct passwd: components of systemd provide and consume user identity as an extensible dictionary of key/value pairs encoded as JSON (source: https://systemd.io/USER_RECORD/, weight 0.92). systemd-homed.service is one of the primary producers and consumers of these records.

These rich records carry fields of direct relevance to desktop environments that manage the local user database; accountsservice-style daemons can source most of their metadata directly from the JSON records (source: https://systemd.io/USERDB_AND_DESKTOPS/, weight 0.97).

Records are signed, and the signature travels with the record. On unencrypted home storage the signed identity materializes as an ~/.identity file inside the home directory, containing signed information about the user, password, group membership, and related account metadata (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.80).

## Blob directories for unstructured data

Binary or unstructured data that does not belong inside the JSON record (avatar images and similar) is stored in per-user blob directories. The JSON user record specifies the location of its blob directory, and like most of the user record this data is made publicly available to the system (source: https://systemd.io/USER_RECORD_BLOB_DIRS/, weight 0.90). systemd-homed.service manages the blob directories for each home it manages (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.86).

## Why this architecture matters for yubiOS

For an image-based OS the model has two operational consequences. First, identity provisioning is data, not configuration: creating a user is writing a signed record into an encrypted volume, so a golden image needs no per-user /etc/passwd state. Second, trust is anchored in a signing key rather than in the local machine: the account is only as portable as the set of public keys the destination host trusts, which is the subject of the signing-key and migration doc in this corpus (source: https://systemd.io/HOME_DIRECTORY/, weight 0.96; https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.88).
