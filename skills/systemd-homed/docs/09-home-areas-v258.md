# 09: Home Areas (v258 and Later)

## Scope

Home areas since v258: secondary `$HOME` subdirectories within one home, the `%area` login syntax, `run0 --area`, and `--default-area` in the user record.

## What an area is

The source doc defines home areas as secondary `$HOME` subdirectories within one home, useful when sharing a home between host and VM but wanting separate session configs (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, Home Areas section). LWN's coverage of v258 describes the mechanics: each home area is maintained in a subdirectory under `/home/user/Areas` of the user's regular home directory, and the areas feature comes with a new `defaultArea` user record field that can be used to specify a default home area (source: https://lwn.net/Articles/1028275/, weight 0.49, weak-to-moderate backing, news coverage of the release).

The systemd-homed man page describes the service as managing home areas, directories and network mounts and real or loopback block devices with a filesystem, optionally encrypted (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.service.8.html, weight 0.95), and the homectl man page carries the corresponding create/remove/change/inspect surface (source: https://www.freedesktop.org/software/systemd/man/249/homectl.html, weight 0.97). Areas are one of the home shapes these surfaces manage.

## Using an area

The source doc gives the workflow (source doc):

```bash
mkdir -p ~/Areas/dev        # create an area
# at the login prompt, append %area to the username: jenny%dev
run0 --area=dev             # enter an area via run0
homectl update jenny --default-area=dev   # set default in the user record
```

The `%area` suffix on the username is the login-time selector, and `run0 --area=dev` starts a session inside the chosen area. The run0 man page documents run0 as a privilege-elevation tool introduced with v256, implemented as an alternative invocation mode of systemd-run, with working-directory behavior defaulting to the target user's home directory (source: https://manpages.debian.org/testing/systemd/run0.1, weight 0.87). The Arch manual page for pam_systemd_home shows a live example of area selection through run0: `run0 --area=versuch1` (source: https://man.archlinux.org/man/pam_systemd_home.8, weight 0.80).

run0 itself arrived in v256 as a safer, more robust alternative to the sudo mechanism without relying on suid binaries (source: https://wiki.archlinux.org/title/Systemd/run0, weight 0.27, weak backing, wiki; consistent with the Debian man page above).

## The host/VM use case

The yubiOS motivation for areas is sharing one home between a host and a VM while keeping session configurations separate (source doc). The v261 release coverage notes the ability to propagate a user's home directory into a VM with systemd-vmspawn (source: https://lwn.net/Articles/1051163/, weight 0.41, weak backing, news), which pairs naturally with per-VM areas inside one portable home.

## Design notes

1. Areas inherit the home's encryption: they are subdirectories inside the LUKS2 volume, so an area is never a weaker security boundary than the home itself (source doc model, doc 01).
2. `--default-area=dev` persists in the user record, so the choice follows the portable home to other machines (source doc; the `defaultArea` field is confirmed by the LWN v258 coverage above, weight 0.49).
3. Areas are the replacement shape for the "one account per machine" pattern where the same human wants a different desktop or shell config per context.

## Sources

- https://www.man7.org/linux/man-pages/man8/systemd-homed.service.8.html (weight 0.95)
- https://www.freedesktop.org/software/systemd/man/249/homectl.html (weight 0.97)
- https://manpages.debian.org/testing/systemd/run0.1 (weight 0.87)
- https://man.archlinux.org/man/pam_systemd_home.8 (weight 0.80)
- https://lwn.net/Articles/1028275/ (weight 0.49, weak-to-moderate)
- https://lwn.net/Articles/1051163/ (weight 0.41, weak)
- https://wiki.archlinux.org/title/Systemd/run0 (weight 0.27, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
