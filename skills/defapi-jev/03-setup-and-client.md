# 03. Setup and client: key handling, network, and the smoke test

Scope: the three setup requirements and the client script the skill ships, plus the smoke test that proves the whole chain works before you build on it.

Internal-record subtopic, no dig: setup facts come from the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md, and every claim below is attributed to it.

## The three setup requirements

The source doc's setup section lists three things, in order.

1. **The API key must be in the environment.** `export DEFAPI_API_KEY="dk-..."`. Two rules attach to it: never hard-code it and never print it. The key is read from the environment at call time, so configuration belongs in your shell profile, your CI secrets store, or your process manager, never in a source file or a log line.
2. **Outbound HTTPS to api.defapi.org must be allowed.** The client talks to one host over one protocol. If the machine sits behind an egress allowlist, api.defapi.org has to be on it before anything else will work.
3. **The client is scripts/defapi_jev.py**, a Python 3 script with standard-library-only dependencies. No pip install, no virtualenv, no dependency resolution. Any Python 3 interpreter that can read the script can run it, which makes it safe to copy into CI images and minimal containers.

That is the whole setup surface. There is no account console to configure, no model download, and no local state file: the skill is stateless between calls, and every call carries its own state and questions.

## The client script

scripts/defapi_jev.py is the only client the skill ships, and it does three jobs:

- It reads the request (a JSON document with a state and a questions object) from a file or from stdin.
- It validates the questions locally before sending anything (the errors doc in this corpus covers the ValueError contract for malformed questions).
- It posts to the DefAPI decisions endpoint and prints the response, raising a RuntimeError with the status and body on HTTP errors.

Because the client is standard-library Python, integrating it is not limited to Python callers. A shell pipeline can curl or echo JSON into it; a Makefile can run it; a CI step can diff its output. The Python import path exists for callers who want the decide() function in process (covered in the calling-the-model doc in this corpus), but the CLI is the lowest-common-denominator interface.

## The smoke test

The source doc gives one command as the proof of setup:

```
python scripts/defapi_jev.py --demo
```

A correct setup returns an urgency score of 2, with the label "Blocking revenue". That single assertion exercises every layer at once: the key is present and valid (otherwise the endpoint returns 401), the network path to api.defapi.org is open (otherwise the connection fails), the client parses and validates its input, and the response shape carries a typed answer you can read programmatically.

Run the smoke test before writing any integration code against the skill. It converts "the credentials are probably fine" into a verified fact, and it takes one command.

## Hygiene rules worth keeping

Three practices fall out of the setup section:

- **Key rotation discipline.** Because the key is read from the environment on every call, rotating it is a configuration change, not a code change. Never let a key value leak into a script, a git history, or a CI log; the source doc's never hard-code or print rule exists to keep that path closed.
- **Network allowlists as the first suspect.** When calls fail with connection refused or a proxy 403, the source doc says the network is blocking api.defapi.org and the fix is to ask for the host to be allowed, not to work around the block. The errors doc in this corpus covers this failure mode in detail.
- **Statelessness as a feature.** Nothing in the setup persists decision history, so audit logging is the caller's job (the acting-on-results doc covers the task_id and consumed fields the response provides for exactly this).

## What setup does not include

For completeness, three things the source doc's setup section does not ask for: it does not ask for a model name at setup time (the model is fixed by the skill, jev-1.13), it does not ask for a regional endpoint or base-URL override (api.defapi.org is the only host), and it does not ask for any local database or cache. If an integration needs a model name, a custom endpoint, or persistence, those are caller-side concerns layered on top of the three setup requirements, not part of them.
