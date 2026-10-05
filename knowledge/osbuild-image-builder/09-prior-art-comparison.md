# 09 - prior art comparison

Scope: how osbuild and Image Builder compare as prior art against other reproducible OS image builders (mkosi, kiwi-ng, lorax, NixOS-style tools) for an image-mode OS project.

## The tool family

The image-building field contains several mature tools with different configuration philosophies and languages: osbuild, kiwi-ng, mkosi, and lorax, as surveyed in a DevConf.cz talk dedicated to comparing them (https://pretalx.com/devconf-cz-2024/talk/ZB9NCL/, weak backing, noul 0.21, a conference talk page rather than technical documentation). The comparison matters because the tools are not interchangeable: each encodes a different model of where build intent lives and how much of the build is declarative.

mkosi is the closest single-tool prior art: it is the systemd project's tool to build bespoke OS images (https://github.com/systemd/mkosi, noul 0.90). Real projects have weighed the trade directly: kata-containers evaluated replacing its osbuilder with mkosi, noting mkosi can generate customized disk images with a number of bells and whistles, which is essentially what osbuilder did, with the difference lying in the approach (https://github.com/kata-containers/kata-containers/issues/8779, weak backing, noul 0.45, an issue discussion rather than a benchmark).

## Standards convergence as a signal

The tools are converging on shared ground rules rather than diverging. The Linux Userspace API Group lists contributing members including people from Ubuntu Core, Debian, GNOME OS, Fedora CoreOS, Endless OS, Arch Linux, SUSE, Flatcar, systemd, image-builder/osbuild, mkosi, and tpm2-software (https://uapi-group.org/, noul 0.75). When the maintainers of osbuild and mkosi sit in the same standards body, the interoperability assumptions (kernel interfaces, boot specifications, image layout) tend to converge, which lowers the cost of treating either tool as prior art for a new builder.

## The image-mode axis

The axis that separates current-generation tools from older ones is container image mode. Red Hat's image mode documentation frames the shift as building, testing, and deploying operating systems using the same tools and techniques as application containers (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/introducing-image-mode-for-rhel_using-image-mode-for-rhel-to-build-deploy-and-manage-operating-systems, noul 0.85). Fedora's bootc documentation summarizes the same idea as transactional, in-place operating system updates using OCI/Docker container images (https://docs.fedoraproject.org/en-US/bootc/getting-started/, noul 0.68).

In this world, the image builder's job narrows to converting a container into bootable artifacts, which is exactly the bootc-to-ISO conversion Red Hat documents: using bootc-image-builder to convert a bootc image to an ISO creates a system similar to the RHEL ISOs, except that the container image content is embedded in it (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/epub/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/deploying-an-iso-bootc-container-over-pxe-boot_deploying-the-rhel-bootc-images, noul 0.78). Red Hat's build-and-test chapter shows the same flow for building and configuring bootc-based images from a Containerfile (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/building-and-testing-the-rhel-bootable-container-images_using-image-mode-for-rhel-to-build-deploy-and-manage-operating-systems, noul 0.87).

## Where osbuild sits in the comparison

osbuild's distinguishing properties relative to the family:

1. Pipeline engine as a separate artifact: osbuild is a manifest-driven pipeline processor, so build intent and build execution are separated and the manifest can be inspected or attested independently (https://osbuild.org/docs/developer-guide/projects/osbuild/manifest/, noul 0.92).
2. A dedicated schema library shared across frontends, so blueprint interpretation cannot drift between tools (https://github.com/osbuild/blueprint, noul 0.77).
3. Build-farm integration: the hosted Image Builder service integrates with the Koji build system, carrying image artifacts into existing build infrastructure (https://osbuild.org/docs/hosted/image-builder-koji/, noul 0.93).
4. Deployment-model breadth: daemon, stateless CLI, containerized, and hosted variants over one engine (https://osbuild.org/docs/on-premises/overview/, noul 0.92; https://osbuild.org/docs/hosted/image-builder-koji/, noul 0.93).

mkosi by contrast is a single stateless tool driven by configuration files, closer in deployment shape to image-builder-cli than to the composer daemon (https://github.com/systemd/mkosi, noul 0.90).

## yubiOS framing

For yubiOS, the comparison yields three reusable judgments. First, the manifest-as-artifact pattern is the strongest reproducibility property in the family and is worth replicating regardless of which tool inspires the frontend. Second, the bootc convergence (doc 06) shows the industry consolidating on container-image inputs with a thin disk-image conversion layer, which validates yubiOS's bootc-based architecture rather than challenging it. Third, the composefs blocker chain (doc 07) marks the boundary of what any of these tools can promise today: sealed, verity-backed image composition is still gated upstream, so yubiOS's own sealing work is differentiated, not redundant.
