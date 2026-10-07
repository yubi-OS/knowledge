# 06: Portable services, the production-side cousin

Scope: what portable services are, how portablectl attach works, and the three yubiOS use cases.

## What a portable service is

The primary sources here are strong. The systemd portable services documentation (https://github.com/systemd/systemd/blob/main/docs/PORTABLE_SERVICES.md, weight 0.83; mirrored at https://systemd.io/PORTABLE_SERVICES/, weight 0.58) states that the primary tool for interacting with portable services is portablectl, that they are managed by the systemd-portabled service, and that they offer stricter default security policies, that is sandboxing of applications. The portablectl man page (https://www.freedesktop.org/software/systemd/man/portablectl.html, weight 0.65) defines a portable service image as containing an OS file system tree along with the unit files to run on the host, and describes portablectl as primarily a command interfacing with systemd-portabled.service.

## How attach works

The Arch man page (https://man.archlinux.org/man/portablectl.1.en, weight 0.41) enumerates the four operations executed when a portable service is attached: unit files of types .service, .socket, .target, .timer, and .path matching the indicated prefix are copied from the image into the host's /etc, plus the remaining attach steps that register the image with the host. A practitioner account (https://rukulkarni.com/blog/systemd-portable-services/, weight 0.14, weak) describes the same thing operationally: portablectl attach mounts the image, looks inside, finds the unit files, and installs them as native systemd services.

The 0pointer walkthrough (https://0pointer.net/blog/walkthrough-for-portable-services.html, weight 0.63) demonstrates attach, enable, and start end to end on a sample service, and is the closest external analogue to the source doc's own example.

## The yubiOS invocation

The source doc shows the build-host side: portablectl attach --image=/path/to/yubiOS-portable-2026.08.raw yubiOS-portable /etc/portables/yubiOS-portable.service, after which systemctl start yubiOS-portable.service runs the service, with nspawn invoked under the hood. The image side is grounded by the systemd docs (weight 0.83): the service definition, a .service unit, ships with the image, and nspawn -i -b is the documented way to boot the same image by hand.

## The three yubiOS use cases

All three are attributed to the source doc:

1. Shipping a tool to a customer without requiring a native install.
2. Running an old version of a service alongside the current version.
3. Running a service that needs a specific /usr without rebuilding the host.

Each maps cleanly onto the documented mechanics: use case 1 is the portable image's reason for existing (https://github.com/systemd/systemd/blob/main/docs/PORTABLE_SERVICES.md, weight 0.83), use case 2 is supported by the copy-in and prefix-matching attach model (https://man.archlinux.org/man/portablectl.1.en, weight 0.41), and use case 3 is the same specific-/usr property the nspawn rung exploits, extended to a persistent service.

## Position in the ladder

Recall doc 01: portable is the production rung of the same image that nspawn runs in dev and test. The source doc phrases it as the production-side cousin of nspawn; the systemd documentation grounds it by showing one image artifact addressable all three ways (weights 0.8 to 0.83 across the docs). A Ubuntu how-to (https://oneuptime.com/blog/post/2026-03-02-how-to-configure-systemd-portable-services-on-ubuntu/view, weight 0.09, weak) shows portablectl list and attach as the two everyday commands, consistent with the man pages but adding nothing new.

## What attach changes on the host

The attach model is the part of portable services that differs most from running nspawn by hand, and it is worth being precise. A hand-launched nspawn container is transient: the image is mounted, the container runs, and on exit nothing persists on the host except what was explicitly bound in. Attach is the inverse: the four documented operations (https://man.archlinux.org/man/portablectl.1.en, weight 0.41) install state on the host, the copied unit files and the registered image, so that ordinary systemctl commands manage the service afterwards. The systemd documentation's stricter-default-sandboxing claim (https://systemd.io/PORTABLE_SERVICES/, weight 0.58) means the copied unit arrives with sandboxing directives applied beyond what the unit file itself carries.

For yubiOS this asymmetry is the reason the source doc routes production to portable and dev/test to raw nspawn. The customer-shipping use case requires the host-side install, because the customer runs systemctl, not nspawn. The side-by-side-versions use case relies on the prefix matching and copy-in of doc 06's attach mechanics, since two images can register distinct unit prefixes on the same host. The specific-/usr use case is the same property the nspawn rung exploits, but persistent. The 0pointer walkthrough (https://0pointer.net/blog/walkthrough-for-portable-services.html, weight 0.63) remains the best worked external demonstration of the full attach, enable, start sequence.
