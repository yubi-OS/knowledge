# Program and Control: The Inherited Model and Its Three Costs

*Scope: what the PAC model (program and control) is, why it became the default, and the three structural costs it carries that its users rarely count. Explicates the opening section of yubi-OS/yubiOS docs/PWC.md.*

## The pattern, named

Almost every security architecture in production is PAC: a program does the work, and a separate control plane stands outside it, watches it, and intervenes when it drifts. The pattern is everywhere once named. An init system supervises services and restarts the ones that die. An IAM layer stands between a caller and an API and decides each request. A host agent scans the filesystem and quarantines what it finds. A runtime policy engine intercepts syscalls and denies the ones the profile forbids. A maintainer reviews a pull request before it merges.

In every case the shape is the same: the actor that holds authority is not the actor that performs the work. The control plane is a separate process, codebase, deployment, and (often) a separate team.

## Why it is a reasonable default

PAC is not stupidity. It separates duties: the worker stays simple, the authority stays concentrated, and the two can be reasoned about independently. The reviewer does not write the code; the policy engine does not run the workload. That independence is what makes each side auditable on its own, and it is why PAC became the default everywhere.

## Cost 1: the controller is itself a program

The first structural cost: the controller runs on something, it must be patched, and it can be subverted, bypassed, or lied to. Every controller is a privileged target, because take the controller and you take the system.

This is the trusted computing base problem in modern dress. The TCB is the totality of the hardware, software, and firmware components critical to a system's security: if any part of it is compromised, the system's security policy is at risk (https://certsensei.io/blog/cissp/trusted-computing-base-cissp-guide, weak backing, jev weight 0.29). A component being called trusted does not assert that it is secure; it asserts that if it fails, the system's security fails with it (https://www.learnsecuritymanagement.com/cissp-trusted-computing-base, weak backing, jev weight 0.38). A PAC control plane sits squarely inside that boundary, which is why TCB minimization is a recognized security objective, even though it is frequently ignored in practice (https://www.sciencedirect.com/topics/computer-science/trusted-computing-base, jev weight 0.52). The research response to this cost has always been to shrink and harden the controller itself, for example by isolating the security operation on a small, minimal operating system behind a virtual machine monitor (https://www.usenix.org/conference/14th-usenix-security-symposium/minimizing-tcb, jev weight 0.63). PAC's whole industry is an answer to cost 1 that never questions the pattern: make the watcher smaller, not fewer.

The consequence on the diagram is asymmetric. A subverted worker is caught by the controller. A subverted controller is caught by nothing, because nothing stands outside it.

## Cost 2: the controller only sees its own vantage

Anything outside the controller's observation window is uncontrolled in fact while controlled in the diagram. A race between check and use, a subresource the controller does not instrument, a path it does not hook: each passes the watcher untouched and still reads as "controlled" to whoever drew the architecture. PAC conflates "there is a component responsible for X" with "X is controlled." The property lives in the org chart, not in the bytes.

## Cost 3: the controller converts a property into a procedure

"The system is safe" becomes "the system is safe while the watcher is running, correctly, on a healthy host, with current rules." The property is now conditional on a process behaving, and the condition list grows with every dependency. Stop the watcher, or let its rules go stale, or let its host drift, and the property evaporates even though nothing in the program changed. This is the deepest cost because it is invisible: every audit confirms the procedure ran, and none confirms the property still holds.

## What the costs imply

All three costs share a root: control lives in a process. Cost 1 makes the process a target, cost 2 limits what it can see, cost 3 makes the property hostage to its runtime. The doctrine's answer, developed in the rest of PWC.md, is not to build better watchers but to move control out of processes and into structures: construction, verification at use, and record. When you can move a control from a process into a structure, you must, because processes are attack surface and structures are not.

## Sources

| source | url | jev weight |
| --- | --- | --- |
| Minimizing the TCB (USENIX Security) | https://www.usenix.org/conference/14th-usenix-security-symposium/minimizing-tcb | 0.63 |
| Trusted Computing Base overview (ScienceDirect) | https://www.sciencedirect.com/topics/computer-science/trusted-computing-base | 0.52 |
| TCB for CISSP (Learn Security Management) | https://www.learnsecuritymanagement.com/cissp-trusted-computing-base | 0.38 (weak) |
| Trusted Computing Base for CISSP (CertSensei) | https://certsensei.io/blog/cissp/trusted-computing-base-cissp-guide | 0.29 (weak) |
