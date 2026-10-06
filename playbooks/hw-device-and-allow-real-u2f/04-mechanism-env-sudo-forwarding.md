# 04 - Mechanism: ALLOW_REAL_U2F env plumbing and explicit sudo forwarding

Scope: the 2 plumbing hops from dispatch input to test-visible environment variable, and why the second hop is the one people miss.

The source doc describes the plumbing as 2 hops, and warns that the second is the one people miss (source doc: yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md):

1. `allow_real_u2f: true` sets `ALLOW_REAL_U2F=1` in the step env. This was added by commit `5200f0b` (source doc).
2. The test call must forward the variable explicitly through sudo, because sudo does not inherit the parent env. This was added by commit `5342867` (source doc).

The forwarding line the playbook records is:

```bash
sudo env ALLOW_REAL_U2F="${ALLOW_REAL_U2F}" ./tests/vm/test-luks-fido2-ci.sh
```

(source doc)

External backing for why hop 2 is necessary: the sudo project's sudoers manual documents that sudo resets the environment to a minimal default set for the invoked command, and that variables from the invoking user's environment are not passed through unless they are whitelisted via `env_keep` or set explicitly on the command line (https://www.sudo.ws/docs/man/1.8.31/sudoers.man/, jev weight 0.89). The man7.org sudoers manual page documents the same environment-resetting behavior (https://www.man7.org/linux/man-pages/man5/sudoers.5.html, jev weight 0.80). `sudo env VAR=value command` is the direct mechanism for setting a variable in the invoked command's environment, which is exactly the shape the playbook uses.

Consequence of skipping hop 2: the flag was set in CI and invisible to the test. The source doc records this as the pre-`5342867` state: without the explicit forwarding, `ALLOW_REAL_U2F` existed in the step env but the sudo-rooted test process never saw it (source doc). The guard's behavior in that state is indistinguishable from a missing flag: it refuses when a real key is attached, which is correct behavior, but for a confusing reason.

Dig record note: the first dig attempt for this subtopic returned no result at weight 0.5 or higher. A redo with different queries (sudoers env_keep and sudo env patterns) produced the 2 primary sources above (sudo.ws manual 0.89, man7.org sudoers 0.80). The redo is logged in `research-db/digs/04-mechanism-env-sudo-forwarding.json`.

The remaining shellcheck angle is recorded in 06: commit `6dad3733` patched the shellcheck disable that PR #144's inline `ALLOW_REAL_U2F=1` triggered, because shellcheck does not track cross-file consumers of a variable (source doc).
