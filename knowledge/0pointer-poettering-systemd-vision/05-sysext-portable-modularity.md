# 05 Modularity Layers: sysext, confext, and Portable Services

Scope: the layered modularity model of the 0pointer vision: system extensions (sysext), configuration extensions (confext), portable services with RootImage, and where the app layer falls short.

## The layered trust model

The vision defines a hierarchy of modularity with decreasing trust guarantees (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). OS extensions (systemd-sysext) and isolated services (portable services with RootImage=) sit at the top: both can be verity-protected and PKCS#7 signed, so they inherit the trust chain of the base image. The app layer, delivered as flatpak or OCI images, is explicitly weaker in that model because it lacks the same attestation properties (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## systemd-sysext

systemd-sysext extends the host filesystem at runtime with signed images that add new files under /usr (source: https://github.com/systemd/systemd/issues/24864, jev 0.92). The upstream man page describes the mechanism and its complement: the systemd-confext concept follows the same principle as systemd-sysext but instead of working on /usr and /opt, confext extends only /etc (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html, jev 0.95). Under the hood sysext uses OverlayFS, adding compatibility checking and systemd integration on top (source: https://itsfoss.com/systemd-sysext/, jev 0.23, low weight). The systemd.io environment-variable documentation confirms the shared implementation: systemd-confext is a multi-call of the sysext functionality (source: https://systemd.io/ENVIRONMENT/, jev 0.72).

## confext

confext exists for the same reason sysext does, but for configuration: it layers signed, verity-protected, live configuration updates onto /etc (source: https://github.com/systemd/systemd/issues/24864, jev 0.92). This closes a gap in the immutable model: /etc is writable by design, so without confext, configuration files have no integrity story. The issue that proposed confext frames both tools as the runtime equivalent of what signed OS images do at build time (source: https://github.com/systemd/systemd/issues/24864, jev 0.92).

## Hardening the extension surface

Because extensions are code arriving outside the base image, they need their own integrity gate. Hardening guidance for immutable Linux recommends requiring signed, verity-protected extensions by setting systemd.extension-images.require-signature=yes (source: https://www.trackr.live/2026/05/07/hardening-immutable-linux-sysext-confext-persistence/, jev 0.14, low weight). This matches the essay's model where only signed and verity-protected extensions participate in the trust chain (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). In the v261 cycle Poettering described extensions as the right way to insert additional code into a fully image based OS (source: https://mastodon.social/@pid_eins/116792552048067669, jev 0.39, low weight), and v261 shipped early-initrd merge services, systemd-sysext-sysroot.service and systemd-confext-sysroot.service, moving extension activation earlier in boot (source: https://github.com/systemd/systemd/releases/tag/v261, jev 0.86, per the parent source material).

## Portable services

Portable services are systemd's delivery method for isolated services, supported since version 239, built on two specific features of container management: image-based delivery and per-service namespacing (source: https://systemd.io/PORTABLE_SERVICES/, jev 0.94). A portable service is a disk image or directory tree containing a root filesystem with the service's dependencies plus systemd unit files describing the service (source: https://oneuptime.com/blog/post/2026-03-02-how-to-configure-systemd-portable-services-on-ubuntu/view, jev 0.10, low weight). The attach mechanism works through unit drop-ins: for unit files of type .service, a drop-in is added that sets RootDirectory= or RootImage=, ensuring the service runs within the image's filesystem (source: https://www.freedesktop.org/software/systemd/man/portablectl.html, jev 0.84).

Poettering's own walkthrough from 2018 explains the lineage: RootDirectory= and RootImage= have been around for a long time, as have the various sandboxing features systemd provides, and portable services simply compose them into a deployment method (source: https://0pointer.net/blog/walkthrough-for-portable-services.html, jev 0.87; LWN coverage: https://lwn.net/Articles/758557/, jev 0.79). v260 took this further with unprivileged portable services, allowing attach and detach without privileges (source: https://github.com/systemd/systemd/releases, jev 0.77, per the parent source material).

## Credentials as the data plane

The systemd.io credentials documentation frames the problem portable services and extensions both face: traditionally, service data was provided via environment variables, which are inherited down the process tree and have size limitations (source: https://systemd.io/CREDENTIALS/, jev 0.95). The credentials mechanism is the sanctioned alternative for injecting secrets and configuration into image-delivered services, completing the modularity story: code comes from signed images, data arrives through the credential subsystem (source: https://systemd.io/CREDENTIALS/, jev 0.95).

## Where the model stops

The essay is candid that the app layer does not get the same guarantees: flatpak and OCI images lack attestation, so the vision's trust chain ends at the service boundary (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). This is a deliberate trade: maximal rigor for the OS and system services, compatibility for third-party apps.
