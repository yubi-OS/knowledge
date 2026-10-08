# 05. From-domain verification before the first send

**Scope.** Why the from address is the one input this connection cannot self-verify, how a failed domain surfaces in the send error, and the human confirmation step the source doc mandates.

## The asymmetry

The source doc states the problem in one sentence: if a `from` address fails domain verification, the error names it, but the key cannot list verified domains, so confirm the sender domain with the user before the first real send. The asymmetry is structural. The send endpoint will happily reject a bad from address at send time, but the only read path that could enumerate valid domains (`GET /domains`) returns the restricted_api_key signature on this connection (doc 02). There is no API-side way to look before you leap.

## What a verified domain means on the platform

Resend sends email using a domain you own, not a shared or public domain, and the platform requires adding and verifying at least one domain before sending (https://resend.com/docs/dashboard/domains/introduction, weight 0.93). The verification flow is documented in the knowledge base: add the domain to Resend, copy the required DNS records, add those records at your DNS provider, and wait for verification to complete, which often finishes within minutes when done correctly (https://resend.com/docs/knowledge-base/what-if-my-domain-is-not-verifying, weight 0.93). The add-a-domain guide notes that the DNS records verify both ownership of the domain and the permission to send and receive email for it (https://resend.com/docs/add-a-domain, weight 0.94).

A community question about gmail.com as a from domain illustrates the failure case from the other side: the from address must correspond to a domain you have verified, for example an address on example.com after its MX and TXT records are in place at the DNS provider (https://stackoverflow.com/questions/77937829/how-do-i-get-gmail-com-domain-verified, weight 0.08, weak backing, cite only as an illustration of the wrong move).

## Why the confirmation is a human step

Three reasons converge. First, the API cannot tell you what is verified, so the information has to come from the user or the Resend dashboard. Second, a first real send that bounces on domain verification is a failed external action: the recipient saw nothing, but the failure is public in the sense that an email was attempted under the user's name. Third, guessing is the worst option, because a plausible-looking domain that is unverified produces an error only after the fact.

## The operational rule

Before the first real send on this connection:

1. Ask the user which from address to use, and confirm that its domain is verified in their Resend account.
2. Record the confirmed address so later sends reuse it instead of re-deriving it.
3. On any send failure that names the from address, stop and re-confirm with the user rather than retrying with a variant address.

The error-signature side of this, including where the domain failure sits in the error table, is consolidated in doc 08.
