# 04: SSRF Prevention

Scope: server-side request forgery. Whenever the server fetches a URL the user influenced (webhooks, import-from-URL, image proxies, link previews), an attacker can aim the fetch at internal services. This doc covers the source doc's validation pattern and its documented limits. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## The threat class

The source doc names the target list: cloud metadata endpoints, `localhost`, and private IPs. OWASP carries SSRF as category A10 in the 2021 Top 10 (weight 0.96), where it is defined as a vulnerability that "occurs when a web application fetches a remote resource without validating the user-supplied URL" (https://owasp.org/Top10/2021/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/). The OWASP SSRF Prevention Cheat Sheet (weight 0.88) documents the same attack pattern from the defensive side, including reachability into internal REST interfaces and file access through `file://` URIs (https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html and https://community.owasp.org/attacks/Server_Side_Request_Forgery, weight 0.69).

## The validation pattern: scheme, host, and resolved-IP checks

The source doc's `assertSafeUrl` enforces 3 gates before any fetch:

1. Scheme: `url.protocol !== 'https:'` fails. HTTPS only.
2. Host: the hostname must be in `ALLOWED_HOSTS` (a set of known hosts such as `hooks.example.com`).
3. Resolved addresses: `lookup(url.hostname, { all: true })` resolves every DNS record, and any record whose `ipaddr.js` range is not `unicast` fails. The `range() !== 'unicast'` test covers loopback, link-local (including `169.254.169.254`, which the source doc calls the number 1 SSRF target), private, and unique-local ranges across IPv4 and IPv6.

The fetch then runs with `redirect: 'error'` so a redirect cannot bounce the request past the validation. The defense-in-depth framing matches OWASP's A10 guidance, which recommends network-layer segmentation in addition to application-layer validation (0.96, https://owasp.org/Top10/2021/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/).

## The TOCTOU gap the source doc admits

The source doc is explicit that the pattern above still has a TOCTOU (time-of-check to time-of-use) gap: `fetch` resolves DNS again after the check, so an attacker with a short-TTL record can rebind the hostname to an internal IP between validation and connection. For high-risk surfaces the source doc prescribes: resolve once and connect to the pinned IP, or put a filtering agent in front (`request-filtering-agent` / `ssrf-req-filter`).

This gap is not theoretical. A published GitHub security advisory for the Postiz application (weight 0.79) describes exactly this failure: its SSRF protections added in versions v2.21.4 through v2.21.6 shared "a fundamental TOCTOU (Time-of-Check-Time-of-Use) vulnerability" because `isSafePublicHttpsUrl()` resolved DNS to validate and the subsequent fetch resolved DNS again (https://github.com/gitroomhq/postiz-app/security/advisories/GHSA-f7jj-p389-4w45). The advisory is the real-world confirmation of the source doc's caveat: validating the URL is not the same as pinning the connection. Lower-weight walk-throughs of the same attack class (0.20 to 0.34: techearl.com, behradtaher.dev, en.wikipedia.org) corroborate the mechanics and can be used only as background reading.

## Where SSRF validation belongs in the skill's tiers

Server-side URL fetches appear in 3 places in the source doc: the always-do tier ("server-side URL fetches are allowlisted"), the verification checklist ("no SSRF to internal services"), and the red flags list ("server fetches user-supplied URLs without an allowlist"). The pattern to internalize: the allowlist is on the scheme, the host, and the resolved addresses together. A hostname-only allowlist is insufficient, because resolution is where the attacker plays.

## Provenance

Source doc claims: the 3-gate pattern, the unicast-range reasoning, the redirect handling, the TOCTOU caveat with its 2 mitigations, and the tier/checklist placement. Dig-backed claims: OWASP A10 definition and defense-in-depth guidance (0.96), the OWASP SSRF cheat sheet defensive patterns (0.88), the OWASP community attack surface description including `file://` URIs (0.69), and the Postiz TOCTOU advisory (0.79). Weakly backed corroboration (labeled): DNS-rebinding explainers at 0.20 to 0.34 (techearl.com, behradtaher.dev, aydinnyunus.github.io, en.wikipedia.org); their mechanics agree with the advisory but none are load-bearing here.
