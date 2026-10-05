# 04: Argv arrays and the injection question

Scope: argv-array remote execution with `shell=False`, why no shell strings cross the wire, injection surface analysis, and the `bash -c` escape hatch.

## How command injection happens

Command injection occurs when an application constructs a command string from unsanitized input and passes the resulting string to a shell; the shell then interprets metacharacters in that input as operators (source: https://runebook.dev/en/docs/python/library/subprocess/security-considerations, jev weight 0.58). It is consistently rated critical severity because successful exploitation yields OS-level code execution on the host (source: https://offensive360.com/blog/command-injection-vulnerabilities/, jev weight 0.22, weak). The mechanism is the metacharacter set: characters like `;`, `|`, `&&`, `$()`, and backticks change how a shell parses the rest of the line (source: https://techearl.com/os-command-injection, jev weight 0.17, weak).

Real advisories show the class is not theoretical. Gentoo issued GLSA 202009-16 for a shell injection in LinuxCIFS where a remote code execution was possible via a command line option (source: https://security.gentoo.org/glsa/202009-16, jev weight 0.94). For a bridge that executes commands on a machine holding a real YubiKey and running destructive disk tests, the injection question is the security question.

## shell=True vs shell=False

Python's subprocess functions take a `shell` argument specifying whether the command should be executed through a shell; using `shell=True` is dangerous because it invokes the shell, which re-interprets the string (source: https://docs.semgrep.dev/cheat-sheets/python-command-injection, jev weight 0.79). The mitigation is structural: pass an argument list (argv array) and avoid shell interpretation of untrusted input (source: https://orbisappsec.com/blog/command-injection, jev weight 0.31, weak). Python's own docs make the same point in their security-considerations discussion of the subprocess module (source: https://runebook.dev/en/docs/python/library/subprocess/security-considerations, jev weight 0.58).

`subprocess.run` with an argv list also gives the caller a clean result contract: captured stdout and stderr, a numeric return code, and a timeout (source: https://openpython.org/articles/python-subprocess-run-shell-commands, jev weight 0.24, weak). Those are exactly the fields the bridge puts in its JSON envelope.

## The argv guarantee

The bridge accepts a JSON body whose `command` field is an array of strings, and executes `subprocess.run(cmd, shell=False)`. The security posture is provable from the bridge code itself: because the wire format is an argv array and the handler passes it straight to `subprocess.run` with `shell=False`, there is no shell in the path to interpret metacharacters (source record, refs/debug-with-cli, 2026-08-01, unweighted).

Two properties of this design deserve emphasis. First, the argv shape is enforced by the bridge code, not by caller discipline: even if a caller crafts `["bash"]`, that is argv to bash with no script string, not `bash -c "<attacker string>"`. Second, no shell means no pipes, no `&&`, no `||`, no glob expansion at the bridge layer, which is the direct source of the limitations in doc 08.

## The bash -c escape hatch

Sometimes a probe genuinely needs shell semantics, such as `dmesg | head -20`. The supported workaround is to make the shell invocation explicit in argv: `["bash", "-c", "dmesg | head -20"]` (source record, unweighted). This is honest in a way a hidden shell layer is not: the caller can see, in the command array it is sending, that it is opting into shell interpretation, and it accepts the responsibility for what the shell string contains. The bridge does not need to distinguish the two cases; `bash` is just another binary in the argv.

The same explicitness covers per-call environment variables, which the bridge does not support natively: `["bash", "-c", "FOO=bar my-cmd"]` (source record, unweighted). A future bridge version could add an env field, but the escape hatch keeps the current surface minimal.

## Practical posture

The combined posture is: one bearer token gates who can execute, argv arrays gate what can be interpreted, and the localhost-only listener plus Funnel ingress gates where requests can arrive from (docs 02 and 07). None of these layers is strong alone; together they make a 50-line bridge defensible for a machine with secrets attached.
