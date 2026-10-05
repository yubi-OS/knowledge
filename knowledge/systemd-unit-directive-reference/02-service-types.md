# Service Types: Type= Semantics and Selection

Scope: what each of the eight Type= values means for startup detection and main-process identification, and how to pick one for a daemon, a batch job or a shell-script service.

## What Type= actually decides

The Type= setting in the [Service] section answers two operational questions for the manager: when did startup succeed, and which process is the main process of the service. The freedesktop systemd.service(5) page documents all eight values and frames the alternatives in exactly those terms: use Type=notify or Type=notify-reload "if the service understands systemd's notification protocol, Type=forking if the service can background itself or Type=dbus if the unit acquires a DBus name once initialization is completed" (https://www.freedesktop.org/software/systemd/man/systemd.service.html, weight 0.98).

## The eight values

| Type | Startup considered complete when |
|---|---|
| simple | Immediately after fork; the ExecStart= process is the main process |
| exec | The execve() of ExecStart= has succeeded |
| forking | The original process exits and the daemon has forked; track with PIDFile= |
| oneshot | The single process exits; multiple ExecStart= lines run serially |
| notify | The service sends sd_notify("READY=1") |
| notify-reload | Same as notify, plus reloads go through the RELOADING=1 / READY=1 protocol |
| idle | Like simple, but execution is delayed until other active jobs are dispatched |
| dbus | BusName= appears on the D-Bus system bus |

This table follows the directive semantics in systemd.service(5) (https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html, weight 0.96; https://man7.org/linux/man-pages/man5/systemd.service.5.html, weight 0.83).

The distinction between simple and exec is small but real: both run the ExecStart= process directly, but exec waits for the execve() call to succeed before the unit is considered started, so a missing binary or interpreter is caught during startup rather than surfacing as a later crash. A community answer recommends exec for exactly this reason when the process keeps running in the foreground (https://superuser.com/questions/1274901/systemd-forking-vs-simple, weight 0.08, weak backing), and the distinction is documented on the man page itself (https://www.freedesktop.org/software/systemd/man/systemd.service.html, weight 0.98).

## oneshot and RemainAfterExit

Type=oneshot is the choice for short-lived work: systemd runs the ExecStart= command and considers the unit active until the process exits. Multiple ExecStart= lines are permitted and run serially, which makes oneshot the natural fit for setup and enrollment jobs. RemainAfterExit=yes keeps the unit in the active state after the process exits so that dependent ordering does not re-trigger. A Unix StackExchange answer notes that oneshot is the more appropriate pairing with RemainAfterExit=yes than Type=simple, because with simple the service is considered stopped the moment the process ends (https://unix.stackexchange.com/questions/736189/difference-between-ubuntu-systemd-simpleoneshot-and-forking, weight 0.04, weak backing).

## notify and the sd_notify protocol

Type=notify and Type=notify-reload are gated on the sd_notify protocol. The sd_notify(3) page states the coupling precisely: readiness notification "is only used by systemd if the service definition file has Type=notify or Type=notify-reload set", and "since there is little value in signaling non-readiness, the only value services should send is READY=1", with READY=0 not defined (https://www.freedesktop.org/software/systemd/man/latest/sd_notify.html, weight 0.94). This is the strongest startup signal systemd offers: the unit does not become active until the daemon says it is actually serving.

For services implemented as shell scripts, the systemd-notify(1) helper sends the same notifications from the script: it "may be called by service scripts to notify the invoking service manager about status changes", most importantly for start-up completion readiness (https://www.freedesktop.org/software/systemd/man/latest/systemd-notify.html, weight 0.97; https://www.man7.org/linux/man-pages/man1/systemd-notify.1.html, weight 0.66). A worked example pairs Type=notify with a script that calls systemd-notify after initialization (https://askubuntu.com/questions/1120023/how-to-use-systemd-notify, weight 0.03, weak backing).

Type=notify-reload goes one step further: `systemctl reload` no longer needs an ExecReload= command that ships a signal. Instead the daemon answers a reload by sending RELOADING=1, does its reconfiguration, then sends READY=1. The source reference for this corpus records notify-reload as the replacement for the ExecReload= signal pattern, and the freedesktop service page lists it as a first-class alternative for services that speak the notification protocol (https://www.freedesktop.org/software/systemd/man/systemd.service.html, weight 0.98).

## Selection rule of thumb

Pick from how the program actually behaves, not from habit. A foreground daemon that can speak sd_notify: Type=notify, or notify-reload if it supports live reconfiguration. A foreground daemon that cannot: Type=exec. A legacy daemon that double-forks: Type=forking with PIDFile=, accepted as the only option when "the service can background itself" (https://www.freedesktop.org/software/systemd/man/systemd.service.html, weight 0.98). One-shot setup or migration work: Type=oneshot, with RemainAfterExit=yes when later units must still order against it. A D-Bus service: Type=dbus with BusName=. Type=idle only for units whose console output must not interleave with other boot jobs, since it delays execution until the job queue is quiet.
