# Dependencies, Ordering, Install Sections and Drop-Ins

Scope: the dependency and ordering directives (Requires, Wants, BindsTo, PartOf, Upholds, After, Before), the [Install] section, the unit file search path, and the drop-in override pattern.

## Two separate mechanisms: requirements and ordering

systemd separates "do I need this unit" from "do I start after this unit". A dependency guide frames it as "two separate mechanisms: ordering (when to start) and requirements" (https://www.dev-toolbox.tech/tools/systemd-unit-generator/examples/dependency-ordering, weight 0.04, weak backing), and the semantics live in systemd.unit(5) (https://www.freedesktop.org/software/systemd/man/systemd.unit.html, weight 0.98). The distinction matters because adding Requires= without After= gives you a requirement with no ordering, so both units still start concurrently.

## The dependency directives, weakest to strongest

| Directive | Coupling |
|---|---|
| Wants= | Soft: start the listed unit, ignore its failure |
| Requires= | Hard: listed unit must be started; its failure fails this unit |
| BindsTo= | Strongest: stop or failure of the listed unit stops this unit too |
| PartOf= | Stop and restart propagate together; failure does not propagate |
| Upholds= | Like Wants=, but continuously re-activates the listed unit if it stops (introduced v250) |

These semantics follow systemd.unit(5) (https://www.freedesktop.org/software/systemd/man/systemd.unit.html, weight 0.98), with the Upholds= and version notes recorded in the yubiOS systemd reference (session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md). The Requires= versus BindsTo= boundary is a known confusion point: a Server Fault question asks exactly where "accidentally stopping" the required unit stops the depending unit (https://serverfault.com/questions/1012550/systemd-requires-vs-bindsto, weight 0.09, weak backing); the man page text is the tiebreaker.

Ordering-only directives are After= and Before=. They carry no dependency: they only order jobs. Fedora Magazine's explainer shows the canonical pairing with a real unit: "The ordering directive After ensures that the SSH server will not run until after the host key generation unit, and after the network is up" (https://fedoramagazine.org/systemd-unit-dependencies-and-order/, weight 0.13, weak backing). The same article notes that Wants and Requires are often combined with After to get both halves right, which matches the systemd.unit(5) semantics (https://www.freedesktop.org/software/systemd/man/systemd.unit.html, weight 0.98).

## The [Install] section

[Install] is not runtime configuration; it is what `systemctl enable` acts on. WantedBy= and RequiredBy= name the targets that receive the symlink when the unit is enabled, typically multi-user.target; Alias= creates an alternative unit name symlink; Also= lists additional units to enable or disable together (semantics per systemd.unit(5), https://www.freedesktop.org/software/systemd/man/systemd.unit.html, weight 0.98, and the yubiOS systemd reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md).

## Unit file search path precedence

In system mode systemd resolves a unit name against a precedence-ordered search path. The yubiOS reference records the order as: 1 /etc/systemd/system.control/ (API-managed), 2 /run/systemd/system.control/ (API-managed), 3 /etc/systemd/system/ (admin), 4 /run/systemd/system/ (runtime), 5 /usr/local/lib/systemd/system/ (local admin), 6 /usr/lib/systemd/system/ (packages). The upstream unit(5) page documents the resolution behavior including template instantiation: "If systemd looks for a unit configuration file, it will first search for the literal unit name in the file system. If that yields no success and the unit name contains an @ character, systemd will look for a unit template that shares the same name but with the instance string removed" (https://www.freedesktop.org/software/systemd/man/systemd.unit.html, weight 0.98). The practical rule: files under /etc/systemd/system/ shadow packaged units, and control directories shadow everything.

## Drop-in overrides

Drop-in directories are the sanctioned way to override packaged units without editing them. Files with the suffix .conf in a unit's .d directory "will be parsed after the unit file itself is parsed", which lets you "alter or add configuration settings for a unit, without having to modify unit files" (https://jira.mariadb.org/browse/MXS-2627, weight 0.08, weak backing, quoting the systemd drop-in behavior). The pattern from the yubiOS reference:

```
/etc/systemd/system/myservice.service.d/
    10-override.conf
    20-hardening.conf
```

Files merge in lexical order, and a type-wide drop-in such as /etc/systemd/system/service.d/99-sandbox.conf applies to every .service unit on the system (yubiOS reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md). Flatcar's documentation confirms the mechanism and its trade-off: drop-ins keep local changes out of the package file, at the cost that "some future Flatcar Container Linux updates might be incompatible with the local changes, but the risk is much lower" (https://www.flatcar.org/docs/latest/os-config/host-config/drop-in-units/, weight 0.59).

Two merge rules cause most drop-in surprises. Settings that take a single value replace; list-valued settings append unless cleared. ExecStart= is the classic case: a drop-in that re-sets it must first clear it with an empty assignment, then set the new value, a rule the drop-in guides call out explicitly (https://www.bigiron.cc/guides/systemd-drop-ins-overriding-a-unit-without-editing-the-package-file, weight 0.11, weak backing). After any drop-in change, `systemctl daemon-reload` is required for the manager to see it.
