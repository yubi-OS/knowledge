# 08. Error signature reference

**Scope.** A consolidated table of the error signatures this connection can produce, what each one means, whether it is expected, and the correct response.

## The table

| Signature | HTTP | Meaning | Expected on this connection? | Correct response |
| --- | --- | --- | --- | --- |
| `name: restricted_api_key`, message "This API key is restricted to only send emails" | 401 | Key is valid and authenticated but the endpoint needs a broader scope (source doc) | Yes, on read endpoints (doc 02) | Treat as a health check pass; proceed with sends, do not fix |
| "Missing API key in the authorization header" | 401 | Request arrived with no credential; the proxy did not inject (source doc, phrased as missing/invalid token) | No | Add the connections array to the call (doc 06) and retry |
| Error naming the `from` address on send | 422-class | From address domain is not verified (source doc) | No, and it must not be retried blind | Stop and confirm the sender domain with the user (doc 05) |
| "Too many requests. Please limit the number of requests per second." | 429 | Rate limit hit (https://www.resend.com/docs/api-reference/errors, weight 0.91) | No, at this connection's volume | Back off and reduce request rate |

## The three 401 cases, read apart

Resend's errors reference is the authoritative source for the 401 family (https://www.resend.com/docs/api-reference/errors, weight 0.91). It pairs the restricted-key case with the missing-key case, and the distinction carries all the diagnostic weight in this workspace: a restricted_api_key body proves the proxy injected a working credential (doc 03), while a missing-key body proves it did not, pointing at the passthrough step rather than the key itself (doc 06). The header shape behind both is documented in the API reference introduction: Bearer re_xxxxxxxxx (https://resend.com/docs/api-reference/introduction, weight 0.85). A third-party taxonomy lists the no-header and non-Bearer-header variants as the common real-world causes of the missing-key family (https://genace.ai/errors/missing-api-key, weight 0.05, weak backing, cite only as a checklist hint).

## The send-time failure

The domain-verification failure is the one error that arrives on the send path itself. The source doc records that it names the failing from address. It is the only signature that indicates a problem with the message rather than the credential, and it cannot be resolved by retry logic because the fix is a human step: verifying a domain at the DNS provider and in Resend, which the platform documents as add domain, copy DNS records, apply at the DNS provider, wait for verification (https://resend.com/docs/knowledge-base/what-if-my-domain-is-not-verifying, weight 0.93).

## Rate limiting

The errors reference documents the 429 case with a suggested action to read the response headers and reduce the request rate, possibly introducing a queue (https://www.resend.com/docs/api-reference/errors, weight 0.91). A community guide on Resend error handling recommends wrapping sends in error handling and treating rate limits as a distinct branch (https://medium.com/@koriigami/transactional-emails-with-resend-in-next-js-9364423f84d3, weight 0.16, weak backing). At Stable Orbit's transactional volume this signature is unlikely, but automated loops should still pace sends.

## Classification habit

Match on the `name` field and the message, in that order: `restricted_api_key` is green, a missing-key message is a caller bug, a named from address is a domain problem, and 429 is pacing. Everything else on this connection is undocumented for this key and should be surfaced to the user rather than guessed at.
