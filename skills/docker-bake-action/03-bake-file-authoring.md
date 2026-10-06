# Authoring docker-bake.hcl: variables, groups, targets, inheritance

Scope: the structure of a `docker-bake.hcl` file as the source doc's example defines it: top-level `variable` blocks, `group` blocks, `target` blocks with their core fields, and the `inherits` mechanism that lets one target derive from another. Grounded in the source doc `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` plus weighted dig results.

## The source doc example in full

The source doc's example bake file is small enough to internalize whole:

```hcl
variable "TAG" { default = "latest" }

group "default" {
  targets = ["yubios", "yubios-minimal"]
}

target "yubios" {
  context    = "."
  dockerfile = "Containerfile"
  platforms  = ["linux/amd64"]
  tags       = ["quay.io/yubi-os/yubios:${TAG}"]
  labels     = {
    "containers.bootc"         = "1"
    "org.opencontainers.image.source" = "https://github.com/yubi-OS/yubiOS"
  }
}

target "yubios-minimal" {
  inherits   = ["yubios"]
  dockerfile = "Containerfile.minimal"
  tags       = ["quay.io/yubi-os/yubios-minimal:${TAG}"]
}
```

Every structural element a yubiOS bake file needs appears in those 18 lines (source doc).

## The four building blocks

1. **`variable`** holds a parameterized value with a default. The example parameterizes the image tag: `variable "TAG" { default = "latest" }` (source doc). CI can override it through the `set` input with `*.args.TAG=` style overrides or by baking the variable into target properties, keeping tag spelling out of the workflow YAML.
2. **`group`** names a set of targets to build together. The example's `group "default"` lists both targets (source doc). Groups are why the bake-action `targets` input can be omitted: the action's default target is the `default` group (source doc, Key inputs).
3. **`target`** is one image build. Its fields in the example: `context` (build context directory), `dockerfile` (which Containerfile), `platforms` (list), `tags` (registry references), `labels` (map) (source doc).
4. **`inherits`** composes targets. `yubios-minimal` inherits from `yubios` and overrides only `dockerfile` and `tags` (source doc). Everything else, including context, platforms, and labels, flows from the parent target.

## Why inheritance is the load-bearing pattern

The source doc's yubiOS note says the goal is "standard + minimal + IoT variants in one pipeline" (source doc, Notes). Inheritance is what makes that scale: define the common shape once in a base target (context, platform list, bootc label, source label), then each variant adds only its own dockerfile and tag. A third variant is 5 lines, not a copy of 18.

Docker's bake file reference documents the same structure formally: targets, groups, variables, and target attributes as the HCL definition surface (https://docs.docker.com/build/bake/reference/, jev weight 0.95). Treat the reference as the spec when a field the source doc does not mention is needed (for example output/export configuration), and treat the source doc's example as the house style.

## The yubiOS-specific labels matter

The example labels are not decoration:

- `"containers.bootc" = "1"` marks the image as a bootc image, which is how bootc tooling recognizes it (source doc). Any yubiOS image target must carry this label or downstream `bootc` consumption breaks.
- `"org.opencontainers.image.source" = "https://github.com/yubi-OS/yubiOS"` ties the image back to its repository per the OCI source annotation convention (source doc).

Because these live in the inherited base target, both variants get them automatically; a variant that did not inherit would have to repeat them.

## Parameterization discipline

One variable (`TAG`) with a default in the example is the right level of parameterization for a first bake file (source doc). Keep variables for values that legitimately change per pipeline run (tags, maybe a version argument), and keep structural values (context, dockerfile paths, labels) literal in the file so the bake file stays reviewable as data. This aligns with the declarative-policy framing the skill carries in yubiOS: the bake file is the build matrix as data (source doc, declarative policy coverage section).

## Format notes

- Bake definitions can also be JSON or Compose YAML: the source doc's Key inputs table lists the `files` input as "Bake definition files (HCL, JSON, Compose YAML)" (source doc). HCL is the house format for yubiOS because the example and the surrounding skills (mkosi config, Rego policies) all read as declarative config files.
- Multiple files in the `files` input merge, which is how the generated metadata file composes with the hand-written HCL (source doc, Action reference; see doc 04).

## Anti-patterns

1. Defining two targets that differ only in a tag string when one could inherit. Inheritance exists for exactly this (source doc example).
2. Leaving `default` as an accidental group that builds more than intended: the action's unset `targets` builds the `default` group, so curate that group deliberately (source doc).
3. Dropping the `containers.bootc` label from a variant that does not inherit the base target (source doc labels).

Primary sources: source doc (`yubi-OS/yubiOS skills/docker-bake-action/SKILL.md`); https://docs.docker.com/build/bake/reference/ (0.95); https://docs.docker.com/ (0.87). Weak backing (< 0.5): https://oneuptime.com/blog/post/2026-02-08-how-to-write-docker-bake-hcl-files/view (0.10, excluded from load-bearing claims).
