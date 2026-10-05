# Regulatory tailwind

Scope: the federal and regulatory push toward phishing resistant MFA (OMB M-22-09, NIST SP 800-63B, agency playbooks), and the certification claim boundary.

## The primary sources

This subtopic produced the strongest source set in the register, with multiple federal primary documents above the 0.5 authoritative threshold:

- OMB Memorandum M-22-09, the Federal Zero Trust Strategy, hosted on whitehouse.gov. Its text states that phishing resistant MFA protects federal personnel from sophisticated online attacks, and directs agencies toward it as part of the zero trust architecture (https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf, weight 0.9296, primary).
- NIST Special Publication 800-63B, the digital identity guideline that defines phishing resistance (verifier impersonation resistance). Both the revision 3 HTML edition (https://pages.nist.gov/800-63-3/sp800-63b.html, weight 0.9383, primary) and the current revision 4 edition (https://pages.nist.gov/800-63-4/sp800-63b.html, weight 0.9059, primary) are live on pages.nist.gov. The official FAQ accompanies them (https://pages.nist.gov/800-63-FAQ/, weight 0.9726, primary).
- The federal IDManagement program's Phishing Resistant Authenticator Playbook, a practical agency facing guide to implementing phishing resistant authentication types (https://www.idmanagement.gov/playbooks/altauthn/, weight 0.9054, primary).
- A Microsoft implementation overview of the M-22-09 multifactor authentication requirements, useful as a secondary explainer of the memo's enterprise managed authenticator requirements (https://learn.microsoft.com/en-us/entra/standards/memo-22-09-multi-factor-authentication, weight 0.8170, secondary).

## A version fact worth carrying forward

The 2020 edition of SP 800-63B (including the upd2 increment) is now marked Withdrawn on its NIST publication page (https://csrc.nist.gov/pubs/sp/800/63/b/upd2/final, weight 0.5185, primary), with revision 4 as the current edition. A weakly backed practitioner guide describes how 800-63B revision 4 treats cryptographic authentication as phishing resistant when the response is bound to the verifier, through channel binding or audience restricted authentication (https://honeybadgersolution.com/phishing-resistant-mfa-guide/, weakly backed, weight 0.3551). Any external facing document citing 800-63B should cite revision 4, not the withdrawn 2020 edition. The register's own cited PDF was a revision 4 document, consistent with this.

A second weak source, below threshold, claims M-22-09 directed agencies to phishing resistant MFA for staff, contractors, and partners by the end of fiscal year 2024 (https://www.scrambleid.com/learn/authentication-for-government-public-sector, weakly backed, weight 0.0609). The deadline detail is weakly sourced in this pass and should be verified against the memo PDF itself before being quoted with a date.

## Sources carried from the register pass, not re-found here

Two register sources were not surfaced in this dig: the CISA fact sheet on implementing phishing resistant MFA, which names FIDO2 and WebAuthn as the gold standard for phishing resistant MFA alongside PIV and CAC smart cards, and the FIDO Alliance US government guidance document. Both were retrieved with a 2026-07-26 date in the register pass and remain register carried. Their absence in this mint's dig is a dig coverage fact, not a contradiction.

## The tailwind argument

These sources support a real regulatory tailwind argument for FIDO2 based products generally: a binding federal memo, a current national standard defining the exact property (phishing resistance), and an agency playbook operationalizing it. That is relevant to funding target framing and to conversations with regulated industry interview targets.

## The certification boundary

The tailwind argument does not extend to the product itself. No federal certification evidence (FIPS validation, FedRAMP authorization, or similar) exists for the project in any register pass. The boundary pair for this benchmark is:

- Use for: regulatory tailwind for the FIDO2 category; funding target framing; explaining why the compliance direction favors hardware backed phishing resistant authentication.
- Do not use for: any claim that the product meets, is pursuing a specific level of, or has been evaluated against any federal certification.

Government guidance documents are revised periodically, as the 800-63 revision history demonstrates. The register's cadence rule for this benchmark, check for a newer revision before citing in any external facing material, is not optional: the withdrawn 2020 edition found in this pass is the live proof of why.
