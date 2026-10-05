# 07. nspawn in CI pipelines

Scope: how systemd-based and third-party projects run tests under nspawn in continuous integration, the vmspawn sibling, and the runner-level mechanics a nspawn CI leg needs.

## How systemd itself tests

The systemd project's own integration testing is the reference shape. A Codethink writeup of systemd's integration testing infrastructure describes the suite built on mkosi-based container and disk image building, and introduces systemd-vmspawn: vmspawn may be used to start a virtual machine from an OS image, and "in many ways, it is similar to systemd-nspawn(1), but it launches a full virtual machine instead of using namespaces" ([Codethink: Improving systemd's integration testing infrastructure, part 2](https://www.codethink.co.uk/articles/2024/systemd-integration-testing-part-2/), jev 0.72). An architecture map of the project's testing infrastructure confirms the shape: low-level C unit tests under src/test/, Python-based network integration test suites, and mkosi-based container and disk image building ([DeepWiki: Testing Infrastructure and CI/CD](https://deepwiki.com/systemd/systemd/10.2-testing-infrastructure-and-cicd), jev 0.31).

The project also tests nspawn itself in CI, and the tracker shows that leg exercising on real runners: issue 32888 records "TEST-13-NSPAWN (machinectl) failed in GitHub Action" ([github.com/systemd/systemd issue 32888](https://github.com/systemd/systemd/issues/32888), jev 0.67). That is the existence proof that a nspawn/machinectl test leg runs inside GitHub Actions-hosted CI at all.

## Third-party CI usage of nspawn

NixOS moved its integration tests onto nspawn deliberately: the NixOS test driver gained a systemd-nspawn-based container backend for integration tests, described as a lightweight alternative that can run tests with multiple NixOS hosts within just a few seconds ([Nixcademy: Faster and cheaper NixOS integration tests with containers](https://nixcademy.com/posts/faster-cheaper-nixos-integration-tests-with-containers/), jev 0.60). This is the strongest public example of the abstraction nspawn buys in CI: multi-host integration tests without a per-cell VM boot.

At the workflow level, the arm-runner-action project ships a dedicated workflow file, .github/workflows/test-systemd-nspawn.yml, whose purpose is to run tests natively and build images directly from GitHub Actions using a chroot-based virtualized Raspberry Pi environment ([github.com/pguyot/arm-runner-action: test-systemd-nspawn.yml](https://github.com/pguyot/arm-runner-action/blob/main/.github/workflows/test-systemd-nspawn.yml), jev 0.65). And the runner-side mechanics are documented by GitHub itself: to use self-hosted runners in a workflow, you use labels or groups to specify the runner for a job, and policies can limit access to self-hosted runners ([GitHub Docs: Managing self-hosted runners](https://docs.github.com/actions/how-tos/managing-self-hosted-runners), jev 0.95).

## The runner gating pattern

The yubiOS CI uses exactly that mechanism for its VM-boot legs: the sysext/portable workflow gates its VM legs behind run_vm_legs: true and dispatches them to the ["self-hosted","Linux","ARM64","KVM"] runner group (rock1), while hosted amd64 runs loud-skip those legs ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). A nspawn dev-environment leg would slot into the same gating shape: the record costs it as "one more VM-boot job on rock1, run_vm_legs: true, same as the sysext legs" ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## The gap the record names

The verified coverage state in the yubiOS record is the negative finding: zero mentions of systemd-nspawn across all 39 workflow files, and zero test scripts under tests/ covering it, while the sysext overlay merge and portable-service attach/detach legs are exercised inside bcvk VMs booted from the yubiOS image ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). Against the public examples above, a systemd project runs its nspawn tests in CI, NixOS runs integration tests on an nspawn backend, and arm-runner-action has a dedicated nspawn workflow; yubiOS names the boundary and leaves the leg dark. The record's flip conditions keep that gap honest until one fires: a workflow needing unit tests against the real /usr of a pinned image without VM boot cost per matrix cell, RootImage= behavior changing across systemd majors, or the portable leg extending to machinectl-level lifecycle ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## Sub-claims recap

1. systemd's own CI builds mkosi images and drives them through nspawn-like runners, with vmspawn as the full-VM sibling (weight 0.72).
2. A TEST-13-NSPAWN (machinectl) leg runs in GitHub Actions within systemd's own CI (weight 0.67).
3. NixOS runs integration tests on a nspawn-based container backend for seconds-scale multi-host tests (weight 0.60).
4. arm-runner-action ships a dedicated test-systemd-nspawn.yml GitHub Actions workflow (weight 0.65).
5. Self-hosted runner targeting is done by labels and groups, which is the mechanism yubiOS uses to gate VM legs (weight 0.95).
6. yubiOS has zero nspawn CI coverage today, with named flip conditions for adding the leg (source-doc record).
