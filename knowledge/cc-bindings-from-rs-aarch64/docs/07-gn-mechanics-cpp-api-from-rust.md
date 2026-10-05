# 07. GN mechanics: how the build graph forces cpp_api_from_rust

Scope: the GN plumbing that wires cc_bindings_from_rs into Chromium's build, why `enable_cpp_api_from_rust` cannot be turned off with args.gn, and the hardcoded paths that must exist on the host.

## The integration is target-level, not toggle-level

Chromium's integration of the generator works through dedicated GN templates. The tracking issue for the integration describes the plumbing precisely: a CL passes `crate_name` from `rust_target.gni` to `cpp_api_from_rust.gni`, has each bindings target declare a `--crate-header=...` flag in the target's metadata, and uses `generated_file` to walk the metadata of dependencies and save the command-line flags into `_action_rsp_path`, then feeds them via `@{action-rsp}` to the generator (source: https://issues.chromium.org/issues/470466915, w=0.61). The announcement post that landed the feature describes the user-facing surface: Chromium developers can use Crubit to call Rust code from C++ as of 2026-07-20 (source: https://groups.google.com/a/chromium.org/g/rust-dev/c/Kixvw8bhfME/m/tkzaAac1BgAJ, w=0.52).

The availability caveat matters for anyone porting: "Chromium's //third_party/rust-toolchain includes cpp_api_from_rust, but other projects may not. This means that Chromium code that is built in such other projects should not depend on cpp_api_from_rust" (source: https://chromium.googlesource.com/chromium/src/+/HEAD/docs/rust/cpp_api_from_rust.md, w=0.91). Within Chromium proper, the tool is fully supported by the Rust in Chrome team with documented caveats (source: https://chromium.googlesource.com/chromium/src/+/main/docs/rust/crubit.md, w=0.90).

## The binary path is hardcoded

The internal survey behind this corpus read `build/rust/gni_impl/cpp_api_from_rust.gni` at pin 153.0.8010.36 and found that lines 95 to 96 hardcode the generator binary path as `//third_party/rust-toolchain/bin/cc_bindings_from_rs`, with no per-architecture logic anywhere in the file (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). The same file, at lines 104 to 108, hardcodes `buildtools/linux64-format/clang-format`, with an upstream TODO by lukasza to generalize that path (internal record, same doc). These two hardcoded paths are the mechanical reason a native aarch64 host needs both an aarch64 `cc_bindings_from_rs` and possibly an aarch64 `clang-format` dropped into the same locations: the build graph will exec exactly those paths and nothing else.

The second path deserves its own caution. `clang-format` in `buildtools/linux64-format/` is used by the same pipeline per the gni references, and the directory name itself signals the x86_64 assumption. The survey flagged verifying that binary on aarch64 and swapping in an aarch64 clang-format if it fails to exec (internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted).

## enable_cpp_api_from_rust cannot be disabled

The escape hatch a builder would reach for first does not exist. The survey found that at the pin, `enable_cpp_api_from_rust` is computed in `build/config/rust.gni` at line 424 rather than declared via declare_args, which means args.gn cannot override it (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). Forcing it false anyway breaks the build graph with unresolved `font_format_bindings` targets (internal record, same doc). This is consistent with the feature's support posture: the Rust in Chrome team fully supports cpp_api_from_rust within Chromium, so the build graph assumes its presence rather than guarding it (source: https://chromium.googlesource.com/chromium/src/+/main/docs/rust/crubit.md, w=0.90).

## Failure shape when the binary is missing or foreign

When the generator cannot run, the failure is at the action level, not the config level. The internal survey's native aarch64 build failed at step [418/41902] with an exec format error when GN reached the action invoking the x86_64 `bin/cc_bindings_from_rs` on the aarch64 host (internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). That is the expected signature: GN resolves the hardcoded path, ninja executes it, the kernel refuses the foreign ELF.

When the generator runs but cannot bind a given API, the failure is intentionally soft: "If cpp_api_from_rust is unable to generate bindings for a given Rust API, then the generated .h file will contain a comment explaining why" (source: https://github.com/chromium/chromium/blob/main/docs/rust/cpp_api_from_rust.md, w=0.88). The docs page exists on both googlesource and the GitHub mirror, and describes the error classes specific to Chromium's integration of Crubit into its build system (source: https://chromium.googlesource.com/chromium/src/+/HEAD/docs/rust/crubit.md, w=0.82).

## Consequences for a native aarch64 build

Three mechanical requirements fall out of the GN mechanics:

1. An aarch64 ELF `cc_bindings_from_rs` must exist at `third_party/rust-toolchain/bin/cc_bindings_from_rs`, because that exact path is what the template execs (internal record; packaging location corroborated by source: https://chromium.googlesource.com/chromium/src/+/HEAD/docs/rust/cpp_api_from_rust.md, w=0.91).
2. The `buildtools/linux64-format/clang-format` binary must also execute on the host, or be replaced with an aarch64 build (internal record).
3. There is no configuration-only workaround: the computed `enable_cpp_api_from_rust` plus the hard dependency from bindings targets means the binary must exist and run (internal record).

This is why the corpus treats the missing aarch64 generator as a hard blocker rather than an optimization: the GN layer offers no degrade path.