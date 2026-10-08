# 06 - KV updates after the worker deploy

Scope: the separate KV update step (SITE namespace, `jev-index.html`, AGENT.md and llms.txt), the json.dumps double-escape incident of 2026-10-05, raw-byte PUTs, and delayed re-GET byte-compare verification.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## KV updates are a separate step, not part of the deploy

Step 8 of the source-doc sequence: after the worker upload, KV changes go in as their own step. The targets are:

- The console HTML at key `jev-index.html` in KV namespace `SITE` (id `b9de35ecd3ca44999b38cfd107c0d44a`), verified afterwards with `GET /jev/`.
- KV text docs (`AGENT.md`, `llms.txt`) updated the same way. After an `AGENT.md` PUT, `GET /AGENT.md` must return the new bytes. AGENT.md is also mirrored in git at `yubi-OS/yubiOS tools/point-map/AGENT.md`, and both copies must be kept identical.

The KV platform is a global low-latency key-value store reachable from workers through bindings and from external applications through the REST API [0.58](https://developers.cloudflare.com/kv/). Writes go through `put()` or the REST write path, including bulk writes [0.42](https://developers.cloudflare.com/kv/api/write-key-value-pairs/). The steady-orbit flow uses the REST path for console and text-doc updates.

## The json.dumps incident (2026-10-05)

The source doc's rule 8a exists because of a real failure chain, recorded as the 2026-10-05 /jev/ incident:

1. The values endpoint stores the request body verbatim. Wrapping the body in `json.dumps` stored a JSON string literal instead of the raw document, so the served page broke with `\"` escapes everywhere.
2. The next KV-fetch-patch cycle stacked another layer on top (the fetch read the escaped bytes, patched them, and re-PUT the doubly escaped result). AGENT.md reached triple-escaping.
3. The corrupted fetch also propagated into any git mirror pushed from the same /tmp file, so the corruption leaked outside KV.

Recovery was to `json.loads` per layer, or re-source AGENT.md from the git mirror, which is AGENT.md's source of truth.

The root causes were two: writing via json.dumps instead of raw bytes, and verifying with a substring grep instead of a byte compare. A substring grep passes even on escaped bytes, because the text is still present inside the escaped string. That miss is how the corrupted version shipped.

## The correct write pattern

Prevention, per the source doc: raw PUT with the body passed exactly as bytes.

```
-H "Content-Type: text/plain" --data-binary @file
```

The curl distinction is documented at the tool level: `--data-binary` posts data exactly as specified with no extra processing, while `--data` strips newlines (and line-ending bytes) from file input [0.62](https://github.com/curl/curl/blob/master/docs/cmdline-opts/data-binary.md) (weak backing on the numeric weight, but this is the primary curl documentation).

## The HTML PUT gotcha: `-d` strips CRLF

A second, separate gotcha is recorded from the console deploy: curl `-d` stripped CRLF, silently shrinking a 173,183-byte console PUT to 169,638 bytes. A 3,545-byte loss with no error returned. Re-PUT with `--data-binary` and byte-verify via a delayed re-GET. (Weak backing for the underlying curl behavior at [0.01](https://unix.stackexchange.com/questions/206446/what-data-transformations-does-curls-data-option-perform) and [0.01](https://man7.org/linux/man-pages/man1/curl.1.html); the incident numbers come from the source doc.)

## Console KV writes get an HTML parse first

For the router console (KV `jev-index.html`, SITE namespace), the source doc adds a pre-write check: validate the merged console with an HTML parser (0 unmatched closes) before any console KV PUT. The console is assembled by inserting cards (the Router card lives inside `sec-corpus` after the taste card), and a structural error caught by the parser is cheaper than a broken console served from KV.

## The verification rule: delayed re-GET plus byte compare

Every KV text write is verified with a delayed re-GET and a byte-compare against the intended local file. The delay matters because the serving edge may not reflect the write instantly, and a fast GET can read the previous value. The byte-compare matters because both recorded failures (json.dumps escaping, CRLF stripping) are invisible to substring checks.

Summary of the KV discipline:

1. Worker deploy first, KV second; never mixed into one operation.
2. Raw bytes only: `--data-binary`, `Content-Type: text/plain`, never json.dumps.
3. HTML console merges validated with a parser before PUT.
4. Every write verified by delayed re-GET plus byte-compare.
5. Git mirrors kept identical with the KV copy, re-sourced from the mirror on corruption.
