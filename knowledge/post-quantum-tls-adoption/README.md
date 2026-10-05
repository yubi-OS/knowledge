# Post-Quantum TLS Adoption Corpus (post-quantum-tls-adoption)

Knowledge corpus on post-quantum TLS adoption: X25519MLKEM768 deployment status across providers and browsers, measurement caveats, and migration considerations for TLS-terminating infrastructure. Minted 2026-10-05 from yubi-OS/yubiOS refs/post-quantum-tls-adoption-2026-07-23.md.

## Documents

| NN | slug | scope |
|---|---|---|
| 01 | mlkem768-hybrid-mechanism | The hybrid KEM construction, TLS 1.3 group identifiers, RFC 10024 spec details, HelloRetryRequest interaction. |
| 02 | fips203-standardization | NIST standardization status of ML-KEM as FIPS 203, parameter sets, why standardization risk is closed. |
| 03 | client-side-adoption | Browser-side deployment (Chrome, Firefox, Safari) and the growth of the client-side traffic share. |
| 04 | cloudflare-deployment | Cloudflare edge and origin deployment, origin-side catch-up, 2029 roadmap, per-domain visibility tooling. |
| 05 | provider-ecosystem | Non-Cloudflare provider deployments, Google Cloud roadmap and load balancers, concentration vs adoption. |
| 06 | library-support | OpenSSL 3.5 defaults, Go 1.24 to 1.26 defaults and GODEBUG toggles, BoringSSL and GnuTLS status. |
| 07 | measurement-caveats | How PQ adoption percentages are computed, HRR effects, concentration vs adoption, secondary reporting limits. |
| 08 | migration-guidance | Origin catch-up, PQ-preferred vs PQ-only tuning, compatibility risk, HNDL motivation, compliance timelines. |
| 09 | kyber-codepoint-history | History of the Kyber draft identifiers and the cutover to ML-KEM code points. |
| 10 | yubios-layering | Layered protection: PQ TLS for transport plus classical PIV/FIDO2 hardware authentication. |

## Research summary

- Results collected: 123 unique results across 26 searXNG queries (2 seed queries per subtopic, plus 1 redo dig per thin subtopic).
- Weight split: 73 high (noul >= 0.5), 50 low (noul < 0.5), of 123.
- jev requests: 27 logged /api/decide calls (1 outline score validation with 10 questions, 21 noul batches of 5, 5 redo noul batches) plus 1 unlogged preflight probe; usage 21967 input / 0 output tokens.
- Redos: 3 (docs 06, 08, 09 re-dug with different queries after thin first digs; all authored after redo).
- Skipped docs: none. Marginal-score subtopics 09 (score 0.69) and 10 (score 0.58) were kept per the validation rule because their digs came back strong after the redo pass (09) or on first dig (10).

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
