# 01 - Pod Security Standards restricted profile

Scope: what the Kubernetes Pod Security Standards are, what the restricted profile enforces, and how Pod Security Admission turns the profile into cluster policy through namespace labels and the enforce, audit, and warn modes.

This corpus explicates the yubiOS skill `least-privilege-pod-security-standards` (source doc: `yubi-OS/yubiOS skills/least-privilege-pod-security-standards/SKILL.md`). Per the source doc, the PSS restricted profile is the operational embodiment of the Kubernetes leg of the yubiOS least-privilege canon, paired with an OPA Rego leg. This doc grounds the Kubernetes leg in the upstream Kubernetes documentation.

## The three Pod Security Standards levels

The Pod Security Standards define three different policy levels, broadly covering the security spectrum from permissive to restrictive: privileged, baseline, and restricted (https://kubernetes.io/docs/concepts/security/pod-security-standards/, jev weight 0.93; http://kubernetes.io/docs/concepts/security/pod-security-standards, jev weight 0.88). The privileged level allows almost everything, baseline blocks common privilege escalations, and the profiles move from very permissive to very restrictive across the three levels (weak backing, weight 0.09, https://dev.smirnov.app/2026/05/kubernetes-pod-security-standards.html).

The restricted profile is the level the yubiOS skill targets. The Kubernetes v1.25 release updated the restricted policy to use the `pod.spec.os.name` field: restrictions that are specific to a particular operating system only apply when `.spec.os.name` is not set for that OS, which relaxes OS-specific policy controls for pods that declare their OS (https://kubernetes.io/docs/concepts/security/pod-security-standards/, jev weight 0.93).

## Pod Security Admission: enforcement machinery

The three policies are implemented by the Pod Security admission controller (https://kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/, jev weight 0.82). Pod Security Admission was available by default in Kubernetes v1.23 as a beta, and became generally available in version 1.25 (https://kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/, jev weight 0.82).

Enforcement is namespace-scoped. Namespaces can be labeled to enforce the Pod Security Standards, and the labels carry the mode and the level the namespace runs under (https://kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/, jev weight 0.82). The admission controller evaluates workload resources and pod templates against the labels on the namespace the workload lands in (https://kubernetes.io/docs/concepts/security/pod-security-admission/, jev weight 0.91).

## The enforce, audit, and warn modes

Pod Security Admission ships three modes. Enforce rejects pods that violate the labeled profile. Audit and warn are the two observational modes: the audit and warn modes of the Pod Security Standards admission controller make it easy to collect important security insights about pods without breaking existing workloads, and it is good practice to enable these modes for all namespaces, set to the level and version you would eventually like to enforce (https://kubernetes.io/docs/setup/best-practices/enforcing-pod-security-standards/, jev weight 0.85).

That last point is the operational sequence the yubiOS skill leans on: run audit and warn at the target level first, harvest the violations as evidence, then flip the namespace to enforce once the violation count reaches zero. The audit and warn phases are also what make the restricted profile usable as an audit artifact source, which doc 04 covers.

## Why the restricted profile is the yubiOS baseline

The source doc positions this skill as the canonical yubiOS reference for mapping the least-privilege keyword set onto both the PSS restricted profile and OPA Rego, forming 16 binding cells across 8 keywords and 2 frameworks (source doc: `yubi-OS/yubiOS skills/least-privilege-pod-security-standards/SKILL.md`). The restricted profile is the Kubernetes-side half of that pairing because it is the level that actually forces least-privilege posture: running as non-root, dropping capabilities, and disabling privilege escalation, as opposed to merely blocking the most obvious escalations.

Security context settings are the pod-level mechanism that the restricted profile requires pods to use: a security context defines privilege and access control settings for a pod or container, including discretionary access control based on user ID and group ID, SELinux labels, and running as privileged or unprivileged (https://kubernetes.io/docs/tasks/configure-pod-container/security-context/, jev weight 0.82). Doc 03 maps those controls onto the keyword set.

## Placement in yubiOS

Per the source doc, the PSS restricted profile and the docker-build-policy skill's `yubiOS.rego` pattern are both required for the yubiOS least-privilege canon: the PSS restricted profile is the operational embodiment of the Kubernetes leg, and the Rego policy is the operational embodiment of the OPA leg. Any change to this area should be reviewed for impact on least-privilege coverage, with gaps tracked in the cycle-9 run log referenced by the source doc.
