# 09 - SELinux labeling in bootc images

Scope: how SELinux contexts work for OCI-based bootc images, the semanage-over-chcon rule, and the default_t trap on custom top-level directories.

## No embedded labels in OCI layers

Standard bootc/OCI images carry no `security.selinux` xattr metadata in their layers, unlike rpm-ostree-composed images which embed labels at compose time (source doc: yubi-OS/yubiOS skills/bootc-images/SKILL.md). The upstream image-layout documentation corroborates: "non-bootc base images do not (usually) have any embedded security.selinux" xattrs, and bootc derives labeling from the target's policy (bootc.dev/bootc/bootc-images.html, w=0.87).

At deploy time, file content in derived layers is labeled using the /etc/selinux default file contexts of the booted system (source doc). This means the image author does not bake labels; the author declares contexts and the system applies them.

## The rule: semanage, never chcon

To declare a label for image content, use semanage fcontext, which works in builds since bootc 1.1.0 (source doc):

```dockerfile
RUN semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
```

The semanage fcontext mechanism is the standard policy tool for defining file contexts (carta.tech/man-pages/man8/semanage-fcontext.8.html, w=0.48, weak backing: third-party man page mirror; the RHEL SELinux guide documents the same command flow, docs.redhat.com RHEL7 SELinux guide, w=0.38, weak backing: older RHEL 7 documentation).

The hard prohibition from the source doc: do not use `chcon` in builds. The container runtime denies the attempt to set the `security.selinux` xattr during build, so a chcon-based Containerfile fails or silently produces unlabeled content (source doc).

## The default_t trap

For arbitrary top-level directories such as /yubiOS or /app, Fedora and CentOS SELinux policies may label them `default_t`, a type few domains can access (source doc). A service that works on a development host can fail on the deployed system with permission denied, and the cause is invisible in the image because the label was assigned by the target policy, not the image.

The fix is explicit file context rules for every custom top-level path the image creates (source doc), paired with the corresponding policy rules for the service domain that needs access. This belongs in the same review pass as the least-privilege hardening of units (systemd-hardening skill): the type assignments and the service's SELinux domain must agree.

## How this composes in yubiOS

yubiOS runs SELinux-enforcing targets, so the labeling discipline is load-bearing:

1. Ship standard paths where possible; policy covers /usr, /etc, /var by default (docs 04, 05).
2. For custom paths, declare fcontext rules in the image (this doc) and keep the list short.
3. Never chcon, never ship xattrs, never rely on runtime labeling of arbitrary new paths (source doc).

The bootc-container-image-best-practices repository collects the same guidance (custom file contexts may need explicit label definitions) for derived images (github.com/andrew-weida/bootc-container-image-best-practices, w=0.20, weak backing: community repo).

## Debugging a labeling failure

When a deployed service hits permission denied that does not reproduce in the container, the sequence is (source doc + standard tooling):

1. Check the assigned type on the deployed path and confirm it is default_t or another fallback type.
2. Add the explicit fcontext rule in the image (this doc's rule set), rebuild, and let the next deployment relabel.
3. Confirm the service domain is permitted to the assigned type; semanage fcontext alone does not grant access, it names the type.

Because labels are assigned from the booted system's policy, fixes ship through the image and land on the next deployment, the same atomic path as any other image change (doc 07). There is no out-of-band relabel step to forget across a fleet.
