# 04: Python script failure modes

Scope: the concrete failure modes the source doc documents for Python scripts: swallowed subprocess stderr, silent except Exception, path traversal, retry-without-idempotency, and secrets in error messages.

## FM-001: subprocess crash with stderr swallowed

The source doc records this as a HIGH severity, Possible probability mode: the caller sees CompletedProcess(returncode=0) even though the child crashed, because subprocess.run was called without check=True and without stderr capture. Detection is a subsequent operation failing with a misleading cause; recovery is re-running with logging enabled and restoring from known-good state; prevention is subprocess.run([...], check=True, capture_output=True, text=True) [source doc].

The Python subprocess documentation grounds the mechanism: when capture_output is true, stdout and stderr are captured, and check, timeout, input, and capture_output are parameters specific to subprocess.run rather than arguments passed through to the Popen constructor (weight 0.83, https://docs.python.org/3/library/subprocess.html) [primary]. The source doc's prevention pattern is therefore an API-backed fix: capture_output=True is what preserves the child's stderr for the parent's error path.

The anti-pattern reading is explicit in the source doc: a try or except block that swallows the error and continues is a silent-failure anti-pattern, not a recovery. Recovery narrows the type, logs, and either re-raises or recovers intentionally [source doc, Anti-patterns].

## FM-002: silent except Exception

Recorded HIGH, Likely in the source doc: except Exception: pass swallows the real error and continues with corrupt state. Detection is a downstream invariant violation or a WARN log line; prevention is an except that narrows the type, logs, and either re-raises or recovers intentionally [source doc]. The red-flag table lists try: ... except: pass in a file as a silent failure for which FM-NNN with severity CRITICAL is the only honest read [source doc, Red flags].

## FM-003: path traversal on user input

Recorded CRITICAL, Possible in the source doc: open(user_path) reads or writes outside the intended directory because os.path.join(base, user_path) was used without validation. Prevention: canonicalize and check resolve().is_relative_to(allowed_root) [source doc].

CWE-367 grounds the adjacent race: time-of-check time-of-use (TOCTOU) is a base-level weakness where the state of the resource changes between check and use (weight 0.88, https://cwe.mitre.org/data/definitions/367.html) [primary]. The source doc's TOCTOU anti-pattern, check the path then open it, is CWE-367, and the fix is an atomic open or create, handles, locks, or transactional conditional operations; without the fix the failure mode is not_handled at CRITICAL severity [source doc].

The Python os.path documentation notes that os.path.join and related manipulations do not canonicalize, and that resulting paths may be missing, inaccessible, contain links or loops, or traverse non-directories (weight 0.76, https://docs.python.org/3/library/os.path.html) [primary]. Canonicalization with realpath or resolve before the access check is the documented mitigation path.

## FM-004: retry without idempotency

Recorded HIGH, Possible in the source doc: a non-idempotent POST retried on a 5xx creates duplicate records with the same key. Detection is an idempotency lookup or duplicate counter; prevention is an Idempotency-Key header, a check before retry, and bounded retries with backoff and jitter [source doc]. Idempotency is a property of the operation, not the file: if neither safe-retry nor not_supported applies, the doc must say why a duplicate would be unsafe [source doc, Guidelines 6].

## FM-005: secret leaked via error message

Recorded MEDIUM, Uncommon: a log line or user-visible error contains the secret because the exception string interpolated it. Detection is a secret-scanning alert or log audit; recovery is rotate the secret and scrub log storage; prevention is structural redaction at the producer [source doc]. The source doc elevates this from a logging policy footnote to a failure mode in its own right: a log line containing a secret is a CRITICAL recovery failure mode (rotate, scrub, escalate) [source doc, Guidelines 8].

Weaker corroboration in this dig (Stack Overflow threads on capturing exit code and stderr, weights 0.11 and 0.12) is cited here as weak only and adds no independent claim beyond the primary subprocess documentation above.
