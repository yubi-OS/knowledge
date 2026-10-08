# 04. The POST /emails request shape

**Scope.** The one endpoint this connection can call: the URL, the JSON body fields, the to field's two accepted forms, the success response, and the extras the official reference documents around it.

## The endpoint and body

The source doc fixes the call: `POST https://api.resend.com/emails` with a JSON body of `{ "from", "to", "subject", "html" }`. The third-party quick reference confirms the same field set and adds two details: for multiple addresses the to field is sent as an array of strings, and `html` is optional because a `text` body field exists as an alternative (https://apicheats.dev/resend/emails-send, weight 0.13, weak backing, cite only as corroboration for the array form).

The official send-email API reference is the strongest source for this endpoint (https://resend.com/docs/api-reference/emails/send-email, weight 0.95). It documents the same core parameters and adds an idempotency-key mechanism worth knowing before any automated send: an idempotency key should be unique per API request, keys expire after 24 hours, and the maximum length is 256 characters.

## The to field: string or array

The source doc states it directly: `to` can be a string or an array. The weak-backed quick reference agrees on the array form for multiple addresses. Operationally this means a single-recipient send and a multi-recipient send share one body shape, differing only in whether `to` is wrapped in brackets. There is no separate endpoint to learn.

## The success response

On success the endpoint returns an object containing an `id` (source doc). That `id` is the entire receipt this connection can produce for a send. There is no read endpoint to confirm delivery or to fetch the message back, because the key is send-only (docs 02 and 07). Treat the `id` as the artifact to log: it is what a human can search for in the Resend dashboard later, since the API cannot retrieve it again.

## Related surface from the digs

Two adjacent mechanisms showed up in the dig and are worth a line each. Upstash QStash's Resend integration passes the same parameter set (from, to, subject, html) to the Send Email API and exposes Resend's separate Batch Email API for multiple distinct messages (https://upstash.com/docs/qstash/integrations/resend, weight 0.68). The batch endpoint is a real Resend feature but is outside this connection's tested path; the source doc covers only the single-send shape, so treat batch sending as unverified for this key until exercised. Separately, resend.dev is a domain for simulating send scenarios in testing instead of using a real personal inbox (https://resend.dev/, weight 0.85); the source doc does not use it, but it names the test-sending option that exists on the platform.

## What the digs did not establish

The dig results do not document the full parameter catalog (cc, bcc, attachments, scheduled sends, and similar fields appear in Resend's wider documentation but were not captured in these dig snippets). Per the no-invention rule, this doc records only what the source doc and the cited dig results state: the four core fields, the two forms of `to`, the id-on-success response, and the idempotency-key mechanics from the official reference.

## The one-line rule

One endpoint, four core fields, two forms of `to`, an `id` back on success, and an optional idempotency key for automated sends.
