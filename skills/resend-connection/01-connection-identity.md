# 01. Connection identity and scope

**Scope.** What the Resend connection in this workspace actually is: one connection row, its auth type, when it was added, and why the send-only restriction defines everything the skill can and cannot do.

## The connection row

The ground source (yubi-OS/yubiOS skills/resend-connection/SKILL.md, fetched 2026-10-08) names exactly one connection row: `conn_YBJp6OTaZ8ZX`, displayed as "Resend (Steady Orbit, send-only)", auth type api_key, added 2026-09-19. Its stated purpose is transactional email sending for the Stable Orbit consultancy. That single row is the whole identity of this integration. There is no second Resend account, no fallback key, and no other credential path in this environment.

## What Resend is

Resend describes itself as an email platform for developers: deliver transactional and marketing emails at scale, with a simple interface and SDKs for common programming languages (https://resend.com/, weight 0.78). The product surface relevant to this connection is the email API. The account-level surfaces, such as the dashboard, domain management, and key management, are reachable through the web console, not through this key.

## Send-only by design

The stored key is a restricted key with only the send-email scope (source doc). Resend's own API surface supports exactly this narrowing. The create-api-key reference documents a permission parameter plus a domain field used when the permission is set to sending_access (https://resend.com/docs/api-reference/api-keys/create-api-key, weight 0.93). The changelog entry for new API key permissions records that key creators choose between Full access and Sending access, and that Sending access can optionally be restricted to a specific domain (https://resend.com/changelog/new-api-key-permissions, weight 0.84). A third-party writeup describes the same split in plain terms: full access is admin level over every resource in the account, while sending access can only send emails (https://www.getfluxly.com/blog/resend-api-key-permissions, weight 0.14, weak backing, cite only as corroboration).

The local key therefore sits at the narrower permission level. Everything in this corpus follows from that single fact: the send path is live, and every read path returns a signature error instead of data.

## Why the restriction is a feature here

Two reasons, both from the source doc. First, least privilege: a key that can only call the send endpoint cannot be abused to read account state, enumerate keys, or mutate domains if it leaks. Second, diagnostics: the narrow scope produces a distinctive, predictable error on any read endpoint, and that error doubles as a health check for the whole credential path (see doc 03). A full-access key would be quieter on both counts: no signal on misconfiguration, and a bigger blast radius if the key ever escaped.

## Operating envelope

For Stable Orbit workflows the envelope is small and deliberate:

1. Build an email with `from`, `to`, `subject`, and `html`.
2. Send it through `POST https://api.resend.com/emails` with the connection passed on the call (doc 06).
3. Treat the returned `id` as the only receipt the connection can give you.

The from address must belong to a verified sender domain. Because this key cannot list verified domains, confirming the sender domain is a human step that happens before the first real send (doc 05). Nothing else in the Resend account is reachable from this connection, and that is by design, not a defect.
