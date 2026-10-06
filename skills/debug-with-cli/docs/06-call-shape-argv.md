# 06 The call shape: argv, not shell

Scope: the POST /run request and response contract, and what the argv-only design costs and restores. Grounded in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md); the subprocess semantics are grounded in the Python standard library documentation.

## The request

From the Sauna sandbox with the connection passed:

```
curl -sS -X POST 'https://<node>.<tailnet>.ts.net/run' \
  -H 'Content-Type: application/json' \
  -d '{"command":["echo","hello"],"timeout":10}'
```

The response is `{"stdout": "hello\n", "stderr": "", "returncode": 0}`; on timeout the response is `{"error":"timeout","timeout":N,"stdout":"..."}` with HTTP 408 (source doc). `timeout` and `cwd` are optional body fields; `command` is required (source doc).

## Why argv

The `command` field is a JSON array of strings passed straight to `subprocess.run` with no `/bin/sh -c` interpretation (source doc). The Python subprocess documentation confirms the design intent of that call form: `run()` with a list argument and the recommended approach for all use cases it can handle (https://docs.python.org/3/library/subprocess.html, weak, weight 0.36). The security property is the source doc's own framing: no injection, no quoting hell, no `;`-versus-`&&` confusion (source doc). A string-shaped `{"command":"ls /; rm -rf /"}` is exactly the injection vector the argv gate prevents (source doc, anti-patterns).

## Restoring shell features, explicitly

The argv gate blocks pipes and shell operators at the bridge. The source doc documents 4 sanctioned ways to get them back:

- **Pipes**: not supported at the bridge. Run `["bash", "-c", "dmesg | head -20"]` if you must. Bash via argv is OK because `subprocess.run(["bash","-c","..."])` is still argv to bash, not a string to `sh -c` (source doc). The caller takes on the injection responsibility for the string they pass.
- **sudo**: `["sudo","-n","systemctl","restart","podman"]`. The `-n` non-interactive flag is critical; sudo would otherwise hang waiting for a password (source doc).
- **Per-call env vars**: not supported. The bridge inherits env from the parent process; to pass per-command env, extend the script to accept an `env` field (source doc).
- **Working directory**: the `cwd` field on the request body; default is `None`, the bridge's CWD (source doc).

The Python docs corroborate the mechanics the call shape relies on: `subprocess.run` raises `TimeoutExpired` when the timeout expires, and its timeout, capture_output, and text parameters drive exactly the bridge's response fields (https://docs.python.org/3/library/subprocess.html, weak, weight 0.34). Note both subprocess-docs results weighted below 0.5 in the dig; the response-shape claims themselves are sourced from the source doc, which specifies the 408 timeout shape directly.

## What this means in practice

The call shape makes every command self-describing and loggable: the argv array is the command. Wrappers that reconstruct a shell-safe string from argv (the TTY audit pattern in doc 07) exist precisely because the bridge stores and transmits argv. The pattern of passing `["bash","-c","..."]` is the sanctioned escape hatch, and the source doc's loading constraints keep the boundary fixed: do not extend the bridge to accept shell strings; the caller who needs pipes passes bash themselves and accepts the responsibility (source doc).
