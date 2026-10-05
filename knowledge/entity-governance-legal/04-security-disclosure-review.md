# 04. Security disclosure, coordinated vulnerability disclosure, and trusted review

Scope: what a pre-GA open-source security project needs in place for vulnerability disclosure (a named contact, a SECURITY.md-style policy, a CVD process) and how trusted external review works for security-critical decisions.

## Coordinated vulnerability disclosure: the standard model

The disclosure model that governs how security issues reach the public is coordinated vulnerability disclosure (CVD), sometimes known as responsible disclosure: a vulnerability is disclosed to the public only after the responsible parties have been allowed sufficient time to patch or mitigate it (https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure, jev weight 0.12, weak backing).

Government guidance for manufacturers is explicit and recent. CISA, the NSA, and international partners jointly published best practices for software manufacturers and online service providers to design and implement a CVD program (https://www.cisa.gov/resources-tools/resources/establishing-coordinated-vulnerability-disclosure-program-work-security-researchers, jev weight 0.92), with the joint guidance document itself hosted by the Defense Media Activity distribution site (https://media.defense.gov/2026/Jul/14/2003961238/-1/-1/0/260714-D-AB123-1001.PDF, jev weight 0.77). That guidance states that suppliers should engage researchers by implementing a CVD program, which lets organizations adjust to changes in the frequency and quality of vulnerability submissions (https://media.defense.gov/2026/Jul/14/2003961238/-1/-1/0/260714-D-AB123-1001.PDF, jev weight 0.77).

## Open-source-specific CVD guidance

For open-source projects specifically, GitHub documents a recommended 4-step process for coordinated vulnerability disclosure with suggestions for reporters to foster a positive experience (https://github.blog/security/vulnerability-research/coordinated-vulnerability-disclosure-cvd-open-source-projects, jev weight 0.68). The OpenSSF maintains a dedicated guide to coordinated vulnerability disclosure for open source software projects, containing background material on vulnerability disclosure, the steps of the CVD process, considerations for the decision points of the process, and troubleshooting for common problems (https://oss-vulnerability-guide.openssf.org, jev weight 0.79). Within the OpenSSF ecosystem, the SIRT special interest group publishes a coordinated vulnerability disclosure policy template focused on secure vulnerability management capabilities within the open source ecosystem (https://github.com/ossf/SIRT/blob/main/coordinated-vulnerability-disclosure-policy.md, jev weight 0.63).

## Trusted review for security-critical code

Two resources frame what external security review looks like in practice for open source:

1. OWASP's Secure Code Review cheat sheet defines secure code review as the process of manually examining source code to identify vulnerabilities that automated tools often miss, analyzing application logic, data flow, and implementation details to detect flaws that require human judgment (https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html, jev weight 0.84).
2. The OpenSSF security-reviews repository is a community collection of security reviews of open source software, a public resource anyone can contribute to and consume under a permissive license (https://github.com/ossf/security-reviews, jev weight 0.42, weak backing).

## What this frames for a pre-GA project

For a project with a single founder and no security team, the dig supports a concrete, low-cost pre-GA checklist:

1. Publish a disclosure policy based on the OpenSSF CVD guide (https://oss-vulnerability-guide.openssf.org, jev weight 0.79) and GitHub's 4-step process (https://github.blog/security/vulnerability-research/coordinated-vulnerability-disclosure-cvd-open-source-projects, jev weight 0.68), naming an explicit contact even if that contact is the founder.
2. Follow the CISA/NSA joint guidance expectation that a manufacturer implements a CVD program before researchers need it (https://www.cisa.gov/resources-tools/resources/establishing-coordinated-vulnerability-disclosure-program-work-security-researchers, jev weight 0.92).
3. For trust-chain-affecting changes, adopt the human-judgment review pattern OWASP describes (https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html, jev weight 0.84) and treat the OpenSSF security-reviews corpus as the model for what a documented external review looks like (https://github.com/ossf/security-reviews, jev weight 0.42, weak backing).

The governance structure that makes these commitments enforceable (who decides, escalation) is covered in doc 03.
