# 02. Action reference and inputs

**Scope:** the action's inputs and version surface: platforms, the 'all' default, reset, and the version drift the source doc's @v3 pin now sits inside.

The source doc's action reference is the canonical usage snippet (source doc):

```yaml
- uses: docker/setup-qemu-action@v3
  with:
    platforms: arm64,arm    # which platforms to emulate; 'all' for everything
```

What the action actually installs is narrower than the name suggests. Per the upstream package page, setup-qemu-action enables user-mode emulation for registered platforms; it does not install qemu-system-* tools and it does not add qemu-* binaries to your PATH (https://github.com/orgs/docker/packages/container/package/setup-qemu-action, jev weight 0.84). The repository description agrees: GitHub Action to install QEMU static binaries (https://github.com/docker/setup-qemu-action, jev weight 0.95). This matters for debugging: anything that needs full-system emulation (qemu-system-*) is out of scope; the action only wires binfmt_misc handlers for running foreign-architecture userspace inside containers.

Inputs the skill's corpus can verify from digs:

- `platforms`: the platform list to register interpreters for. The source doc shows arm64,arm as the explicit form and 'all' as the everything form. The official guidance to only list what you need comes from the source doc's Notes section, and it is sound: registering every interpreter costs setup time for platforms the build never touches (source doc).
- `reset`: added upstream in PR 21, it uninstalls currently registered emulators (https://github.com/docker/setup-qemu-action/releases, jev weight 0.95). Useful when a workflow needs to swap interpreter sets mid-job.

Version surface, with one dated correction. The source doc pins `docker/setup-qemu-action@v3`. The upstream releases page is live and actively maintained (https://github.com/docker/setup-qemu-action/releases, jev weight 0.95), and a tag comparison shows the v3 line running v3.3.0 through v3.7.0 alongside a v4 line (v4.0.0, v4.1.0) as of 2026-06-12 (https://gitea.psi.ch/docker/setup-qemu-action/compare/v3.4.0...releases/v3, jev weight 0.59). Correction, dated 2026-10-06: v4 tags exist upstream; the source doc's @v3 pin remains valid as a major-version pin but consumers should treat v3 and v4 as both live major lines when choosing a pin.

One weakly backed input note: a mirror of the README documents a "Customizing inputs" section with further steppable inputs (https://git.ari.lt/docker/setup-qemu-action, jev weight 0.50). Treat any input beyond platforms and reset as weakly verified in this corpus; check the upstream README's action.yml before relying on it.

**Grounding spine:** the source doc's Action reference section. Digs added the user-mode (not full-system) boundary, the reset input, and the v4 version-drift correction.
