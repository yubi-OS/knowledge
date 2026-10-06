# 04 AI and ML products

Scope: the "I need AI" decision tree from the source doc, covering Workers AI inference, the Vectorize vector database, the Agents SDK for stateful AI agents, AI Gateway, and AI Search.

## The tree as the source doc states it

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) routes AI requests by the capability needed:

- Run inference (LLMs, embeddings, images): workers-ai/
- Vector database for RAG and search: vectorize/
- Build stateful AI agents: agents-sdk/
- Gateway for any AI provider, with caching and routing: ai-gateway/
- AI-powered search widget: ai-search/

## Workers AI and the unified AI platform

The Workers AI docs overview (weight 0.95, https://developers.cloudflare.com/workers-ai/) exposes a machine-readable documentation index: fetch the complete documentation index at https://developers.cloudflare.com/workers-ai/llms.txt to discover all available pages before exploring further. That llms.txt pattern is itself useful to a retrieval-first skill: it is the cheapest way to enumerate the product surface before citing anything.

The product page (weight 0.62, https://www.cloudflare.com/products/workers-ai/) frames Workers AI as running AI inference globally with one API call, with no GPUs to manage and no capacity planning, and notes integration with Vectorize and AI Search for complete AI workflows.

The umbrella AI docs (weight 0.90, https://developers.cloudflare.com/ai/, updated 6 days before collection) unify the two halves of the AI tree: Cloudflare AI provides a platform for running AI models, whether hosted on Cloudflare infrastructure (Workers AI) or proxied through AI Gateway to external providers. That single sentence resolves the tree's top two rows into a choice of execution venue.

## AI Gateway

The AI Gateway product page (weight 0.55, https://www.cloudflare.com/products/ai-gateway/) describes it as an intelligent control plane for AI applications: connect to any model, dynamic routing, caching, observability, and unified billing for AI workloads. The docs landing page at https://gateway-beta.ai.cloudflare.com/ (weight 0.82) is the live docs host for AI Gateway in the dig's index.

## Vectorize

The AI Gateway docs overview (weight 0.82, https://gateway-beta.ai.cloudflare.com/) carries the clearest Vectorize description in the dig: build full-stack AI applications with Vectorize, Cloudflare's vector database; adding Vectorize enables tasks such as semantic search, recommendations, and anomaly detection, or providing context and memory to an LLM. That last phrase, context and memory for an LLM, is the RAG wiring the source doc's vectorize/ row names.

## Agents SDK

The strongest cluster of this subtopic is the Agents SDK. The AI Search docs (weight 0.92, https://developers.cloudflare.com/ai-search/agent-sdks/agents-sdk/, updated 2026-08-25) show the SDK building stateful AI agents that run on Workers, with a worked example of a chat agent that provisions its own AI Search instance, indexes a document, and searches that content with a tool before it answers. The Agents docs (weight 0.93, https://developers.cloudflare.com/agents/, updated 2026-09-18) describe stateful AI agents with persistent memory, real-time WebSocket connections, and scheduled tasks. The canonical repository (weight 0.81, https://github.com/cloudflare/agents) states the runtime model: agents are persistent, stateful execution environments for agentic workloads, powered by Cloudflare Durable Objects; each agent has its own state, storage, and lifecycle, with built-in support for real-time communication, scheduling, AI model calls, MCP, and workflows, and agents hibernate when idle and wake on demand. The starter-kit page (weight 0.73, https://labs.cloudflare.dev/agents/) covers the Agent Starter Kit and the architecture behind persistent, real-time AI agents.

Weakly weighted sources, labeled: the product page (weight 0.47, https://www.cloudflare.com/products/agents/) lists built-in memory, scheduling, email handling, and real-time communication; the third-party explainer (weight 0.07, https://alatirok.com/cloudflare-agents-sdk/) says each agent runs as a stateful Durable Object with its own SQL database and scheduler. Both are below the 0.5 authority line, so treat them as orientation only; the Durable Objects runtime claim itself is already carried at weight 0.81 by the canonical repository.

## How the tree composes

Read together, the dig supports a composition chain the tree implies: Workers AI or AI Gateway provides the model call, Vectorize provides embeddings and retrieval context, and the Agents SDK provides the persistent stateful wrapper that schedules work, holds memory, and calls tools such as AI Search. The source doc's five rows are entry points into that chain, not five alternatives for one job.
