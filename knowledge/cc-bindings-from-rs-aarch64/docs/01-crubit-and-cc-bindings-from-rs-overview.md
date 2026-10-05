# 01. Crubit and cc_bindings_from_rs: what the generator actually is

Scope: what crubit is, what cc_bindings_from_rs (aka cpp_api_from_rust) generates for Chromium, and why a Chromium build on linux-aarch64 cannot proceed without it.

## Crubit in one paragraph

Crubit is Google's bidirectional interop tool for C++ and Rust: one half generates C++ bindings from Rust crates, the other generates Rust bindings from C++ headers (source: https://github.com/google/crubit, w=0.87). The repo describes itself plainly as "A bidirectional bindings generator for C++ and Rust", and the `cc_bindings_from_rs` subtree lives at `cc_bindings_from_rs/` in that repo (source: https://github.com/google/crubit/tree/main/cc_bindings_from_rs, w=0.85). The public documentation site makes the split concrete: "You can build cc_bindings_from_rs, which allows Rust code to be called from C++, using cargo build --bin cc_bindings_from_rs" (source: https://crubit.rs/index.html, w=0.76).

## The Chromium name: cpp_api_from_rust

Chromium's docs use a different name for the same tool. The authoritative page states: "cpp_api_from_rust (aka cc_bindings_from_rs) is a Crubit tool that takes a Rust crate as input and generates C++ APIs (a .h header) as output, enabling C++ to call Rust", and that it is fully supported by the Rust in Chrome team with documented caveats (source: https://chromium.googlesource.com/chromium/src/+/main/docs/rust/crubit.md, w=0.90). The upstream announcement on the chromium rust-dev list confirms the availability date and intent: as of 2026-07-20 Chromium developers can use Crubit to call Rust code from C++ (source: https://groups.google.com/a/chromium.org/g/rust-dev/c/Kixvw8bhfME/m/tkzaAac1BgAJ, w=0.52).

## How the tool works

Three properties matter for anyone building it from source:

1. It consumes a Rust crate (a set of .rs files) as input and tries to generate C++ bindings for all public APIs (source: https://groups.google.com/a/chromium.org/g/rust-dev/c/Kixvw8bhfME, w=0.72).
2. It is built on top of the rustc_driver crates, which means it can understand the exact memory layout of Rust structs and enums. This lets C++ pass and store Rust objects by value; the announcement's example is the qr_code_generator target storing a `qr_code::QrCode` Rust struct directly in C++ (source: https://groups.google.com/a/chromium.org/g/rust-dev/c/Kixvw8bhfME/m/tkzaAac1BgAJ, w=0.74).
3. Partial coverage is the designed failure mode, not a crash: "If cpp_api_from_rust is unable to generate bindings for a given Rust API, then the generated .h file will contain a comment explaining why" (source: https://github.com/chromium/chromium/blob/main/docs/rust/cpp_api_from_rust.md, w=0.88). Unsupported Rust APIs are replaced with C++ comments describing the error or pointing at the bug tracking the missing Crubit feature (source: https://groups.google.com/a/chromium.org/g/rust-dev/c/Kixvw8bhfME, w=0.57).

The same partial-coverage philosophy applies to the C++ side: Crubit does not support advanced features like templates or virtual inheritance (source: https://crubit.rs/cpp/, w=0.73).

## Why Chromium cannot build without it

Because bindings generation is wired into the build graph, a missing binary is a hard failure, not a degraded one. The tool is distributed as part of Chromium's `//third_party/rust-toolchain` directory: "Chromium's //third_party/rust-toolchain includes cpp_api_from_rust, but other projects may not. This means that Chromium code that is built in such other projects should not depend on cpp_api_from_rust" (source: https://chromium.googlesource.com/chromium/src/+/HEAD/docs/rust/cpp_api_from_rust.md, w=0.91). In Bazel-land the equivalent story holds: all rust_library targets can receive C++ bindings, and a C++ rule exporting the bindings is created with the `cc_bindings_from_rust` rule pointing at the crate (source: https://crubit.rs/rust/, w=0.76).

The internal survey behind this corpus records that at Chromium pin 153.0.8010.36 the Rust-to-C++ path generates the `rs_core.h`, `rs_alloc.h` and `rs_std.h` headers through the `enable_cpp_api_from_rust` machinery, and that the x86_64-only `bin/cc_bindings_from_rs` in the downloaded toolchain fails with an exec format error at build step [418/41902] on an aarch64 host (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). That internal observation is consistent with the public packaging statement above: the binary ships inside the toolchain, so an aarch64 toolchain deployment must ship an aarch64 binary.

## What a third-party walkthrough adds (weakly)

A community tutorial repository (CrubiT) documents bidirectional usage with copy-pastable examples and snapshots of generated bindings (source: https://github.com/Toast552/CrubiT, w=0.55). An AI-generated DeepWiki page describes cc_bindings_from_rs as the component integrating directly with rustc for semantic analysis before generating C++ (source: https://deepwiki.com/google/crubit/3-cc_bindings_from_rs:-rust-to-c++-bindings, w=0.15, weak). These are orientation aids only; every operational fact in this corpus is anchored on the official docs, the Chromium source tree, or the issue tracker instead.

## The takeaway for linux-aarch64

The tool is a pure-Rust cargo binary in the cc_bindings_from_rs direction (source: https://crubit.rs/index.html, w=0.76), it must exist as an executable under `third_party/rust-toolchain/bin/` for the Chromium build graph to resolve (source: https://chromium.googlesource.com/chromium/src/+/HEAD/docs/rust/cpp_api_from_rust.md, w=0.91), and no published channel provides that binary for aarch64 hosts (see doc 02). That combination is what forces a native build.