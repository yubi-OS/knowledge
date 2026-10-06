# 02 - The 8 DevTools MCP Capabilities

Scope: what the tool surface of Chrome DevTools MCP actually gives an agent, per the skill's tool table, and how each capability maps to a verification job.

Grounding spine: source doc yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (the "Available Tools" table).

## The tool table

The skill enumerates 8 capabilities. Each row pairs a tool with the job it is for (source doc):

| Tool | What it does | When to use |
|------|-------------|-------------|
| Screenshot | Captures the current page state | Visual verification, before/after comparisons |
| DOM inspection | Reads the live DOM tree | Verify component rendering, check structure |
| Console logs | Retrieves console output (log, warn, error) | Diagnose errors, verify logging |
| Network monitor | Captures network requests and responses | Verify API calls, check payloads |
| Performance trace | Records performance timing data | Profile load time, identify bottlenecks |
| Element styles | Reads computed styles for elements | Debug CSS issues, verify styling |
| Accessibility tree | Reads the accessibility tree | Verify screen reader experience |
| JavaScript execution | Runs JavaScript in the page context | Read-only state inspection and debugging |

The purpose of the table is coverage: between them, the 8 tools observe every layer a browser bug can live in. Rendering (screenshot, styles), structure (DOM, accessibility tree), runtime behavior (console, network, performance), and state (JavaScript execution). The skill's debugging workflows in docs 05 through 07 are compositions of exactly these tools; the table is the vocabulary the workflows are written in.

## Cross-check against the official tool reference

The upstream repo maintains a tool reference document that enumerates the server's tools in detail (https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md, jev weight 0.80). The official set is larger and more granular than the skill's 8-row abstraction: it includes navigation control, input emulation (click, fill), script evaluation, network request interception and emulation, and multiple performance entry points. The skill's table is a deliberately reduced view: it keeps the read-and-verify capabilities and pushes interaction and mutation behind the security constraints in doc 04. Chrome's DevTools documentation describes the same underlying panels the MCP tools wrap (https://developer.chrome.com/docs/devtools, jev weight 0.94), and the launch blog post for the MCP server lists the capability areas as its selling points (https://developer.chrome.com/blog/chrome-devtools-mcp, jev weight 0.69).

The practical reading: when the skill says "screenshot", the underlying MCP tool may be `take_screenshot`; when it says "DOM inspection", the tool may be `take_snapshot` returning a uid-addressed tree the agent can then query. The abstraction holds, but agents wired to a specific server version should confirm tool names against that version's tool reference rather than assuming the skill's names are literal (https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md, jev weight 0.80).

## How the capabilities compose

Three compositions cover most of the skill's guidance (source doc):

1. **Visual verification loop.** Screenshot before, change code, reload, screenshot after, compare. This is the whole of doc 08's screenshot discipline, and it uses only the screenshot capability plus page reload.
2. **Error triage loop.** Console logs for symptoms, DOM inspection plus element styles for structure and styling, network monitor for data flow. This is the inspect and diagnose halves of the UI bug workflow (doc 05).
3. **Performance loop.** Performance trace as baseline, identify the bottleneck, fix, trace again and compare. Doc 07's entire method is this loop, and the trace tool is its only instrument.

The accessibility tree deserves its own emphasis. It is the only capability that observes what a screen reader sees, which is why the skill's accessibility verification procedure (doc 09) is built on it rather than on DOM inspection: the DOM can be perfectly correct while the accessibility tree exposes unlabeled buttons, skipped heading levels, or missing live regions (source doc).

## JavaScript execution is the odd one out

Seven of the 8 tools are pure observers: they read state and cannot change it. JavaScript execution is not. It runs arbitrary code in the page context, which makes it both the most powerful and the most dangerous capability in the table. The skill's tool table already narrows its "when to use" to read-only state inspection, and the security section (doc 04) turns that narrowing into hard rules: no external requests, no credential access, no exploratory scripts on arbitrary pages, user confirmation before any mutation (source doc). The asymmetry is deliberate: the observing tools cannot exfiltrate anything or damage anything, so they need no gatekeeping. JavaScript execution can do both, so it is the one capability the skill fences.

## Sources for this doc

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (primary source of record).
- https://developer.chrome.com/docs/devtools (jev 0.94)
- https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md (jev 0.80)
- https://github.com/ChromeDevTools/chrome-devtools-mcp/ (jev 0.73)
- https://developer.chrome.com/blog/chrome-devtools-mcp (jev 0.69)
- https://deepwiki.com/ChromeDevTools/chrome-devtools-mcp/3.11-performance-tracing-and-analysis (jev 0.32, weak backing)
