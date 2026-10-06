# 05 - Rows 3 to 6: container state pitfalls (mounts, divergence, cross-version tokens, unset vars)

Scope: the four rows where the CI container's filesystem and environment, not the signing logic, are the failure.

## Row 3: cpio chown failed on a shadowed token directory

The failure is `cpio: chown failed - No data available` while installing softhsm (source doc). The cause: a host mount shadows the RPM's own file target. When the workflow mounts a host directory over `/var/lib/softhsm`, the RPM install cannot chown files under a path that is a live mount (source doc). SoftHSM's default token store is indeed `/var/lib/softhsm/tokens` (https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/softhsmv2/, weight 0.34, weak backing), and the ownership and permission model of that default location is a recurring friction point (https://stackoverflow.com/questions/53230852/error-creating-token-via-softhsm2-as-non-root-user-could-not-initialize-the-lib, weight 0.11, weak backing).

The playbook's fixes, in the shape it gives them: never mount over `/var/lib/softhsm`; instead cross-mount to `/run/yubios-hsm` and point `SOFTHSM2_CONF`'s `directories.tokendir` there, or drop the mount entirely (row 5 shows why dropping is the better end state) (source doc).

## Row 4: two docker run invocations with the same -v mount can diverge

The failure is `Failed to load X.509 certificate from /output/pki/sb.crt`, while an earlier step's `/output/yubios.unsigned.efi` is visible in the same mount (source doc). That asymmetry is the tell: one file from the earlier container shows up and the other does not, from two `docker run` invocations carrying the same `-v` mount. The source doc's conclusion is that two runs with the same mount can diverge, and the fixes are to collapse UKI build and signing into one `docker run`, or to pass cert and PKCS#8 key as base64 env vars instead of files.

The same row carries the bind-mount footnote: single-file bind-mounts give `EISDIR` when the path is a directory (source doc). V29 through V35 walked this row: V29 hit the missing cert, V31/V32 merged the docker runs, V33/V34 passed the cert as a base64 env var and hit `EISDIR`, V35 saw `EISDIR` persist and tried a cross-mount (source doc, doc 08).

## Row 5: cross-version SoftHSM BDB token files give Input/output error

The failure is `Input/output error` from pkcs11-provider on a cross-mounted token (source doc). The mechanism: SoftHSM token files are BDB-backed, and cross-version token files, here host SoftHSM 2.6.1 on Debian trixie versus container 2.7.0-2.fc45, are unreadable across versions (source doc). SoftHSM is a PKCS#11 software token store whose on-disk token database is version-coupled to the SoftHSM build (https://github.com/softhsm/SoftHSMv2, weight 0.52, weak backing).

The playbook's fix: do not cross-mount tokens. Initialize inside the container with `softhsm2-util --init-token` plus `--import /tmp/sb.p8`, sourcing the PEM from env vars, and remove the mount (source doc). The token management verbs the fix relies on, init-token and import, are exactly what softhsm2-util provides (https://deepwiki.com/softhsm/SoftHSMv2/9.1-softhsm2-util, weight 0.15, weak backing). One residual hazard the source doc flags: a leftover `:ro` mount makes the container's own token-dir writes fail with `EROFS`, so removing the mount means removing it, not read-only-ing it (source doc).

## Row 6: KEY_P8_B64: unbound variable, and nothing else

The failure is `KEY_P8_B64: unbound variable` with no other output (source doc). The mechanism: `set -euo pipefail` plus `set -u` plus a `docker run` that declares only some of the `-e` variables. The first `echo "$UNSET"` exits before anything useful logs (source doc). The fixes: declare every variable on the `docker run` line, and `printenv`-check between the outer and inner bash so a missed variable surfaces as a checklist failure instead of a silent exit (source doc). Generic docker-run environment variable documentation describes the `-e` mechanics the row depends on (https://www.geeksforgeeks.org/devops/docker-run-with-environment-variables/, weight 0.08, weak backing; https://spacelift.io/blog/docker-run-environment-variables, weight 0.07, weak backing).

## The common denominator

All four rows are state that lives outside the workflow's own logic: what is mounted where, which container writes which file, which SoftHSM version owns the token files, and which variables the inner shell inherited. The playbook's doctrine rule 4 (one change per iteration) exists because these rows interleave: fixing row 4 surfaced row 5's cross-mount hazard, and row 3's cross-mount was row 5's trap (source doc). Diffing against the canonical `ci_mkosi-installer.yml` catches most of these before the run, because the canonical already encodes the working mount and env-var topology (source doc).
