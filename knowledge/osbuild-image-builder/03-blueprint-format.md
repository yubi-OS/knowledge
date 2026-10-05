# 03 - blueprint format and customization surface

Scope: the TOML blueprint format and its customization surface: packages, users, files, filesystem layout, kernel options, and how the format is shared across frontends.

## TOML as the on-premises blueprint format

Blueprints are text files in TOML format that describe customizations for the image being built, and the reference explicitly frames them for the on-premises environment (https://osbuild.org/docs/user-guide/blueprint-reference/, noul 0.91). A typical blueprint specification contains general metadata (name, version, description), a list of packages, and customization sections (https://docs.oracle.com/en/operating-systems/oracle-linux/10/ibldr/Blueprints.html, noul 0.86, Oracle's Image Builder documentation which shares the same blueprint model).

## One format, multiple frontends

The format is not owned by any single frontend. The osbuild/blueprint repository defines itself as the library used for parsing JSON and TOML blueprints and states that the blueprint is the common configuration format for Image Builder frontends, with the repository defining the structures, types, and serialization (https://github.com/osbuild/blueprint, noul 0.77). This is a load-bearing architectural fact for reproducible builders: a blueprint written against the osbuild/blueprint types is portable across the composer daemon, the stateless CLI, and any other frontend that adopts the library.

## Package and filesystem customizations

Package selection is the core customization: the blueprint lists packages to install into the image. Filesystem customization is a first-class section, with dedicated handling in the osbuild/blueprint library (https://github.com/osbuild/blueprint/blob/main/pkg/blueprint/filesystem_customizations.go, noul 0.89), covering mountpoints and minimum sizes for partitions such as a 10 GiB minimum on /var.

Third-party repositories are also a blueprint-level concern: osbuild-composer supports adding packages from third-party repositories and saving the repository customizations to an image, with documentation clarifying each use case and how to configure it (https://osbuild.org/docs/user-guide/repository-customizations/, noul 0.94). This means repository sources, not just package names, are part of the declared build intent, which is what makes a blueprint a reproducible input rather than a wish list.

## Users, groups, and files

User creation is part of the customization surface: blueprints carry user entries with name, password hash, group membership, and SSH keys, and kernel command line customization via an append field (as used in the yubiOS refs source research examples against the documented blueprint model; the underlying reference is https://osbuild.org/docs/user-guide/blueprint-reference/, noul 0.91).

For bootc image builds, the customization input is a separate configuration file in TOML or JSON provided at build time, organized under a customizations key (https://deepwiki.com/osbuild/bootc-image-builder/2.5-customizations, weak backing, noul 0.24, third-party generated wiki). The bootc path diverges from the package-list model because the container already defines the content; the config file covers disk layout, users, and kernel arguments instead.

## Versioning and tool introspection

The stateless CLI reports the format it is built against: `image-builder version` prints its own version plus the versions of its bundled dependencies, including the images library and osbuild (https://github.com/osbuild/image-builder-cli, noul 0.80). Because blueprint semantics are implemented in the shared osbuild/blueprint library (https://github.com/osbuild/blueprint, noul 0.77), pinning the CLI version pins both the schema interpretation and the engine behavior together.

## yubiOS framing

The blueprint model is the prior-art hook for yubiOS's own image description format. Three properties are worth adopting: TOML as a plain-text, version-controllable format; customization sections that include repository sources so the full package universe is declared; and a single shared schema library so frontends cannot drift apart in how they interpret the same file. The weak point in the upstream model is that the bootc path uses a different configuration shape than the package-mode path, which is exactly the kind of dual-schema split a new builder should avoid.
