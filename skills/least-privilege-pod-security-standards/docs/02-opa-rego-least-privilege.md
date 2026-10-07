# 02 - OPA Rego least-privilege policy leg

Scope: Open Policy Agent and Rego as the declarative policy leg of yubiOS least privilege: what Gatekeeper is, how Rego admission policies are structured, and how the yubiOS skill binds this leg to the docker-build-policy `yubiOS.rego` pattern.

Per the source doc (`yubi-OS/yubiOS skills/least-privilege-pod-security-standards/SKILL.md`), the yubiOS least-privilege canon has two operational embodiments: the PSS restricted profile is the Kubernetes leg, and the `docker-build-policy` skill's `yubiOS.rego` pattern is the operational embodiment of the OPA Rego leg. Both are required. This doc grounds the OPA leg in the upstream OPA documentation.

## Gatekeeper is the recommended path

The Open Policy Agent project's own documentation recommends OPA Gatekeeper as the project for using OPA for Kubernetes admission control, with plain OPA and Kube-mgmt as alternatives when the management features of OPA are wanted, such as status logs, decision logs, and bundles (https://www.openpolicyagent.org/docs/kubernetes, jev weight 0.81). OPA is a Cloud Native Computing Foundation graduated project (https://www.openpolicyagent.org/ecosystem/entry/gatekeeper, jev weight 0.72).

This distinction matters for the yubiOS skill: Gatekeeper is the admission-control deployment, while the decision-log and bundle machinery that makes OPA useful as an audit artifact source lives in the OPA core. A yubiOS deployment that wants both enforcement and evidence keeps both surfaces in view, which is exactly the P3 plus P6 pairing the source doc records.

## Rego admission policy structure

For OPA deployed as a Kubernetes admission controller, the default installation assumes rules live in the `kubernetes.admission` package (https://www.openpolicyagent.org/docs/kubernetes/primer, jev weight 0.66). Deny rules are the typical tool for admission control, their order does not change the result, and starting with deny rules is the recommended approach for admission-control policies (https://www.openpolicyagent.org/docs/kubernetes/primer, jev weight 0.66).

That is the structural shape of the Rego leg: a set of deny rules that reject pods violating least-privilege invariants, evaluated at admission time, with the rule set expressed declaratively in Rego rather than imperatively in controller code. The declarative quality is what earns the leg its P3 (declarative policy) placement in the yubiOS 10-primitive spine per the source doc: PSS profiles and Rego policies are both declarative, so the skill contributes to P3 through both of its legs.

## From Rego to the yubiOS.rego pattern

The source doc names the docker-build-policy skill's `yubiOS.rego` pattern as the operational embodiment of this leg. In that pattern (per the docker-build-policy skill), a Rego policy vets build inputs, such as base images by registry and digest, before any layer executes, and the same deny-rule structure that Gatekeeper applies at cluster admission applies at build time. The skill places the LP mapping in both contexts: the same 8 least-privilege keywords that PSS expresses as pod fields are expressible as Rego deny rules over admission input.

Doc 03 works through the keyword mapping itself. The practical consequence recorded here: a violation of a least-privilege keyword is representable in two declarative policy languages, one enforced by Pod Security Admission inside the cluster and one enforced by OPA, and the yubiOS skill requires coverage in both.

## Enforcement versus audit in the Rego leg

The OPA documentation separates the enforcement surface from the logging surface: plain OPA can expose status logs and decision logs through its management features (https://www.openpolicyagent.org/docs/kubernetes, jev weight 0.81). Doc 04 covers the decision-log artifact in detail; the point for this doc is that the Rego leg, like the PSS leg, has an enforce mode and an evidence mode, and the yubiOS skill counts both. A Rego policy that denies privileged pods but produces no decision records satisfies P3 only, not the P6 half the skill claims.

## Complementary policy engines

Third-party material on Rego policy authoring and Gatekeeper ConstraintTemplates exists in the wider ecosystem (weak backing, weight 0.2 to 0.28, for example https://devops.trainwithsky.com/blog/kubernetes/opa-gatekeeper and https://www.k8s.guide/ecosystem/opa-gatekeeper/). The yubiOS skill does not depend on those sources; its canon is the OPA documentation plus the docker-build-policy pattern. Where a downstream consumer needs ConstraintTemplate structure or mutation behavior, those weakly-backed references are a starting point, not a grounding spine.
