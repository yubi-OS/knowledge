# Prod/test separation: which artifact class does the work touch

Scope: Declaring whether promoted work touches production artifacts, dev/test artifacts, installer artifacts, firmware artifacts, or lab-only outputs.

## The gate question

The promotion gates document (yubiOS refs, roadmap-promotion-gates, 2026-07-17) requires: "Does the work touch production artifacts, dev/test artifacts, installer artifacts, firmware artifacts, or lab-only outputs?" The gate makes artifact class an explicit declaration at promotion time. The point is blast radius: a claim about a lab-only output is cheap to make and cheap to break; a claim about production or firmware artifacts carries different obligations and different recovery stakes.

## Standards treat environment separation as a control, not a preference

ISO 27001's Annex A control 8.31 requires separation of development, test, and production environments to prevent unauthorized access, accidental changes, and security breaches, with best practices including access control, change management, and data protection to maintain system integrity (https://www.isms.online/iso-27001/annex-a-2022/8-31-separation-of-development-test-production-environments-2022/, jev weight 0.30, weak backing). A control level summary adds concrete corollaries: development tools such as compilers, IDEs, and debuggers are not installed on production systems by default, and approval logging records who approved, who deployed, and what changed (https://iseoblue.com/iso-27001/annex-a/control-8-31/, jev weight 0.34, weak backing). The underlying control text is summarized at another implementation guide: organisations should review and test changes in a test environment separate from production before use in production, and testing in production environments should not be allowed unless defined and approved prior (https://www.isms.online/iso-27002/control-8-31-separation-of-development-test-and-production-environments/, jev weight 0.24, weak backing).

An IAM focused analysis frames the same separation as a core design choice: access rules differ across development, test, staging, and production based on risk, sensitivity, and operational consequence (https://softwarepatternslexicon.com/iam-basics-and-permission-models/cloud-and-saas-iam/environment-separation-dev-test-staging-production/, jev weight 0.41, weak backing). ITIL oriented change management material describes pipelines that automate change workflows, tracking, and compliance with established processes (https://www.atlassian.com/itsm/change-management, jev weight 0.26, weak backing).

Note the weights: this subtopic's strongest corroboration sits below 0.5, so the environmental separation claims above carry weak backing and are corroborative rather than authoritative. The gate itself does not need them to stand; it needs the author's declaration.

## Artifact promotion preserves class boundaries mechanically

The strongest operational argument for separating artifact classes comes from artifact promotion pipelines. JFrog documentation defines build info as metadata capturing what was built and which artifacts were produced, and artifact promotion as the practice of moving artifacts between repositories as they progress through environments from dev to staging to production (https://docs.devopspilot.com/jfrog/tutorials/build-info-promotion/, jev weight 0.44, weak backing). A GitHub Actions oriented guide states the key invariant: the artifact that passes tests in staging is the exact same artifact that runs in production, modeled with GitHub Environments, human approval gates, and safe rollback (https://learn.programmingline.com/learn/cicd/cicd-staging-production-promotion, jev weight 0.20, weak backing). A longer treatment argues artifact promotion is the control between unpredictable rebuilds and unreliable production rollouts, preserving the exact binary and its provenance through dev, staging, and prod (https://beefed.ai/en/artifact-promotion-pipeline-dev-to-prod, jev weight 0.15, weak backing).

The distinction the yubiOS gate draws between production, dev/test, installer, firmware, and lab-only outputs is a finer grained version of the same principle: each class has its own provenance chain, approval surface, and recovery stakes.

## Firmware and device artifacts are their own classification

For firmware specifically, regulated practice makes artifact class determine obligation depth. An IEC 62304 implementation guide maps firmware lifecycle phases, risk classification, verification and validation, traceability, and audit ready artifacts (https://beefed.ai/en/iec-62304-firmware-compliance-guide, jev weight 0.28, weak backing), and a classification explainer states that the classification of software directly dictates what documentation is required, with the depth and formality of each artifact scaling with classification (https://enlil.com/blog/iec-62304-classifications-explained/, jev weight 0.29, weak backing). Translated to the gate: declaring "this work touches firmware artifacts" is declaring a heavier obligation class, which is why the source doc records firmware RK tags promoted only to CI workflow metadata and publish routing, with real board divergent payloads remaining hardware lane work (yubiOS refs, roadmap-promotion-gates, 2026-07-17).

## Authoring guidance

The declaration should enumerate every artifact class the work touches, not just the primary one. A VM workflow change that also edits the installer script touches 2 classes and inherits both obligations. If the list includes production or firmware, the recovery baseline gate and the evidence target gate sharpen accordingly: production and firmware claims need named evidence and documented recovery before default enablement.
