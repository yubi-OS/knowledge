# 06: systemd unit inputs: Environment=, EnvironmentFile=, and the runtime-surface boundary

Scope: how a systemd unit's Environment= and EnvironmentFile= directives form the input surface, the file mode/ownership/reload rules, and why runtime-surface directives are recorded separately from inputs.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md` plus the searXNG dig (digs/06-systemd-environment-inputs.json). The dig for this subtopic returned mostly secondary material; the strongest source is Flatcar Container Linux's environment-variables documentation.

## Environment= in the unit

The source doc: `Environment=KEY=VAL` declares variables directly in the unit, and the key/val pair is visible to anyone who can run `systemctl show`. That visibility is itself a secret-consequence property: a secret placed in an inline `Environment=` directive is exposed to every operator with show access. Flatcar's documentation on environment variables in systemd units (weight 0.90) documents both `Environment=` and `EnvironmentFile=` as the two supported channels for passing configuration into services, matching the source doc's split.

## EnvironmentFile= and the file discipline

The source doc requires documenting the file's mode (0600 expected), ownership, and reload behavior: `systemctl daemon-reload` plus a unit restart, NOT a SIGHUP. The reload distinction matters operationally: editing the environment file does nothing to a running service until the unit is restarted, and the reload path is a documentation obligation, not an implementation detail. The dig collected several secondary treatments of this reload behavior (phoenixnap on daemon-reload, weight 0.22, weak backing; linux-audit on reloading systemd configuration, weight 0.26, weak backing; Baeldung on systemd environment variables, weight 0.26, weak backing) and a serverfault thread (weight 0.23, weak backing); they agree with the primary sources but are recorded low-weight. Wikipedia's systemd article (weight 0.52, moderate backing) gives general context only.

## The runtime-surface boundary

The source doc is explicit: `WorkingDirectory=`, `User=`, `ExecStart=`, `CapabilityBoundingSet=`, `ReadOnlyPaths=`, `ProtectSystem=`, and similar directives are not inputs in the NSS-Inputs sense; they configure the runtime surface. Record them next to Inputs, separately. This is the same boundary doc 01 draws for LABEL in a Containerfile: the seven-channel taxonomy stays short by excluding what the platform itself consumes rather than what the program consumes.

## The yubiOS example, decoded

The source doc's Example 3 declares a complete unit input surface: `Environment=YUBIOS_RELEASE=45` set in the unit and visible via `systemctl show yubiOS.service`; `EnvironmentFile=-/etc/yubios/yubiOS.conf` optional, so absence applies defaults; the file itself mode 0600, root:root, KEY=VALUE per line, comments starting with #. `WorkingDirectory=/var/lib/yubios` and `ExecStart=/usr/bin/yubiOS-launch` are declared but marked not inputs. Precedence: Environment= in unit > EnvironmentFile= > built-in default. Validation: systemd rejects KEY=VALUE lines with an unparsable value at daemon-reload time. Failure: `systemctl status yubiOS.service` shows the failing line and `journalctl -u yubiOS.service` shows the application-level rejection.

## Secrets in units

Guideline 6: a secret belongs in `EnvironmentFile=` (mode 0600), in BuildKit `--mount=type=secret`, in Kubernetes `Secret`, or in `secrets:` on GitHub Actions, never in `ENV`, never in `ARG`, never in a log line, never in `--help` output. The dig collected articles arguing for systemd credentials and against .env files for services (weights 0.14 to 0.27, weak backing) which point in the same direction; the source doc plus guideline 6 carries the doctrine, and doc 09's verification check 3 turns it into an auditable rule: if the file documents a secret, the declaration must reference one of the safe channels.
