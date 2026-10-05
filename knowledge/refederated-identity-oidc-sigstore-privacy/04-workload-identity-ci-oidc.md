# Workload Identity and CI OIDC Federation

Scope: CI and workload OIDC federation: GitHub Actions OIDC tokens, Google Cloud Workload Identity Federation, self-hosted runners such as Tekton, and what changes when the workload signing identity issuer anchor shifts.

## GitHub Actions as an OIDC issuer

GitHub's OIDC provider "auto-generates an OIDC token" every time a job runs, and that token "contains multiple claims to establish a security-hardened and verifiable identity about the specific workflow that is trying to authenticate" [1]. The token is therefore a per-run, short-lived assertion about a specific workflow, not a long-lived credential.

To use it, the consuming side must be configured to trust it: "you will first need to configure your cloud provider to trust GitHub's OIDC as a federated identity, and must then update your workflows to authenticate using tokens" [2]. That trust configuration, with its issuer, audience, and subject conditions, is the federation anchor for CI workloads. It is also the surface that has to change in a refederation.

## Google Cloud Workload Identity Federation

Google's Workload Identity Federation is the canonical consuming side. It "follows the OAuth 2.0 token exchange specification": "You provide a credential from your IdP to the Security Token Service, which verifies the identity on the credential, and then returns a federated token in exchange", with OIDC providers configured with local JWKs [3].

For CI specifically, the combination removes static credentials from the pipeline: "with GitHub's introduction of OIDC tokens into GitHub Actions Workflows, you can authenticate from GitHub Actions to Google Cloud using Workload Identity Federation, removing the need to export a long-lived JSON service account key", with fine-grained scoping on top [4]. The deployment-pipelines guide generalizes the pattern beyond GitHub: different CI/CD systems bring their own ambient credentials, for example "Azure DevOps pipelines can use a Microsoft Entra workload identity federation service connection to obtain an ID token" [5]. Google's documentation also maintains a supported-services and limitations page for the CLI and API surfaces involved [6].

## The issuer anchor and what shifts it

The federation is anchored on the CI system's issuer. GitHub Actions tokens come from GitHub's OIDC provider [1]; an Azure DevOps pipeline's anchor is Entra [5]; a self-hosted runner setup can anchor elsewhere. When a workload moves between these (GitHub-hosted Actions to a self-hosted system, or to a different cloud's federation service), the same logical CI workload presents tokens from a different issuer. Everything downstream that pinned the old issuer, from cloud-provider trust configs to signing-identity policy, has to be updated. The OWASP Workload Identity Federation cheat sheet's guidance to validate "the exact trusted issuer (iss), expected audience (aud), and allowed subject (sub)" [7] is the checklist shape of that update.

## Implications for artifact attestation

When the CI's OIDC token is the input to a signing identity (as in Sigstore keyless signing), the issuer anchor is embedded in the resulting attestation chain. A workload that refederates keeps its logical identity ("the project's CI") while its verifiable identity changes. Verifiers see a new issuer, a possibly different sub, and new certificates; continuity is only what the verifier's updated trust configuration says it is. This is the workload-side mirror of the user-side refederation problem, and it is where the multi-federation designs in the rest of this corpus apply.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. OpenID Connect - GitHub Docs, https://docs.github.com/en/actions/concepts/security/openid-connect (0.92)
2. Configuring OpenID Connect in cloud providers - GitHub Docs, https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers (0.90)
3. Workload Identity Federation - Google Cloud IAM docs, https://docs.cloud.google.com/iam/docs/workload-identity-federation (0.94)
4. Enabling keyless authentication from GitHub Actions, Google Cloud blog, https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions (0.75)
5. Configure Workload Identity Federation with deployment pipelines, https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines (0.94)
6. Identity federation: products and limitations, Google Cloud IAM docs, http://cloud.google.com/iam/docs/federated-identity-supported-services (0.91)
7. OWASP Workload Identity Federation Cheat Sheet, https://cheatsheetseries.owasp.org/cheatsheets/Workload_Identity_Federation_Cheat_Sheet.html (0.76)
