# 04 Step 2: The Source Hierarchy and Fetch Precision

Scope: the 4-tier authority ordering for documentation sources, the never-cite list, and the precision rule of fetching the exact page rather than the homepage.

## The hierarchy

The ground skill ranks sources by authority (source doc: yubi-OS/yubiOS skills/source-driven-development/SKILL.md):

1. Official documentation: react.dev, docs.djangoproject.com, symfony.com/doc.
2. Official blog or changelog: react.dev/blog, nextjs.org/blog.
3. Web standards references: MDN, web.dev, html.spec.whatwg.org.
4. Browser and runtime compatibility: caniuse.com, node.green.

Tier separation matters because each tier answers a different question: tier 1 answers "what is the current API", tier 2 answers "what changed and when", tier 3 answers "what does the platform itself specify", tier 4 answers "where can this ship today".

## What the top tiers look like in practice

MDN is the canonical tier 3 example, and it is run like a production documentation project: the official content repository describes itself as "the official source for MDN Web Docs content. Home to over 14,000 pages of documentation about HTML, CSS, JS, HTTP, Web APIs, and more" (https://github.com/mdn/content, jev weight 0.89, primary backing). MDN publishes its writing guidelines and conventions openly (https://developer.mozilla.org/en-US/docs/MDN/index.html, jev weight 0.64, primary backing) and has recently added an MCP server that "brings MDN's documentation and browser compatibility data directly into your editor or IDE, giving your LLM or coding agent access to accurate, up-to-date web platform information" (https://developer.mozilla.org/en-US/, jev weight 0.75, primary backing). That last point matters for agents: the tier 3 authority is now fetchable programmatically.

The same project maintains browser-compat-data, "browser compatibility data for Web technologies as displayed on MDN", which is the dataset behind both MDN's compatibility tables and third-party tools (https://github.com/mdn/browser-compat-data, jev weight 0.20, weak backing for that specific page). MDN documents its standard compatibility-table format as the way shared-technology support is illustrated "across all browsers" and published programmatically from the BCD repository (https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Compatibility_tables, jev weight 0.76, primary backing).

Tier 4 resources are the compat lookups. caniuse.com provides "up-to-date browser support tables for support of front-end web technologies on desktop and mobile web browsers" (https://caniuse.com/, jev weight 0.14, weak backing per the weighting model). node.green tracks Node.js ES feature support (https://node.green/, jev weight 0.22, weak backing), and the kangax ECMAScript compatibility table covers engine-level support (https://compat-table.github.io/compat-table/es6/, jev weight 0.20, weak backing). These are the right tools for the "include browser/runtime support data when recommending platform features" citation rule (source doc), even though the weighting model scored their landing pages low; cite the specific feature page, not the homepage.

## The never-cite list

The skill is categorical about what never counts as a primary source (source doc):

- Stack Overflow answers.
- Blog posts or tutorials, even popular ones.
- AI-generated documentation or summaries.
- Your own training data, "that is the whole point - verify it".

## Fetch precision

The skill demands the exact page for the feature being implemented, "not the homepage, not the full docs" (source doc):

- BAD: fetch the React homepage. GOOD: fetch react.dev/reference/react/useActionState.
- BAD: search "django authentication best practices". GOOD: fetch docs.djangoproject.com/en/6.0/topics/auth/.

The reason precision is mandatory, not stylistic, is that version-scoped URLs carry deprecation state. A search result can return guidance for any version; a versioned URL cannot lie about which version it documents.

## Conflict handling

When official sources conflict with each other, for example a migration guide contradicting the API reference, the skill says to surface the discrepancy to the user and verify which pattern actually works against the detected version (source doc). Both pages are tier 1, so the tie is broken by the detected version, not by which page reads more authoritative.
