# 05 Axis 4: Security

Scope: the fourth review axis, whether the change introduces vulnerabilities, and the specific checks the reviewer walks at merge time.

Grounding spine: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md` (source doc). External mechanisms are cited with their jev weight.

## Delegation boundary

The source doc is explicit that this axis is a review gate, not a security discipline: for detailed security guidance the reviewer is pointed to the `security-and-hardening` skill (source doc). The axis exists so that no merge slips through without a vulnerability pass, while the deep work happens elsewhere. The same pattern holds for performance in doc 06.

## The checks the reviewer walks

The source doc lists 8 checks for the axis (source doc):

1. Is user input validated and sanitized?
2. Are secrets kept out of code, logs, and version control?
3. Is authentication and authorization checked where needed?
4. Are SQL queries parameterized, with no string concatenation?
5. Are outputs encoded to prevent XSS?
6. Are dependencies from trusted sources with no known vulnerabilities?
7. Is data from external sources treated as untrusted?
8. Are external data flows validated at system boundaries before use in logic or rendering?

These map closely onto established industry checklists. OWASP's Secure Code Review cheat sheet organizes review around exactly this kind of risk-focused question set, covering injection, authentication, session management, and input validation as first-class review categories (noul 0.85, https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html). OWASP itself is the reference body for application security knowledge, maintained as an open foundation (noul 0.86, https://owasp.org/).

Input validation deserves its own emphasis because it is the entry point for most of the other checks. MDN's security guidance frames input validation as a defense-in-depth layer: validate data type, size, range, and format at every trust boundary, since client-side checks alone are bypassable (noul 0.90, https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Input_validation). The source doc's phrasing, "validated at system boundaries before use in logic or rendering", is the same idea expressed at the architecture level.

Secure code review as a methodology, distinct from penetration testing, is what the skill is practicing: code-level inspection before deployment, aligned with the review gate (noul 0.60, https://docs.hacken.io/methodologies/secure_code_review/).

## Severity handling in review

Security findings sit at the top of the severity ladder. The Critical prefix blocks merge and is reserved for security vulnerability, data loss, and broken functionality (source doc). A security-sensitive change without security-focused review is on the red-flag list (source doc). The lead-with-what-matters rule puts correctness and security findings first in the comment ordering, before structural regressions and everything else (source doc).

## Dependency trust

Two of the 8 checks concern supply chain: dependencies from trusted sources with no known vulnerabilities, and external data treated as untrusted. The dependency side is elaborated in the skill's dependency discipline section: before adding any dependency, check whether the existing stack solves the need, how large it is, whether it is actively maintained, whether it has known vulnerabilities via audit tooling, and whether its license is compatible (source doc). The rule the skill draws is to prefer standard library and existing utilities over new dependencies, because every dependency is a liability (source doc).

## The checklist boxes

The review checklist carries 5 security boxes into the merge gate (source doc): no secrets in code, input validated at boundaries, no injection vulnerabilities, auth checks in place, and external data sources treated as untrusted. These are the 8 walk-through checks compressed into what a reviewer can verify in seconds per file.
