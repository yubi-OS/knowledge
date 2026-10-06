# Deliverability, Authentication, and Compliance

Scope: the deliverability layer the source doc routes to its deliverability.md reference: SPF, DKIM, and DMARC authentication, bounce handling, suppression, and the transactional-only scope rule.

## What the source doc commits to

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) gives deliverability one row in its table ("Improve deliverability, avoid spam folders", pointing at deliverability.md for "Authentication, content, compliance") and 4 relevant rows in its mistakes table (source doc):

1. Missing `text` field (HTML only): "Some email clients only show plain text; also helps spam scores. Always include both `html` and `text` versions."
2. Using email for marketing/bulk sends: "Email Service is for transactional email only. Use a dedicated marketing email platform for newsletters and campaigns."
3. Testing with fake addresses: "Bounces from non-existent addresses hurt sender reputation. Use real addresses you control during development."
4. Forwarding to unverified destinations (routing side, covered in the routing doc of this corpus).

The transactional-only scope is a platform-classification rule, not a tip: newsletters and campaigns belong on a dedicated marketing platform, and the deliverability consequences of bulk-sending from a transactional identity are exactly the reputation damage the fake-address row warns about.

## DNS authentication records

The dig grounds the SPF/DKIM/DMARC layer in Cloudflare's own docs. The DMARC Management docs page states: "Learn how to configure SPF records, DKIM records, and DMARC records in your Cloudflare account to help improve email security" (w 0.84, https://developers.cloudflare.com/dmarc-management/security-records/), revised May 5, 2026. The DNS email-records page adds the DNS-level mechanics: "To send and receive emails from your domain, you need an SMTP provider. Then, create two DNS records within Cloudflare" (w 0.91, https://developers.cloudflare.com/dns/manage-dns-records/how-to/email-records/), revised Apr 16, 2026.

Two weights stand out. The DMARC page at 0.84 and the DNS page at 0.91 are official Cloudflare documentation and clear the 0.5 threshold, but they describe the general email-records discipline for any sending setup rather than the Email Sending product's own onboarding flow (which the prerequisites doc of this corpus covers, including the `cf-bounce` MX records Cloudflare provisions at onboarding, w 0.96). The practical synthesis: Email Sending's onboarding handles the bounce-routing DNS automatically, while SPF, DKIM, and DMARC records are the sender's standing authentication posture and remain the operator's responsibility to verify.

## Bounces and suppression

The source doc's bounce-related guidance is operational and dev-specific: never test with fabricated addresses (source doc). The dig's general deliverability sources on bounce handling and spam avoidance scored below the 0.5 threshold (third-party ESP blogs and marketing pages), so this corpus does not import their specific practices; the load-bearing rules stay the source doc's: use real addresses during development, treat `permanent_bounces` in the REST response as hard failures (the response shape is documented in the REST API doc of this corpus), and keep the sending identity clean of bulk traffic.

What the REST response shape implies about suppression: because a single send returns `delivered`, `permanent_bounces`, and `queued` arrays (source doc), an application that records its own suppressions can act directly on `permanent_bounces` entries without waiting for a webhook. The source doc does not document a suppression-list API; applications that need one should retrieve the current state from the Cloudflare docs per the skill's retrieval-first rule (source doc).

## Content practices

The load-bearing content rule from the source doc is the html-plus-text pairing (source doc): always include both versions, because some clients show only plain text and the missing text part hurts spam scores. The Cloudflare API reference corroborates the floor: a send requires "at least one of text or html" (w 0.96, https://developers.cloudflare.com/api/resources/email_sending/methods/send/), which means the API permits the exact mistake the skill warns against; the skill's stricter rule is a deliverability practice, not an API constraint, and that distinction is worth keeping sharp when writing validation logic.

## The compliance axis

The source doc's deliverability reference covers "Authentication, content, compliance" (source doc) as its 3 axes. Of these, the dig gave strong backing to authentication (the DMARC and DNS pages above). Content is covered by the html/text rule. Compliance (CAN-SPAM/GDPR-style obligations) is named as an axis but no high-weight dig source was collected for it, so this corpus records it as a gap: the source doc's deliverability.md reference is the intended home for compliance guidance, and it was not expanded here without a citable source.

## Backing summary

2 of the 12 collected results for this subtopic scored 0.5 or higher: the DMARC Management security-records page (0.84) and the DNS email-records page (0.91). This was the weakest dig of the corpus. The 10 low-weight results (third-party deliverability guides, a dictionary entry, self-hosting blogs) were excluded. The doc therefore leans on the source doc for its operational rules and cites the 2 high-weight official pages for the DNS authentication layer only.
