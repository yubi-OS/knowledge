# 02. The restricted_api_key error signature

**Scope.** The exact 401 body this connection returns on read endpoints, which endpoints trigger it, and why the signature is the expected behavior of a sending_access key rather than a fault to fix.

## The exact body

The source doc records the literal response that `GET /domains`, `GET /api-keys`, and `GET /emails` return on this connection:

```json
{"statusCode":401,"message":"This API key is restricted to only send emails","name":"restricted_api_key"}
```

Three fields matter: status 401, the `restricted_api_key` name, and the message that names the scope. Any agent or script that pattern-matches on the `name` field can classify this response in one comparison.

## Official corroboration

Resend's own errors reference lists this exact case: status 401, message "This API key is restricted to only send emails" (https://www.resend.com/docs/api-reference/errors, weight 0.91). So the signature the source doc records is the platform's documented behavior, not a quirk of this account. The same page pairs it with the other 401 case, a missing key in the authorization header, which is a different signature with a different fix (doc 03 and doc 08 cover the distinction).

## Why the key behaves this way

The key was created with sending-level permission. Resend's create-api-key API exposes a permission parameter and a domain restriction that applies when permission is sending_access (https://resend.com/docs/api-reference/api-keys/create-api-key, weight 0.93). The changelog entry for new API key permissions describes the two levels chosen at key creation, Full access and Sending access (https://resend.com/changelog/new-api-key-permissions, weight 0.84). A sending_access key simply has no authorization for read endpoints, so Resend answers with the restricted_api_key signature.

A third-party knowledge base describes the same mechanism from the consumer side: a 401 restricted_api_key means the key lacks permission for the action, and a send-email-only key cannot create, update, or delete domains, audiences, contacts, or campaigns (https://www.sendping.co/docs/kb/403-errors, weight 0.59).

## The read endpoints that trigger it

The source doc names three read endpoints that return the signature: `GET /domains`, `GET /api-keys`, and `GET /emails`. The practical consequence is that none of the account-inspection moves a broader key would enable are available here: no domain listing, no key enumeration, no send-history lookup. Requests to these endpoints are not worth retrying; the answer will not change with a different payload or a retry.

## Do not fix it

The source doc is explicit: this error is the health check, not a fault. The instinct to work around it, for example by requesting a broader key or by probing other read endpoints, is wrong on both counts. It destroys the diagnostic signal (doc 03) and widens the key's blast radius for no operational gain, because the workflow this connection exists for needs only the send path (doc 01).

## The one-line rule

A 401 with `name: "restricted_api_key"` on a read endpoint means the connection is working exactly as configured. Treat it as confirmation and move on to the send path.
