# 05 - Exit semantics and shell error propagation

Scope: dimensions 6 and 7 of the Mode axis: failure semantics (exit codes, "differences found" codes) and shell error propagation (`set -e`/`errexit`, `set -o pipefail`).

## Dimension 6: failure semantics (0-2)

The source doc contract: "exit 0 = success; failures non-zero; 'differences found' codes not confused with errors." The 0/1 convention is formal in the Bash Reference Manual: the exit status of a command is 0 for success and nonzero for failure, and the manual states the counter-intuitive-looking scheme exists "so there is one well-defined way to indicate success and a variety of ways to indicate various failure modes" (https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html, weight 0.92). A mode contract that treats nonzero as an undifferentiated "error" bucket is missing half the contract: the interesting codes are the specific failure modes.

Exit values live in 8 bits: 0 through 255. The GNU Coding Standards make the constraint concrete: "exit status values are limited to 8 bits (0 through 255). A single run of the program might have 256 errors; if you try to return 256 as an error status the caller sees 0" (https://www.gnu.org/prep/standards/standards.html, weight 0.86). The rubric's scoring reads this as: a file that documents per-error exit codes must show they fit the byte range and are distinguishable from signal deaths.

Two special ranges matter. The Bash manual documents 128+N as the status when a command is terminated by signal N, so statuses above 128 are effectively reserved for signal deaths rather than application-defined errors. GNU Coding Standards require errors to be reported in a parseable format: "Error messages from other noninteractive programs should look like this: program: source-file-name: lineno: message" (https://web.mit.edu/gnu/doc/html/standards_15.html, weight 0.79); the errors chapter also covers message capitalization and not ending with a period (https://www.gnu.org/prep/standards/html_node/Errors.html, weight 0.86). The sysexits.h range (64-78) is the BSD-side vocabulary for "exit with dignity" classes; the Advanced Bash-Scripting Guide's exit-code page catalogs the common conventions including 126, 127, and the 128+N range (https://tldp.org/LDP/abs/html/exitcodes.html, weight 0.48, weak backing).

The "differences found" clause is the subtle one: diff-like tools exit 1 to mean "differences were found" (a successful check with findings) and 2 for real trouble. A mode contract must keep those apart; a CI caller keying on "nonzero means bug" will misroute the findings case. GNU's Autoconf manual documents the same class of subtlety for signal handling across shells: whether a shell exits with an error on termination by a trapped signal varies by shell (https://www.gnu.org/software/autoconf/manual/autoconf-2.69/html_node/Signal-Handling.html, weight 0.82).

## Dimension 7: shell error propagation (0-2)

The source doc wants `set -e`/`errexit`, `set -o pipefail`, explicit status checks where needed, and documented exceptions. The core observation is negative: "Shell scripts don't actually fail automatically. If one line returns a non-zero (failure) exit code, that code simply falls through to the next line" (https://jasonfleetwoodboldt.com/courses/shell-scripting/shell-scripting-set-euo-pipefail-failsafe/, weight 0.14, weak backing). `set -o errexit` supplies the default-exit behavior (https://elder.dev/posts/safer-bash/, weight 0.19, weak backing).

But the source doc's guideline 5 is explicit: "`set -e` is not complete error handling. Document exceptions and `pipefail`." The exceptions are real shell semantics, not folklore: commands in conditional contexts are exempt from errexit, and pipelines hide failures of every member except the last unless `pipefail` is set. A file that ships `set -e` without `set -o pipefail` earns at most 1, and the red-flag table says exactly that: "`set -e` without `set -o pipefail` -- upstream pipeline failures hidden" (source doc).

The fail-fast failure mode is the practical stake: a script whose linting step failed but whose pipeline still reported green, because the error status fell through (https://morgan.cugerone.com/blog/quick-tip-to-fail-fast-your-shell-scripts/, weight 0.20, weak backing). CI runners standardize on the full set: `bash --noprofile --norc -eo pipefail` is the pattern the source doc's Example 3 checks for when scoring a GitHub Actions workflow (source doc).

## Scoring notes

- A file earns dimension 6 fully by documenting its exit-code vocabulary, including which codes mean findings versus errors.
- A file earns dimension 7 fully by stating the errexit/pipefail posture AND the exceptions where a nonzero status is expected and handled.
- Exit-code tests are part of the contract: the CLI design guide's test checklist includes verifying exit codes for success and failure conditions (https://deepwiki.com/cli-guidelines/cli-guidelines/3-the-basics-of-cli-design, weight 0.15, weak backing).
- The portable spelling is EXIT_SUCCESS/EXIT_FAILURE in C, plain 0/nonzero in scripts (https://www.man7.org/linux/man-pages/man3/exit.3.html, weight 0.82).
