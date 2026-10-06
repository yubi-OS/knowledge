# 09 - CI Workflow and Code Quality Rules

**Scope:** the bcvk-based CI workflow the source doc teaches (mkosi build, ephemeral boot test, FIDO2 enrollment test) and the code quality rules it imports from bcvk's REVIEW.md.

## The CI job

The source doc gives a GitHub Actions job, reproduced here in its own terms:

```yaml
jobs:
  test-yubiOS:
    runs-on: ubuntu-latest
    container:
      credentials:
        username: 0mniteck42
        password: ${{ secrets.DOCKER }}
      image: docker://dhi.io/debian-base@sha256:9415967aa0ed8adea8b5c048994259d1982026dca143d0303c7bbe0e11ed67d3
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd
      - name: Build OCI image
        run: mkosi build
      - name: Test ephemeral VM boot
        run: bcvk ephemeral run --timeout 60 ./mkosi.output/yubiOS
      - name: Run FIDO2 enrollment test
        run: |
          sudo modprobe vhci-hcd
          sudo ~/go/bin/virtual-fido &
          sleep 2
          bats tests/integration/fido2/
```

Everything above is a source-doc claim. Three structural points are worth naming: the job runs inside a digest-pinned container image (the `docker://dhi.io/debian-base@sha256:...` line), the checkout action is pinned to a full commit SHA, and the build tool is mkosi with the output fed straight into `bcvk ephemeral run --timeout 60`, which fails the job if the image does not boot within 60 seconds.

## mkosi, the build stage

mkosi is the upstream project of the build step: "systemd/mkosi: Build Bespoke OS Images" (https://github.com/systemd/mkosi/, jev weight 0.70, high). Its project site titles it "mkosi - Build Bespoke OS Images" (https://mkosi.systemd.io/, jev weight 0.49, weak, labeled). The yubiOS-side contract is the source doc's `mkosi build` producing `./mkosi.output/yubiOS` for the VM test.

## The VM boot test stage

`bcvk ephemeral run --timeout 60 ./mkosi.output/yubiOS` is the ephemeral VM path from doc 02 with a timeout added. The same pattern exists in the wider bootc ecosystem: the secureblue project's bootc integration test action builds a qcow image, "imports" it into virt-install, runs tests on the booted machine, records output, and passes only "if all tests exited with exit code 0", uploading logs to GitHub Artifacts (https://github.com/secureblue/bootc-integration-test-action, jev weight 0.40, weak, labeled). That project corroborates the boot-then-test shape, though it uses virt-install rather than bcvk.

## The FIDO2 test stage

The FIDO2 stage loads the USB/IP kernel modules (`sudo modprobe vhci-hcd`), starts the `virtual-fido` emulator in the background, waits 2 seconds, then runs `bats tests/integration/fido2/`. These are source-doc claims. The USB/IP mechanism is what lets a software device appear as a USB token to the host, and virtual-fido is the Go emulator the source doc names for LUKS2 + PAM U2F tests (source doc). bats is the Bash Automated Testing System the test directory runs under (https://github.com/bats-core/bats-core, jev weight 0.19, weak, labeled). The emulator's own project page describes the mechanism: "Virtual FIDO creates a USB/IP server over local TCP to attach a virtual USB device. This USB device then emulates the USB/CTAP protocols to provide U2F/FIDO services to the host computer" (https://github.com/bulwarkid/virtual-fido, jev weight 0.37, weak, labeled). Note the drift: the source doc links `github.com/standard-library/virtual-fido`, while the live repository found in the dig is `github.com/bulwarkid/virtual-fido` (dated correction, dig source, 2026-10-06).

## Code quality rules (from bcvk REVIEW.md)

The source doc imports five rules from bcvk's REVIEW.md, all source-doc claims:

1. Table-driven unit tests, not one test per case.
2. Split parsers from I/O: parsers accept `&str`, a separate function reads from disk.
3. Strict assertions, not just "didn't crash".
4. AI attribution: `Assisted-by: Sauna (claude-sonnet-4-6)`.
5. No `Signed-off-by` on AI-generated commits; a human must add it after review.

Rules 1-3 shape how yubiOS test code for this pipeline is written: test tables rather than copies, pure parser functions separate from file access, and assertions that verify content rather than only the absence of exceptions. Rules 4-5 are commit-hygiene policy: AI-assisted commits carry the assisted-by trailer, and the human sign-off is added post-review.

## Weak-signal sources, labeled

The dig's weakest hits are recorded for traceability only: a QEMU-in-CI tutorial gist (https://gist.github.com/dghubble/c2dc319249b156db06aff1d49c15272e, jev weight 0.17, weak), a GitHub Marketplace QEMU action (https://github.com/marketplace/actions/run-with-qemu-vm, jev weight 0.20, weak), and generic GitHub Actions content (https://anupamsinha.github.io/posts/github-actions-cicd-spring-boot/, jev weight 0.04, weak). None are load-bearing.
