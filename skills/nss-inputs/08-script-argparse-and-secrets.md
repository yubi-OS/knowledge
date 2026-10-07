# 08: Script input surfaces: the argparse-first pattern and the secrets doctrine

Scope: the yubiOS script input convention: CLI flags first, env secondary, config third, secrets last with a documented mode and an explicit never-logged rule, implemented as the four-step argparse pattern.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md` plus the searXNG dig (digs/08-script-argparse-and-secrets.json). The dig for this subtopic returned only one high-weight source: the Python argparse documentation.

## The four-step argparse pattern

The yubiOS scripts in `scripts/*.py` follow a four-step pattern, per the source doc: `argparse` CLI flags first; env vars as a secondary input channel with documented precedence; config files as a third; secrets last, with a documented mode and an explicit "never logged" rule. The Python argparse documentation (weight 0.97) is the reference for the parser mechanics: `add_argument` with `type`, `default`, `action="store_true"` for boolean flags, and `action="count"` for verbosity counters.

## The env-in-default trick

The source doc's example script consults the env var inside the `default=` expression:

```python
p.add_argument("--config", type=Path,
               default=Path(os.environ.get("YUBIOS_CONFIG", "config.yaml")),
               help="config file path (env: YUBIOS_CONFIG)")
```

The note in the source doc: the env var is consulted in the `default=` expression, so the help text reflects the precedence, and argparse still wins once the user passes `--config` explicitly. This is precedence implemented in the schema rather than described next to it, which is why guideline 9 (pre-register the input surface, schema-first) and this pattern are the same discipline at script scale.

## The full example, decoded

The source doc's Example 2 declares a complete script input surface: `--config PATH` (env: YUBIOS_CONFIG, default ./config.yaml), `--dry-run` (boolean, no default; absence = False), `--verbose` / `-v` (count, default 0), `YUBIOS_LOG_LEVEL` (env, default INFO; one of DEBUG/INFO/WARN/ERROR), and `/etc/yubios/secret` (file, mode 0400, required when `--sign` is set, refused if missing). Precedence: CLI > env > config file > built-in default. Validation: argparse rejects unknown flags; the config file is validated against schema version 2. Failure: exit code 2 on validation error; the offending name is logged but the value is never echoed.

## The secrets doctrine

The yubiOS doctrine, from `PROJECT_RULES.md` and the `audit-evidence-packaging` skill via the source doc: secrets are never echoed, never log-shipped, never put in an `ENV` directive that persists in an image, never put in a Containerfile `ARG`. At the script layer this means the secret channel is a file input with a documented mode (0400 in the example) and a conditional-required rule (required when `--sign` is set), not an env var. The failure behavior field of doc 02 is what enforces the never-echoed rule: the operator sees the canonical name and the expected type, never the value.

## What the dig adds

Beyond the argparse reference, the dig returned secondary material recorded at low weight: Stack Overflow threads on setting options from environment variables with argparse (weights 0.13 and 0.14, weak backing) describe hand-rolled env-override helpers that predate the env-in-default pattern; Twelve-Factor config summaries (weights 0.19 to 0.22, weak backing) restate the environment-as-config doctrine from factor 3 (see doc 03); a blog post on risks of secrets in environment variables (weight 0.22, weak backing) supports the never-in-env rule for secrets. One result, the Python argparse docs at weight 0.97, is the authoritative anchor; everything else in this doc beyond it traces to the source doc.
