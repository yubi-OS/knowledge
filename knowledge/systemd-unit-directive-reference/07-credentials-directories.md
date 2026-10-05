# Credentials and Per-Service Directories

Scope: the per-service credential mechanism (LoadCredential, LoadCredentialEncrypted, SetCredential, ImportCredential via $CREDENTIALS_DIRECTORY), the managed directory directives (StateDirectory, RuntimeDirectory, CacheDirectory, LogsDirectory, ConfigurationDirectory), and image-rooted roots (RootImage, RootEphemeral, RootMStack).

## The credential model

systemd's credential model moves secrets out of environment variables into a per-service credential store mounted at $CREDENTIALS_DIRECTORY. The upstream design document defines the whole mechanism: "LoadCredentialEncrypted= is similar to LoadCredential= but will load an encrypted credential, and decrypt it before passing it to the service" (https://systemd.io/CREDENTIALS/, weight 0.89; same content at https://github.com/systemd/systemd/blob/main/docs/CREDENTIALS.md, weight 0.85).

The unit-file settings are enumerated on the systemd-creds(1) page: "Credentials are configured in unit files via the ImportCredential=, LoadCredential=, SetCredential=, LoadCredentialEncrypted=, and SetCredentialEncrypted= settings, see systemd.exec(5) for details" (https://www.freedesktop.org/software/systemd/man/latest/systemd-creds.html, weight 0.92). LoadCredential= sources a credential "from disk, from an AF_UNIX socket, or propagate them from a system credential", and ImportCredential= loads one or more credentials by pattern from the manager's credential set (https://github.com/systemd/systemd/blob/main/docs/CREDENTIALS.md, weight 0.85). SetCredential= writes a literal value into the credential store rather than reading one from disk. The v250-era page shows the settings list as it stood with four entries (LoadCredential=, SetCredential=, LoadCredentialEncrypted=, SetCredentialEncrypted=), which is a useful marker for how recently ImportCredential= arrived (https://www.freedesktop.org/software/systemd/man/250/systemd-creds.html, weight 0.96).

A concrete unit from the yubiOS reference (internal source: session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md):

```ini
[Service]
LoadCredential=fido2-token:/etc/yubikey/slot-config
LoadCredentialEncrypted=api-key:/etc/credentials/api.cred
SetCredential=mode:production
```

The service reads these through `$CREDENTIALS_DIRECTORY/fido2-token`, not environment variables, which is the property that makes the model resistant to environment leakage through child processes (pattern recorded in the yubiOS reference; the practice of replacing environment-variable secrets with systemd-creds is argued at https://dev.to/lyraalishaikh/stop-putting-secrets-in-environment-variables-practical-systemd-creds-on-linux-4gfi, weight 0.04, weak backing).

## Managed directories

The directory directives create per-service paths with correct ownership and lifecycle, and they carry mount dependencies automatically: "Units with WorkingDirectory=, RootDirectory=, RootImage=, RuntimeDirectory=, StateDirectory=, CacheDirectory=, LogsDirectory= or ConfigurationDirectory= set automatically gain dependencies of type Requires= and After= on all mount units required to access the paths involved" (https://www.freedesktop.org/software/systemd/man/systemd.exec.html, weight 0.94). That implicit-dependency rule is what makes these directives safe on systems with /var or /etc on late-mounted storage.

Each directive maps to one filesystem home with a distinct lifetime:

| Directive | Path | Lifetime |
|---|---|---|
| StateDirectory= | /var/lib/<name>/ | Persistent state |
| RuntimeDirectory= | /run/<name>/ | Removed when the unit stops |
| CacheDirectory= | /var/cache/<name>/ | Deletable cache data |
| LogsDirectory= | /var/log/<name>/ | Persistent logs |
| ConfigurationDirectory= | /etc/<name>/ | Persistent config |

The persistent-versus-deletable split is the essential distinction: "StateDirectory stores persistent state, CacheDirectory stores cached data which can be deleted" (https://unix.stackexchange.com/questions/804693/difference-between-cachedirectory-and-statedirectory-in-systemd, weight 0.02, weak backing), with the same mapping recorded in a systemd teaching manual (https://github.com/zcecc22/systemd-manual/blob/main/docs/15-state-runtime-and-cache-directories.md, weight 0.51).

With DynamicUser=yes the directory directives are what make statelessness workable: the transient user owns these directories during the service's lifetime and the ownership follows the service rather than a passwd entry (https://0pointer.net/blog/dynamic-users-with-systemd.html, weight 0.77).

## Image-rooted roots

For image-based systems, RootImage= runs the service's root filesystem from a disk image, verity-protected; RootEphemeral= (v254 and later) makes each invocation run from an ephemeral copy of the RootDirectory= or RootImage= content, so state written by one run never leaks into the next. RootMStack= (v260 and later) supplies an overlayfs-based mount stack for the root filesystem. These three directives are the per-unit building blocks for ephemeral and image-backed services on an image-based OS (yubiOS systemd reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md; v260 context confirmed against upstream release notes at https://github.com/systemd/systemd/blob/main/NEWS, weight 0.94, and v260 coverage at https://www.phoronix.com/news/systemd-260-Released, weight 0.10, weak backing).

## Where the split falls for a hardening design

The credential side pairs with sandboxing naturally: credentials are exposed only to the service that declared them, so a DynamicUser service can read its secret without any world-readable file or exported environment variable. The directory side replaces hand-written ExecStartPre= chown/mkdir chains, which is both the correctness win and the audit win: the unit file declares which paths the service owns, and the automatic Requires= and After= mount dependencies make the declaration hold on any boot order (https://www.freedesktop.org/software/systemd/man/systemd.exec.html, weight 0.94).
