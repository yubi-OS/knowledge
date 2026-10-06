# 08. Errors and failure handling

Scope: the two exception contracts the client raises, the documented error bodies, and the network-block case with its prescribed fix.

Internal-record subtopic, no dig: the error contracts come from the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md, and every claim below is attributed to it.

## The two exception contracts

The source doc defines two exceptions, raised at different points in the call lifecycle:

1. **RuntimeError("DefAPI <status>: <body>")** on HTTP errors. This is the server-side or network-side failure surface: any non-success HTTP status comes back as a single RuntimeError whose message carries the status code and the response body. Because the body is in the message, the error text is the diagnostic: a caller catching RuntimeError gets the full response payload, not just a status.
2. **ValueError for malformed questions**, raised before any request is sent. This is the client-side validation surface: a question with a missing criteria payload where criteria are required, a score list outside the 2 to 10 level bound, or a structurally invalid question fails locally and cheaply, with zero network traffic and zero spend.

The split is worth internalizing: ValueError means fix your request document; RuntimeError means inspect the status and body and decide between auth, network, and upstream causes.

## The documented error bodies

The source doc documents two concrete failure modes:

- **401 {"code": 1007, "message": "Invalid Api Key"}**: the key is missing, wrong, or revoked. Given the setup rule that DEFAPI_API_KEY lives in the environment, the checklist for this error is short: is the variable exported in this shell or process, does it hold a current dk- prefixed key, and has it been revoked since the last successful call. Because the client reads the key from the environment at call time, fixing it is a configuration change, not a code change.
- **Connection refused or proxy 403**: api.defapi.org is blocked by the network. The source doc's instruction is explicit and worth quoting in substance: ask for the host to be allowed rather than working around it. The prescribed fix is an allowlist change, not a proxy bounce, a mirror host, or a retry loop. This matters for integrators on locked-down CI runners and corporate egress: the failure is environmental, the remedy is organizational.

Anything else that surfaces as a RuntimeError with a status and body is upstream behavior; the body is the diagnostic and the retry decision belongs to the caller's policy.

## Failure handling in practice

A robust integration around this skill has three layers of handling, each mapped to a contract:

- **Request construction**: let the ValueError contract do its job. Validate early, fail fast, and treat any ValueError in a batch loop as a bug in the request generator, not a transient condition to retry. Retrying a malformed question is wasted spend on a request that will always fail.
- **Transport and auth**: catch RuntimeError, branch on the status. A 401 with code 1007 is non-retryable until the environment is fixed. A connection error against api.defapi.org is non-retryable until the allowlist is fixed. Neither is solved by retrying.
- **Transient conditions**: rate limits and 5xx-class responses are the retryable class. The yubiOS minting workflow that produced this corpus applies a REDO discipline to exactly this class: on a 429 or 5xx, sleep 30 seconds and resend, up to 3 attempts, splitting the batch smaller on retry (recorded in the yubi-OS/yubiOS skills/knowledge-corpus-mint/MINT-BRIEF.md workflow). A decision-model failure is treated as a failed step to redo, never as a reason to ship an unmade decision. That discipline is the practical answer to "what if the decide call fails mid-batch": redo the batch, and if it still cannot complete, the affected work is skipped and recorded as a gap rather than filled with a guess.

## What the errors section does not cover

Three boundaries the source doc's errors section leaves to the caller:

- **Timeouts** are not named; the client raises on HTTP errors, and a hung connection is the caller's timeout policy to set.
- **Response validation** after a 200 is not handled by the errors section; a caller should still check that the expected question keys exist in the answers map before reading fields off them.
- **Retries are not built in.** The client raises; the caller decides. The REDO discipline above is one policy, not the client's behavior.

The pointer at the end of the source doc's errors section, "See references/api.md for the full request and response schema", is the escalation path: when an error body does not match the two documented shapes, the full schema in the skill's references directory is the next place to look, and the error message itself (status plus body) is what to compare against it.
