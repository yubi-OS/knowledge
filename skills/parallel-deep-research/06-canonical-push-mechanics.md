# 06. Canonical Push Mechanics

Scope: step 5 of the workflow, publishing the synthesized note to refs/ on yubi-OS/yubiOS main through the GitHub Contents API, and the shell-quoting pitfalls the source doc flags.

## The target and the call

The canonical location is `refs/<topic-slug>-YYYY-MM-DD.md` on `yubi-OS/yubiOS` main (source doc, workflow step 5). The push uses the GitHub Contents API PUT with the `X-Sauna-Connection-Id: conn_3h7rj41VF6hs` header (source doc). The authoritative documentation is GitHub's REST reference for repository contents: endpoints to create, modify, and delete base64-encoded content in a repository (https://docs.github.com/en/rest/repos/contents, weight 0.98), part of the broader GitHub REST API documentation (https://docs.github.com/en/rest, weight 0.97). A mirrored API reference describes the contents methods as retrieving file contents as base64 with media types for raw or rendered output (https://docs2.lfe.io/v3/repos/contents/, weight 0.74). The PUT-to-create shape is standard: path, message, content (base64 of the file bytes), and branch, returning the new file's commit metadata.

## The quoting pitfall, stated plainly

The source doc's step 5 carries an explicit warning (source doc): "Watch for JSON shell-quoting issues. Apostrophes in commit messages break single-quoted bodies. Use a temp file for the JSON body, or a Python heredoc."

The failure mode is concrete: a shell command like `curl -d '{"message":"It's done",...}'` dies the moment the message contains an apostrophe, because the single-quoted body terminates early. Practitioner writeups document the same trap from other angles. A heredoc guide catalogs generating JSON payloads in bash, including quoted-delimiter literal mode and piping heredoc output, and the common mistakes around them (https://linuxize.com/post/bash-heredoc/, weight 0.31, weak). A dedicated writeup on shell heredoc JSON shows why single quotes alone do not solve it: they let you embed double quotes but lose the ability to interpolate variables, which pushes people toward fragile nesting (https://www.ryanmr.com/posts/shell-heredoc-json, weight 0.22, weak). An article on curl POST quoting describes how improper quotation handling produces host-resolution errors and unmatched brace issues, and recommends heredoc-based construction (https://devgex.com/en/article/00009741, weight 0.16, weak). A gist captures the pragmatic pattern: assign the JSON payload to a variable via heredoc, then pass that variable to curl's data parameter (https://gist.github.com/daynemay/704dfc459c550198e93d723f16efb3bb, weight 0.12, weak). A tools roundup reaches the same conclusion: for nontrivial JSON, the robust options are heredocs, jq generation, or writing the payload to a file (https://wildandfreetools.com/blog/escape-json-for-bash-shell-script/, weight 0.16, weak).

## The two sanctioned fixes

Per the source doc, there are two safe constructions (source doc, step 5):

1. Temp file: write the full JSON body (message, content, branch) to a file, then `curl -d @/tmp/body.json`. The file can be written by any tool that quotes correctly, including a Python script or a heredoc with a quoted delimiter.
2. Python heredoc: build and send the request inside a Python process, where JSON is serialized by `json.dumps` and never re-parsed by the shell.

Both remove the shell from the quoting path entirely. The rule of thumb the sources converge on: never construct JSON inline in a shell string when the content can contain apostrophes.

## Where this fits in the workflow

The push is step 5, after synthesis is saved to session (step 4, doc 05) and before borrow-intent verification (step 6, doc 07). The sequencing matters: the push publishes the research record, and step 6 decides whether any code change follows. A finding that survives verification but turns out to be already implemented better is redirected into a refs/ note (source doc, step 6), which is a second, smaller push through the same mechanics described here.

## Length budget for the landed note

The canonical note is not the full synthesis. Discovery findings land at 500 to 1500 words (source doc, Length budgets), a compressed record of what was found and what it means for the repo, with sources. The session file keeps the full synthesis; the refs/ note is the durable, citable distillation.

Sources: source doc (yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md, workflow steps 4 to 6 and Length budgets); https://docs.github.com/en/rest/repos/contents (0.98); https://docs.github.com/en/rest (0.97); https://docs2.lfe.io/v3/repos/contents/ (0.74); https://linuxize.com/post/bash-heredoc/ (0.31, weak); https://www.ryanmr.com/posts/shell-heredoc-json (0.22, weak); https://devgex.com/en/article/00009741 (0.16, weak); https://wildandfreetools.com/blog/escape-json-for-bash-shell-script/ (0.16, weak); https://gist.github.com/daynemay/704dfc459c550198e93d723f16efb3bb (0.12, weak).
