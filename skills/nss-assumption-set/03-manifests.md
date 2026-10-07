# 03 - Dependency manifests as machine-readable assumption sets

Scope: dependency files as the narrow but highly useful machine-readable form of assumption documentation, and the five questions a dependency-gap checker must ask beyond "is package X documented".

## Why manifests are assumption sets

Dependency files say, in machine-readable form, what must be available for a build, test, or runtime scenario (source doc: yubi-OS/yubiOS skills/nss-assumption-set/SKILL.md). They are evidence of an assumption, not proof that the assumption is sufficient or operationally documented (source doc).

## What each manifest declares

- package.json declares dependencies, devDependencies, peerDependencies, and optionalDependencies, plus the os, cpu, and engines fields that encode environment assumptions directly. If os is empty, the package makes no OS assumption (source doc). The npm documentation describes package.json as the building block of the npm ecosystem and documents the engines field as the way to specify versions of node the package will work on (https://docs.npmjs.com/cli/v10/configuring-npm/package-json/, jev weight 0.73). A platform-compatibility checker that evaluates os, cpu, and engines fields against the current system is a concrete implementation of that assumption check (https://npm.hexdocs.pm/NPM.Platform.html, jev weight 0.24, weak backing).
- Cargo.toml declares dependencies, dev-dependencies, build-dependencies, target-specific dependencies, features, profiles, and workspace membership. The Cargo SemVer guidance explicitly calls out restricting previously-supported platform requirements as a possibly-breaking change (source doc).
- pyproject.toml declares project dependencies (abstract), optional-dependencies, tool.uv and tool.poetry sections, plus environment markers like sys_platform == "win32" and Python version constraints (source doc).
- requirements.txt is a pip-oriented installation instruction list. Pinned lockfiles (pylock.toml since 2025) sit beside it for reproducible deployments. Treating the manifest as sufficient when reproducibility requires the lockfile is a classic gap (source doc).
- Containerfile ARG is a build-time parameter; ENV persists into the image and is visible to every process; LABEL is image metadata. BuildKit --mount=type=secret is the secret path; ARG SECRET and ENV SECRET are the wrong paths because both leak into image and build history (source doc).
- mkosi.conf exposes every setting in three places (config file, CLI --some-setting, and a few environment variables). mkosi.conf.d snippets are lex-sorted, last-wins on duplicate keys (source doc).
- systemd units declare Environment=KEY=VAL in the unit (visible via systemctl show) and EnvironmentFile=/path reads key/value pairs from a file, with mode 0600 expected and reload via daemon-reload plus unit restart, not a SIGHUP (source doc). The systemd source repository is the upstream authority for these semantics (https://github.com/systemd/systemd, jev weight 0.50); practitioner guides confirm the daemon-reload plus restart pattern for applying new environment values to a running service (https://www.flatcar.org/docs/latest/os-config/host-config/environment-variables/, jev weight 0.19, weak backing; https://www.baeldung.com/linux/systemd-services-environment-variables, jev weight 0.09, weak backing).
- GitHub Actions workflow_call.inputs and workflow_dispatch.inputs declare each input's description, required, default, and type. Inputs flow through inputs.<id> in the workflow and ${{ inputs.<id> }} in expressions (source doc).

## The five questions a dependency-gap checker must ask

The source doc's checklist, verbatim in structure (source doc):

1. Is the dependency declared (production, development, build, optional, peer, target-specific)?
2. Is the version a range or an exact resolution? Is the lockfile or equivalent present when reproducibility matters?
3. Are native tools, OS packages, services, credentials, environment variables, ports, files, and platform assumptions also documented?
4. Does the documentation cover every manifest-selected configuration, including optional features and platform markers?
5. What is the stale indicator, meaning which event means "this assumption is no longer current"? Kernel version, OS release, package rotation, library major bump, secret rotation, certificate expiry.

## Where manifests stop

A manifest does not state owner, stale indicator, verification method, or impact if false. Those fields are the difference between a manifest entry and an assumption-ledger row, and they are what the assumption ledger (doc 04) adds on top. The source doc's Containerfile example shows the full expansion: the FROM digest pin carries both a reachability claim ("this exact digest is available") and a correctness claim ("this digest produces a working yubiOS"), each falsifiable, each needing a stale indicator such as "any 422 or 404 from quay.io on this exact digest" (source doc).
