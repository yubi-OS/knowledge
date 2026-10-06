# Base-image bumps invalidate the guarantee

Scope: why a proven drop-in ordering is only valid per filename pair against a specific base image, how bootc base-image upgrades change the field silently, and how to re-verify after a bump.

## The guarantee is per-filename-pair

The playbook draws a second corollary from OMN-149: "Re-verify on base-image bumps. The guarantee is per-filename-pair, not permanent; a new upstream `static-...` file invalidates it" (source doc: yubi-OS/yubiOS playbooks/drop-in-override-naming.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/drop-in-override-naming.md).

The ordering a drop-in relies on is a relation between 2 filenames: the yubiOS file and the specific upstream file it must sort after. Nothing pins the set of upstream filenames. When the base image changes, the set of upstream files in `usr/lib/tmpfiles.d/` (and the sibling directories) can gain, lose, or rename members, and any of those changes can invalidate a previously proven ordering without a single line of yubiOS code changing.

## Why bootc upgrades make this a recurring event

yubiOS ships as a bootc-based image, and the bootc model makes base-image content a first-class moving part. The bootc project describes its aim as applying container transport to bootable host systems, delivering base operating system updates as standard OCI images (https://github.com/bootc-dev/bootc, jev 0.8). Its build guidance emphasizes that code and configuration can be strictly lifecycle bound together in the image model (https://bootc.dev/bootc/building/guidance.html, jev 0.82), which is exactly the property that lets an upstream package's tmpfiles.d drop-in arrive or change as part of a routine base refresh.

The upgrade path is transactional and recurring: `bootc upgrade` queries the container image source and queues an updated image for the next boot (https://jmarrero.github.io/bootc/upgrades.html, jev 0.68). Every such upgrade is a potential change to the upstream filename set the ordering guarantee was proven against.

## Real drift precedents in the bootc ecosystem

Drift across a base upgrade is not hypothetical. A bootc issue records that when upgrading between host builds, SSH key file permissions in `/etc/ssh` were invalidated and sshd failed to start, blocking remote access after the upgrade (https://github.com/containers/bootc/issues/673, jev 0.72). The general class, configuration state left inconsistent by a base-image move, is documented in a technical briefing on bootc host configuration drift (https://ngelinux.com/stop-bootc-from-leaving-your-host-configuration-in-an-inconsistent-state/, jev 0.26, weak backing).

For the drop-in ordering rule the analogous hazard is subtler than permission loss: a base bump can introduce a new upstream file whose name lex-sorts between the yubiOS file and the upstream file it was proven against, reordering the effective sequence with no yubiOS-side diff at all. The playbook's step 3 recipe (listing the drop-in directory from inside the base image with `podman run --rm`) exists so the check runs against the image that will actually boot, not the repo tree (source doc).

## Operational practice

Because container ecosystems routinely rebuild dependents when base images move, base-image currency is an expected, schedulable event rather than an anomaly; Microsoft's Azure Container Registry Tasks documentation, for example, builds automated triggers that rebuild application images when their base image updates (https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-base-images, jev 0.94). The bootc image layout guidance similarly treats the base image's configuration content as something a derived image must consciously use or recreate (https://jmarrero.github.io/bootc/bootc-images.html, jev 0.65).

For yubiOS the corresponding discipline is: whenever the base image reference moves (digest bump or release), re-run the playbook's verification recipe. The pairwise sort assertion from step 2 is cheap; the expensive part, 4 lost days on OMN-149, was discovering the invalidation in production instead of at author time (source doc).
