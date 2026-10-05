# 02 - deployment models

Scope: the deployment models for on-premises image generation: the osbuild-composer daemon with the Weldr API versus the stateless image-builder-cli, plus the containerized and hosted-service variants.

## The daemon model: osbuild-composer plus composer-cli

The classic on-premises deployment installs osbuild-composer as a daemon and drives it with composer-cli. The Image Builder homepage instructs users to install osbuild-composer and composer-cli on Fedora, CentOS Stream, or RHEL and build images locally (https://osbuild.org/, noul 0.88). The on-premises overview describes composer-cli as a Linux command line interface to part of the functionality provided by OSBuild, and states that the CLI is part of the Weldr project (https://osbuild.org/docs/on-premises/overview/, noul 0.92).

The Weldr project supplies the client tooling: weldr-client is a Go client library and command line tool for the API, and its walkthroughs operate on blueprints through subcommands such as `composer-cli blueprints list` and saving a blueprint locally for editing (https://github.com/osbuild/weldr-client, noul 0.78). A third-party generated wiki describes the Weldr API as a legacy HTTP interface in osbuild-composer designed for compatibility with the older lorax-composer project, providing endpoints for blueprint management and repository configuration (https://deepwiki.com/osbuild/osbuild-composer/2.2-weldr-api, weak backing, noul 0.16).

In the daemon model, blueprints are stored server-side by the daemon and builds are queued through the API; the on-premises blueprint reference states that blueprints are text files in TOML format used in the on-premises environment (https://osbuild.org/docs/user-guide/blueprint-reference/, noul 0.94).

## The stateless model: image-builder-cli

The modern CLI takes the opposite design point: it is a stateless tool with no daemon and no database, and blueprints are local TOML files (as recorded in the yubiOS refs source research, which tracks this project; the repo itself is https://github.com/osbuild/image-builder-cli, weak backing, noul 0.49, primary repository page but thin index text). Running `image-builder version` prints a dependency report including the images and osbuild versions the CLI bundles, showing it directly embeds the build stack rather than calling a daemon (https://github.com/osbuild/image-builder-cli, noul 0.80). Actual builds run as `sudo image-builder build qcow2 --distro centos-9`, and image types that upload to the cloud, such as ami, are supported from the same command surface (https://github.com/osbuild/image-builder-cli, noul 0.86).

## The containerized model

Image building can also run without any host installation, inside a privileged container. The osbuild.org homepage promotes using podman to turn bootc-enabled container images into bootable artifacts (https://osbuild.org/, noul 0.88), and the bootc migration page shows the concrete pattern: pull the input container (`quay.io/centos-bootc/centos-bootc:stream9` in the example), create an output directory, then run the builder container with `--rm --privileged --pull=newer` and SELinux options (https://osbuild.org/docs/bootc/, noul 0.84). This wraps the stateless CLI in a container image so the host needs only podman. Podman itself builds container images daemonlessly: each container is a direct child process of the user who starts it (https://docs.podman.io/en/latest/markdown/podman-build.1.html, noul 0.89; https://podman.io/, noul 0.84).

## The hosted-service model

Image Builder also exists as a hosted service that integrates with build farms: a dedicated document describes how various instances of the Koji build system integrate with the Image Builder service (https://osbuild.org/docs/hosted/image-builder-koji/, noul 0.93). In the hosted model the pipeline engine and image definitions run as a service rather than on the user's machine, and integration points like Koji carry image artifacts into an organization's existing build infrastructure.

## Comparison

Four deployment models cover the same engine:

1. Daemon (osbuild-composer + composer-cli): persistent service, server-side blueprint storage, queue-based builds, Weldr API compatibility layer (https://osbuild.org/docs/on-premises/overview/, noul 0.92; https://github.com/osbuild/weldr-client, noul 0.78).
2. Stateless CLI (image-builder-cli): no daemon, no database, local TOML blueprints, embedded build stack (https://github.com/osbuild/image-builder-cli, noul 0.80).
3. Containerized: the stateless CLI shipped in a privileged container, host needs only podman (https://osbuild.org/docs/bootc/, noul 0.84).
4. Hosted: service-operated builds with build-system integration such as Koji (https://osbuild.org/docs/hosted/image-builder-koji/, noul 0.93).

## yubiOS framing

For yubiOS the stateless and containerized models are the relevant prior art: they require no persistent service on the build host, their entire state is the blueprint file plus container references, and both properties map directly onto a reproducible CI pipeline. The daemon model's server-side state is a liability for reproducibility because build intent lives in a mutable daemon database rather than in versioned files.
