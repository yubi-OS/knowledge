# 06 - Referenced security advisory (YSA-2025-01)

Scope: the one security advisory the citation doc references: Yubico YSA-2025-01, the pam-u2f partial authentication bypass, CVE-2025-23013. Grounded in yubi-OS/yubiOS [docs/CITATION.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/CITATION.md) (source doc); dig claims carry URL and jev weight.

## What the source doc cites

The source doc's "Referenced security advisory" section is a single entry [source doc: yubi-OS/yubiOS docs/CITATION.md]:

- Yubico, *YSA-2025-01: pam-u2f partial authentication bypass (CVE-2025-23013)*, https://www.yubico.com/support/security-advisories/ysa-2025-01/

This is the only vulnerability record anywhere in the citation doc. Its presence marks the one place where yubiOS's dependency stack produced a published advisory the project considered worth anchoring a citation to.

## The advisory itself, verified by dig

The Yubico advisory page at https://www.yubico.com/support/security-advisories/ysa-2025-01/ (jev weight 0.94) titles itself "Security Advisory YSA-2025-01 - Partial Authentication Bypass in pam-u2f Software Package" and shows a published date of January 14, 2025, plus a tracking identifier. The Yubico security-advisories index (https://www.yubico.com/support/security-advisories/, jev weight 0.92) lists YSA-2025-01 among the 2025 advisories, alongside YSA-2025-02, which is a distinct advisory (FIDO PIN/UV Auth Protocol conformance) and not part of this record.

## CVE-2025-23013, verified by dig

The NVD entry at https://nvd.nist.gov/vuln/detail/CVE-2025-23013 (jev weight 0.92) describes the vulnerability as: in Yubico pam-u2f before 1.3.1, local privilege escalation can sometimes occur, and it notes that the product implements a Pluggable Authentication Module. The CVE program's own index at https://www.cve.org/ (jev weight 0.91) is the record system the identifier belongs to.

Note the naming difference, which is real and not a contradiction: Yubico's advisory calls it a partial authentication bypass in pam-u2f, the term the source doc repeats [source doc], while the NVD description phrases the impact as local privilege escalation that "can sometimes occur" for pam-u2f versions before 1.3.1 (https://nvd.nist.gov/vuln/detail/cve-2025-23013, jev weight 0.92). Both descriptions describe the same CVE identifier; the vendor advisory is the more specific characterization and the source doc follows the vendor's wording.

Weak-backing results (labeled as such, jev weight under 0.5): press coverage of the advisory from Forbes (https://www.forbes.com/sites/daveywinder/2025/01/18/yubico-issues-security-advisory-as-2fa-bypass-vulnerability-confirmed/, jev weight 0.25), The Cyber Express (https://thecyberexpress.com/yubico-2fa-bypass-vulnerability-advisory/, jev weight 0.1), and two vulnerability-database mirror sites, SentinelOne's entry (https://www.sentinelone.com/vulnerability-database/cve-2025-23013/, jev weight 0.23) and cvefeed.io (https://cvefeed.io/vuln/detail/CVE-2025-23013, jev weight 0.1). One general project-news page (https://www.openwall.com/news, jev weight 0.6) scored above 0.5 on source class but carries no YSA-2025-01 content in its snippet; it is recorded for provenance and not cited for any claim.

## Timeline as the dig dates it

The records collected for this subtopic give a 3-point timeline, with weight labels noting which points are authoritative:

1. January 14, 2025: Yubico publishes YSA-2025-01 with the title "Partial Authentication Bypass in pam-u2f Software Package" (https://www.yubico.com/support/security-advisories/ysa-2025-01/, jev weight 0.94).
2. Between publication and January 18, 2025: press coverage picks the advisory up; the Forbes piece is dated January 18, 2025 and confirms a 2FA bypass vulnerability in pam-u2f (https://www.forbes.com/sites/daveywinder/2025/01/18/yubico-issues-security-advisory-as-2fa-bypass-vulnerability-confirmed/, jev weight 0.25, weak backing, used only for the date).
3. Ongoing: NVD maintains the CVE-2025-23013 record with the "before 1.3.1" fix boundary (https://nvd.nist.gov/vuln/detail/CVE-2025-23013, jev weight 0.92).

The vendor page is the authoritative timeline anchor at every point; the press item is recorded for provenance of the coverage window, not as a technical source.

## Why this advisory is in the citation doc at all

pam-u2f is the PAM module that lets a YubiKey satisfy Linux PAM authentication, and yubiOS leans on the FIDO2/PAM path for local login flows. The citation doc's other sections cite standards, specifications, and design literature; this section cites a defect record in a component yubiOS actually deploys [source doc: yubi-OS/yubiOS docs/CITATION.md]. The practical reading for downstream users: check the installed pam-u2f version against the fixed version 1.3.1 named by NVD (https://nvd.nist.gov/vuln/detail/cve-2025-23013, jev weight 0.92), and consult the Yubico advisory (https://www.yubico.com/support/security-advisories/ysa-2025-01/, jev weight 0.94) for the vendor's own remediation guidance.

## Boundary

Everything above the "why" section is either source-doc attribution or dig-verified with weights. The dig did not fetch the advisory's full body (affected configurations, workaround text, patch links); only the title, published date, and subject are carried, and the remaining details live on the vendor page, which is the authoritative source for them.
