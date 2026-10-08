# 06. Connection passthrough on every call

**Scope.** The mechanism that makes the whole connection work: passing the connection row explicitly on every request so the proxy injects the credential, and what happens when you forget.

## The rule from the source doc

The source doc ends with the operational instruction: pass the connection on every call, in the form

```
connections: [{ id: "conn_YBJp6OTaZ8ZX", name: "Resend (Steady Orbit, send-only)" }]
```

This is a workspace-mechanics rule, not a Resend rule. The Sauna proxy intercepts outbound requests and injects the stored credential for the connection, but only when the call declares that connection. The credential itself is never visible in the script; the placeholder-free pattern is to write ordinary request code and let the proxy add authentication.

## Why every call

The injection is per request, not per session. Two consequences follow. First, omitting the connection array does not produce a graceful error from the script; it produces a 401 from Resend, because the request arrives with no Authorization header at all. That is the missing-key signature from doc 03 and doc 08, and it is the one failure mode of this integration that is caused by the caller rather than the key. Second, an explicit declaration doubles as documentation: a reader of the script can see which identity is acting.

## The failure signature to recognize

When a call forgets the passthrough, the response is the missing-key 401: Resend's errors reference documents the message "Missing API key in the authorization header" with the suggested action to include an Authorization header of the form Bearer YOUR_API_KEY (https://www.resend.com/docs/api-reference/errors, weight 0.91), and the API reference introduction documents the header shape as Bearer re_xxxxxxxxx (https://resend.com/docs/api-reference/introduction, weight 0.85). In this workspace the fix is not to hand-build the header, which would require the raw key; the fix is to add the connections array to the tool call so the proxy performs the injection.

This is the mirror image of the health check in doc 03: a restricted_api_key 401 means injection worked, and a missing-key 401 means injection did not happen. Reading the two signatures apart is the single most useful diagnostic habit for this connection.

## Relation to the send path

The passthrough applies to every request that touches api.resend.com, including the health-check probe. The send call itself carries no extra headers beyond what the proxy injects; the body is the four fields from doc 04. A script that passes the connection correctly, sends to a verified from address, and reads the returned `id` has exercised the complete supported surface of this connection.
