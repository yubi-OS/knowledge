# 05: Network namespace modes and microsegmentation

Scope: the four nspawn network modes, what each gives, and how yubiOS maps zones onto CISA ZTMM maturity stages.

## The four modes

The source doc tabulates the modes, all attributed to it:

- --private-network: the container has only loopback. yubiOS use: fully offline builds, Fedora RPM build isolation.
- --network-bridge=br0: the container shares a bridge with the host. yubiOS use: the default for dev containers that need network.
- --network-veth: the container gets its own veth pair. yubiOS use: network-policy testing, iptables and nftables experiments.
- --network-zone=zone: the container joins a pre-existing zone. yubiOS use: multi-container segmentation tests.

The yubiOS microsegmentation pattern assigns --network-zone= values by CISA ZTMM maturity stage, with the source doc naming zone=identity-only, zone=device-trust, and zone=continuous-validation as the groupings. Containers in the same zone share a bridge, so policy experiments can be scoped to a maturity stage rather than to individual containers.

## Corroboration from the dig, and its weight

This subtopic has the weakest external grounding of the corpus, and the weights say so honestly. The ArchWiki (https://wiki.archlinux.org/title/Systemd-nspawn, weight 0.54) documents the interaction caveat: network options specified in the .nspawn file and on the command line do not work correctly together when --settings=override is in play, which the systemd-nspawn@.service file sets. That is a live constraint for yubiOS because the registered-machine launch path uses --settings=override, so zone membership should be declared in one place, not split between the settings file and the CLI.

A Server Fault answer (https://serverfault.com/questions/867055/accessing-host-services-from-systemd-nspawn-containers, weight 0.14, weak) describes --network-zone= as doing the same thing as a manual bridge but managing the bridge interface automatically, which matches the source doc's "joins a pre-existing zone" framing from the other side: the zone creates and owns its bridge so containers can join it.

## The veth shape

OneUptime's Ubuntu walkthrough (https://oneuptime.com/blog/post/2026-03-04-configure-networking-for-systemd-nspawn-containers-on-rhel/view, weight 0.10, weak) shows --network-veth producing a host-side interface named ve-<machine>, which is the observable form of "the container gets its own veth pair". The same source notes that by default, directly-invoked nspawn containers without private networking share host networking, which is precisely why the source doc insists on an explicit mode for every container instead of relying on the default.

The deep general context is thin here: the Wikipedia systemd article (https://en.wikipedia.org/wiki/Systemd, weight 0.36, weak) covers network connection management as part of systemd's daemons but not nspawn specifics, and a DeepWiki overview (https://deepwiki.com/systemd/systemd/5.1-systemd-nspawn-container-manager/, weight 0.18, weak) names the namespace and cgroup machinery without detailing the four network modes.

## What this means for policy design

Combining the source doc with the weighted dig material: declare each container's mode explicitly, group containers into --network-zone= bridges by ZTMM stage when the test is about segmentation rather than connectivity, and treat the .nspawn-file-versus-CLI interaction under --settings=override as the known sharp edge (ArchWiki, weight 0.54). The zones-to-stages mapping is the source doc's own contribution and is not independently corroborated by the dig; it is recorded here as a source-doc claim, not a dig-backed one.

## Reading the modes against the yubiOS jobs

Mapping the 4 modes onto the use cases in doc 02 explains why all 4 survive in yubiOS rather than collapsing to one. Offline RPM builds need no egress at all, so --private-network is the honest default there; any accidental network dependency in a build then fails loudly instead of resolving from the host's resolv.conf. Dev containers that fetch packages or test against network services take --network-bridge=br0, which the source doc calls the default for networked dev containers. Policy experiments take --network-veth because an isolated veth pair is the unit that iptables or nftables rules apply to. Segmentation tests take --network-zone= because the zone, not the single container, is the segmentation unit.

The zone mechanism's observable behavior is the part with any external corroboration: the Server Fault answer (weight 0.14, weak) describes zone-managed bridge creation and the ArchWiki (weight 0.54) documents the settings-override interaction. The zones-to-ZTMM-stage mapping, identity-only, device-trust, continuous-validation, is a yubiOS-internal convention and appears only in the source doc. Where a corpus reader needs an authoritative outside reference for the flags themselves, the man7 systemd-nspawn page (https://man7.org/linux/man-pages/man1/systemd-nspawn.1.html, weight 0.84, cited in doc 03) is the primary document for all four options; the network-specific dig results here serve as operational color, not as the flag definition of record.
