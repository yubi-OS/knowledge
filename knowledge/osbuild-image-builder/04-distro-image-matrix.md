# 04 - distro and image type matrix

Scope: which distros and output image types osbuild Image Builder supports on premises: image descriptions and the image-type catalogue.

## Where the matrix is documented

The project documents its support matrix as image descriptions: the image descriptions page describes the distributions available in the latest upstream version of the Image Builder tooling and notes that the list of available distributions may vary depending on the frontend in use (https://osbuild.org/docs/user-guide/image-descriptions/, noul 0.90, page updated 2026-09-09). Each distro gets its own subtree of per-image-type description pages; for example the CentOS 10 ec2 page enumerates the blueprint fields accepted for that image type, sourced from the image-builder describe output, and links back to the blueprint reference for syntax (https://osbuild.org/docs/user-guide/image-descriptions/centos-10/ec2/, noul 0.96).

The supported distro set as verified 2026-07-20 in the yubiOS refs source research against the image descriptions page: RHEL 10.1, 9.7, and 8.10; AlmaLinux 10.1, 9.7, and 8.10 plus AlmaLinux Kitten 10; CentOS Stream 10 and 9; Fedora 44 and 43; Rocky Linux 10.1, 9.7, and 8.10 (https://osbuild.org/docs/user-guide/image-descriptions/, noul 0.90).

## Default distro and override

The build command defaults to the same distribution and version as the host system; a different distribution and version can be passed with the --distro argument (https://osbuild.org/docs/user-guide/image-descriptions/... see https://osbuild.org/docs/developer-guide/projects/image-builder/usage/, noul 0.88). For bootc inputs this default flips: --distro is not combined with bootc inputs because the input container itself defines the target distro (https://osbuild.org/docs/developer-guide/projects/image-builder/usage/, noul 0.88, as recorded in the yubiOS refs source research).

## The image-type catalogue

The usage documentation is the canonical list of image types. The catalogue spans several families (https://osbuild.org/docs/developer-guide/projects/image-builder/usage/, noul 0.88, catalogue as enumerated in the yubiOS refs source research):

1. Cloud: server-ami, server-oci, server-openstack, server-ova, server-vhd, server-vmdk.
2. Virtualization and workstation: server-qcow2, vagrant-libvirt, vagrant-virtualbox, workstation-live-installer, wsl.
3. Installer and minimal: minimal-installer, minimal-raw-xz, minimal-raw-zst.
4. IoT and OSTree: iot-bootable-container, iot-commit, iot-container, iot-installer, iot-qcow2, iot-raw-xz, iot-simplified-installer.
5. Base: container.
6. Bootc inputs: --bootc-ref, --bootc-build-ref, --bootc-installer-payload-ref rather than a separate tool.

Concrete instance pages confirm the catalogue is per-distro and per-architecture: the Fedora 44 page lists image types with explicit architecture pairs such as budgie-atomic-installer for aarch64 and x86_64, and cloud-azure, cloud-e... families, each tagged with supported architectures (https://osbuild.org/docs/user-guide/image-descriptions/fedora-44/, noul 0.89).

## Introspection from the CLI

The image-builder CLI itself exposes the matrix: the list and describe commands provide introspection over the built-in image definitions, where list discovers available distro and image-type combinations and describe returns the fields each one accepts (https://deepwiki.com/osbuild/image-builder-cli/2.2-list-and-describe-commands, weak backing, noul 0.25, third-party generated wiki). The per-image-type web pages are generated from the same describe data (https://osbuild.org/docs/user-guide/image-descriptions/centos-10/ec2/, noul 0.96).

## Cloud upload path

Image types that target cloud providers are more than file formats: when building an image type that can be uploaded to the cloud, such as an ami, the CLI handles the upload flow (https://github.com/osbuild/image-builder-cli, noul 0.86). This makes the matrix a build-to-deploy contract, not just a set of disk formats.

## The managed-service contrast

AWS EC2 Image Builder is a fully-managed AWS service for automating creation and management of customized golden server images (https://docs.aws.amazon.com/imagebuilder/, noul 0.63). It occupies the hosted-cloud slot in the same problem space that osbuild's on-premises matrix covers with local builds, and the distinction is deployment control: osbuild keeps the pipeline on premises or in the user's CI, while EC2 Image Builder keeps it inside AWS.

## yubiOS framing

For yubiOS, the matrix demonstrates two patterns worth copying: per-image-type description pages generated from a single describe source of truth, and architecture-tagged types so the catalogue itself encodes what the CI can build. The iot-* family also shows how OSTree flows are exposed as ordinary image types rather than a separate toolchain.
