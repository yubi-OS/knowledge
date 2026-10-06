# 03 - Profile Isolation and Blast Radius

Scope: why the choice of browser profile determines the blast radius of every other rule in the skill, and the concrete rules for choosing one.

Grounding spine: source doc yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (the "Profile Isolation" section of Security Boundaries).

## The blast radius argument

The source doc opens the Security Boundaries section with a claim about ordering: the blast radius of every rule that follows depends on which browser the agent is attached to (source doc). The reasoning is structural, not incremental. An agent on an isolated profile that injects a bad navigation or leaks a token damages a throwaway browser session. An agent on the user's real profile damages the user's actual accounts, because the profile is where the credentials live.

With `--autoConnect`, the agent attaches to the running Chrome's default profile and, per the chrome-devtools-mcp docs, has access to all open windows of that profile: logged-in email, banking, GitHub sessions, saved cookies (source doc). The source doc also notes that `--browser-url` is less exposed by design, because Chrome requires a non-default user data directory to enable the remote debugging port, and warns against defeating that protection by pointing it at a copy of the real profile.

The worst case the doc names is a compound failure: one page with injected instructions plus an agent holding an authenticated browser. In that combination, the untrusted-data rules of doc 04 stop being one of two defenses and become the only line of defense (source doc). This is why profile choice is listed first in the skill's security architecture: it is the control that keeps the second defense from being load-bearing alone.

## The platform's own enforcement

The isolation defaults are not just skill guidance; the browser platform enforces part of them. In Chrome 136, remote debugging on the default user data directory was disabled: `--remote-testing-port`-style switches now require a non-default `--user-data-dir` for the debugging port to open (https://developer.chrome.com/blog/remote-debugging-port, jev weight 0.85). Chrome's stated motivation is that a debugging port on the daily profile exposes an attacker-controllable protocol over the user's live authenticated sessions. A Chromium issue tracks the residual discussion around default-directory bypass attempts (https://issues.chromium.org/issues/429117827, jev weight 0.57).

This platform change corroborates the source doc's claim that `--browser-url` is "less exposed by design": the design is Chrome's, and it dates from 2025. Where the skill and the platform disagree is only in the direction of more protection over time.

## The four rules

The source doc states profile isolation as four rules (source doc):

1. **Default to the dedicated profile (no connect flags) or `--isolated`.** Testing localhost almost never needs real sessions.
2. **If logged-in state is required**, prefer a separate Chrome profile created for testing, signed into only the account under test. This scopes the blast radius to one account instead of the user's whole profile.
3. **If you must attach to the real profile**, close every tab and window unrelated to the test first, and detach when done. This narrows the exposure window and the number of live sessions the agent can see.
4. **Treat "the agent can see my open tabs" as a finding to surface to the user, not a convenience to exploit.** Visibility into unrelated tabs is itself an incident signal, even if nothing was read maliciously.

The red flags list in doc 10 repeats the last two as failure states: an agent attached to the user's daily Chrome profile for a test that only needs localhost is listed as a red flag (source doc).

## Where the dig is thin

The public sources with real weight on this topic are vendor pages: the Chrome blog post on the debugging-port change (0.85) and the Chromium issue (0.57). Third-party writeups on browser-automation security scored below 0.5 in weighting (for example https://remote-browser.dev/blog/secure-browser-automation-script, jev weight 0.13, weak backing; https://vibesecadvisory.com/blog/browser-agent-profile-isolation/, jev weight 0.11, weak backing). They agree with the vendor sources in direction but are treated here as weak backing only, and no claim in this doc rests on them alone.

## Sources for this doc

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (primary source of record).
- https://developer.chrome.com/blog/remote-debugging-port (jev 0.85)
- https://issues.chromium.org/issues/429117827 (jev 0.57)
- https://remote-browser.dev/blog/secure-browser-automation-script (jev 0.13, weak backing)
- https://vibesecadvisory.com/blog/browser-agent-profile-isolation/ (jev 0.11, weak backing)
- https://browserize.com/blog/browser-automation-security (jev 0.10, weak backing)
