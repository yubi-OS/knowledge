# 05 - Regulatory guidance as a citation source

Scope: government and standards-body guidance (NIST SP 800-63B, CISA, OMB M-22-09) as citation sources for phishing-resistant MFA and what such citations cannot imply.

## The strongest-weight sources in the corpus

Government and standards-body sources weighted highest of anything collected for this corpus, which matches their role: they define terms rather than estimate markets, and their text is the citable artifact.

NIST SP 800-63B is the definitional anchor. The current edition (Revision 4, published as final on July 31, 2025) is at https://csrc.nist.gov/pubs/sp/800/63/b/4/final (weight 0.98) and supersedes the prior SP 800-63B. The Revision 4 HTML defines phishing attacks as attempts by fraudulent verifiers and relying parties to fool an unwary claimant into presenting an authenticator to an impostor, noting that earlier revisions called these verifier-impersonation attacks (https://pages.nist.gov/800-63-4/sp800-63b.html, weight 0.93; the Revision 3 page at https://pages.nist.gov/800-63-3/sp800-63b.html, weight 0.92, carries the older "strongly MitM resistant" language). The authenticator requirements chapter defines the assurance levels and authenticator types (https://pages.nist.gov/800-63-4/sp800-63b/authenticators/, weight 0.96). One secondary explainer summarizes the consequence for OTP: OTP paired with a password supports AAL1 to AAL2 but never reaches AAL3 because it is not verifier-impersonation-resistant (https://identitychallengecard.avatier.com/en/blog/otp-nist-800-63b-defense-2026, weight 0.10, weak backing; use NIST's own text for any AAL claim).

CISA guidance is the operational layer. The Implementing Phishing-Resistant MFA fact sheet urges all organizations to implement phishing-resistant MFA as part of Zero Trust principles (https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf, weight 0.88). CISA's government-audience page directs agencies to enable phishing-resistant MFA to protect critical information systems (https://www.cisa.gov/audiences/state-local-tribal-and-territorial-government/secure-us-sltt/require-mfa-government, weight 0.98). The federal IDManagement playbook records the policy linkage: when a PIV credential is impractical, the Federal Zero Trust Strategy under OMB Memo 22-09 permits agencies to use alternative phishing-resistant authenticators such as FIDO2 and Web Authentication (https://www.idmanagement.gov/playbooks/altauthn/, weight 0.74). This is the primary-text basis for the internal reference doc's regulatory-push claim, which attributes to OMB M-22-09 the direction toward phishing-resistant MFA and to CISA the characterization of FIDO2/WebAuthn as the gold standard alongside PIV/CAC smart cards.

## What regulatory citations cannot imply

A regulatory-tailwind citation supports exactly one claim: that the policy environment pushes toward phishing-resistant authentication generally. It cannot imply that a specific product meets any certification. The reference doc is explicit that no FIPS or FedRAMP certification evidence for the product existed in its repository, and the do-not-use-for boundary holds regardless of how strong the guidance citations are. Certification claims require the certification body's own listing; guidance documents are not product attestations.

A secondary write-up of federal deployment progress reports scale examples such as roughly 40,000 USDA users logging in without passwords using FIDO2 and Windows Hello for Business (https://www.iddataweb.com/inside-cisas-phishing-resistant-mfa-playbook/, weight 0.32, weak). Such adoption anecdotes are useful color for a tailwind argument but are single-source and should not be used as a federal adoption statistic.

## Version discipline for standards citations

Standards documents are versioned artifacts, and version drift is a silent failure mode: SP 800-63B Revision 3 said "verifier impersonation"; Revision 4 says "phishing." A document citing "SP 800-63B" without a revision can be quoting a term that no longer exists in the standard. The reference doc's refresh rule applies with full force here: check for a newer revision before citing in any external-facing material, and always cite the revision (for example, "NIST SP 800-63B-4") alongside the URL. The csrc.nist.gov publication page is the authoritative pointer for which revision is current.

## Sources considered

| Source | URL | Weight |
|---|---|---|
| SP 800-63B-4 publication page (NIST CSRC) | https://csrc.nist.gov/pubs/sp/800/63/b/4/final | 0.98 |
| SP 800-63B-4 HTML (NIST pages) | https://pages.nist.gov/800-63-4/sp800-63b.html | 0.93 |
| SP 800-63B-4 authenticator requirements (NIST pages) | https://pages.nist.gov/800-63-4/sp800-63b/authenticators/ | 0.96 |
| SP 800-63B Rev 3 HTML (NIST pages) | https://pages.nist.gov/800-63-3/sp800-63b.html | 0.92 |
| Implementing Phishing-Resistant MFA fact sheet (CISA) | https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf | 0.88 |
| Require MFA in Government (CISA) | https://www.cisa.gov/audiences/state-local-tribal-and-territorial-government/secure-us-sltt/require-mfa-government | 0.98 |
| Phishing-Resistant Authenticator Playbook (IDManagement.gov) | https://www.idmanagement.gov/playbooks/altauthn/ | 0.74 |
| NIST home | https://www.nist.gov/ | 0.79 |
| CISA home | https://www.cisa.gov/ | 0.23 (weak) |
| USDA deployment writeup (ID Dataweb) | https://www.iddataweb.com/inside-cisas-phishing-resistant-mfa-playbook/ | 0.32 (weak) |
| OTP and NIST 800-63B guide (Avatier) | https://identitychallengecard.avatier.com/en/blog/otp-nist-800-63b-defense-2026 | 0.10 (weak) |
| Phishing-resistant MFA business guide (Honeybadger) | https://honeybadgersolution.com/phishing-resistant-mfa-guide/ | 0.07 (weak) |
