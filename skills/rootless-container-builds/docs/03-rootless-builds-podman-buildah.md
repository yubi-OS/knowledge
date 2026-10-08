# 03. Building images with rootless podman and buildah

Scope: the hardened build invocation for rootless podman and buildah, the push and digest-capture step, and how the two tools relate.

## The hardened build flags

The source doc gives the canonical build command with two security flags on every build:

```
podman build --no-cache \
  --security-opt no-new-privileges \
  --cap-drop ALL \
  -t dhi.io/yubi-OS/yubiOS:latest \
  -f Containerfile .
```

(source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md). `--security-opt no-new-privileges` blocks the container processes inside the build from gaining new privileges through setuid or file capabilities; `--cap-drop ALL` removes every Linux capability from the build sandbox. Combined with the user-namespace mapping from doc 01, the build executes with no capabilities and no privilege-escalation path, which is the practical expression of the rootless security model. The same flags apply to `buildah bud --no-cache` as a direct alternative (source doc).

## How podman build and buildah relate

The podman documentation states the relationship precisely: podman build uses code sourced from the Buildah project to build container images, and that Buildah code creates Buildah containers for the RUN options in container storage (https://docs.podman.io/en/latest/markdown/podman-build.1.html, jev weight 0.92). So `podman build` is a frontend over buildah's builder: the two commands in the source doc are not two different engines, they are two entry points into the same build machinery, which is why the hardening flags are identical on both.

Weak-backing note: opensource.com's tips-and-tricks post on rootless buildah scored 0.38 and the Wikipedia podman page 0.46 under jev weighting, both below the 0.5 authoritative threshold. They are not used as claim sources here; the tool relationship rests on the official podman-build man page.

## Push and digest capture

After the build, the source doc's sequence is:

```
podman push dhi.io/yubi-OS/yubiOS:latest
DIGEST=$(podman inspect --format '{{.Digest}}' dhi.io/yubi-OS/yubiOS:latest)
echo "Pin this: dhi.io/yubi-OS/yubiOS@$DIGEST"
```

(source doc). The echo is the point of the step: the digest captured here becomes the immutable reference that every downstream consumer pins (doc 08). Pushing a mutable tag and then reading back the digest converts a floating reference into a fixed one, and the `Pin this:` line is the handoff contract between the build stage and everything that consumes the image.

The podman-build man page covers the full flag surface for this command family (https://docs.podman.io/en/latest/markdown/podman-build.1.html, jev weight 0.92), and the podman project repository documents the tool's scope across containers, images, volumes, and pods (https://github.com/podman-container-tools/podman, jev weight 0.76).

## Why rootless matters specifically for build

A build is the highest-risk operation in a container pipeline: RUN steps execute arbitrary shell as part of the build, base image layers are extracted onto the filesystem, and build-time network access is routine. Under a root daemon, any of those steps compromising the builder owns the host. Under the rootless path documented here, the same compromise is contained to a user namespace with the mapped unprivileged UID from doc 01, with all capabilities dropped and new-privileges disabled on top.

This is also why the flags are not optional hardening theater. `--cap-drop ALL` is meaningful only because the build already runs unprivileged; applying it to a root daemon build would not remove the daemon's own privileges. The ordering is: rootless daemon (doc 02 setup), then capability stripping and no-new-privileges per build (this doc), then digest capture for the supply chain (this doc and doc 08).

## Where the GitHub Actions version fits

The source doc's CI workflow (doc 09) uses exactly this build invocation inside a job step, tags with `github.sha` instead of `latest`, pushes, captures the digest into `$GITHUB_OUTPUT`, and signs it with keyless cosign. The local sequence in this doc is the same pipeline run by hand; keeping the flags identical between local and CI builds means a locally verified build is the same build CI produces.
