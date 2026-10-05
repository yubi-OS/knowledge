# 05 - OSTree and IoT flows

Scope: the OSTree and IoT build flows: iot-commit artifacts, simplified installers, edge deployment image chains, and commit distribution.

## OSTree as the substrate

The Image Builder documentation introduces OSTree as a technology for creating immutable operating system images and identifies it as the base for Fedora CoreOS, Fedora IoT, Fedora Silverblue, and RHEL for Edge (https://osbuild.org/docs/on-premises/commandline/building-ostree-images/, noul 0.94). In the Image Builder model, an OSTree flow starts by composing an OSTree commit as an artifact, and that commit is the thing that gets distributed, installed, and updated.

## Composing commits and installing them

The commit itself is one image type among the catalogue (iot-commit in the image-type list, https://osbuild.org/docs/developer-guide/projects/image-builder/usage/, noul 0.88, catalogue as enumerated in the yubiOS refs source research). Fedora's IoT documentation treats image-builder as the command line tool for building custom OS images for Fedora, CentOS, and RHEL, and walks the IoT-specific flows through it (https://docs.fedoraproject.org/en-US/iot/using-image-builder/, noul 0.93).

The installer side embeds the commit: Red Hat's RHEL for Edge documentation describes creating a RHEL for Edge Installer image that embeds the OSTree commit using the image builder command line interface (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/composing_installing_and_managing_rhel_for_edge_images/composing-a-rhel-for-edge-image-using-image-builder-command-line_composing-installing-managing-rhel-for-edge-images, noul 0.94). The osbuild.org on-premises docs describe the combined pattern explicitly: build a boot ISO which installs an OSTree-based system using the RHEL for Edge Container image type in combination with the RHEL for Edge Installer image type (https://osbuild.org/docs/on-premises/commandline/edge-container+installer/, noul 0.89). The container image carries the commit, the installer ISO carries the container, and a single boot installs the system.

## Simplified installers for unattended provisioning

The iot-simplified-installer image type produces an installer for unattended, zero-touch provisioning on Fedora 43 (https://osbuild.org/docs/user-guide/image-descriptions/fedora-43/iot-simplified-installer/, noul 0.89). Red Hat's documentation describes building simplified installer images as the provisioning step in the RHEL for Edge workflow (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/composing_installing_and_managing_rhel_for_edge_images/creating-and-managing-ostree-image-updates_composing-installing-managing-rhel-for-edge-images, noul 0.87).

## Update semantics

Red Hat's OSTree chapter explains the update versioning system as working like a Git repository that stores and versions the OSTree commits (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/composing_installing_and_managing_rhel_for_edge_images/creating-and-managing-ostree-image-updates_composing-installing-managing-rhel-for-edge-images, noul 0.87). This is the property that makes OSTree flows attractive for reproducible builders: updates are content-addressed commits rather than ad hoc package transactions, and a rollback is a pointer change.

## Distribution of commits

Commits do not have to travel inside ISOs. Image Builder supports uploading an OSTree commit to Pulp: the flow imports the commit into a named repository, creating the repository if it does not exist and otherwise adding the commit to it (https://www.osbuild.org/docs/user-guide/uploading-to-pulp-stree, noul 0.85). A full demonstration repo shows the end-to-end shape: use Image Builder to create a custom RHEL for Edge OSTree commit and install it to a disk or a virtual machine image (https://github.com/osbuild/rhel-for-edge-demo, noul 0.76).

## The iot-* family as a coherent chain

Read together, the iot-* image types form a complete deployment chain (https://osbuild.org/docs/developer-guide/projects/image-builder/usage/, noul 0.88, catalogue as enumerated in the yubiOS refs source research):

1. iot-commit: the OSTree commit artifact.
2. iot-container: the commit packaged as a container for registry distribution.
3. iot-bootable-container: a container that boots.
4. iot-installer and iot-simplified-installer: boot media that installs the commit, unattended in the simplified case.
5. iot-qcow2 and iot-raw-xz: preinstalled disk images with the commit already embedded.

## yubiOS framing

The OSTree chain is directly relevant prior art for yubiOS: it shows how a toolchain separates the atomic content artifact (the commit) from every delivery format (container, ISO, disk image), so the reproducible core is one artifact and the delivery formats are mechanical conversions. The Pulp upload path also demonstrates that commit distribution can target external registries rather than always being embedded in install media.
