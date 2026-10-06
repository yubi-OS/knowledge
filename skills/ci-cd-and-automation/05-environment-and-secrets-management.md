# 05 - Environment and Secrets Management

## Scope

Where configuration and credentials live across local development, CI, test, and production, and the separation rule that CI never sees production secrets.

## The four-tier layout (source doc)

The source doc fixes an explicit file-and-vault taxonomy:

1. `.env.example`, committed, is the template for developers.
2. `.env` is NOT committed; it holds local development values.
3. `.env.test` is committed because it holds test environment values with no real secrets.
4. CI secrets are stored in GitHub Secrets or a vault.
5. Production secrets are stored in the deployment platform or a vault (source doc).

The dividing line is simple: anything committed must be safe to publish to the whole repository audience. `.env.example` and `.env.test` pass that test only when they contain no real credential values; `.env` fails it by construction, hence the NOT committed rule.

## CI never has production secrets (source doc)

The source doc states the rule directly: "CI should never have production secrets. Use separate secrets for CI testing" (source doc). This is stronger than "be careful": it requires that separate CI-scoped credentials exist at all, so a CI runner compromise cannot reach production systems. It also composes with doc 02's note that even CI-only test database passwords go through GitHub Secrets rather than literals, which builds the habit and prevents accidental reuse of test credentials (source doc).

## Vault and workload identity patterns (high-backed dig)

HashiCorp's official well-architected framework documentation recommends managing and securing CI/CD pipeline secrets with Vault using workload identity, short-lived tokens, and platform-specific integrations (https://developer.hashicorp.com/well-architected-framework/secure-systems/secure-applications/ci-cd-secrets, weight 0.88). This is the authoritative extension of the source doc's "vault" mention: instead of long-lived static secrets pasted into a vault, issue short-lived credentials bound to a workload identity. The practical consequence for CI is that the runner authenticates as itself and receives scoped, expiring tokens, which shrinks both the blast radius and the rotation burden.

A practitioner guide covering Vault integration, OIDC workload identity, secrets injection patterns, and common anti-patterns lands at weight 0.24 (https://secure-pipelines.com/ci-cd-security/secrets-management-ci-cd-pipelines-patterns-vault/, weak). It is directionally consistent with the HashiCorp source but should not be cited as authority on its own.

## What the dig did not find

The dig on this subtopic returned mostly 2026 blog content on GitHub Actions secrets handling (for example https://devactivity.com/insights/enhancing-ci-cd-security-managing-secrets-in-github-actions-fo at 0.16, https://www.blacksmith.sh/blog/best-practices-for-managing-secrets-in-github-actions at 0.18, both weak). None of it contradicts the source doc or the HashiCorp guidance; none rises to authoritative. The corpus therefore treats the source doc layout plus the HashiCorp workload-identity recommendation as the stable core of this subtopic.

## Operational rules extracted

1. Commit templates, never values. `.env.example` documents shape; real values stay out of git (source doc).
2. Committed test config must contain no real secrets (source doc).
3. CI credentials are distinct from production credentials, not downscoped copies of them (source doc).
4. Every CI-referenced credential flows through the platform's secret store: GitHub Secrets in the source doc's examples, `secrets.CI_DB_PASSWORD` and `secrets.VERCEL_TOKEN` in doc 02 and doc 04 (source doc).
5. Prefer short-lived, workload-identity-bound tokens over long-lived static secrets where the platform supports it (https://developer.hashicorp.com/well-architected-framework/secure-systems/secure-applications/ci-cd-secrets, weight 0.88).

## How the tiers change operations

The tier separation is not only about leak prevention; it changes what each environment can do. Because CI holds no production secrets, a CI workflow cannot deploy to production or read production data by accident: it lacks the credentials to even authenticate. Production deploys run from a different context (a deployment platform action or a vault-issued short-lived token, per the HashiCorp pattern above). This is why the source doc can treat "CI should never have production secrets" as a structural guarantee rather than a warning label: the missing credential is the access control (source doc).

For rotation, the tiers rank differently. Committed template files never need rotation because they contain no secrets. Local `.env` files rotate when a developer replaces a personal credential. CI secrets rotate on the platform's schedule and are auditable through the platform's secret store rather than through repository history. Production secrets benefit most from the short-lived-token pattern: a credential that expires in minutes does not accumulate validity the way a static key does (https://developer.hashicorp.com/well-architected-framework/secure-systems/secure-applications/ci-cd-secrets, weight 0.88).

The habit dimension is stated in the source doc's own note on CI databases: using GitHub Secrets even for test credentials "builds good habits and prevents accidental reuse of test credentials in other contexts" (source doc). The taxonomy is therefore also a training surface: a developer who has only ever seen credentials flow through `secrets.*` references is structurally less likely to paste one into a YAML file.

## Red flags this doc guards against

The source doc's red-flag list includes "Secrets stored in code or CI config files (not secrets manager)" (source doc). That single line is the failure mode of the whole subtopic: the moment a credential becomes a diff in a pull request, revocation requires a git history rewrite rather than a rotation.
