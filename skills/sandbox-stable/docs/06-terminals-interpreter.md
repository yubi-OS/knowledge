# 06. Terminals, interpreter, and compute features

Scope: the interactive and compute surfaces of the stable package: `sandbox.terminal(request)` browser terminals with session and xterm helpers, the code Interpreter API, git workflows inside the sandbox, and Docker-in-Docker.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## Browser terminals on stable

The source doc's non-negotiable is explicit about which terminal API is stable: "Interactive browser terminals often use sandbox.terminal(request) and session/xterm helpers on stable—not preview createTerminal unless the package is @next." The Terminal API page confirms the shape and its stability: "Connect browser-based terminal UIs to sandbox shells via WebSocket. The server-side terminal() method proxies WebSocket connections to the container, and the client-side SandboxAddon integrates with xterm.js for terminal rendering. This page documents terminal helpers on today's stable @cloudflare/sandbox package" (https://developers.cloudflare.com/sandbox/api/terminal/, jev weight 0.80).

The browser-terminals guide gives the two connection paths: "This guide shows you how to connect a browser-based terminal to a sandbox shell. You can use the SandboxAddon with xterm.js, or connect directly over WebSockets" (https://developers.cloudflare.com/sandbox/guides/browser-terminals/, jev weight 0.81). For production wiring, the how-to page is concrete: "In production, install @xterm/xterm and @xterm/addon-fit from npm and serve them with static assets. Add routes to your Worker that serve the page and pass the WebSocket to the sandbox" (https://developers.cloudflare.com/sandbox/commands/open-a-terminal-in-the-browser/, jev weight 0.81). Note the stable terminal path still moves bytes over WebSocket at the edge even though the package-to-container transport is migrating to RPC (doc 08); the two hops are separate.

## Code interpreter

The Interpreter API page defines the surface: "Execute Python, JavaScript, and TypeScript code with rich output formats in Sandbox SDK" (https://developers.cloudflare.com/sandbox/api/interpreter/, jev weight 0.76). The source doc lists the interpreter among the surfaces where you should "use main docs for signatures; trust installed stable types", so exact method signatures come from the installed package types, with the interpreter page as orientation.

## Git workflows and Docker-in-Docker

The source doc's retrieve table points git work at the git workflows guide (https://developers.cloudflare.com/sandbox/guides/git-workflows/) and Docker-in-Docker at its own guide (https://developers.cloudflare.com/sandbox/guides/docker-in-docker/). The dig for this subtopic returned the repo-level README and the Docker image README, which establish the container context but not guide-level signatures: "Secure, isolated code execution containers for Cloudflare Workers. Run untrusted code safely — execute commands, manage files, run background processes, and expose services from your Workers applications" (https://github.com/cloudflare/sandbox-sdk/blob/main/DOCKER_README.md, jev weight 0.76). Git-workflow and Docker-in-Docker specifics therefore stay pointer-only here, per the source doc's trust-installed-types rule; no dig-backed signature claims are made.

## The broader context

The overview page situates these surfaces in the product: "From your browser, open a web server that runs in a sandbox... Run coding agents such as Claude Code, Codex, and Devin in a sandbox that belongs to one task" (https://developers.cloudflare.com/sandbox/, jev weight 0.74). The interactive tutorial frames the learning path across "containers, code execution, and AI integration" (https://labs.cloudflare.dev/sandbox-sdk/, jev weight 0.68).

## Weak-source caution

The marketing homepage (0.29) and vendor landing page (0.58) carry no mechanism claims and are used only as context above where marked. Every API-shape claim rests on Cloudflare docs pages at 0.74 or higher, plus the source doc.
