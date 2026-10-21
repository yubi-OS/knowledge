# 02: On-Device Digest-Pinned Podman Extraction and SHA-256

**Scope:** Sourcing `u-boot-rockchip.bin` directly on rock1 via `podman pull docker.io/0mniteck/yubios@sha256:<digest>` plus `podman export`, to avoid ~11MB bridge chunk transfers, and cross-verifying sha256 against the CI artifact.

**Ground source:** `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md`.

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md, no external web dig.

Every claim below is taken from the ground source (procedure steps 1 and 2, validated 2026-10-10/11 across 3 verified writes) unless it is explicitly marked as an inference.

## 1. Why source the bin on rock1 itself

rock1 is reached through a shell bridge. Moving an ~11MB loader binary across that bridge would require chunked transfer (many base64 chunks, each a separate bridge call that can be cut or partially applied). The ground source avoids this entirely: rock1 pulls the firmware image from the registry itself, so the only bytes crossing the bridge are commands and short hash strings.

Trade-off recorded in the source: **each pull costs ~100MB of rock1's small root fs**. That cost is accepted because it is bounded and reclaimable, while a corrupted chunked transfer is silent until the readback hash fails.

## 2. Find the publish digest

The digest comes from the CI run that built the firmware, specifically the **"Stage 4 - Publish firmware bundle"** job log of a `ci_firmware-rk` run. The relevant line has the shape:

```
pushing manifest for docker.io/0mniteck/yubios:firmware-<board>@sha256:...
```

Pin to the `@sha256:` digest, never the `firmware-<board>` tag. A tag is mutable: a later CI run can repoint it between "the run I validated" and "the pull on rock1". A digest is content-addressed, so the pulled image is exactly the one CI published.

## 3. Pull, create, export, extract, remove

On rock1, in order:

```sh
podman pull docker.io/0mniteck/yubios@sha256:<digest>
podman create --name fw <ref>
podman export fw | tar -xf - -C <dir> --wildcards '*u-boot-rockchip.bin'
podman rm -f fw
```

Notes on each step:

- **`podman create`** instantiates a container filesystem without running anything. The firmware image does not need an entrypoint to be useful; it is a carrier for files.
- **`podman export | tar`** streams the container's flattened filesystem and extracts only the matching path via `--wildcards '*u-boot-rockchip.bin'`. This avoids unpacking the whole bundle onto rock1's limited root fs.
- **`podman rm -f fw`** removes the temporary container immediately so names do not collide on the next run. (Inference: the pulled image layers remain until pruned; the ~100MB per-pull cost in the source refers to that residue.)

## 4. Verify sha256 against the CI artifact

The digest pin proves the image is the published one; it does not by itself prove the extracted file is the same file the CI build produced as its downloadable artifact. The ground source therefore requires an independent second path:

1. In the sandbox (not on rock1), download the CI run's artifact zip.
2. Hash the inner `u-boot-rockchip.bin` with sha256.
3. On rock1, hash the extracted copy.
4. **Require a byte-for-byte match.** Any mismatch stops the flow before any guard or write runs.

Two independent supply paths (registry image by digest, Actions artifact zip) converging on one hash is the evidence that the bytes about to be written are the bytes CI built. That reference hash is reused later as the expected value for the post-write readback (doc 04).

## 5. Failure handling

- **Pull fails or digest not found:** recheck the Stage 4 log line; do not fall back to the tag.
- **Extraction finds no file:** the bundle layout changed; inspect `podman export fw | tar -t` before retrying, rather than broadening the wildcard blindly.
- **Hash mismatch:** stop. Do not proceed to doc 03 guards. Report both hashes.
- **Root fs pressure:** each pull costs ~100MB; check free space on rock1 before pulling another build. (Inference: pruning old images is the natural remedy; the source does not prescribe a specific prune command.)
- **Bridge call returned a network error:** the command may still have run on rock1. Reconcile box-side state (does the container `fw` exist, does the file exist in `<dir>`) before re-sending (see doc 06, proxy-cut reconciliation).

## 6. Output of this stage

A single file, `<dir>/u-boot-rockchip.bin`, on rock1's local filesystem, with a sha256 that equals the CI artifact's inner `u-boot-rockchip.bin` hash. Its byte count `BYTES` and sector count `CNT = BYTES / 512` feed the target guards (doc 03) and the readback window (doc 04).

## Sources Considered

| # | Source | Type | Weight |
|---|---|---|---|
| 1 | `yubi-OS/yubiOS skills/rockchip-sd-flash/SKILL.md` (procedure steps 1 and 2) | Internal record, validated 2026-10-10/11 | n/a (no external web dig) |
