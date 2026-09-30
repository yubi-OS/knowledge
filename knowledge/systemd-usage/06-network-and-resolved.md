# Network and DNS in practice: systemd-networkd and systemd-resolved

systemd-networkd and systemd-resolved split network configuration into two jobs. networkd applies address, route, and link configuration declared in `.network`, `.netdev`, and `.link` files, matching each file's `[Match]` section against interfaces as they appear. resolved owns the resolver side: a local DNS stub on 127.0.0.53, per-link DNS servers and routing domains, and LLMNR/mDNS. This doc covers the matching semantics that decide which file wins, the common static/DHCP/VLAN/bond setups, the networkctl verbs worth knowing, resolved configuration, and the debugging workflow when connectivity or name resolution breaks. All version notes reference systemd 262 documentation unless stated.

## When networkd is the right choice

networkd is a headless, declarative network manager. It detects and configures network devices as they appear and creates virtual devices from `.netdev` files (systemd-networkd.service(8)). It is the right tool for servers, containers, embedded and image-based systems where configuration is static per role and versionable on disk.

It is the wrong tool when interfaces change identity at runtime: it does not roam between Wi-Fi networks, manage per-user VPNs, or auto-join access points. For that use NetworkManager (ArchWiki, 0.63). The two can coexist: networkd only manages links matched by a `.network` file and ignores everything else, and interfaces with the udev property `ID_NET_MANAGED_BY=` set to another manager are never matched unless the value is `io.systemd.Network` (systemd.network(5), version-sensitive: this ownership mechanism is recent, verify on your release).

A behavior worth knowing before you adopt it: for links networkd manages, it flushes existing addresses and routes when bringing up the device, and when networkd exits it leaves devices intact, so netdevs whose configuration was removed are not torn down and may need manual cleanup (systemd-networkd.service(8)).

## File layout and precedence

Config lives in `/usr/lib/systemd/network`, `/usr/local/lib/systemd/network`, `/run/systemd/network`, and `/etc/systemd/network`. All files across all directories are collectively sorted in alphanumeric order regardless of directory. Files with identical filenames replace each other, and `/etc/` wins, so you override a vendor file by giving yours the same name; an empty file or a symlink to `/dev/null` masks a file entirely. Name your files with a prefix below `70-` or distro defaults and `systemd-network-generator.service` output can take precedence (systemd.network(5)).

Alongside `foo.network` you can ship a `foo.network.d/` drop-in directory; its `.conf` files merge in alphanumeric order and are parsed after the main file. Drop-ins under `/etc` beat `/run`, which beats `/usr/lib`, and drop-ins take precedence over the main file wherever it lives. Prefer drop-ins over editing main files: image-based systems keep `/usr` read-only (systemd.network(5)).

## Matching semantics

Three file types, three layers:

- `.link` files: handled by systemd-udevd, not networkd. They set low-level device attributes (names, altnames) and SR-IOV functions, applied at device-plug time (systemd-networkd.service(8)).
- `.netdev` files: create virtual devices. `Kind=` is compulsory; supported kinds include `bond`, `bridge`, `vlan`, `macvlan`, `vxlan`, `tun`, `tap`, `wireguard` and more (systemd.netdev(5)).
- `.network` files: apply addresses, routes, and DNS to a link.

For `.network` files the rule is strict: files are considered in alphanumeric order and the first file whose `[Match]` section matches a given interface is applied; all later files are ignored even if they also match (systemd.network(5)). So `10-eth0.network` shadows `40-generic.network` for eth0. A file with no valid `[Match]` settings matches all interfaces and networkd logs a warning; add `Name=*` to silence it deliberately.

`[Match]` keys include `MACAddress=`, `PermanentMACAddress=`, `Path=`, `Driver=`, `Type=`, `Kind=`, `Property=`, `Name=`, `SSID=`/`BSSID=` (Wi-Fi), plus host-level switches: `Host=`, `Virtualization=`, `KernelCommandLine=`, `KernelVersion=`, `Architecture=`, `Firmware=`. `Driver=` matches the udev driver string and supports globs, which is how you bind a file to a NIC family rather than a name (systemd.network(5)). `.link` files support the same match vocabulary plus `OriginalName=`, applied by udev at plug time (systemd.link(5)).

