# 09: Anchor threat model: possession, knowledge, and the server

Scope: what it means for a YubiKey to be the sole anchor at a boot-time boundary, the factor taxonomy behind the passphrase rejection, the touch requirement as an anti-coercion surface, and the boundary between authorisation to the machine and identity to a remote service.

## The factor taxonomy

Authentication factors divide into knowledge, possession, and inherence. Okta's factor-types brief states the ranking plainly: knowledge-based factors are considered weaker than possession or inherence-based factors (source: https://www.okta.com/sites/default/files/2024-05/factor-types-assurance-levels.pdf , jev noul 0.69). The source problem family's rejection of passphrase-only is an application of that ranking at the boot boundary: a passphrase is a knowledge factor, and the source sharpens the weakness into its worst case, that the anchor becomes something the owner can be compelled to say.

FIDO2's own security story strengthens the possession side of the ledger. Microsoft's security primer describes FIDO2 as strengthening security through phishing-resistant cryptographic authentication (source: https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2 , jev noul 0.86), and Yubico's FIDO2 guide frames passkeys as eliminating password vulnerabilities (source: https://www.yubico.com/authentication-standards/fido2/ , jev noul 0.84). Applied to disk unlock, the possession factor does not merely authenticate; it derives the unlock secret, so the secret never exists as a tellable string.

## The hmac-secret shape and the touch surface

The mechanism behind the anchor is credential-scoped derivation: Yubico documents that the hmac-secret and hmac-secret-mc extensions enable creation of a symmetric secret value scoped to a credential, depending on firmware version (source: https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html , jev noul 0.85). The volume stores a salt and a wrapped key, and the token produces the unwrap input only when challenged, meaning the machine never holds the secret while powered off.

The touch is the human-verification surface on that challenge. The tooling ecosystem treats touch as a distinct, configurable property rather than an accident: Nitrokey's support forum discusses enabling required touch specifically for hmac-secret operations, with community tooling built to add the option where native support is missing (source: https://support.nitrokey.com/t/how-to-enable-required-touch-for-hmac/6345 , jev noul 0.52). The hmac-secret tooling world confirms the passphrase-plus-token composition is a recognized pattern: the fido2-hmac-secret project generates passphrase-protected secrets from a FIDO2 authenticator with hmac-secret support, which is the model where knowledge gates possession rather than replacing it (source: https://github.com/dido/fido2-hmac-secret , jev noul 0.51).

## Authorisation to the machine versus identity to a service

The problem family draws the boundary that this corpus keeps conflating. Cryptographic identity is about proving who you are to someone else, over the network, where FIDO2's phishing-resistance story applies in full. The boot boundary is about proving authorisation to the machine itself, offline, before any network exists. The same YubiKey serves both, which is why the two are easy to confuse but must not share a threat model: the boot boundary's adversary is someone with physical access to the powered-off machine, and the defense is that the unlock secret is derivable only from a device in the owner's pocket, verified by a touch the owner performs.

## What "sole anchor" commits to

Taking the YubiKey as the sole anchor commits to three properties, each grounded in the mechanism docs: possession over knowledge at the boot boundary (Okta's factor ranking, source: https://www.okta.com/sites/default/files/2024-05/factor-types-assurance-levels.pdf , jev noul 0.69), derivation rather than storage of the unlock secret (Yubico's hmac-secret docs, source: https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html , jev noul 0.85), and a removable, rotatable device rather than a soldered chip or a network server, which is the axis on which the TPM2 and Tang alternatives each lost.
