# 04. Order matters: the four-step ordering discipline

**Scope:** why the source doc fixes the order QEMU, Buildx, login, build, and what breaks when registration comes after use.

The source doc's Order matters section lists the pipeline as (source doc):

1. setup-qemu-action: register QEMU interpreters
2. setup-buildx-action: configure BuildKit
3. login-action: authenticate
4. build-push-action: build

The ordering is dependency-driven, and the hard edge is 1 before 2.

- setup-qemu-action registers QEMU emulators with binfmt_misc so later steps can run containers built for another architecture on the runner (https://github.com/docker/setup-qemu-action, jev weight 0.95). It enables user-mode emulation for registered platforms and installs no PATH-visible qemu binaries (https://github.com/orgs/docker/packages/container/package/setup-qemu-action, jev weight 0.84).
- setup-buildx-action "will create and boot a builder that can be used in the following steps of your workflow if you're using Buildx or the build-push action" (https://github.com/docker/setup-buildx-action, jev weight 0.81). Its README also states the ordering rule directly: if you are using docker/setup-buildx-action, the QEMU action should come before it (https://git.ari.lt/docker/setup-qemu-action, jev weight 0.50; weakly backed mirror, consistent with the source doc).

The mechanism behind that rule: a foreign-architecture RUN step inside the arm64 build requires the kernel to dispatch that architecture's ELF binaries to a QEMU user-mode handler. That dispatch table lives in binfmt_misc and is populated by the QEMU registration step. BuildKit's docker-container builder, booted by setup-buildx-action, is the process that will issue the foreign-architecture builds; if its builder container starts before the handlers exist, the emulated platforms fail inside RUN steps with exec format errors rather than a clear setup-order message. Weakly backed corroboration of the mechanism (jev weights 0.20 and 0.16, labeled weak): QEMU user-mode emulation works by registering binfmt_misc handlers so the kernel executes foreign-architecture binaries transparently (https://sudo.academy/blog/building-multi-architecture-docker-images-with-buildx-and-qemu-emulation-364e31; https://stackharbor.com/en/knowledge-base/docker-buildx-multi-arch-images/). The strong-backed form of the same fact is the registration claim in the action's own repository at 0.95 above.

The login step is the flexible one: Docker's own multi-platform guide shows Login before Set up QEMU (https://docs.docker.com/build/ci/github-actions/multi-platform, jev weight 0.94), while the source doc puts it third. Both orderings work because authentication is orthogonal to emulation and builder state. The only absolute ordering constraint this skill teaches is QEMU registration before builder creation and use.

Docker's general GitHub Actions CI guide walks the same setup sequence for build workflows (https://docs.docker.com/build/ci/github-actions, jev weight 0.90), and the buildx repository itself documents multi-architecture support built on either emulated or native builder nodes (https://github.com/docker/buildx, jev weight 0.88).

**Grounding spine:** the source doc's Order matters section. Digs grounded each ordering edge from the actions' own documentation; the binfmt_misc mechanism claims from third-party explainers carry weak labels.
