# 06 Mode hazards: state leaks, restart expectations, and destructive gates

Scope: the failure modes that each execution mode hides: leaked state after interrupted cleanup, lost state on restart under systemd's transient directories, and the confirmation gate that replaces cleanup in destructive one-shot installs.

Weight legend: 0.5 and above means authoritative backing; below 0.5 is labeled weak.

## The hazard inverts with the mode

Ephemeral boundaries hide state leaks: their whole contract is that nothing survives, so any residue that does survive is an anomaly that signals interrupted cleanup. Persistent boundaries hide the opposite: they discard their transient state on every stop, so anything a service expected to survive a restart was never persisted. Destructive one-shot mode hides nothing; it has a confirmation gate instead. Each of the three is grounded below.

## Ephemeral leak hazard: interrupted cleanup leaves residue

An ephemeral nspawn session discards its snapshot at exit; the discard is a btrfs snapshot or a plain copy removal [0.50, https://sumguy.com/systemd-nspawn-the-forgotten-container/]. An ephemeral VM test run tears down a disk image and a network attachment. If the run is killed mid-cleanup, the residue is partial: a disk image may be gone while the network state remains, and the next run inherits that network namespace rather than a clean one.

The network half is observable. libvirt's default virtual network is a NAT switch using IP masquerading, connected through the host bridge virbr0 [0.84, https://wiki.libvirt.org/VirtualNetworking.html]. Because virbr0 is the standard artifact of the default network [0.74, https://linuxconfig.org/how-to-use-bridged-networking-with-libvirt-and-kvm], its state on the host is a usable trace of VM network lifecycle. The yubiOS mode table treats "virbr0 DOWN after exit" as a cleanup signal; that is a project-level inference from the documented default-network behavior, not a documented libvirt contract, and the source doc itself carries the same caveat. It should be validated per host before gating on it.

Idempotency follows: an ephemeral test runner should be safe to re-run after a kill. A runner that assumes a clean slate will misbehave when residue exists, so the re-run path should detect and clear residue (stale disk images, UP virbr0) before starting.

## Persistent restart hazard: transient state is gone on stop

The persistent mode's hazard is state loss, not state leak. RuntimeDirectory= directories are removed when the service stops [0.42, weak, https://linux-audit.com/systemd/settings/units/runtimedirectorymode/], and PrivateTmp= /tmp is private to the service's lifetime [0.28, weak, https://stackharbor.com/en/knowledge-base/systemd-service-hardening/]. A service that writes anything it later needs into its runtime directory or private tmp has silently created a restart bug.

The contract is enforced by the supervisor's lifecycle logic and can regress with the supervisor. systemd issue 35427 documents a v257 regression where the runtime directory was removed as soon as the ExecStart= commands finished, while the unit was still active, contradicting documented behavior [0.80, https://github.com/systemd/systemd/issues/35427]. The report is primary evidence that the transient-state contract is a versioned property of the supervisor, not a fixed law; a hardened unit's restart behavior should be re-verified across systemd upgrades. Timing pitfalls around runtime directories are common enough to be a recurring user-facing issue [0.53, https://unix.stackexchange.com/questions/354583/how-to-automatically-create-a-runtime-folder-with-a-systemd-service-or-tmpfiles].

## Destructive one-shot hazard: the confirmation gate

The destructive row inverts everything: the target disk is the output, so there is no cleanup and nothing to leak. The protection is a gate before the write. bootc's install documentation provides the grounded version of this design. bootc install to-disk installs the container's image to a target block device; the command must be invoked inside the container being installed, and the container must run in --privileged mode [0.83, https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-disk.8.md]. The install surface has two sub-commands, to-disk and to-filesystem, where to-filesystem targets a mounted filesystem rather than a whole device [0.78, https://github.com/bootc-dev/bootc/blob/main/docs/src/bootc-install.md]. to-disk is the destructive, whole-device operation [0.38, weak, https://www.mankier.com/8/bootc-install-to-disk].

The yubiOS practice of preferring bootc install to-filesystem over to-disk in CI follows directly from this split: a filesystem-scoped write bounds the blast radius of a misdirected target argument, while a device-scoped write can clobber an unrelated disk. The bootc project's own getting-started material also offers podman-bootc, which runs a local bootc image in a VM with shell access, giving a non-destructive way to test an install-shaped image before any disk write [0.95, https://docs.fedoraproject.org/en-US/bootc/getting-started/].

## Exit semantics as hazard detection

Mode also determines how failure is detected. In one-shot and ephemeral modes the exit code is the signal; the container's PID 1 return code propagates to the caller [0.92, https://docs.docker.com/reference/cli/docker/container/run]. In persistent mode the supervisor decides what counts as success through unit configuration, so a crash loop rather than a nonzero exit may be the first visible symptom. In destructive mode the gate itself is the signal: a refused write is the success path for "wrong target", and an accepted write must be verified by reading the disk back, not by trusting the exit code.

## Open gaps

No retrieved source documents bcvk's rc=77 SKIP convention, so the skip-honored row of the yubiOS mode table is recorded as a project convention without web grounding here. The weak-source labeling on the systemd directive paragraphs reflects dig reality: the strongest persistent-mode sources in this dig were the systemd GitHub issue (0.80) and the Fedora bootc docs (0.95).
