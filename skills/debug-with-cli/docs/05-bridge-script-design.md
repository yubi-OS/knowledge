# 05 The bridge script: design of the ~50 line server

Scope: the internals of `rock1-shell-server.py`, the Python stdlib HTTP server the source doc specifies verbatim. This is an internal-record subtopic, no dig: the script is quoted in full in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md), and every claim here is grounded in it.

## Shape

The script is a single stdlib-only Python file. Its imports are `json`, `os`, `hmac`, `subprocess`, plus `BaseHTTPRequestHandler` and `HTTPServer` from `http.server`. It listens on `127.0.0.1` and reads its port from `ROCK1_SHELL_PORT` (default 8080) and its token from the required env var `ROCK1_SHELL_TOKEN` (source doc). No dependencies, no pip install; the frontmatter compatibility line requires only Python 3.8+ stdlib (source doc).

## Request handling, line by line

`do_POST` implements the whole contract:

1. **Route check**: anything other than `POST /run` gets a 404 (source doc). The bridge has one route; there is no GET surface, no status page, no listing.
2. **Auth check**: the presented Bearer token is extracted from the Authorization header and compared against the stored token with `hmac.compare_digest` (constant-time, no timing leak, per the source doc's security model). A missing or wrong token gets 401 before any parsing or execution (source doc).
3. **Body parse**: the body is read by Content-Length and parsed as JSON; a malformed body gets 400 with the parse error (source doc).
4. **Command validation**: `command` must be a non-empty list whose every element is a string. Anything else gets 400 with the message "command must be non-empty list[str]" (source doc). This is the argv-only gate: a string command cannot even reach `subprocess.run`.
5. **Execution**: `subprocess.run(cmd, capture_output=True, timeout=int(body.get("timeout", 60)), cwd=body.get("cwd") or None, text=True)`. The response is `{"stdout": ..., "stderr": ..., "returncode": ...}` with status 200 (source doc).
6. **Timeout path**: `subprocess.TimeoutExpired` becomes `{"error": "timeout", "timeout": N, "stdout": ...}` with HTTP 408 (source doc). The default timeout is 60 seconds when the request does not set one.
7. **Any other error** becomes `{"error": repr(e)}` with HTTP 500 (source doc).

## Deliberate quietness

`log_message` is overridden to pass, so the base class's default per-request stderr logging is silent (source doc). The docstring and the loading constraints section agree: no request logging by default; enable journald capture of the bridge's stderr only if the threat model demands it, and command output is already captured in the response body, which is enough audit for most purposes (source doc).

## What the server does NOT do

Reading the script as specified, the bridge has no:

- per-command environment support (env is inherited from the parent process; extending the script with an `env` field is the source doc's suggested path), (source doc)
- shell interpretation (argv only, by construction), (source doc)
- concurrency hardening beyond what `HTTPServer` provides (single-threaded request serving), (source doc)
- token rotation logic (rotation is a manual ops procedure; see doc 10), (source doc)

Each omission is either a documented anti-pattern guard or a documented extension point. The loading constraints forbid closing the argv gap (do not extend the bridge to accept shell strings) while explicitly permitting the env-field extension (source doc).

## Startup

The `__main__` block prints one line (`rock1-shell-server listening on 127.0.0.1:<PORT>`) and calls `serve_forever` (source doc). Combined with the nohup wrapper in doc 03, the deployment is: env sourced from `/etc/rock1-shell.env`, output appended to `/var/log/rock1-shell.log`, process backgrounded (source doc).
