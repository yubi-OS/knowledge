# 04 - Rows 1, 2, and 7: signing-path failures (systemd-sbsign, PKCS#11 URI, ECDSA multipart)

Scope: the three signing-path rows of the decision tree: the missing binary on PATH, the fragile sign command line, and the SoftHSM ECDSA multipart signature failure.

## Row 1: systemd-sbsign is not on PATH

The failure is `systemd-sbsign: command not found` or `ukify not found in PATH` (source doc). The mechanism: the binary ships inside the `systemd` package at `/usr/lib/systemd/systemd-sbsign` and is not on PATH (source doc). There is no `systemd-sbsign` dnf package; `No match for argument` is the expected output when looking for one (source doc). The fix is to call the binary by full path.

Two aggravating facts ride along. First, ukify and systemd-sbsign are coupled: ukify's Secure Boot signing can use `SecureBootSigningTool=systemd-sbsign` / `--signtool=systemd-sbsign`, which is how `ukify build` delegates to the signer (https://man7.org/linux/man-pages/man1/ukify.1.html, weight 0.49, weak backing). Second, each `docker run` is a fresh container, so a dnf install performed in one container does not persist into the next one (source doc). V25 and V26 were burned on this row, and V27 additionally hit row 2 (source doc, doc 08).

## Row 2: the sign command fragments; provider, not engine

The second row is the sign command itself. Three failure surfaces live here (all source doc):

1. `--private-key-source=...` runs as its own command when the command line fragments.
2. An unquoted `;` inside a PKCS#11 URI splits the `bash -c "..."` invocation.
3. The pkcs11-provider needs the PIN embedded in the URI, or signing hangs or `C_Login` fails.

The working form, from the source doc:

```bash
/usr/lib/systemd/systemd-sbsign sign \
  --private-key-source=provider:pkcs11 \
  --private-key='pkcs11:token=yubiOS-ci;object=sb-key;type=private?pin-value=1234' \
  --certificate=/output/pki/sb.crt ...
```

The URI is single-quoted so the `;` separators survive bash, and `pin-value=1234` is embedded. The source doc also prefers single-line `bash -c` with `&&` / `;` separators over multi-line quoting.

The source selection is deliberate: `provider:pkcs11`, not `engine:pkcs11`, per ADR-008 / OMN-116, because OpenSSL 3.x deprecates the engine API (source doc). The upstream manual corroborates the mechanism: systemd-sbsign takes `--private-key=` with `--private-key-source=TYPE[:NAME]` and `--certificate=` with `--certificate-source=TYPE[:NAME]`, where the source types include `file` and `provider`, and the value passed to a provider source is a URI handled by that OpenSSL provider (https://www.man7.org/linux/man-pages/man1/systemd-sbsign.1.html, weight 0.45, weak backing).

## Row 7: EVP_DigestSignUpdate provider signature failure on ECDSA

The third signing row is the one that is not your workflow. The symptom is `EVP_DigestSignUpdate: provider signature failure` with error `030000EA` on an ECDSA key (source doc). The mechanism, as the source doc records it: SoftHSM 2.7.0 added the hashed ECDSA mechanisms but implemented them single-part only; pkcs11-provider streams the to-be-signed bytes via `C_SignUpdate`, and the token rejects the multipart operation.

The dig confirms the upstream record. SoftHSM issue 842 states that #683 introduced the hashed ECDSA mechanisms without implementing multipart operations, and that the PKCS#11 specs say multipart should work (https://github.com/softhsm/SoftHSMv2/issues/842, weight 0.39, weak backing). The OASIS PKCS#11 base specification is explicit that `C_Sign` cannot be used to terminate a multi-part operation, which is why a single-part-only token breaks streaming signers (https://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html, weight 0.49, weak backing). A parallel ECDSA multipart failure class exists in OpenSC's tracker, where a `C_SignUpdate` call fails mid-stream on a large input (https://github.com/OpenSC/OpenSC/issues/2181, weight 0.22, weak backing).

Per the source doc the upstream state is: SoftHSMv2 issue 842 is open, with the fix merged to `main` in PR 857; pkcs11-provider issue 715 is closed as won't-fix on the provider side.

## The two fixes, in order

The source doc gives two fixes in order. First, pin `pkcs11-provider >= 1.2.0`, which carries PR 669's SoftHSM fallback; verify inside the failing container with `rpm -q pkcs11-provider`. Second, swap the CI token to kryoptic, which is the provider maintainer's own recommendation, and which only changes `--module` and `--token-label` in the invocation (source doc). The row 7 finding is source-verified in the deepdive doc `sealed-uki-vm-pkcs11-ecdsa-deepdive-VERIFIED-2026-07-31.md` referenced by the playbook (source doc).

## What this row teaches

Row 7 is the only row where the workflow is innocent. The debug lesson is to move the blame frontier before patching: `rpm -q pkcs11-provider` inside the failing container, plus the upstream issue state, distinguish a token-side mechanism gap from a workflow-side argument mistake. Rows 1 and 2 are workflow-side and cheap to fix; row 7 is ecosystem-side and needs a version pin or a token swap.
