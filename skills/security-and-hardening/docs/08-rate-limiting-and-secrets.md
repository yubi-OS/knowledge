# 08: Rate Limiting and Secrets Management

Scope: the 2 operational controls the skill treats as release-blocking: rate limiting that actually holds behind multiple instances, and secrets management that survives contact with version control. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## Rate limiting: two tiers, one shared-store rule

The source doc's pattern sets a general API limit and a stricter auth limit with express-rate-limit: `windowMs: 15 * 60 * 1000` (15 minutes) with `max: 100` for the general `/api/` surface and `max: 10` for `/api/auth/`, using `standardHeaders: true` and `legacyHeaders: false`.

The critical caveat the source doc states: count in a shared store once there is more than one process. `express-rate-limit` keeps counters in process memory by default, so behind a load balancer each instance holds its own count and the effective limit becomes `max` multiplied by the number of instances. On serverless or edge runtimes a fresh invocation starts from zero, so the auth limit may never fire at all. The fix is a shared store (Redis via `rate-limit-redis`) or an HTTP-based limiter that works where a long-lived TCP connection does not, such as `@upstash/ratelimit` with a sliding window of 10 attempts per 15 minutes keyed on the client IP, returning 429 when `success` is false.

The Redis documentation (weight 0.84) confirms the shared-store pattern and lists the ecosystem libraries that provide Redis-backed rate limiting in Node.js, including `rate-limiter-flexible` and express-rate-limit with a Redis store (https://redis.io/docs/latest/develop/use-cases/rate-limiter/). The `rate-limit-redis` adapter's repository (weight 0.64) documents the store interface that forwards limiter arguments to the Redis client (https://github.com/express-rate-limit/rate-limit-redis). Weakly backed walkthroughs (0.14 to 0.30: npmjs.com/package/rate-limit-redis, medium.com posts) describe the same in-memory-versus-Redis distinction; corroboration only.

Rate limiting sits in the always-do tier's neighborhood via the checklist (login has rate limiting) and the red flags list (no rate limiting on authentication endpoints, or an in-memory limiter in front of more than one instance). Modifying rate limiting is tier 2 (ask first).

## Secrets: the .env discipline

The source doc's layout:

- `.env.example`: committed, a template with placeholder values.
- `.env`: not committed, contains real secrets.
- `.env.local`: not committed, local overrides.

`.gitignore` must include `.env`, `.env.local`, `.env.*.local`, `*.pem`, and `*.key`. Before every commit, check for accidentally staged secrets: `git diff --cached | grep -i "password\|secret\|api_key\|token"`. Secrets are read from the environment in code (`process.env.SESSION_SECRET`, `process.env.STRIPE_API_KEY`), never inlined.

The OWASP Secrets Management Cheat Sheet (weight 0.86) is the primary external reference for this surface, covering secret storage, handling, and rotation practices (https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html). GitHub's platform controls back the detection layer: push protection blocks commits containing detected secrets before they enter the repository (weight 0.94, https://docs.github.com/en/code-security/concepts/secret-security/push-protection), and secret scanning detects exposed credentials in existing code (weight 0.96, https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning). These tools implement in platform what the source doc's pre-commit `git diff --cached | grep` check does locally.

## If a secret is ever committed: rotate first

The source doc's rule: if a secret is committed, rotate it. Deleting the line or rewriting history is not enough; assume the secret is compromised the moment it reaches a remote. Revoke and reissue the key first, then purge it from history.

GitHub's documentation backs both halves of that sequence: the removing-sensitive-data guide covers purging secrets from repository history (weight 0.96, https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), and the `git-filter-repo` tool (weight 0.57, https://github.com/newren/git-filter-repo) is the recommended mechanism for the history rewrite, with git's own documentation as the general reference (weight 0.80, https://git-scm.com/). A weakly backed writeup (0.25, https://security.furybee.org/articles/secrets-in-git-detection-rotation-history/) states the same ordering, rotate first, confirm the old credential is dead, then consider rewriting history; the ordering matches the source doc exactly, but carries weak source weight.

## Provenance

Source doc claims: both rate-limit configurations, the shared-store rule with the instance-multiplication and serverless-zero-start reasoning, the `.env` layout and gitignore entries, the pre-commit check, and the rotate-before-purge rule. Dig-backed claims: the Redis rate-limiter ecosystem listing (0.84), the rate-limit-redis store (0.64), the OWASP Secrets Management Cheat Sheet (0.86), GitHub push protection (0.94), secret scanning (0.96), the sensitive-data removal guide (0.96), and git-filter-repo (0.57). Weakly backed corroboration (labeled): rate-limiting walkthroughs at 0.14 to 0.30 and the rotation-ordering writeup at 0.25.
