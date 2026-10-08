# 01 - chrome-devtools-mcp Setup and Tool Availability Verification

Scope: how the Chrome DevTools MCP server is installed and configured, which browser it officially supports, what telemetry it emits, and why the web-perf skill insists on verifying tool availability before any audit work.

Grounding spine: yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).

## Why verification comes first

The source doc makes one rule non-negotiable: before starting any audit, try calling `navigate_page` or `performance_start_trace`, and if either is unavailable, STOP, because the chrome-devtools MCP server is not configured. This is a correctness gate, not politeness. Every later phase (trace capture, insight analysis, network listing, snapshots) depends on the same server. A half-configured MCP setup silently degrades into pre-trained guesses, which the source doc explicitly forbids: "your knowledge of web performance metrics, thresholds, and tooling APIs may be outdated. Prefer retrieval over pre-training."

## Installing the server

The source doc gives the canonical client config:

```json
"chrome-devtools": {
  "type": "local",
  "command": ["npx", "-y", "chrome-devtools-mcp@latest"]
}
```

This matches the package's documented installation path: the chrome-devtools-mcp npm package is the distribution point, and community installation guides describe npx as the primary method, with MCP-client integration on top (https://deepwiki.com/thanush2205/chrome-devtools-mcp/1.1-getting-started-and-installation, weak backing, weight 0.32). Pin `@latest` deliberately: the server is under active development and tool surfaces change.

## What the server provides

The official GitHub repository describes the server as "Chrome DevTools for coding agents" and lists the capability groups the web-perf skill relies on: getting performance insights by recording traces and extracting actionable performance insights, and advanced browser debugging that analyzes network requests, takes screenshots, and reads browser console messages with source-mapped stack traces (https://github.com/ChromeDevTools/chrome-devtools-mcp, weight 0.79). That mapping is why the skill's quick reference table (navigate_page, performance_start_trace, performance_analyze_insight, list_network_requests, get_network_request, take_snapshot) is stable: those tools are the documented product surface, not agent inventions.

## Browser support boundary

The repository is explicit: "chrome-devtools-mcp officially supports Google Chrome and Chrome for Testing only. Other Chromium-based browsers may work, but this is not guaranteed, and you may encounter unexpected behavior" (https://github.com/ChromeDevTools/chrome-devtools-mcp, weight 0.79). For audits this matters in two directions:

1. Do not point the server at Brave, Edge, or Vivaldi and expect trace fidelity. Metrics like LCP and TBT depend on renderer behavior that is only guaranteed on Chrome and Chrome for Testing.
2. If a target environment only has a Chromium fork available, treat every lab metric as approximate and say so in the report.

## Configuration flags

The official configuration reference organizes settings into connection options ("Use these options to configure how the server connects to Chrome") plus further flag groups documented in the Chrome DevTools MCP GitHub repository (https://developer.chrome.com/docs/devtools/agents/get-started/configuration, weight 0.77). The source doc's local-command config is the minimal shape; flags such as channel selection or headless mode belong to that reference, not to the audit workflow. Retrieval rule: when a flag's behavior is uncertain, check the configuration page rather than assuming from CLI folklore.

## Telemetry you should know about

The npm package page states that Google collects usage statistics, "such as tool invocation success rates, latency, and environment information", to improve the reliability and performance of Chrome DevTools MCP (https://www.npmjs.com/package/chrome-devtools-mcp, weak backing, weight 0.37). The GitHub README adds that performance tools may send trace URLs to the Google CrUX API to fetch real-user experience data (https://github.com/ChromeDevTools/chrome-devtools-mcp, weight 0.79). Two consequences for auditors:

1. Auditing confidential or unreleased sites through this server leaks URLs and tool metadata to Google; prefer a local Chrome instance without telemetry flags if confidentiality matters, and disclose the CrUX fetch in the audit method section.
2. CrUX-derived numbers are field data at the 75th percentile, not your lab trace; never present them interchangeably (see doc 03).

## Operational checklist

1. Confirm the MCP config entry exists and the server starts.
2. Probe `navigate_page` or `performance_start_trace`; STOP on failure and surface the config snippet above.
3. Confirm the browser is Chrome or Chrome for Testing (https://github.com/ChromeDevTools/chrome-devtools-mcp, weight 0.79).
4. Note telemetry exposure in the audit preamble when the target site is confidential.

Sources: https://github.com/ChromeDevTools/chrome-devtools-mcp (weight 0.79), https://developer.chrome.com/docs/devtools/agents/get-started/configuration (weight 0.77), https://www.npmjs.com/package/chrome-devtools-mcp (weak backing, weight 0.37), https://deepwiki.com/thanush2205/chrome-devtools-mcp/1.1-getting-started-and-installation (weak backing, weight 0.32), plus yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).
