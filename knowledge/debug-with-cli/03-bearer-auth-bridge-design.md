# 03: The 50 line bearer auth bridge

Scope: the minimal stdlib Python bridge: `BaseHTTPRequestHandler`, `hmac.compare_digest` bearer check, `subprocess.run`, about 50 LOC, zero dependencies.

## Shape of the bridge

The bridge is a single Python file with no `pip install`, no Node, and no MCP framework. It uses only the standard library: `http.server` for HTTP, `hmac` for the token check, and `subprocess` for command execution (source record, refs/debug-with-cli, 2026-08-01, unweighted). The size constraint is deliberate. A debug tool you can read in one sitting is a tool you can audit in one sitting, and the security posture of the whole pattern rests on the bridge code being small enough to verify by eye (see doc 04 for the argv argument).

Python's `http.server` module provides exactly the pieces needed. `BaseHTTPRequestHandler` is the class you subclass to define how the server responds to specific HTTP requests, by implementing methods named after the verbs such as `do_POST` (source: https://docs.python.org/3/library/http.server.html, jev weight 0.96; corroborated at https://runebook.dev/en/docs/python/library/http.server/http.server.BaseHTTPRequestHandler, jev weight 0.28, weak). A common pattern is to implement `do_POST`, read and parse the request body as JSON, and respond with a JSON status and payload (source: https://stackoverflow.com/questions/41429172/python-basehttprequesthandler-respond-with-json, jev weight 0.23, weak). Where concurrency matters, `ThreadingHTTPServer` is identical to `HTTPServer` but handles requests in threads (source: https://docs.python.org/3/library/http.server.html, jev weight 0.96). The verified bridge accepts one command per request and blocks on `subprocess.run`, so plain sequential serving is adequate; a threaded server is the obvious upgrade if the bridge ever multiplexes callers.

## The bearer check

Every request must carry `Authorization: Bearer <token>`, and the comparison must not leak timing. Python's `hmac.compare_digest(a, b)` returns `a == b` using an approach designed to prevent timing analysis (source: https://docs.python.org/3/library/hmac.html, jev weight 0.98). Real Python's reference describes the module as HMAC over any fixed-size hash function from `hashlib`, accepting bytes and bytearrays (source: https://realpython.com/ref/stdlib/hmac/, jev weight 0.82).

The timing argument is worth stating because it is the whole reason to use the function. A plain `==` on strings short-circuits at the first differing byte, so the amount of time the comparison takes correlates with how many leading bytes match, which is a side channel an attacker can measure across many requests (source: https://runebook.dev/en/docs/python/library/hmac/hmac.compare_digest, jev weight 0.38, weak). `compare_digest` runs in constant time, independent of where the first mismatch is (source: https://runebook.dev/en/docs/python/library/hmac/hmac.HMAC, jev weight 0.54, weak).

This matches the standard webhook-auth recipe: use a shared-secret token and compare it with a constant-time compare such as `hmac.compare_digest` (source: https://github.com/shurugiken/webhook-auth-patterns, jev weight 0.64). The bridge applies the same recipe to a bearer header instead of a webhook signature: extract the `Authorization` header, split off the scheme, and pass the token plus the stored secret to `compare_digest`. On mismatch, return 401 with no detail about why.

## Response contract

The verified bridge returns a uniform JSON envelope: `{"stdout": "...", "stderr": "...", "returncode": N}` populated from `subprocess.run` with `capture_output` semantics (source record, unweighted). Callers branch on three error codes: 401 means the bearer was missing or wrong, 408 means the command exceeded the timeout field, and a 530 seen at the edge means the Funnel had no listening origin (see doc 02). Keeping the envelope uniform means the agent-side call site needs exactly one parser.

## What is deliberately absent

The bridge ships without: request logging (default off, so tokens and command contents are not persisted), per-call environment variables, shell interpretation, and any allowlist of permitted commands. Each omission is a decision, not an oversight. No logging protects the token and command stream from ending up in `/var/log`. No shell interpretation is the injection guarantee of doc 04. No allowlist keeps the 50-line budget honest; the token is the access control, and its hygiene is the subject of doc 07.
