# 06. build_crubit.py: the sanctioned arch-aware crubit builder

Scope: Chromium's tools/rust/build_crubit.py, its host-architecture detection and sysroot handling, the CRUBIT_BINS list across revisions, and the tracking bug for building crubit on all host platforms.

## The script and its job

`tools/rust/build_crubit.py` is Chromium's script for building and packaging crubit into the Rust toolchain. It exists at HEAD in the Chromium source tree (source: https://chromium.googlesource.com/chromium/src/+/HEAD/tools/rust/build_crubit.py, w=0.86). Its install behavior is visible in a public branch snapshot: the script imports `RUST_HOST_LLVM_INSTALL_DIR` from build_rust, runs a cargo build, then prints "Installing Crubit to {RUST_TOOLCHAIN_OUT_DIR} ..." and iterates `CRUBIT_BINS = ['cc_bindings_from_rs']`, appending `EXE` to each name as it copies the binaries into the toolchain output directory (source: https://chromium.googlesource.com/chromium/src/+/refs/heads/lkgr-android-internal/tools/rust/build_crubit.py, w=0.83). That snapshot is load-bearing for this corpus: it shows that on recent Chromium revisions the script's bin list already includes the tool a native aarch64 build needs.

The tools/rust documentation frames where this script sits in the pipeline: "Local development. Rolling Crubit tools. Building and testing Crubit locally. The Rust build also includes building LLVM for rustc to use, and Clang for bindgen and crubit to use" (source: https://chromium.googlesource.com/chromium/src/tools/rust/, w=0.61).

## Host architecture handling

The internal survey recorded the script's arch detection: it computes the host arch as 'arm64' when `platform.machine() == 'aarch64'` else 'amd64', and downloads the matching Debian sysroot accordingly (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). The sysroot machinery it relies on is the standard Chromium one: `build/linux/sysroot_scripts/install-sysroot.py`, normally run as a gclient hook, no-op on non-Linux platforms, with prebuilt sysroot images rebuilt periodically for Debian security fixes (source: https://github.com/chromium/chromium/blob/main/docs/linux/sysroot.md, w=0.71). An older copy of that script shows the arch mapping table it uses, including 'x64': 'amd64' (source: https://github.com/webrtc-uwp/chromium-build/blob/master/linux/sysroot_scripts/install-sysroot.py, w=0.38, weak).

The official ARM Linux recipes doc rounds out the picture of how sysroots and ARM builds are handled in-tree: the sysroot is installable manually or via hooks, and ARM builds use the clang binary in the tree with specific gn args (source: https://chromium.googlesource.com/chromium/src/+/main/docs/linux/chromium_arm.md, w=0.84).

## The CRUBIT_BINS history

The internal survey found that at crubit tag 141, `CRUBIT_BINS = ['rs_bindings_from_cc']` only: the script built and packaged the C++-to-Rust direction but not cc_bindings_from_rs (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). The lkgr branch snapshot cited above shows the list later expanded to `['cc_bindings_from_rs']`, consistent with the commit history: "[crubit] Link cc_bindings_from_rs with Chromium's toolchain" landed in tools/rust within days of the survey (source: https://chromium.googlesource.com/chromium/src/tools/rust/, w=0.59). The practical instruction from the survey: before trusting build_crubit.py at a given Chromium pin to produce cc_bindings_from_rs, read that pin's CRUBIT_BINS list; if the binary is absent from the list, invoke the crubit cargo rules directly instead (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted).

## The tracking bug

Chromium issue 351793625, "Use Crubit for C++/Rust interop", carries the multi-host build work: "WIP Chromium CL (edits of build_crubit.py) can successfully build rs_bindings_from_cc on all host platforms. Working on two correctness issues + splitting this into smaller CLs and landing them" (source: https://issues.chromium.org/issues/351793625, w=0.63). The issue's linked resources include the goal statement that crubit must "generate consistent bindings with libc++ and libstdc++, and ... trivially-relocatable bindings for std types that are as such (unique_ptr) in both" (source: https://issues.chromium.org/issues/351793625/resources, w=0.35, weak). The issue confirms both the intent and the boundary: the "all host platforms" CL work targeted rs_bindings_from_cc at the time the survey read it, and no aarch64-host work had landed through 2026-09-25 (internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted).

## What this means for the native build

The script is the sanctioned recipe for a native aarch64 crubit build, because it already knows how to:

1. Detect an aarch64 host and select the right sysroot (internal record; consistent with the sysroot doc, source: https://github.com/chromium/chromium/blob/main/docs/linux/sysroot.md, w=0.71).
2. Build crubit with the toolchain's own toolchain (source: https://chromium.googlesource.com/chromium/src/tools/rust/, w=0.61).
3. Install the produced binaries into the toolchain layout Chromium's build graph expects (source: https://chromium.googlesource.com/chromium/src/+/refs/heads/lkgr-android-internal/tools/rust/build_crubit.py, w=0.83).

The only check required before using it on a specific pin is the CRUBIT_BINS list at that pin, per the survey's finding. If the pin predates the cc_bindings_from_rs addition, the fallback is the direct cargo build documented in doc 04.