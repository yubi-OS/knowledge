# Capabilities, ambient sets, and CAP_SYS_ADMIN as root by another name

## Scope

The Linux capabilities model as the vocabulary for runtime privilege minimisation: capability sets, the ambient set, why CAP_SYS_ADMIN is treated as equivalent to root, and what CapabilityBoundingSet buys.

## The model

Starting with kernel 2.2, Linux divides the privileges traditionally associated with superuser into distinct units, known as capabilities, which can be independently enabled and disabled; capabilities are a per-thread attribute (litux man mirror of capabilities(7), https://litux.nl/man/htmlman7/capabilities.7.html). Traditional UNIX implementations distinguish 2 categories of processes for permission checks: privileged processes whose effective user ID is 0 (root), and unprivileged processes (linux.die.net capabilities(7), https://linux.die.net/man/7/capabilities). Capabilities exist to break that binary split into grantable units.

For permission checking the modern kernel uses capability sets per thread; the ambient capability set can be directly modified using prctl(2), and ambient capabilities are automatically lowered on exec of setuid or file-capability binaries that do not retain them (man7.org capabilities(7), https://www.man7.org/linux/man-pages/man7/capabilities.7.html). The ambient set is what lets a non-setuid binary keep a small capability across an exec boundary; it is the mechanism most often proposed for granting builders a narrow power without uid 0.

## CAP_SYS_ADMIN is not a narrow grant

The canonical critique: capabilities are, at least in theory, a nice idea, dividing the privileges of root into small pieces so that a process can be granted just enough power to perform specific privileged tasks; CAP_SYS_ADMIN is the exception that swallows the rule, and the LWN article that coined the phrase treats it as the new root (LWN, Michael Kerrisk, 14 March 2012, https://lwn.net/Articles/486306/). Concretely, CAP_SYS_ADMIN governs namespace manipulation, mount operations, and a large share of the kernel's privileged surface, so granting it to a builder restores most of the risk the rootless model removed.

The bounding set itself is also constrained: only the init process may set capabilities in the capability bounding set; otherwise a privileged process may only clear capabilities from that set (manpages.ubuntu.com capabilities(7), https://manpages.ubuntu.com/manpages/bionic/man7/capabilities.7.html). This is the kernel-level guarantee behind CapabilityBoundingSet in unit files: the bounding set can only shrink over a process lifetime, so a hardened unit's capability floor is set at spawn and can only get narrower.

## Decision rule

The capability model supports 3 postures for a builder or service:

1. Drop to zero capabilities, the rootless default.
2. Grant a minimal, named capability with a documented reason, the exception path that requires a written justification per instance.
3. Grant CAP_SYS_ADMIN or run rootful, rejected: this is root by another name, and it re-opens the attack surface the whole model exists to close.

The ambient set belongs in posture 2 only, never as a substitute for posture 1, because an ambient grant persists across exec and therefore widens rather than narrows what a compromised process keeps.
