# 02. The credential-safe login flow

Scope: the only safe login flow for LinkedIn in a live cloud browser session: the agent types only the email, the human types their own password and 2FA into the live browser view, and cookies persist for the session lifetime.

Ground source: yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md (primary source of record).

## The rule that never breaks

The source doc states the rule in absolute terms: never ask for or collect a LinkedIn password in chat, under any framing, including "securely" or "just this once" (source doc). This is the strongest constraint in the skill. It overrides any convenience argument, because a password typed into chat is recorded in the transcript and becomes part of the agent's context.

## The 5-step flow

Per the source doc:

1. Open a browser_use session and navigate to https://www.linkedin.com/login (source doc).
2. Type the email into the email field only. The email is not a secret; the password is (source doc).
3. Stop. Tell the user the live session URL and ask them to type their own password, and the 2FA code if prompted, directly into the browser view (source doc).
4. Do not touch the password field yourself, ever. The source doc repeats this as a guideline: "Do not touch the password field yourself, ever" (source doc).
5. Once the user confirms, verify login with a fresh browser_use call with sessionId set, read-only: check that the feed loads and the profile nav shows their name (source doc).

This is a human-in-the-loop pattern: the agent handles routine navigation while the human keeps control of authentication. The pattern is documented in the browser-automation ecosystem generally; Browserbase ships a human-in-the-loop template that wires agent execution, human input collection, and resume logic together for exactly this class of flow (https://www.browserbase.com/templates/agent-with-human-in-loop, jev weight 0.28, weak backing). A 2026 practitioner writeup describes human-in-the-loop browser automation as letting agents handle routine tasks while keeping a human in control for authentication, approvals, and edge cases (https://proxyhuman.ai/blog/what-is-human-in-the-loop-browser, jev weight 0.22, weak backing). Both are weak-backed corroboration, not authority; the authority here is the source doc's own rule.

## What the human may face at sign-in

LinkedIn can present several verification prompts on sign-in, which is why step 3 hands the whole credentials-and-verification stage to the human:

- LinkedIn may prompt you to check your email for a verification code to verify a sign-in attempt (https://www.linkedin.com/help/linkedin/answer/a1339220/security-verification-when-signing-in?lang=en, jev weight 0.47, weak backing).
- LinkedIn may prompt verification through the LinkedIn mobile app when a new device is detected, instead of a PIN through SMS or email (https://www.linkedin.com/help/recruiter/answer/a1427042/sign-in-security-prompt-overview?lang=en, jev weight 0.22, weak backing).
- Two-step verification can be turned on or off in account settings, and there are recovery paths if the enrolled device is unavailable (https://www.linkedin.com/help/linkedin/answer/a1335344, jev weight 0.25, weak backing; https://www.linkedin.com/help/linkedin/answer/a1381088/turn-two-step-verification-on-and-off, jev weight 0.13, weak backing).

The dig for this subtopic stayed weak after 2 redos (best jev weight 0.47), so the verification-prompt specifics above are weak-backed; the flow steps themselves are from the source doc and are authoritative for this skill.

## Session persistence and why login is one-time per session

The source doc states: cookies persist on the session as long as you do not stop it, so login is a one-time action per session lifetime (source doc). Ecosystem documentation corroborates the mechanism: browser-automation platforms persist cookies, tokens, and session state across runs to skip repeated logins (https://www.browserbase.com/templates/context, jev weight 0.47, weak backing), and practitioner guides distinguish session cookies, which expire when the browser closes, from persistent cookies, which survive for a duration (https://www.skyvern.com/blog/browser-automation-session-management/, jev weight 0.33, weak backing). One 2026 writeup makes the security point directly: cookies are what let an automated session skip re-authentication, and they are a credential the moment you save them (https://anchorbrowser.io/blog/cookie-management-in-browser-automation-persistence-and-security, jev weight 0.34, weak backing).

The operational consequences, per the source doc:

- Do not stop the session between the login and the messaging work; stopping loses the login state.
- Treat the session as holding live credentials. The corroboration sources (weak-backed) reinforce what the source doc implies: the session's cookie store is equivalent to a password for the duration of the session, so it should be treated with the same care as the credential rule above.
