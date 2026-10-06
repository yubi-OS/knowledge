# 04. Auto-generated OCI labels

**Scope:** The OCI labels metadata-action generates automatically from GitHub repo metadata, the yubiOS label additions, and the annotations-versus-labels distinction.

## The five auto-generated labels

The source doc (yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md) states that these labels "are generated automatically from GitHub repo metadata":

- `org.opencontainers.image.title`
- `org.opencontainers.image.url`
- `org.opencontainers.image.created`
- `org.opencontainers.image.revision`
- `org.opencontainers.image.version`

No workflow configuration is needed for these five: they appear in the `labels` output on every run, derived from the repository and run context. The official Docker documentation describes the same design: "If you want an 'automatic' tag management and OCI Image Format Specification for labels, you can do it in a dedicated setup step" using the Docker Metadata Action (https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, weight 0.91).

## What the labels look like in practice

The upstream README's bake-file example shows generated labels attached to a build target (https://github.com/docker/metadata-action, weight 0.95): `org.opencontainers.image.title` set to `"Hello-World"` from the repository name, plus the description and revision keys. The `revision` label carries the commit SHA of the build, which is what makes a pulled image traceable back to the exact source revision that produced it.

## The yubiOS label additions

The source doc's yubiOS pattern adds four explicit labels on top of the auto-generated five:

```yaml
labels: |
  containers.bootc=1
  org.opencontainers.image.source=https://github.com/yubi-OS/yubiOS
  org.opencontainers.image.description=FIDO2-first immutable OS
  org.opencontainers.image.licenses=GPL-2.0
```

(source doc). Two of these are load-bearing in the yubiOS ecosystem:

- `containers.bootc=1` marks the image as a bootable container image, the signal bootc tooling reads to treat the image as a system image rather than an application image (source doc yubiOS pattern; supply-chain and bootc context in the yubi-OS skill corpus).
- `org.opencontainers.image.source` points at the upstream repository, which many registries surface as the "source" link on the container page.

## Annotations versus labels

The OCI ecosystem has two metadata mechanisms, and Docker Docs draw the line explicitly: "Annotations describe OCI image components, such as manifests, indexes, and descriptors. Labels describe..." the container image itself (https://docs.docker.com/build/metadata/annotations/, weight 0.89; snippet truncated at fetch, quoted only as far as it was captured). The general principle they give: "you can think of the difference between annotations and labels as follows: Annotations describe OCI image components... Labels describe..." the resource itself.

The practical takeaway for this skill: the `org.opencontainers.*` keys metadata-action emits land as image labels through the `labels:` passthrough to build-push-action, and the same keys are valid OCI annotation keys. The distinction matters when a workflow starts emitting its own keys: annotation keys belong to the OCI image components layer, label keys belong to the image content layer (https://docs.docker.com/build/metadata/annotations/, weight 0.89).

## Why the generated labels matter for yubiOS

The source doc's Notes and the primitive-coverage sections tie this to yubiOS's self-describing primitive: "OCI labels make the image self-identifying." A yubiOS image pulled from `quay.io/yubi-os/yubios` carries its title, URL, build timestamp, source revision, and version in the image metadata itself, without consulting the registry API or the git log. The source doc's own framing: "this skill contributes to self-describing; OCI labels make the image self-identifying" and "yubiOS's self-describing stack composes composefs signed catalogs (per composefs-kernel-floors), SLSA L3 provenance (per slsa-provenance), and the audit-evidence bundle manifest (per audit-evidence-packaging); this skill is one contributor" (source doc, curve-guided-rsi cycle-5 edit section, fit coordinate u=0.231, v=0.100, PC1+PC2 = 0.4615, holdout R2 = +0.2244).

## Weak-source note

The dig for this subtopic returned two generic Docker-domain pages with moderate weights (https://www.docker.com/, weight 0.56) that do not carry label-specific claims; they are archived but not cited above. All label facts here come from the source doc, the official manage-tags-labels page (weight 0.91), the upstream README (weight 0.95), and the annotations page (weight 0.89).
