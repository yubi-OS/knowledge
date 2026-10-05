# 04. The cargo build path: cc_bindings_from_rs as a pure-Rust binary

Scope: how cc_bindings_from_rs is actually built from source, the cargo surface area involved, and the librustc_driver linkage mechanics that make the build toolchain-sensitive.

## The documented cargo recipe

Crubit's official cargo build documentation is explicit that the Rust-to-C++ tool is an ordinary cargo target: "cc_bindings_from_rs can be built by invoking cargo as follows", and this works "from a git checkout of the public project or from Google's internal mirror of the repo"; when iterating on a cargo build the docs recommend cd-ing into `third_party/crubit` so the build runs without specifying a manifest path (source: https://crubit.rs/overview/cargo_build.html, w=0.87). The documentation home condenses it to one line: "You can build cc_bindings_from_rs, which allows Rust code to be called from C++, using cargo build --bin cc_bindings_from_rs" (source: https://crubit.rs/index.html, w=0.76).

The repo layout matches. The `cargo/` directory at the top of the crubit tree contains the cargo manifests, and its recent commit history includes cargo-specific cc_bindings_from_rs work such as "Fix ABI-compatible type definitions in cc_bindings_from_rs" and "Proper support for proc macro crates in our bazel->Cargo export" (source: https://github.com/google/crubit/tree/main/cargo, w=0.55). The internal survey recorded the exact manifest location as `cargo/cc_bindings_from_rs/cc_bindings_from_rs/Cargo.toml` and the exact command as `cargo build --release --locked --bin cc_bindings_from_rs` (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted).

## What the cargo build does NOT need

A load-bearing asymmetry: the Bazel/LLVM/Abseil dependency weight in crubit's tree belongs to the reverse direction, `rs_bindings_from_cc`, not to cc_bindings_from_rs. The C++-to-Rust tool's build documentation describes setting up clang and LLVM header paths plus `libLLVM*.a` and `libclang*.a` static libraries for Crubit's cargo build (source: https://crubit.rs/cpp/building.html, w=0.76), which is the heavier tool. The internal survey found cc_bindings_from_rs to be a pure-Rust cargo binary with no such native dependency stack (internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). This asymmetry is the technical reason the native aarch64 route is "trivially portable": the binary being rebuilt is the light one.

## The librustc_driver linkage problem

What the cargo build does couple to is the rustc build it runs against. cc_bindings_from_rs integrates with rustc for semantic analysis through the rustc_driver crates (source: https://deepwiki.com/google/crubit/3.1-architecture-and-entry-points, w=0.46, weak; and the rust-dev announcement, source: https://groups.google.com/a/chromium.org/g/rust-dev/c/Kixvw8bhfME/m/tkzaAac1BgAJ, w=0.74). On Linux the resulting binary dynamically links `librustc_driver-*.so`, and the history of that library is full of tool-mismatch failures:

- Rust issue 137469: "tools no longer find librustc_driver"; the tools were built against the wrong rustc, with the library hash mismatching (source: https://github.com/rust-lang/rust/issues/137469, w=0.48, weak).
- Rust issue 140299: building Rust with `--disable-rpath` causes most cargo tests to fail due to missing dynamic libraries, notably librustc_driver (source: https://github.com/rust-lang/rust/issues/140299, w=0.49, weak).
- jyn.dev's writeup on building your own rustc_driver covers how wrapper tooling interacts with rustc invocation, relevant background for anyone linking against rustc internals (source: https://jyn.dev/rustc-driver/, w=0.64).
- A Rust internals thread records `librustc_driver.so` reproducibility issues when building the compiler twice, fixed via `--remap-path-prefix` (source: https://internals.rust-lang.org/t/librustc-driver-so-not-reproducible/19639, w=0.28, weak).

The practical consequence, recorded in the internal survey, is that the binary must be built with Linux RUSTFLAGS so it finds the library next to the toolchain it belongs to: `-Clink-args=-Wl,-z,origin -Clink-args=-Wl,-rpath,$ORIGIN/../lib` (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). Chromium's own solution to this coupling is to link the tool against the toolchain it ships: the commit "[crubit] Link cc_bindings_from_rs with Chromium's toolchain" in tools/rust exists precisely for this (source: https://chromium.googlesource.com/chromium/src/tools/rust/, w=0.59).

## The rustc-dev component requirement

Crubit's cargo build page calls out the component explicitly: "If you build Crubit using cargo and rustc that are built and installed using x.py install, then please ensure that x.py's config.toml covers the rustc-dev component" (source: https://crubit.rs/overview/cargo_build.html, w=0.84). A distro-style or rustup-style toolchain needs the equivalent component present. The internal survey confirmed the Chromium-pinned toolchain already ships the rustc-dev component, so the prerequisite is satisfied on the target host (internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted).

## What this means for aarch64

Nothing in the documented build path is x86_64-specific: cargo, a rustc with rustc-dev, and rpath link flags against the toolchain's own librustc_driver. The internal survey's risk list for the aarch64 build is therefore narrow: `--locked` may need regeneration if the vendored lockfile lacks aarch64 platform resolution, and the build must use the same toolchain rustc that supplies librustc_driver (internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). Both risks are mechanical and are covered in doc 09.