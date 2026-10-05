# GitHub Secure Open Source Fund: cohort funding for maintainers

Scope: GitHub Secure Open Source Fund: grant size, cohort format, eligibility, application process, and what deliverables it expects.

## What the program is

GitHub describes the program as: "The GitHub Secure Open Source Fund invests in critical open source security, funding maintainers to reduce risk and strengthen the global OSS ecosystem" (https://github.com/open-source/github-secure-open-source-fund, weight 0.56).

The launch announcement on the GitHub Blog states: "Applications for the new GitHub Secure Open Source Fund are now open! Applications will be reviewed on a rolling basis until they close on January 7 at 11:59 pm PT. Programming and funding will begin in early 2025" (https://github.blog/news-insights/company-news/announcing-github-secure-open-source-fund/, weight 0.84). That establishes the two structural facts that still define the program's shape: applications are reviewed on a rolling basis, and funding is coupled to programming rather than paid as an unconditional grant.

The program's alumni showcase describes what participation produced for past projects, in their own words: "The program took us from 0 to security scans on every line of code, on every commit, and on every release" (https://github.com/open-source/github-secure-open-source-fund/projects, weight 0.72). Another alumnus frames the ecosystem-level effect: "The AI-agent ecosystem is safer, and will keep getting safer, because of the Secure Open Source Fund" (https://github.com/open-source/github-secure-open-source-fund/projects, weight 0.72). The Open Source Initiative's writeup directs prospective applicants to the official program page and announcement to apply (https://opensource.org/blog/improving-open-source-security-with-the-new-github-secure-open-source-fund, weight 0.72).

## Program mechanics as verified by this dig

What the primary sources support:

1. Rolling application review, with a stated close date for the opening session (https://github.blog/news-insights/company-news/announcing-github-secure-open-source-fund/, weight 0.84). Sessions recur; a new cycle's open and close dates must be read from the program page at application time.
2. Funding is bundled with programming and mentorship, not paid as a lump sum (https://github.blog/news-insights/company-news/announcing-github-secure-open-source-fund/, weight 0.84).
3. The deliverable pattern is concrete security improvements in the funded repository: the alumni evidence is about enabling security scans on every commit and release (https://github.com/open-source/github-secure-open-source-fund/projects, weight 0.72).

What this dig could not confirm from primary sources: the widely quoted grant amount (USD 10,000 per project) and cohort duration (3 weeks) appear only in third-party summaries and community threads, which scored below the authoritative threshold in this dig (https://www.helpnetsecurity.com/2024/11/20/open-source-security-funding/, weight 0.41; a community forum thread scored 0.04). Treat the amount and duration as unverified here and read them from the program's own page before relying on them (https://github.com/open-source/github-secure-open-source-fund, weight 0.56).

## Eligibility signals

The program funds "maintainers" of open source projects (https://github.com/open-source/github-secure-open-source-fund, weight 0.56), so the applicant is the maintainer or maintainers of the repository, not a corporation. GitHub's broader maintainer-support surface notes 280,000+ maintainers already access GitHub benefits including free Copilot Pro for eligible maintainers (https://github.com/open-source, weight 0.47), which indicates the audience definition GitHub uses elsewhere: active maintainers of real projects.

## Fit assessment for a scoped security deliverable

The program is the lowest-friction target in this corpus for an open-source security project, for three reasons grounded in the sources above:

1. Rolling review with modest documentation burden relative to research solicitations (https://github.blog/news-insights/company-news/announcing-github-secure-open-source-fund/, weight 0.84).
2. The expected output is a named security improvement to the funded repository, which is exactly the "scoped public deliverable" pattern: one closed blocker, one enabled security-scanning regime, one published hardening writeup (https://github.com/open-source/github-secure-open-source-fund/projects, weight 0.72).
3. Governance risk is low: the funder is a platform vendor funding security work in its own ecosystem, with no equity, roadmap-ownership, or exclusivity terms visible in the primary material.

## Practical conclusion

This fund is the right first application to validate the scoped-deliverable pattern, provided a specific, small, security-shaped deliverable is named in the application rather than a general ask. Before applying, confirm on the program page (https://github.com/open-source/github-secure-open-source-fund, weight 0.56) whether a session is currently open, and confirm the current grant amount and cohort format there rather than from third-party summaries.
