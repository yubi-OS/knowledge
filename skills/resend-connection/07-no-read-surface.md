# 07. No readable account data: not a sweep surface

**Scope.** Why this connection must never be included in a connection sweep or treated as a data source: there is no inbox, no send history, and no account state reachable through the API.

## The rule

The source doc states it plainly: there is no readable account data on this connection (no inbox, no send history via API), so it is not a connection-sweep surface. A connection sweep, the routine pass over connected services that inventories what each account can see and act on, has nothing to inventory here. The only capability is sending.

## What the API cannot return

Three reads are structurally absent on this key, each documented in the source doc and each backed by the restricted_api_key signature on read endpoints (doc 02):

1. `GET /emails` would be the send-history read; it returns the 401 restricted_api_key body instead.
2. `GET /domains` would enumerate verified sender domains; same 401.
3. `GET /api-keys` would list keys; same 401.

The dig corroboration is the official errors reference, which documents the 401 restricted key case as platform behavior (https://www.resend.com/docs/api-reference/errors, weight 0.91), and the create-api-key reference, which shows the sending_access permission level that produces it (https://resend.com/docs/api-reference/api-keys/create-api-key, weight 0.93). A send-only key is a designed permission level, so its blindness to account data is a platform guarantee, not an accident of this account.

## What replaces the read-back

Because no read confirms what happened, the send response's `id` is the only receipt (doc 04). Operational substitutes:

- Log the `id`, the from address, the subject, and the timestamp at send time; that local log is the send history.
- For anything a human needs to check (did it arrive, did it bounce), the Resend dashboard is the surface, reached by the user, not through the API.
- Delivery diagnostics are out of scope for agents acting through this connection.

## Why sweeps must exclude it

Including a connection in a sweep normally means probing its read endpoints and summarizing what comes back. For this connection every probe returns the same signature and yields zero data, so a sweep adds noise without information and risks the misreading documented in doc 03, where the 401 gets treated as a broken connection and escalated. The source doc closes the loop: do not "fix" the reads, because the connection was provisioned send-only on purpose.

The practical check an agent should run instead of a sweep is the single health probe from doc 03, and even that only on first contact or on suspicion of credential drift. It confirms the credential path, after which the connection's story is complete: send, log the id, stop.
