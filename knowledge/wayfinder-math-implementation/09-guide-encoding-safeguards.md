# 09 Guide and encoding safeguards

Scope: the copyable prompt's preview step, the homepage Copy agent guide button fetching `/AGENT.md` as the single source of truth, its independence from iframe loading, and the byte-for-byte encoding checks.

## The copyable prompt

The map's copyable prompt now includes the actual-text preview step (source doc: guide and encoding safeguards section, primary project artifact). This closes a workflow gap: an operator following the guide would otherwise learn about preview only from API documentation, and the preview step is precisely the one that protects against stale inputs and silent drift before any edit is applied.

## One authoritative guide

The homepage Copy agent guide button now fetches the authoritative `/AGENT.md` instead of maintaining a second hardcoded recipe (source doc: guide and encoding safeguards section, primary project artifact). The failure mode being removed is the duplicated document: two copies of the same instructions drift independently, and the copy the operator pastes is the one nobody updated. Serving the guide from a single authoritative endpoint means an update to the operational contract is visible to every user on their next copy.

The fetch works independently of iframe loading, including on mobile (source doc: guide and encoding safeguards section, primary project artifact). That matters because a copy button whose only path runs through an embedded frame silently fails on mobile browsers, exactly where the iframe stack is least reliable.

## Failure honesty in the clipboard flow

Fetch and copy failures show an error and a link; success is shown only after clipboard success or a successful fallback return (source doc: guide and encoding safeguards section, primary project artifact). The browser clipboard contract makes this care necessary. The Clipboard API provides clipboard write access but is permission-gated and not universally available, so implementations need a fallback path and honest status reporting (source: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API, jev weight 0.94; see also https://developer.mozilla.org/docs/Web/API/Clipboard, jev weight 0.82). The legacy `document.execCommand('copy')` path is deprecated, and migration guides recommend `navigator.clipboard` with a fallback for environments where the API is unavailable (source: https://clipboardinspector.com/blog/migrate-execcommand-to-clipboard-api, jev weight 0.58).

Showing success only after the copy actually succeeded is the same discipline the diagnostics follow everywhere else in the instrument: never display a state you have not verified.

## Byte-for-byte verification

Desktop and mobile browser checks compared copied text byte-for-byte with the updated guide (source doc: guide and encoding safeguards section, primary project artifact). Byte comparison is the right test for a copy flow because "looks the same" is exactly the kind of soft check that hides trailing whitespace, newline convention, and encoding drift. UTF-8 is the character encoding the clipboard supports for HTML clipboard content in the Windows convention, and encoding mismatches surface as corrupted text only after the paste (source: https://learn.microsoft.com/en-us/windows/win32/dataxchg/html-clipboard-format, jev weight 0.87). Measuring copied text in bytes rather than characters also matches what HTTP quotas and APIs actually count, since byte length and character length diverge outside ASCII (source: https://toolcore.dev/tools/ai/utf8-byte-check, jev weight 0.45, weak backing).

## Preserved surface

The served assets remain UTF-8, all unrelated homepage text and legacy site endpoints are preserved (source doc: guide and encoding safeguards section, primary project artifact). Preservation checks are easy to skip in a focused change and expensive to recover from: a guide update that silently breaks a legacy endpoint or mangles a homepage string is a regression no one was watching for. Recording the preserved surface as part of the verification claim, alongside the 60 browser checks that included exact guide copying and mobile reachability, makes the blast radius of the change explicit (source doc: verification before publication section, primary project artifact).
