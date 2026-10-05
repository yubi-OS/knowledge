# cc-bindings-from-rs-aarch64

A knowledge corpus on crubit's cc_bindings_from_rs on linux-aarch64: the absence of prebuilt aarch64 bindings generators anywhere in the ecosystem, and the native-build route to producing them inside a Chromium toolchain. Minted 2026-10-05 from the yubiOS refs/ source doc `cc-bindings-from-rs-aarch64-2026-09-26.md`.

## Docs

| NN | slug | one-line scope |
|---|---|---|
| 01 | crubit-and-cc-bindings-from-rs-overview | What crubit is and what cc_bindings_from_rs (aka cpp_api_from_rust) generates for Chromium |
| 02 | distribution-gap-no-prebuilt-binaries | Zero releases, no distro packages, one shipping channel (Chromium's toolchain) that has no aarch64 variant |
| 03 | ci-and-nightly-matrix-x86-64-only | Active upstream repo, x86_64-only CI and nightly matrix, no artifacts published |
| 04 | cargo-build-path-pure-rust | The pure-Rust cargo build, RUSTFLAGS rpath coupling to librustc_driver, rustc-dev component |
| 05 | chromium-rust-toolchain-cipd | Chromium's self-built toolchain, CIPD platform variants, no Linux_arm64, binary rides in the tarball |
| 06 | build-crubit-py-arch-detection | The sanctioned arch-aware builder script, CRUBIT_BINS history, tracking bug 351793625 |
| 07 | gn-mechanics-cpp-api-from-rust | Hardcoded binary paths, computed enable_cpp_api_from_rust, why there is no config-only escape |
| 08 | native-arm64-chromium-prior-art | jasonrandrews and theoparis pipelines stop at bindgen; platform guarantees for native aarch64 rustc |
| 09 | native-build-recipe-install-and-risks | The 7-step route (a) recipe, install layout, verification, and risk register |

## Research summary

- Results collected: 108 (2 searXNG queries per subtopic, top 6 kept per query, 9 subtopics).
- Weight split: 65 results at weight >= 0.5 (authoritative backing), 43 results at weight < 0.5 (weak backing, labeled as such in the docs).
- Jev: 24 requests to /api/decide on the clef model (1 probe, 1 outline score validation over 9 questions, 22 noul weighting batches of 5 results each). Usage recorded per request in research-db/jev-log.json.
- Redos: 0 dig redos (no subtopic dig came back thin); 1 weighting extraction correction, no re-requests needed because the raw answer objects were stored intact.
- Skipped docs: none. All 9 subtopics validated as load-bearing or marginal-with-strong-dig (outline scores 0.98 to 1.79 on the 0/1/2 scale; none scored 0).

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200