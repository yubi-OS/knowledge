# 01 - The /run call contract

Scope: the exact shape of a shell-bridge call: URL, method, body, credential injection, response, and the argv-array rule that keeps remote execution predictable.

## One call shape, both boxes

The source doc (yubi-OS/yubiOS skills/shell-bridge-connection/SKILL.md) fixes a single call shape for rock1 and ubuntu alike:

```
curl -sS -m 30 -X POST https://<host>.tail3a04f5.ts.net/run \
  -H "Content-Type: application/json" \
  -d '{"command":["bash","-lc","<remote shell>"]}'
```

Three properties of this contract matter every time you reach for it: credential injection is automatic, the command is an argv array, and the response has exactly three keys.

## Credential injection is automatic, never manual

Always pass the connection in the tool's connections param; the Sauna proxy injects the Bearer token (source doc). The connection ids are `conn_ai5iXWquRX0s` for ubuntu and `conn_W36n4EetFoNp` for rock1 (source doc). Never hand-write an Authorization header in a proxied call: the proxy owns credential injection, and hand-written headers either duplicate or clobber it.

The one sanctioned exception is a deliberate diagnostic test with injection disabled, using the `X-Sauna-Connection-Id: none` opt-out (source doc, diagnostics section). That exception exists for exactly one purpose: testing a known token directly when the stored connection row is suspect (doc 04).

## The argv-array rule

Compound shell MUST be `["bash","-lc","..."]` because the bridge passes the command array to `subprocess.run` verbatim, with no shell interpolation (source doc). This is not a stylistic preference; it is the exact semantics of the Python subprocess API. The official subprocess documentation defines `subprocess.run(args, ...)` such that when args is a sequence, it is passed directly to the target program without an intermediate shell unless `shell=True` is set (https://docs.python.org/3/library/subprocess.html, jev weight 0.68). The bridge is a ~50 LOC stdlib Python server (source doc), so the list-vs-string distinction is the whole safety model: a JSON array element is one argv slot, never a parseable shell string.

Two failure shapes follow from getting this wrong:

- Passing a single string like `"echo hi && uname -a"` as the command would be handed to `subprocess.run` as one argv element, which is not an executable file: the call fails at the OS level rather than doing something dangerous.
- Piping, redirection, and `&&` chains work ONLY inside the `bash -lc` payload, because bash is the program doing the interpretation, not the bridge.

Weakly weighted corroboration of the list-args semantics exists in tutorial coverage: Real Python's subprocess walkthrough (https://realpython.com/python-subprocess/, weight 0.36) and GoLinuxCloud's subprocess.run guide (https://golinuxcloud.com/python-subprocess/, weight 0.14, weak backing). Cite these sparingly; the official docs carry the claim.

## What comes back

The endpoint returns a JSON object with exactly three keys: `stdout`, `stderr`, and `returncode` (source doc). `GET /run` returns 501 because the endpoint is POST-only (source doc); that also makes GET a free liveness control (doc 04).

Two operational consequences follow:

1. Head or tail every output before it reaches chat context. The source doc says "head/tail all outputs", and this is a hard rule when a build log can be megabytes. Wrap remote commands accordingly: `journalctl -u shell-bridge | tail -50`, not `journalctl -u shell-bridge`.
2. The 30 second timeout in the canonical call (`curl -m 30`) is part of the shape (source doc). A hung remote command burns exactly 30 seconds, not your whole session. For intentionally long work, raise the timeout deliberately on that one call and say why in the message.

## A worked minimal call

The ping-before-push pattern (doc 07) is the smallest instance of the contract:

```
curl -sS -m 30 -X POST https://rock1.tail3a04f5.ts.net/run \
  -H "Content-Type: application/json" \
  -d '{"command":["bash","-lc","echo alive"]}'
```

Expected body: `{"stdout":"alive\n","stderr":"","returncode":0}`. Any deviation maps to the diagnostic table in doc 04.

## HTTP framing notes

The call is a plain HTTP POST with a JSON body; curl's `-d` flag sends the request body and pairs with the explicit Content-Type header. The MDN HTTP overview grounds the general request/response framing (https://developer.mozilla.org/en-US/docs/Web/HTTP, weight 0.13, weak backing), and a Stack Overflow answer shows the bash-side curl POST pattern (https://stackoverflow.com/questions/53943485/sending-post-request-from-bash-script, weight 0.08, weak backing). These are weak sources; the load-bearing statements about the contract come from the source doc.

## What this doc does not cover

Host-specific facts (which box runs what), auth failure diagnosis, and token file locations are covered in docs 02, 04, and 06. This doc is deliberately host-agnostic: if a third box joins the tailnet, this contract transfers unchanged.
