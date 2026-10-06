# 03. Standard multi-platform setup

**Scope:** the four-step workflow skeleton the skill teaches: QEMU, Buildx, login, build and push, with the platforms argument on the build step.

The source doc's standard setup is (source doc):

```yaml
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3

- name: Set up Buildx
  uses: docker/setup-buildx-action@v3

- name: Login
  uses: docker/login-action@v3
  with:
    registry: quay.io
    username: ${{ secrets.QUAY_USERNAME }}
    password: ${{ secrets.QUAY_TOKEN }}

- name: Build and push
  uses: docker/build-push-action@v6
  with:
    platforms: linux/amd64,linux/arm64
    push: true
    tags: quay.io/yubi-os/yubios:latest
```

Each step has a documented job:

1. setup-qemu-action registers the QEMU binfmt_misc interpreters so foreign-architecture RUN steps can execute (https://github.com/docker/setup-qemu-action, jev weight 0.95).
2. setup-buildx-action creates and boots a builder used by the following steps. Its default driver is docker-container, chosen specifically to be able to build multi-platform images and export cache using a BuildKit container (https://github.com/docker/setup-buildx-action, jev weight 0.81). Multi-platform output is a Buildx/BuildKit capability, not a classic-docker capability, which is why the builder setup step exists at all.
3. login-action authenticates to the registry (quay.io in the source doc example) using secrets.
4. build-push-action performs the build and push with full multi-platform support; its repository describes it as building and pushing Docker images with Buildx with full support of Moby BuildKit features including multi-platform builds (https://github.com/docker/build-push-action, jev weight 0.77).

The platforms argument belongs on the build step, not on the QEMU step: the QEMU action only registers interpreter support, and build-push-action decides which platforms to actually build (source doc; https://github.com/docker/build-push-action, jev weight 0.77).

Docker's official multi-platform GitHub Actions guide presents the same skeleton and calls the default Docker setup on GitHub Actions runners the supported path for building and pushing multi-platform images (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.94; https://docs.docker.com/build/ci/github-actions/, jev weight 0.91). Two drift notes, dated 2026-10-06: the docs example places the Login step before Set up QEMU (https://docs.docker.com/build/ci/github-actions/multi-platform, jev weight 0.94), and its action pins read docker/setup-buildx-action@v4 (https://abc.vhrghala.org/p/https/docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.65). The login step's position is flexible; the QEMU-before-Buildx constraint is not (see doc 04). The yubiOS corpus keeps the source doc's v3 pins for its own examples.

**Grounding spine:** the source doc's Standard multi-platform setup section. Digs confirmed the role of each of the four actions from their upstream repositories and documented the login-position and v4 drift.
