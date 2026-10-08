# 03: OWASP Top 10 Prevention Patterns

Scope: the source doc's prevention patterns for the classic web application categories: injection, broken authentication, XSS, broken access control, security misconfiguration, and sensitive data exposure. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## The checklist is the Top 10 itself

The source doc states that the OWASP Top 10 categories are "the checklist itself" and that the patterns below are prevention patterns, not a ranking. OWASP's project page (weight 0.97) backs the framing: the Top 10 is "the reference standard for the most critical web application security risks" and adopting it is "perhaps the most effective first step towards changing the software development culture within your organization" (https://owasp.org/projects/top-ten). Note the drift risk: the source doc references the 2021 ordering, while OWASP now publishes a 2025 edition of the Top 10 (weight 0.76, https://owasp.org/Top10/2025). The categories the skill encodes (injection, auth, XSS, access control, misconfiguration, data exposure) remain the same prevention problems across editions; consult the current edition for the updated ranking.

## Injection: parameterize, never concatenate

The source doc's bad pattern is `SELECT * FROM users WHERE id = '${userId}'` built by string interpolation; the good patterns are a parameterized query (`db.query('SELECT * FROM users WHERE id = $1', [userId])`) or an ORM call that parameterizes internally (`prisma.user.findUnique`). The rule is at tier 1 (always do) in the skill's boundary system: parameterize all database queries.

## Broken authentication: hash passwords, harden sessions

The source doc's patterns: bcrypt hashing with 12 salt rounds (`hash(plaintext, 12)` and `compare`), and session middleware configured with the secret from `process.env.SESSION_SECRET` (never in code), `resave: false`, `saveUninitialized: false`, and cookies with `httpOnly: true`, `secure: true`, `sameSite: 'lax'`, and a 24 hour maxAge. Password hashing is tier 1; anything touching auth flows is tier 2 (ask first).

## XSS: auto-escape by default, sanitize when HTML is required

The source doc's bad pattern is `element.innerHTML = userInput`. The good patterns: render through framework auto-escaping (React escapes by default, so `<div>{userInput}</div>` is safe), and when HTML must be rendered, sanitize first with DOMPurify (`DOMPurify.sanitize(userInput)`). `innerHTML` with user-provided data is a tier 3 never-do.

## Broken access control: authorization is a separate check from authentication

The source doc's pattern is an explicit ownership check inside the route handler: load the task, compare `task.ownerId !== req.user.id`, and return 403 with a structured error (`{ code: 'FORBIDDEN', message: 'Not authorized to modify this task' }`) before proceeding with the update. Authentication proves who the caller is; the ownership comparison proves they may touch this resource. The skill's checklist requires an authorization check on every endpoint and admin-role verification on admin actions.

## Security misconfiguration: headers and CORS

The source doc uses helmet on Express: `app.use(helmet())` plus an explicit contentSecurityPolicy with `defaultSrc: ["'self'"]`, `scriptSrc: ["'self'"]`, `styleSrc` including `'unsafe-inline'` with the comment "tighten if possible", `imgSrc: ["'self'", 'data:', 'https:']`, and `connectSrc: ["'self'"]`. CORS is restricted to known origins read from `process.env.ALLOWED_ORIGINS?.split(',')`, never a wildcard. The helmet library's own documentation (weight 0.85) confirms the usage pattern, including that `helmet.contentSecurityPolicy()` works as standalone middleware, and recommends relying on CSP checkers such as CSP Evaluator rather than eyeballing policies (https://github.com/helmetjs/helmet). A low-weight writeup (0.25, https://www.securecoding.com/blog/using-helmetjs/) claims recent helmet versions ship a fixed set of headers and that a default CSP is not a policy; treat that as weakly backed color, consistent with the source doc's "tighten if possible" stance.

## Sensitive data exposure: shape your API responses and fail loud on missing secrets

Two patterns from the source doc: a `sanitizeUser` function that strips `passwordHash` and `resetToken` via destructuring before returning any user record, and a fail-fast check on environment secrets (`if (!API_KEY) throw new Error('STRIPE_API_KEY not configured')`). The first pattern prevents field leakage; the second prevents a missing secret from silently degrading into an unset credential.

## Provenance

Source doc claims: all code patterns above, the tier assignments, and the checklist items. Dig-backed claims: OWASP Top 10 framing (0.97, https://owasp.org/projects/top-ten), the 2025 edition's existence (0.76, https://owasp.org/Top10/2025), helmet usage and CSP-checker guidance (0.85, https://github.com/helmetjs/helmet), and OWASP Foundation description (0.91, https://owasp.org/). Weakly backed corroboration (labeled): helmet header-count and nonce guidance at 0.25 (securecoding.com) and Express hardening walkthroughs at 0.15 to 0.22 (apiposture.com, oneuptime.com, pkglog.com, stacklesson.com).
