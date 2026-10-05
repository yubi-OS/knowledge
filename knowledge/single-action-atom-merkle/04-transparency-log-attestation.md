# 04. Transparency Logs and Attestations

**Scope:** Transparency logs (Rekor, Certificate Transparency) and public attestations: publishing each change artifact so third parties can verify it existed, was signed, and was logged at a point in time.

## What a transparency log promises

Certificate Transparency is the reference design. Its ecosystem site states the contract directly: "built using Merkle trees, logs are publicly verifiable, append-only, and tamper-proof," and the system "depends on independent, reliable logs because it is a distributed ecosystem" (https://certificate.transparency.dev/, weight 0.65). Three properties carry the promise: public verifiability (anyone can check the log), append-only (entries cannot be removed or edited), and distribution (no single operator is trusted alone).

The mechanism that makes append-only checkable is the Merkle consistency proof. RFC 6962 defines it as "the list of nodes in the Merkle Tree required to verify that the first m inputs D[0:m] are equal in both trees," where one tree is a prefix of the other (https://datatracker.ietf.org/doc/html/rfc6962, weight 0.60). Consistency proofs are the log-side complement of the inclusion proofs in doc 02: inclusion proves an entry is in the log; consistency proves the log you are shown today contains everything the log contained yesterday.

## Rekor: the transparency log for software artifacts

Sigstore's Rekor applies the model to software supply chains. "The Rekor project provides a restful API-based server for validation, and a transparency log for storage. A CLI application is available to make and verify entries, query the log for inclusion proof, integrity verification of the log or retrieval of entries (either by a public key or an artifact)" (https://docs.sigstore.dev/logging/overview/, weight 0.72). The sigstore documentation further describes Rekor as fulfilling "the signature transparency role of sigstore's software signing infrastructure" (https://github.com/sigstore/rekor, weak backing, weight 0.45).

Verification from the client side is a first-class operation. The CLI's verify command lets a user "send a public key / signature and artifact to the Rekor transparency log for verification of entry," which "show[s] that your artifact is stored within the transparency log" (https://www.sigstore.dev/docs/about, weak backing, weight 0.42). The practical workflow for an auditable change is therefore: sign the artifact, create the log entry, keep the inclusion proof, and let any verifier later replay the proof against the log's signed tree head.

## The frontier: transparency built into the credential

Certificate Transparency grew as an add-on log that mis-issuance could be checked against. A newer IETF draft, Merkle Tree Certificates, inverts the architecture: "this document describes Merkle Tree certificates, a new form of X.509 certificates which integrate public logging of the certificate, in the style of Certificate Transparency. The integrated design reduces logging overhead in the face of both shorter-lived certificates and large post-quantum signature algorithms" (https://www.ietf.org/archive/id/draft-davidben-tls-merkle-tree-certs-06.html, weight 0.80). The design is an early-internet-draft "co-authored by Chrome, Cloudflare, and Geomys" that "uses public logging as a first-class building block for establishing trust" (https://transparency.dev/summit2025/talks/mtcs.html, weight 0.55).

The lesson for change-artifact design is structural. When the artifact itself embeds its position in a public log, logging stops being a separate act that can be forgotten, skipped, or done after the fact. An improvement-cycle artifact that carries its own Merkle path and log position is self-evidencing; an artifact that expects a separate attestation step is only as complete as the discipline of the agent that was supposed to attach it.

## Attestation versus transparency

A signed attestation and a transparency entry answer different questions:

1. A signature proves who authored a statement, but the statement can be shown selectively or never shown at all.
2. A transparency entry proves the statement existed at a time and cannot be silently retracted, because any omission creates two conflicting logs whose divergence is detectable.

The strongest auditable artifact carries both: an attestation over the content and an inclusion proof anchoring that attestation in an append-only log. This is the shape the worked example follows with its single root hash over six artifacts: the root is the commitment, and recording it durably (in a refs manifest, an issue, and a changelog) is the transparency step. The doc-05 evidence bundle generalizes this into a reusable packaging format, and doc 08 specifies the manifest structure that the root summarizes.
