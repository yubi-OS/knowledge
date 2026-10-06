# 02 - Authentication standards

Scope: the authentication standards the citation doc names as primary sources: W3C WebAuthn Level 2, FIDO Alliance CTAP 2.1, and IETF RFC 7512, the PKCS #11 URI scheme. Grounded in yubi-OS/yubiOS [docs/CITATION.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/CITATION.md) (source doc); dig claims carry URL and jev weight.

## What the source doc cites

The source doc's "Authentication: FIDO2 / WebAuthn / CTAP" section lists 3 primary sources [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. W3C, *Web Authentication: An API for accessing Public Key Credentials (WebAuthn) Level 2*, W3C Recommendation, 2021, https://www.w3.org/TR/webauthn-2/
2. FIDO Alliance, *Client to Authenticator Protocol (CTAP) 2.1*, FIDO Alliance Proposed Standard, 2021, https://fidoalliance.org/specs/fido-v2.1-ps-20210615/
3. IETF, Pechanec, J. & Moustakas, D., *RFC 7512: The PKCS #11 URI Scheme*, 2015, https://www.rfc-editor.org/rfc/rfc7512

These are the standards under the FIDO2-first half of yubiOS: WebAuthn is the browser-facing credential API, CTAP is the browser-to-authenticator protocol, and PKCS #11 is the token interface layer that PIV-based signing (systemd-sbsign with a YubiKey) addresses through the URI scheme RFC 7512 defines. The role assignment is the source doc's; the standards themselves are verified below.

## WebAuthn Level 2, verified by dig

The W3C Recommendation text lives at https://www.w3.org/TR/webauthn-2/ (jev weight 0.96) and defines the authentication ceremony, including section 7.2 on verifying an authentication assertion, which is initiated by the relying party. The W3C's own news announcement states that the Web Authentication Working Group published Level 2 as a Recommendation on April 8, 2021 (https://www.w3.org/news/2021/web-authentication-an-api-for-accessing-public-key-credentials-level-2-is-a-w3c-recommendation/, jev weight 0.87), which corroborates the source doc's "W3C Recommendation, 2021" dating.

The specification is developed in the W3C WebAuthn Working Group repository at https://github.com/w3c/webauthn/ (jev weight 0.7), which is the working source for drafts and issues. Weaker backing on the same subject: the Wikipedia overview (https://en.wikipedia.org/wiki/WebAuthn, jev weight 0.35, weak) describes WebAuthn as a W3C-published web standard defining an API; it is recorded but not relied on.

## CTAP 2.1, from the source doc

The source doc cites CTAP 2.1 as a FIDO Alliance Proposed Standard dated 2021 at https://fidoalliance.org/specs/fido-v2.1-ps-20210615/ [source doc]. The dig confirms the FIDO Alliance maintains an official specifications download page that grants access to its authentication specifications and implementation guides (https://fidoalliance.org/specifications/download/, jev weight 0.89), which is where CTAP documents are published. The dig did not independently fetch the CTAP 2.1 document body itself; the version and date claims are carried by the source doc.

## RFC 7512, verified by dig, with a dated correction

The RFC Editor info page for RFC 7512 (https://www.rfc-editor.org/info/rfc7512/, jev weight 0.95) and the IETF Datatracker document page (https://datatracker.ietf.org/doc/html/rfc7512.html, jev weight 0.94) both identify RFC 7512, "The PKCS #11 URI Scheme", as an April 2015 Standards Track RFC. The scheme defines URIs that identify PKCS #11 (Cryptoki) objects and libraries; the document text explains that attributes identifying a Cryptoki library include library attributes, and the URI form is specified with ABNF per RFC 5234 (https://www.rfc-editor.org/rfc/rfc7512.html?format=txt, jev weight 0.95).

Dated correction, 2026-10-06: the source doc attributes RFC 7512 to "Pechanec, J. & Moustakas, D." The dig shows the actual authors as J. Pechanec and D. Moffat, of Oracle, on the Datatracker page (https://datatracker.ietf.org/doc/html/rfc7512.html, jev weight 0.94). The datatracker draft page for the predecessor draft also reads "J. Pechanec ... D. Moffat" (https://datatracker.ietf.org/doc/draft-pechanec-pkcs11uri/, jev weight 0.35, weak). The "Moustakas" attribution in the source doc appears to be a citation error; downstream readers citing yubiOS should cite RFC 7512 as Pechanec & Moffat, per the RFC Editor record.

Weak-backing results (labeled as such, jev weight under 0.5): the Internet Archive mirror of the RFC text (https://archive.org/details/rfc7512, 0.22), an unofficial RFC aggregator (https://rfcinfo.com/rfc-7512/, 0.11), and one entirely off-topic forum result recorded for provenance only.

## Why these 3 standards and not others

The source doc's selection is narrow and deliberate: one browser API (WebAuthn), one authenticator-side protocol (CTAP), and one token-URI scheme (RFC 7512). The first 2 cover the FIDO2/WebAuthn user-presence path that yubiOS documents elsewhere; the third covers the PKCS #11 URI syntax that appears wherever yubiOS points tooling at a YubiKey token object, such as UKI signing with systemd-sbsign. The source doc does not cite FIDO2's UAF protocols or the older CTAP 2.0 revision, and this corpus does not add them. [source doc: yubi-OS/yubiOS docs/CITATION.md]