Practical precedence questions answered by this model: name matching is fastest but fragile against predictable renames; MAC matching survives renames but not NIC replacement; `Driver=` is the middle ground for fleets. One caveat: a catch-all `[Match]` in a low-numbered file will claim every interface, so order your filenames so specific files sort first.

## Common setups

Static address:

```ini
# /etc/systemd/network/10-eth0.network
[Match]
Name=eth0

[Network]
Address=192.168.1.10/24
Gateway=192.168.1.1
DNS=192.168.1.1
Domains=example.internal
```

`Address=` and `Gateway=` may be specified multiple times in `[Network]`; richer per-address and per-route settings go in `[Address]` and `[Route]` sections (systemd.network(5)).

DHCP: set `DHCP=` in `[Network]`, which accepts `yes`, `no`, `ipv4`, or `ipv6` and defaults to `no`; DHCPv6 is normally triggered by router advertisements when enabled (systemd.network(5)).

VLAN: create the device in a `.netdev` file, then match it in a `.network` file:

```ini
# /etc/systemd/network/20-vlan10.netdev
[NetDev]
Name=vlan10
Kind=vlan

[VLAN]
Id=10
```

The parent interface's `.network` file needs no extra config for the child; match `Name=vlan10` in `20-vlan10.network`. VLAN devices inherit the master MAC by default (systemd.netdev(5)).

Bond: `Kind=bond` netdev plus a `[Bond]` section for mode, miimon and so on; enslave links by matching them in `.network` files with `BindCarrier=` or per-interface files setting `Bond=` (systemd.netdev(5)). For both VLAN and bond, remember each member link also needs a `.network` file, or networkd leaves it unmanaged.

## networkctl in practice

`networkctl list` shows every link with its OPERATIONAL and SETUP state; `networkctl status eth0` shows driver, addresses, DNS servers, and the `.network` file that matched (networkctl(1)). Operational states range from `off` and `no-carrier` through `carrier`, `degraded` (link-local addresses only) to `routable`; setup states run from `pending` and `configuring` to `configured`, `unmanaged`, and `failed`. `unmanaged` plus a link you expected to configure almost always means your `[Match]` section did not match.

The reload verbs matter: `networkctl reload` rereads configuration from disk, and since v244 `networkctl reconfigure DEVICE` reconfigures one interface, but reconfigure does not reread the `.network`/`.netdev` files, so run `reload` first after editing files (networkctl(1)). `--no-reconfigure` (added in v262) reloads files without touching interfaces so you can apply changes selectively (version-sensitive). Also available: `renew` (renew a DHCP lease), `delete`, `up`/`down`, `lldp`, `edit` (opens the file in an editor and applies), `cat` (networkctl(1)).

## resolved configuration

resolved is usually the stub resolver: it listens on port 53 at 127.0.0.53 and 127.0.0.54 and programs route lookups. Four `/etc/resolv.conf` modes are supported; the recommended one symlinks `/etc/resolv.conf` to `/run/systemd/resolve/stub-resolv.conf`, which points all clients at the stub and carries up-to-date search domains. The other modes: a static `/usr/lib/systemd/resolv.conf` (stub, no search domains), `/run/systemd/resolve/resolv.conf` (upstream servers directly, for clients that must bypass the stub), and a managed file kept by a service like NetworkManager, from which resolved reads configured servers when it is not one of its own symlinks (systemd-resolved.service(8)).

Per-link DNS comes from `.network` files: `DNS=` in `[Network]` accepts repeatable server addresses in the format `address[:port]%ifname#SNI`, where the `#` suffix supplies SNI and certificate name for DoT (systemd.network(5)). `Domains=` takes a whitespace-separated list where items prefixed with `~` are routing-only domains and plain items are search domains used to extend single-label hostnames (systemd.network(5)). Name routing works by longest suffix: a lookup whose name matches a configured routing domain is sent to the servers of the links that define the best-matching (most-labels) domain (systemd-resolved.service(8)).

