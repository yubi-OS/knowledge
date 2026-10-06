# 06 - The Network Debugging Workflow

Scope: the skill's capture, analyze, diagnose, fix and verify sequence for network issues, including the status-code to cause mapping.

Grounding spine: source doc yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (the "For Network Issues" workflow).

## The 4 steps

The network workflow is the most mechanical of the skill's three workflows because the instrument, the network monitor, produces a complete record of every request (source doc):

1. **CAPTURE.** Open the network monitor, then trigger the action. Order matters: the monitor must be recording before the action runs, or the failing request is simply absent from the capture.
2. **ANALYZE.** Six checks on the captured request: URL, method, and headers; whether the request payload matches expectations; the response status code; the response body; and timing (is it slow, is it timing out).
3. **DIAGNOSE.** Map the observed failure to a cause class: 4xx, 5xx, CORS, timeout, or missing request.
4. **FIX & VERIFY.** Fix the issue, replay the action, confirm the response.

## The diagnosis mapping

The skill's cause classes are mutually exclusive in a useful way: each one points at a different responsible component (source doc):

- **4xx** means the client is sending wrong data or hitting the wrong URL. The fix lives in the frontend code or in the contract the frontend believes it has.
- **5xx** means a server error; the browser capture is only the symptom, and the investigation moves to server logs.
- **CORS** failures are checked against origin headers and server configuration. A CORS failure is not a client bug and not exactly a server bug: it is a mismatch between what the server allows and what the browser requires, so the check is on the response headers (`Access-Control-Allow-Origin` and related) against the requesting origin.
- **Timeout** points at server response time or payload size: the request may be well-formed and the endpoint alive, just too slow for the client's patience.
- **Missing request** is the quietest failure: nothing appears in the monitor at all, which means the client code is not sending what you think it is sending. This is why the skill's analyze step includes "check if the code is actually sending it" as part of diagnosis (source doc).

Microsoft's troubleshooting documentation covers the 4xx/5xx diagnosis split from the server operator's side (https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/site-behavior-performance/troubleshoot-http-errors, jev weight 0.50), and Edge's network tool documentation describes the same inspect-network-activity workflow the skill's capture step relies on (https://learn.microsoft.com/en-us/microsoft-edge/devtools/network/, jev weight 0.47). Both are just below or at the weighting threshold and should be read as corroborating rather than primary; the workflow's authority is the source doc.

## What "verify" means for network fixes

The verify step replays the exact action that failed and confirms the response. Because the network monitor records everything, verification is unusually strong here: it can prove the fix at three levels at once, that the request is now correct (URL, method, payload), that the response is now correct (status, body), and that no duplicate or orphaned requests were introduced by the fix. The skill's test-plan discipline (doc 08) leans on this: its example test plan checks "Network should show PATCH /api/tasks/:id with { status: 'completed' }" as a per-step acceptance criterion (source doc).

## The console-network relationship

A failed network request almost always leaves a trace in the console as well, and the skill's console analysis patterns list "Failed network requests" under the ERROR level with the cause class "API or CORS issue" (source doc). In practice the two instruments triangulate: the console tells you that something failed and often why at the browser level (blocked, CORS, 404), while the network monitor tells you exactly what was sent and received. The UI bug workflow (doc 05) already includes console reading in its inspect step for this reason.

## Sources for this doc

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (primary source of record).
- https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/site-behavior-performance/troubleshoot-http-errors (jev 0.50)
- https://learn.microsoft.com/en-us/microsoft-edge/devtools/network/ (jev 0.47)
- https://www.devtoolsdaily.com/blog/debug-cors-browser-api-requests/ (jev 0.13, weak backing)
- https://headersnap.com/blog/debug-cors-errors-chrome/ (jev 0.13, weak backing)
- https://shotmark.dev/blog/developer-tools/network-request-debugging-for-frontend-devs (jev 0.13, weak backing)
