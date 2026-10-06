# 07 - Safe Fallbacks and Instrumentation

Scope: the source doc's two recovery patterns (safe defaults, graceful degradation) and the add, remove, and keep lifecycle for debugging instrumentation.

## Safe fallback patterns

The source doc's fallback section targets time pressure explicitly: "When under time pressure, use safe fallbacks." It shows 2 TypeScript patterns:

- Safe default plus warning instead of crashing: a config getter that, when the environment variable is missing, logs a warning naming the key and returns a default value instead of throwing.
- Graceful degradation instead of a broken feature: a chart renderer that returns an empty state for empty data and, when rendering throws, logs the error and returns an error state instead of taking down the surrounding view.

Both patterns share a structure: catch or detect the degraded condition, emit a diagnostic, return a defined lower-functioning state. What they deliberately do NOT do is hide the failure silently; the warning and the error log are part of the pattern, which keeps the fallback diagnosable later. Resilience-pattern literature generalizes the second pattern as graceful degradation within broader microservice resilience design (https://www.geeksforgeeks.org/system-design/microservices-resilience-patterns/, weak backing, w 0.25).

The boundary to keep in mind: fallbacks are for time pressure and degraded-mode operation, not a substitute for the root-cause fix of doc 04. A config key that always falls back to a default is a bug being masked, and the warning log is what eventually surfaces it.

## Instrumentation lifecycle

The source doc's instrumentation guidelines define when to add logging (only when it helps), when to remove it, and what stays permanently.

Add instrumentation when:

- You cannot localize the failure to a specific line
- The issue is intermittent and needs monitoring
- The fix involves multiple interacting components

Remove instrumentation when:

- The bug is fixed and tests guard against recurrence
- The log is only useful during development, not in production
- It contains sensitive data (always remove these)

Keep permanently:

- Error boundaries with error reporting
- API error logging with request context
- Performance metrics at key user flows

The sensitive-data rule is unconditional; the other two removal conditions are conditional on the guard tests of Step 5 existing first. The permanent-keep list is the audit-facing residue of debugging: error boundaries and request-context logging are what make the next incident diagnosable.

Standard-library logging design supports the permanent-keep case: Python's logging module exists so that all modules can participate in logging, integrating your application's messages with third-party modules' messages into one application log (https://docs.python.org/3/library/logging.html, w 0.91). The same participation principle is why request-context API logging is on the keep list: context attached at log time is what makes cross-component traces reassemblable.

## Security constraint on log content

Instrumentation has a security face. The OWASP Logging Cheat Sheet directs that if log data is sent over untrusted networks, for collection or analysis, a secure transmission protocol should be used, and that the origin of event data should be considered for verification (https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html, w 0.68). For this skill that means debug logs you add mid-incident can become a leak channel: they carry payloads and environment detail, they often ship to aggregation systems, and they are exactly the content the "remove when done" rule exists to retire.
