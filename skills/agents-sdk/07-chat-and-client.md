# 07 Chat agents, streaming, and the client SDK

Scope: AIChatAgent and its persistence and resumability model, the React client hooks, server-driven messages, and human-in-the-loop approval flows.

Grounding note: the source doc is yubi-OS/yubiOS skills/agents-sdk/SKILL.md, cited as "source doc". Other claims cite their dig source URL plus the jev weight.

## AIChatAgent

For AI chat applications you extend `AIChatAgent` instead of `Agent`, implementing `onChatMessage(onFinish, options)` and returning a streaming response; `this.messages` holds the conversation history (source doc; https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90). The class comes from `@cloudflare/ai-chat`, with the React hook from `@cloudflare/ai-chat/react` (https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/, jev 0.87). Install line: `npm i @cloudflare/ai-chat agents ai @ai-sdk/react workers-ai-provider` (https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/, jev 0.87).

The three properties the source doc advertises are all confirmed by the chat page: built-in message persistence, automatic resumable streaming on reconnect mid-stream, and compatibility with the `useAgentChat` React hook (source doc; https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/, jev 0.87). Messages are persisted to SQLite and stream chunks are buffered there too; the page states the `new_sqlite_classes` migration is required for exactly that reason (https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/, jev 0.87). The flow is: the client sends a chat message, `AIChatAgent` persists it to SQLite and calls your `onChatMessage`, you stream the response, and the chunks persist so a disconnecting client can resume (https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/, jev 0.87).

One integration detail: `AIChatAgent` can wait for MCP server connections to settle before calling `onChatMessage`, so `this.mcp.getAITools()` returns the full tool set even after Durable Object hibernation restores connections in the background; for lower-level control call `this.mcp.waitForConnections()` directly inside `onChatMessage` (https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/, jev 0.87).

## Client SDK

`useAgent({ agent, name })` from `agents/react` connects a React component to an instance, exposing `onStateUpdate` and `onIdentity` callbacks and an `agent.setState()` for pushing state, per the source doc's React Client example (source doc). The state page confirms the same client surface for React and for vanilla JS via `AgentClient` from `agents/client` (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92). For chat UIs, `useAgentChat({ agent })` returns `{ messages, sendMessage, status }` (https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/, jev 0.87). The client also exposes `agent.stub` for typed callable RPC and `agent.call(method, args, options)` for named calls with timeout and stream options (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92).

## Server-driven messages

The source doc's trigger-patterns entry covers server-initiated turns with `saveMessages` and `waitUntilStable` (source doc). This is the proactive-agent pattern: the server writes messages into the persisted conversation and waits for the stream to stabilize, letting an agent act on its own schedule, on an incoming webhook, or after a workflow finishes, without a user prompt. The capability list in the source doc names it "Server-driven messages, saveMessages, waitUntilStable for proactive agent turns" (source doc).

## Human in the loop

The source doc indexes approval flows under `needsApproval` and the human-in-the-loop concept page (source doc). On the workflow side, the agents API lists `waitForApproval()` on the agent and `approveWorkflow(instanceId, options)` / `rejectWorkflow(instanceId, options)` as workflow management methods, with a human-in-the-loop approval example in the Workflows guide (https://developers.cloudflare.com/agents/runtime/execution/run-workflows/, jev 0.90). The composition is: a workflow step blocks for approval, the agent broadcasts the request to connected clients, a human approves, and the workflow resumes durably (https://developers.cloudflare.com/agents/runtime/execution/run-workflows/, jev 0.90).

## Where this doc sits in the skill

The skill's chat-and-client cluster is the largest of its reference groups, with four files: streaming-chat, client-sdk, server-driven-messages, and human-in-the-loop (source doc). The dig evidence matches that weighting: the chat agents page is one of the deepest in the docs tree, and the package structure in the repo reflects it, with `@cloudflare/ai-chat` as its own package for "persistent messages, resumable streaming, tool execution" (https://github.com/cloudflare/agents, jev 0.77).
