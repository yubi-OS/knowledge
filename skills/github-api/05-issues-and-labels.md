# 05 issues-and-labels

Scope: the Issues family the source doc uses for tracking work: creating issues with labels, commenting, listing, and creating labels, including the 422 already-exists convention.

## Ground spine

Source doc: `yubi-OS/yubiOS skills/github-api/SKILL.md`. External grounding from searXNG dig, weighted by jev-1.13 noul.

## Creating an issue

The source doc's create pattern is `POST {base}/issues` with a JSON body carrying `title`, `body` (markdown), and `labels` (an array of label name strings); the response's `number` field is the issue number used by every follow-up call (source doc). The example shows a tracking issue for a base-image digest bump with three labels at once: `phase-0`, `adr`, `build` (source doc), so labels are applied at creation rather than patched on later.

The official issues documentation describes the family as a whole: "Use the REST API to view and manage issues, including issue assignees, comments, labels, and milestones" (https://docs.github.com/en/rest/issues, weight 0.97). That framing matters because labels and comments share the issues surface rather than living under a separate top-level resource.

## Commenting

The comment pattern is `POST {base}/issues/<number>/comments` with `{body: "<text>"}` (source doc). The source doc's example comment reports a resolved value ("Digest found: sha256:6a60ff82..."), which is the operational pattern: the issue is the thread, and each automated step posts its result as a comment so the trail stays in one place.

## Listing

The list pattern is `GET {base}/issues?state=open&per_page=50` (source doc). Two parameters are doing work here: `state=open` filters to open issues only, and `per_page=50` raises the default page size so a dashboard-style script gets a full board in one call.

## Labels

Label creation is `POST {base}/labels` with `{name, color, description}`, where color is a 6-digit hex string such as `f59e0b` (source doc). The source doc appends the operational note: "422 = already exists, safe to ignore" (source doc). That one line encodes an idempotency convention worth restating: org automation creates labels on demand, treats the 422 validation response as confirmation rather than failure, and moves on. It is the only place in the skill where a 4xx response is specified as success-adjacent.

The official labels documentation explains why labels sit inside the issues API: "You can use the REST API to manage labels for a repository and add or remove labels to issues and pull requests. Every pull request is an issue, but not every issue is a pull request. For this reason, 'shared' actions for both features, like managing assignees, labels..." (https://docs.github.com/en/rest/issues/labels, weight 0.97). The practical consequence: a label applied to a draft PR flows through the same endpoints as a label on an issue, and the source doc's issue examples work unchanged for PR threads.

## How the patterns compose

The source doc's example flow is a complete loop: an issue tracks a pending change, labels classify it, comments record progress with concrete values (a digest, a PR number), and listing gives any later script the current open set. Nothing in the loop needs a checkout or a local clone; it is pure REST, which is what makes it usable from scheduled jobs and agent sessions (source doc).

## Dig surface

Both queries for this subtopic returned the two authoritative docs at weight 0.97; the remaining results were homepage, sign-in, blog, and social pages weighted 0.05 to 0.20 and rejected. No redos were needed for this subtopic.
