# 05 - The quay.io and dhi.io patterns

Scope: the two stored-credential registry logins the yubiOS pattern teaches: quay.io robot accounts and dhi.io credentials, plus the multi-registry job shape that pairs them.

Grounding spine: source doc `yubi-OS/yubiOS skills/docker-login-action/SKILL.md` (Supported registries and yubiOS pattern sections).

## The yubiOS multi-registry pattern

The source doc's pattern section shows two login steps in one job, quay.io first, then ghcr.io:

```yaml
- uses: docker/login-action@v3
  with:
    registry: quay.io
    username: ${{ secrets.QUAY_USERNAME }}
    password: ${{ secrets.QUAY_TOKEN }}

- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

(Source doc.) The GHCR half is covered in doc 04; this doc covers the quay half and the dhi.io sibling. Both logins live in the same job because the job pushes to both registries; Docker documents the multi-registry push flow as multiple login steps preceding the pushes (https://docs.docker.com/build/ci/github-actions/push-multi-registries/, weight 0.93).

## quay.io: robot accounts

The source doc maps quay.io to a robot account token held in `QUAY_USERNAME` and `QUAY_TOKEN` secrets (source doc). Quay's own documentation defines the mechanism: robot accounts are accounts that can be shared by multiple repositories owned by a user or organization, and creating one produces a username of the form namespace+accountname, where namespace is the user or organization name (https://docs.quay.io/glossary/robot-accounts.html, weight 0.93). Red Hat's Quay documentation describes the same model for Red Hat Quay: robot account credentials are generated and associated with the robot account, and repositories are granted access to it (https://docs.redhat.com/en/documentation/red_hat_quay/3/html/about_quay_io/allow-robot-access-user-repo, weight 0.90, and https://docs.redhat.com/en/documentation/red_hat_quay/3/html/use_red_hat_quay/allow-robot-access-user-repo, weight 0.90).

Practical notes for the CI pairing:

1. The username is not a human name. It is the robot identity, namespace+accountname per quay's docs (weight 0.93).
2. The token is the robot account's generated credential, stored as a repository secret, which is exactly the source doc's `${{ secrets.QUAY_TOKEN }}` (source doc).
3. Robot accounts are per-user or per-organization and can be shared across repos, so one CI robot can serve the org's image repositories rather than one account per repo (weight 0.93).

## The newer path: OIDC instead of robot tokens

The robot-token pattern is quay's classic answer. Quay now also supports federation: a Red Hat Developer article from July 2026 describes pushing images to Quay without a password by configuring a robot identity with a GitHub issuer URL and subject, letting GitHub Actions exchange its OIDC token for short-lived quay credentials (https://developers.redhat.com/articles/2026/07/22/push-images-to-quay-without-a-password, weight 0.57). A dedicated community action, quay-oidc-auth-action, exchanges a GitHub-issued OIDC JWT for a short-lived Quay robot account token (https://github.com/sabre1041/quay-oidc-auth-action, weight 0.24, weak source). The source doc does not cover OIDC; it predates the federation flow. Dated note 2026-10-06: the robot-token pattern in the source doc remains the documented baseline, and the OIDC flow is an observed newer alternative with a moderate-weight primary source.

## dhi.io: Docker Hardened Images

The source doc lists dhi.io with "dhi.io credentials" (source doc, Supported registries). Docker's DHI documentation fills in what that means in practice: run `docker login dhi.io` to authenticate, and use dhi.io for community images pulled directly from Docker Hardened Images, or docker.io for mirrored repositories (https://docs.docker.com/dhi/how-to/use/, weight 0.85). The distinction matters for CI: where you log in depends on whether you pull from the DHI registry directly or from your own mirror on Docker Hub.

Subscribing and mirroring: the DHI quickstart covers getting started after subscribing to a DHI subscription or starting a trial, including mirroring repositories and accessing compliance verification (https://docs.docker.com/dhi/get-started/, weight 0.88). Mirroring requires a DHI Select or Enterprise subscription; without a subscription you can pull Docker Hardened Images directly from dhi.io without mirroring (https://docs.docker.com/dhi/how-to/mirror/, weight 0.84). Docker positions DHI as secure, minimal, production-ready base images (https://docs.docker.com/dhi/, weight 0.80).

For GitHub Actions, the dhi.io login is the same login-action shape: registry `dhi.io`, username and password from stored dhi.io credentials (source doc). A weak third-party integration guide describes the credential shapes one registry config accepts, including LOGIN+TOKEN and AUTH variants, and notes that registry auth fails closed for invalid combinations (https://getdrydock.com/docs/v1.6/configuration/registries/dhi, weight 0.41, weak source, label as weak).

## Why the pattern separates the two credentials

The yubiOS pattern deliberately uses three different credential sources across its two logins: a quay robot secret pair, and the automatic GITHUB_TOKEN (source doc). The split is the lesson: each registry has its own identity model, and the login step's inputs are the adapter. Secrets stay in repository secrets; nothing registry-specific leaks into workflow YAML beyond the secret names.

## Failure modes

1. Human username for quay. Using a personal login instead of the robot identity breaks the namespace mapping quay expects (robot username is namespace+accountname, weight 0.93).
2. Wrong dhi.io target. Logging in to dhi.io when the workflow pulls from a mirrored docker.io repository, or the reverse, per Docker's use guidance (weight 0.85).
3. Expired robot token. The source doc stores the token as a secret but does not cover rotation; robot account tokens are generated credentials per Red Hat's docs (weight 0.90), so rotation is an operational concern outside the skill's canon.

## Summary

quay.io uses robot accounts with namespace+accountname usernames and generated tokens in secrets (source doc, weights 0.93 and 0.90); an OIDC federation alternative exists as of July 2026 (weight 0.57). dhi.io uses dhi.io credentials, with dhi.io for direct community pulls and docker.io for mirrored repos (weights 0.85, 0.84). Both log in through the same login-action step shape the source doc teaches.
