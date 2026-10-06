# Why rcN.d numeric prefixes do not transfer

Scope: where the numeric-prefix habit comes from, why the sysv-init rcN.d convention does not carry over to tmpfiles.d and the other drop-in directories, and the concrete arithmetic that made the mismatch bite yubiOS.

## The rcN.d convention the habit comes from

System V init ordered boot work through per-runlevel directories containing symlinks named with an S or K prefix followed by a 2-digit number: S for start, K for kill, and the number defined the exact execution order from 00 through 99, lower running earlier (https://www.linuxfromscratch.org/lfs/view/11.0/chapter09/usage.html, jev 0.74). Classic examples are S10network running before S20apache. The Linux From Scratch system administration chapter states it directly: "the numbers determine the order in which the scripts are run, from 00 to 99, the lower the number the earlier it gets executed" (https://www.linuxfromscratch.org/lfs/view/11.0/chapter09/usage.html, jev 0.74).

That convention was load-bearing in sysvinit, which was the default init manager in distributions like Yocto Project's default target (https://docs.yoctoproject.org/5.3.3/dev-manual/init-manager.html, jev 0.9). Generations of packagers and administrators learned "lower number fires earlier" as the way to express ordering in a `.d`-style directory.

## The convention does not transfer

The yubiOS playbook records the core finding: numeric prefixes such as `50-` and `53-` are a sysv-init rcN.d convention that does not transfer to `usr/lib/tmpfiles.d/`, `usr/lib/modprobe.d/`, `usr/lib/dracut.conf.d/`, `usr/lib/systemd/*.service.d/`, or `usr/lib/udev/rules.d/`, because all of those sort by full filename lexicographically (source doc: yubi-OS/yubiOS playbooks/drop-in-override-naming.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/drop-in-override-naming.md).

The mismatch is not just unhelpful, it is direction-inverting. A numerically-prefixed override intended to fire after upstream fires before it, and upstream wins silently (source doc). Nothing errors; the override simply never gets the last word.

## The arithmetic that bit OMN-149

The playbook's worked example shows the byte comparison that defeated a numeric prefix (source doc):

```
"53-yubiOS-no-static-vfio.conf"  -> '5' = 0x35
"static-nodes-permissions.conf"  -> 's' = 0x73
0x35 < 0x73  =>  yubiOS fires FIRST, upstream fires LAST
```

The comparison stops at the first byte. `5` is 0x35 and `s` is 0x73, so `53-yubiOS-no-static-vfio.conf` sorted before `static-nodes-permissions.conf` regardless of the number 53 reading as "later than 50". Upstream's `z /dev/vfio/vfio 0666 - - -` line then re-created the `/dev/vfio` character device on every boot, negating the yubiOS `r /dev/vfio/vfio` removal line that was supposed to run after it (source doc).

## The silent-winner property

What makes this class of bug expensive is the winner is the upstream file and the loss is invisible in the drop-in directory itself. The yubiOS file shipped, the name looked deliberate, and the ordering was wrong in exactly the direction the prefix was chosen for (source doc). The playbook records that the resulting condition, `/dev/vfio` present in every default yubiOS guest, persisted for 4 days before the failing CI test surfaced it. The detection path and cost are recorded in the source doc's Verified working section and in the doctrine doc of this corpus.

## Corollaries recorded from the same incident

The playbook draws 2 corollaries from OMN-149 (source doc):

1. Prefer `r ` (remove) over `z ` (adjust-last) in tmpfiles.d when an upstream package will re-create the node. An adjust-last line loses to a later re-creation; a remove line does not leave a node for the next writer to re-create.
2. Re-verify on base-image bumps. The ordering guarantee is per-filename-pair, not permanent; a new upstream `static-...` file invalidates a previously proven ordering. The base-image doc of this corpus expands on that.

The lesson condensed: in these directories, ordering intent is expressed by bytes of the filename, and the rcN.d number vocabulary is the wrong tool for it.
