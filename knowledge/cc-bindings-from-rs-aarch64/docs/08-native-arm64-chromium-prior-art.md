# 08. Prior art: native linux-aarch64 Chromium builds without crubit

Scope: what the public record shows about building Chromium natively on arm64 Linux hosts, why the existing pipelines stop short of the crubit problem, and what they validate for a native build.

## The official path is cross-compilation

Chromium's official ARM Linux documentation describes building for ARM using the clang binary shipped in the tree with specific gn args, sysroots installed by script, and a testing infrastructure described as "somewhat limited", with two builders set up on the FYI waterfall and try bots (source: https://chromium.googlesource.com/chromium/src/+/main/docs/linux/chromium_arm.md, w=0.84). The doc never contemplates running the toolchain binaries on an arm64 host, which is the root cause this corpus circles: the toolchain packages exist only for x64 and Mac/Win hosts (doc 05), so the official flow always executes the toolchain on an x64 host. A community repo states the consequence from the other side: "This repository provides instructions on how to build Chromium on arm64 linux systems, since google does not officially support Chromium on linux-arm64" (source: https://github.com/theoparis/chromium-linux-arm64, w=0.48, weak).

## The jasonrandrews pipeline: the closest prior art

The most complete public native-arm64 pipeline is `jasonrandrews/build-chromium-linux-arm64`. Its README explains the premise: "This repository performs a native arm64 build of Chromium on Linux. This is required because the official Linux build instructions are optimized for x86_64 hosts and assume a cross-compilation model, which breaks when the host itself is arm64. The scripts and patches here remove x86-only dependencies so the build can run entirely on an arm64 machine" (source: https://github.com/jasonrandrews/build-chromium-linux-arm64, w=0.33, weak).

The same repo documents the Rust-toolchain surgery its patch performs: "The script arm64-rust-build.patch sets the host triple to aarch64-unknown-linux-gnu, avoids the amd64 sysroot, uses system OpenSSL, and skips problematic std tests, enabling a native Rust toolchain and bindgen. Bindgen needs an accessible libclang: Rust's bindgen links to libclang" (source: https://github.com/jasonrandrews/build-chromium-linux-arm64, w=0.26, weak). The project publishes no binary releases either: its releases page shows "There aren't any releases here" (source: https://github.com/jasonrandrews/build-chromium-linux-arm64/releases, w=0.40, weak).

Two facts make this repo the right prerequisite reference but not a crubit answer. First, its Rust patch chain ends at bindgen and a native Rust toolchain; the dig surfaced no crubit work in it (and the internal survey explicitly recorded that the pipeline "stops at bindgen; never builds crubit", source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). Second, the crubit host tool did not exist in packaged form on any platform when that pipeline was built, per doc 02, so the pipeline had nothing to consume.

## Smaller prior art in the same family

- theoparis/chromium-linux-arm64 documents host-side substitutions for x86-only packaged binaries: "Unfortunately, chromium also downloads prebuilt node.js binaries for the wrong architecture. Let's override this, assuming you have node.js installed globally on your system" (source: https://github.com/theoparis/chromium-linux-arm64, w=0.48, weak). This is the same class of problem as the x86_64 cc_bindings_from_rs: a DEPS-shipped host binary for the wrong architecture that must be locally replaced.
- A community gist documents building Chromium on Arch Linux ARM64, "specifically addressing challenges with depot_tools and architecture mismatches on ARM64" (source: https://gist.github.com/grav/9059e7bbc277057c536245aa6ba5338b, w=0.27, weak). Depot_tools architecture mismatch is the upstream-most instance of the pattern this corpus documents.
- The same author (Jason Andrews, an Arm engineer) publishes general Arm native-build demos, such as a docker hello-world demo noting "This is not a multi-arch image. On the local Arm machine build the Arm image" (source: https://github.com/jasonrandrews/arm-docker-demo, w=0.24, weak), indicating the native-Arm-build discipline rather than multi-arch emulation.

## What the platform guarantees

The Rust side of the prerequisite layer is on firm ground: AWS's Graviton technical guide states "Rust is supported on Linux/arm64 systems as a tier1 platform along side x86", and notes that all Graviton processors from generation 2 onward support the Armv8.2 instruction set (source: https://aws.github.io/graviton/rust.html, w=0.78). Armbian's kernel-rust extension, which installs a pinned rustup toolchain to build Rust kernel modules alongside C in ARM kernels, shows the same native aarch64 Rust tooling working in an embedded-adjacent context (source: https://docs.armbian.com/build-framework/extensions/kernel-rust/, w=0.73). In other words, the component the jasonrandrews pipeline validates, a native aarch64 rustc and cargo, is a tier-1 supported configuration, not an experiment.

## The synthesis

Three layers stack up in the public record:

1. Native aarch64 rustc/cargo: tier 1, proven (source: https://aws.github.io/graviton/rust.html, w=0.78).
2. Native arm64 Chromium prerequisite chain (clang, bindgen, sysroot avoidance, x86-only binary replacement): proven by the jasonrandrews and theoparis pipelines, but always ending before crubit (sources: https://github.com/jasonrandrews/build-chromium-linux-arm64, w=0.33, weak; https://github.com/theoparis/chromium-linux-arm64, w=0.48, weak).
3. cc_bindings_from_rs on an aarch64 host: no public prior art. The internal survey found nothing building it natively on aarch64 anywhere (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted), and upstream's own multi-host work had reached only rs_bindings_from_cc (source: https://issues.chromium.org/issues/351793625, w=0.63).

That makes the native crubit build the open cell in an otherwise filled row, and the filled row is what makes the open cell mechanically tractable.