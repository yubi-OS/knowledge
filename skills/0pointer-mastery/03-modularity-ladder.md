# 03 - The Modularity Ladder

Scope: the 4-rung modularity ladder from the 0pointer-mastery skill, which answers "what are you adding to the system" with a ranked choice among sysext, portable services, nspawn, and end-user app payloads, plus the uniformity rule that makes all of them the same image format.

Grounding spine: yubi-OS/yubiOS skills/0pointer-mastery/SKILL.md (source doc). External mechanism claims carry their dig source URL and jev weight.

## Rung 1: sysext (extends /usr itself)

The first rung answers: the addition extends /usr itself, in the same namespace, with the same credentials, sharing host libraries. The mechanism is systemd-sysext. Example payloads in the source doc: debug tools, optional drivers, YubiKey tools overlay (source doc).

Trust model: the extension image is verity-protected and PKCS#7 signed, and merges as a read-only overlayfs on top of /usr (source doc). The base /usr stays verified and the extension is validated separately (source doc).

Constraints, from the official man page: OS extension images are not suitable for shipping resources that are processed by subsystems running in earliest boot, and are not suitable for shipping system services (https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html, weight 0.74). The source doc makes the same point in its own words: sysext images are not packaging, there is no dependency language, they are coarse-grained, and they must be built in lockstep with the host OS because file dependencies must match (source doc).

Version note from the source doc: v260 and later add `RootMStack=` for layered overlayfs in a service context (source doc).

## Rung 2: portable services (isolated system service)

The second rung answers: the addition is an isolated system service with its own root and namespace, talking to the host over IPC. The mechanism is a Portable Service attached with `RootImage=`. Example payloads: chipsec, a VPN service, yubikey-agent, any privileged daemon (source doc).

The official systemd documentation describes the same design: portable services do not provide a fully isolated environment; they attach an OS image's services onto the host with stricter sandboxing defaults, and the primary tool is portablectl, with systemd-portabled as the managing service (https://systemd.io/PORTABLE_SERVICES/, weight 0.83 for the first-pass copy and 0.84 for the second). The portablectl man page confirms the image shape: portable service images contain an OS file system tree along with systemd unit file information, and portablectl attaches, detaches, or inspects them (https://redhat-plumbers.github.io/systemd-rhel8/portablectl.html, weight 0.53).

Trust model: verity plus PKCS#7 signed GPT image, and sandboxing is opt-out rather than opt-in (source doc). The source doc lists the 4 sandboxing profiles: default, strict, nonetwork, trusted, selected at attach time. Attached unit files are copied to /etc/systemd/system/ (source doc). Lennart's own walkthrough of the mechanism exists on 0pointer, including a Go edition (http://0pointer.net/blog/walkthrough-for-portable-services-in-go.html, weight 0.6).

Two version notes from the source doc: the same image can serve as a portable service, an nspawn container, or a bare-metal OS; and v260 adds unprivileged portable services, meaning no root is required to attach (source doc).

## Rung 3: nspawn (full secondary OS)

The third rung answers: the addition is a full secondary OS or a legacy package-managed workload. The mechanism is a systemd-nspawn container. Example payloads: a Debian dev container, an RPM compatibility layer (source doc).

Trust model: the same PKCS#7 verity validation as the host, recursively, so the container's trust chain is the host's trust chain (source doc).

The source doc's dev trick: `systemd-nspawn --directory=/ --volatile=yes -U --bind-user=$USER -b` gives an instant container off the host /usr with no OS tree preparation needed (source doc). This is the developer workflow the reference sub-file `references/developer-workflow.md` covers.

## Rung 4: end-user apps (weakest trust)

The fourth rung answers: the addition is an end-user app payload. The mechanism is flatpak on desktop or OCI containers on servers. The source doc is explicit that this is the weakest trust level: no verity attestation, no measurements, and it is acceptable for UX apps but privileged OS components must never run here (source doc).

## The uniformity rule

The ladder's closing rule is what holds the design together: sysext images, portable service images, nspawn images, and the host OS image are all GPT disk images with DPS UUIDs, verity, and a PKCS#7 signature. The same tools build, validate, and update all of them, and IMA validates all of them through the same kernel path (source doc). The practical consequence: choosing a rung changes only the attachment mode, not the image format.

For context on the ecosystem these rungs sit in: systemd describes itself as the suite of basic building blocks for a Linux system, a system and service manager running as PID 1 (https://systemd.io/, weight 0.82), developed in the open at https://github.com/systemd/systemd (weight 0.82 and 0.81 across queries). Generic third-party overviews of systemd (https://en.wikipedia.org/wiki/Systemd, weight 0.35; https://linuxvox.com/blog/systemd-in-linux/, weight 0.12, weak) exist but carry no load-bearing claims in this doc.
