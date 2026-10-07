# 03 - The canonical LP keyword mapping

Scope: the canonical least-privilege keyword set and how the skill maps 8 keywords onto both the PSS restricted profile and OPA Rego, forming 16 binding cells, grounded in the NIST definition of least privilege and the Kubernetes security-context mechanism.

Per the source doc (`yubi-OS/yubiOS skills/least-privilege-pod-security-standards/SKILL.md`), this skill is the yubiOS canonical reference for the LP keyword mapping: 8 keywords multiplied by 2 frameworks equals 16 binding cells. The source doc records the count and the two frameworks but not the individual keyword strings; the enumeration lives in the skill's own records and must not be reconstructed here. What this doc can do is ground each half of the mapping in its authoritative source.

## The NIST definition of least privilege

The NIST Computer Security Resource Center glossary defines least privilege as a security principle that a system should restrict the access privileges of users, or processes acting on behalf of users, to the minimum necessary to accomplish assigned tasks (weak backing, weight 0.49, https://csrc.nist.gov/glossary/term/least_privilege, sourced from CNSSI 4009-2022 and NIST SP 800-12 Rev. 1). The formal control catalog carrying the principle is NIST Special Publication 800-53 Revision 5, the catalog of security and privacy controls for information systems and organizations (https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final, jev weight 0.94; https://www.nist.gov/, jev weight 0.9).

The keyword set in the source doc descends from this lineage: each keyword names one restriction that keeps a workload at minimum necessary privilege. The mapping discipline in the skill is that a keyword is not closed until it is enforced in both frameworks, which is what makes a cell binding.

## The Kubernetes half: security contexts

On the Kubernetes side, the enforcement mechanism is the security context. A security context defines privilege and access control settings for a pod or container, and its settings include, but are not limited to, discretionary access control based on user ID and group ID, SELinux security labels, and running as privileged or unprivileged (https://kubernetes.io/docs/tasks/configure-pod-container/security-context/, jev weight 0.82).

Each of those settings is the concrete field-level expression of at least one least-privilege keyword. Running as unprivileged expresses the keyword that forbids root. Discretionary access control and SELinux labels express the keywords that bound read and write surfaces. The restricted profile requires pods to carry these settings, so the PSS leg enforces the keyword set at admission time, while the Rego leg can enforce the same set by denying admission requests whose pod spec violates the fields.

## The Rego half: deny rules over admission input

On the OPA side, the same keywords are expressible as deny rules in the `kubernetes.admission` package, evaluated against the admission request input (https://www.openpolicyagent.org/docs/kubernetes/primer, jev weight 0.66). The 16-cell structure is the point: for each of the 8 keywords there is one cell for the PSS expression and one cell for the Rego expression, and a keyword with only one filled cell is half-enforced.

## Why a mapping rather than a checklist

The source doc frames the skill as the corpus-additive anchor for the least-privilege primitive: it closes 7 residual LP coverage cells identified post-cycle-8, when the least-privilege primitive stood at 63 of 70 cells across the 70-skill corpus. The 7 closure skills are `browser-testing-with-devtools`, `code-review-and-quality`, `composefs-kernel-floors`, `frontend-ui-engineering`, `observability-and-instrumentation`, `shipping-and-launch`, and `spec-driven-development`, each contributing a least-privilege facet that the source doc names explicitly (source doc). This skill's contribution is that those facets now have a single canonical reference for what least privilege means at the pod-policy layer: a keyword set with two enforceable expressions per keyword.

## Practical use

When reviewing a yubiOS change, the 16-cell grid is the coverage check: name the keyword, check the PSS expression in the restricted profile, check the Rego expression in the policy layer. Any change that flips a cell should be reviewed for impact on LP coverage, per the source doc, and gaps attributable to this skill are tracked in the cycle-9 run log at `refs/curve-guided-rsi-v2-cycle9-corpus-enrichment-2026-08-06.md` on `yubi-OS/yubiOS` (source doc).
