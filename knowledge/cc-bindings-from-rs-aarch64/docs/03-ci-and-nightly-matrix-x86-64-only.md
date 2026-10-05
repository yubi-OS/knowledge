# 03. Crubit upstream CI: active repo, x86_64-only matrix, no distribution

Scope: what crubit's own CI infrastructure does and does not produce, why an active repo still ships nothing, and what that implies for arm64 host coverage.

## An active repo with no release channel

Crubit's GitHub repository is under daily development: the tools/rust commit log visible from Chromium's mirror shows crubit commits landing within days of the survey date, including "[crubit] Build rs_bindings_from_cc with Cargo" and "[crubit] Link cc_bindings_from_rs with Chromium's toolchain" by Lukasz Anforowicz (source: https://chromium.googlesource.com/chromium/src/tools/rust/, w=0.59). Activity, however, does not translate into artifacts. The releases page states plainly: "There aren't any releases here" (source: https://github.com/google/crubit/releases, w=0.83), and the README explains why distribution was never a goal: "Crubit currently expects deep integration with the build system, and is difficult to deploy to environments dissimilar to Google's monorepo" (source: https://github.com/google/crubit, w=0.87).

## What the workflows are

The repository carries two public workflow surfaces that a survey can inspect: the "Cargo" workflow at `.github/workflows/rust.yml` (source: https://github.com/google/crubit/actions/workflows/rust.yml, w=0.20, weak) and the "Crubit Nightly Test Matrix" at `.github/workflows/nightly.yaml` (source: https://github.com/google/crubit/actions/workflows/nightly.yaml, w=0.28, weak). The workflow-listing pages themselves are thin; they confirm the workflows exist and run, but publish no downloadable artifacts. The internal survey behind this corpus read both workflow definitions at the survey date and found that the CI matrix and the nightly matrix run x86_64-Linux only, and that neither distributes binaries (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). No CIPD packages and no GCS artifacts are published by the project either (internal record, same doc).

## Why no arm64 host coverage has ever surfaced

The internal survey swept roughly 400 issues in the crubit tracker and found no arm64 or aarch64 host issues and no pull requests targeting aarch64 hosts (source: internal record, yubiOS refs/ cc-bindings-from-rs-aarch64-2026-09-26, unweighted). That negative result is consistent with the observable posture: a project that runs its matrix on x86_64-Linux and distributes nothing will never receive arm64-host bug reports, because nobody outside Google's infrastructure runs the toolchain-coupled build on other hosts.

The generic Rust CI ecosystem shows how multi-architecture coverage is normally achieved when a project wants it: the widely used `cross` GitHub Action compiles with cargo or cross depending on the host machine and target, and for Linux builds it always uses cross except when targeting x86 architectures like x86_64 or i686 (source: https://github.com/marketplace/actions/build-rust-projects-with-cross, w=0.59). Crubit's matrix does not use such a path for host coverage, and the tool's rustc-driver coupling (see doc 04) makes a naive cross-compilation matrix insufficient anyway: a cross-compiled cc_bindings_from_rs would still be linked against the rustc_dev libraries of the build host's toolchain, not the host it is meant to run on. Rust's own tooling has hit exactly this class of problem: rust-lang issue 137469 records external tools failing to find `librustc_driver` because the tools were built against the wrong rustc (source: https://github.com/rust-lang/rust/issues/137469, w=0.48, weak), and building Rust without rpath causes roughly 3,000 cargo test failures from missing librustc_driver (source: https://github.com/rust-lang/rust/issues/140299, w=0.49, weak).

## The CI baseline other Rust projects use

For orientation: the Cargo Book's CI guide shows the standard GitHub Actions pattern that tests all three release channels, noting that a failure in any toolchain version fails the entire job (source: https://doc.rust-lang.org/cargo/guide/continuous-integration.html, w=0.81), and GitHub's own tutorial documents the same build-and-test workflow shape (source: https://docs.github.com/en/actions/tutorials/build-and-test-code/rust, w=0.80). Crubit's workflows are shaped like these, but their output is test results rather than binaries.

## What this means for the aarch64 question

The CI evidence closes the last plausible escape hatch. A builder on linux-aarch64 cannot point at:

1. GitHub releases: none exist (source: https://github.com/google/crubit/releases, w=0.83).
2. CI artifacts: the workflows publish none (source: https://github.com/google/crubit/actions/workflows/rust.yml, w=0.20, weak; internal record for the x86_64-only matrix).
3. Community forks: none surfaced in the dig; the only third-party repo the dig surfaced (CrubiT) is a tutorial collection, not a build or release fork (source: https://github.com/Toast552/CrubiT, w=0.44, weak).

The conclusion is that if an aarch64-host binary is needed, the upstream project will not provide one, and the builder must produce it. That conclusion, combined with the pure-Rust cargo build path (doc 04), is what turns the problem from a distribution question into a build question.