DNSSEC and DoT are set globally in `resolved.conf` and overridable per link via `DNSSEC=` and `DNSOverTLS=` in `.network` files, with per-link settings applying to per-link servers and the global setting applying to system DNS servers. `DNSSEC=` takes `yes`, `no`, or `allow-downgrade`; `yes` fails all lookups if the upstream does not support DNSSEC correctly, so the upstream recommendation is `true` only where the server is known-good and trust anchors are updated, `allow-downgrade` otherwise. `DNSOverTLS=` takes `yes`, `no`, or `opportunistic` and defaults to `no` (resolved.conf(5)).

## NSS integration

resolved replaces `nss-dns` via `nss-resolve`: set `hosts:` in `/etc/nsswitch.conf` to `resolve [!UNAVAIL=return]` placed early, before `files` because resolved resolves `/etc/hosts` with caching, after `mymachines` so container hostnames win over DNS, and keep `dns` after `resolve` as a fallback if resolved is down (nss-resolve(8)). `nss-myhostname` resolves the local hostname to the machine's own addresses (or 127.0.0.2/::1 if none), `localhost`, and the special names `_gateway`, `_outbound`, and `_localdnsstub` (nss-myhostname(8)). A typical line: `hosts: files mymachines resolve [!UNAVAIL=return] myhostname`.

## Debugging workflow

1. `networkctl status <if>`: is the link managed, which file matched, what is the setup state (networkctl(1)).
2. `networkctl list`: setup `unmanaged` means no `[Match]` matched; check `Driver=`/`MACAddress=` assumptions against the udev values shown in `status`.
3. After config edits: `networkctl reload && networkctl reconfigure <if>`, not a service restart.
4. `resolvectl status`: shows per-link DNS servers, domains, DNSSEC and DoT state; `resolvectl query` tests lookups with source link shown; `resolvectl flush-caches` clears cache; `resolvectl statistics` shows cache hit and validation counts; `resolvectl revert <link>` undoes runtime overrides set via `resolvectl dns`/`domain` (resolvectl(1)).
5. For deep DNS tracing raise the log level at runtime with `resolvectl log-level debug` instead of editing config files, then follow `journalctl -u systemd-resolved -f`; watch resolution happen query by query (Unix Stack Exchange, 0.83). The same `log-level` knob exists in resolved.conf for persistence.

A common split-brain: `dig example.com` on the host works but an application fails, because the app uses `/etc/resolv.conf` and that file is not pointed at the stub. Check the symlink first, then `resolvectl status` for which link owns the routing domain.

## Sources considered

- systemd-networkd.service(8), freedesktop.org, verified directly: used.
- systemd.network(5), freedesktop.org, verified directly: used.
- systemd.link(5), freedesktop.org, verified directly: used.
- systemd.netdev(5), freedesktop.org, verified directly: used.
- networkctl(1), freedesktop.org, verified directly: used.
- systemd-resolved.service(8), freedesktop.org, verified directly: used.
- resolvectl(1), freedesktop.org, verified directly: used.
- resolved.conf(5), freedesktop.org, verified directly: used.
- nss-resolve(8), freedesktop.org, verified directly: used.
- nss-myhostname(8), freedesktop.org, verified directly: used.
- ArchWiki systemd-networkd (0.63): used for networkd-vs-NetworkManager positioning.
- Unix Stack Exchange, "How to troubleshoot DNS with systemd-resolved" (0.83): used for `resolvectl log-level debug`.
- Akamai techdocs (0.67): rejected, vendor tutorial redundant with primary sources.
- OneUptime blog posts (0.17, 0.20): rejected, low-weight aggregator blog.
- Linux Junkies guides (0.13, 0.15): rejected, low-weight blog.
- poweradm.com (0.14): rejected, low-weight blog.
- devopsaitoolkit.com (0.20): rejected, low-weight blog.
- Wikipedia systemd (0.14, 0.20): rejected, tertiary.
- GitHub mirrors of systemd man XML and man7.org: rejected as fallback only, not needed, freedesktop.org served directly with User-Agent omni-agent/1.0.
