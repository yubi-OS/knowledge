# 04. The bump verification gate

Scope: the two-command bump gate, `docker buildx imagetools inspect` on the new digest followed by a functional `systemd --version` smoke check, and why those two checks together constitute verification.

## The gate as recorded

The source ref records the original v261 gate as two commands (source ref, no external weight for the internal procedure):

```sh
docker buildx imagetools inspect quay.io/fedora/fedora-bootc:45
docker run --rm <new-digest> systemd --version
```

The gate is a historical checklist retained for future base-image refreshes: the v261 bump is marked completed, and future bumps are expected to repeat the same two-step verification against whatever the new digest is.

## Check 1: inspect the manifest in the registry

`docker buildx imagetools inspect NAME` shows details of an image in the registry (https://docs.docker.com/reference/cli/docker/buildx/imagetools/inspect/, noul 0.86). The imagetools command family exists specifically for working with manifest lists in container registries, and inspecting manifests to check multi-platform configuration and attestations is its stated use case (https://docs.docker.com/reference/cli/docker/buildx/imagetools/, noul 0.67). The command supports a JSON template function for rendering specific fields of the returned manifest data (https://docs.docker.com/reference/cli/docker/buildx/imagetools/inspect/, noul 0.86). The upstream buildx reference documentation shows the shape of the output: the tool prints the resolved name including the digest, the manifest media type, and the platform entries of the list (https://github.com/docker/buildx/blob/master/docs/reference/buildx_imagetools_inspect.md, noul 0.64).

Why this matters for a multi-arch index: the pin targets the OCI index digest, and `imagetools inspect` is the tool that displays the index with its platform children. If the index digest is wrong, does not resolve, or resolves to something other than a manifest list, this check fails before any image is pulled. Docker's `docker image inspect` provides the local-image counterpart with platform selection for multi-platform images (https://docs.docker.com/reference/cli/docker/image/inspect, noul 0.85).

## Check 2: run the image and ask systemd its version

The second command runs the new digest with `docker run --rm` and executes `systemd --version` inside it. This is a functional smoke check: it proves the image is pullable, bootable as a container, and contains a working systemd at the expected version level. The relevance of the systemd check is specific to what the base image ships: the Fedora bootc base image includes systemd configured to run by default even when executed as a container (https://docs.stg.fedoraproject.org/en-US/bootc/base-images/, noul 0.88), so the systemd version inside the image is the direct signal of which systemd release stream the base carries. For a v261 bump, the gate is literally asking the image whether it contains the systemd v261 features the bump was performed to obtain.

Bootc containers are designed to be run and inspected with ordinary container tooling: the bootc repository describes the image as carrying the kernel in `/usr/lib/modules` and being usable as a standard OCI/Docker container (https://github.com/bootc-dev/bootc, noul 0.56, weak backing), and the RHEL image mode documentation treats build-and-test as the normal loop for bootc images (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/building-and-testing-the-rhel-bootable-container-images_using-image-mode-for-rhel-to-build-deploy-and-manage-operating-systems, noul 0.95).

## What the gate establishes, and what it does not

The gate establishes two things: the pinned digest resolves to the expected manifest structure in the registry, and the image content answers a functional version query correctly. It does not establish full boot behavior on target hardware; that is the domain of the VM and hardware-in-the-loop testing lanes, not the digest gate. The source ref records that this gate's success unblocked downstream yubiOS work: `ConditionSecurity=measured-os`, `systemd-tpm2-swtpm.service`, and the enrollment-unit hardening effort, all of which depend on systemd capabilities present in the v261 base (source ref, no external weight; the systemd capabilities themselves are covered in doc 05).

As a pattern, the gate is worth keeping verbatim for future bumps: check the manifest first, then check the functional version, then proceed.
