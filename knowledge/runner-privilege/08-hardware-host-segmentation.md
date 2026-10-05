# Segmentation of job classes on shared hardware lab hosts

Scope: hosts that exist because of the hardware attached to them (serial lines, audio codecs, dev boards) break the standard cloud-runner model; this doc covers how such hosts are segmented from general CI and what the hardware-in-the-loop pattern requires.

## Why the hardware host exists

The last mile of embedded CI is physical. A cloud runner cannot flash a board, so the runner that does the flashing has to be physically wired to it (https://betterdevices.io/blog/self-hosted-ci-runners-embedded-e2e-testing/, w 0.51). Hardware-in-the-loop testing is the practice of running automated tests against the actual device you ship, on every commit (https://www.embeddedci.com/resources/getting-started-with-hil, w 0.45). Any organization with serial-port devices, audio codecs, or dev boards attached to a CI host has a runner whose defining property is not compute but attachment, and that property cannot be replicated on ephemeral cloud capacity.

The difficulty is long-standing: it is hard to automate tests that involve physical hardware, and hardware vendors have historically done little to help (http://lwn.net/Articles/509719/, w 0.64). Dedicated hardware labs therefore became their own discipline: KernelCI is a Linux Foundation project dedicated to testing the upstream Linux kernel across community hardware labs (https://github.com/kernelci/kernelci-project, w 0.71), and maintaining your own CI and test system for a platform is more costly than joining a shared lab (https://docs.kernelci.org/intro/platform-testing/, w 0.52).

## Identity and routing for hardware jobs

In a hardware lab, board enablement is an identity problem as much as an automation problem: a KernelCI platform entry is effectively a machine identity for the test target, because the pipeline trusts it to route jobs to the right device (https://nhimg.org/articles/kernelci-configuration-for-cip-slts-what-practitioners-need-to-know/, w 0.52). The same holds on a smaller scale: the runner label or device selector is the identity that routes a job to the physical device, and anyone who can claim that identity can drive the hardware. The LAA (Lab as an Appliance) model makes the routing explicit: selecting the runner kind and the device routes jobs from a CI system to your lab (https://docs.lavacloud.io/use-cases/ci.html, w 0.42).

## Segmentation of job classes

A hardware host should run one job class. The reasons:

1. The attached devices are stateful and serially shared. A flash-and-test job that races with another job's serial session produces corrupted test results that look like product bugs. Segmentation by job class (one workflow family per host) is the cheapest way to make results trustworthy.

2. The host cannot be rebuilt per job. Ephemeral patterns apply to runner processes, not to the attached hardware, so contamination of the host's system state persists in a way it would not on disposable capacity.

3. The trust boundary is wider than the host. Workload-architecture guidance treats the choice of what shares a domain as an explicit design decision: standard versus consolidated architecture models and workload domain types are the first questions in designing a virtualized infrastructure platform (https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-5-2-and-earlier/5-2/vcf-design-5-2/vmware-cloud-foundation-concepts/vmware-cloud-foundation-architecture-models.html, w 0.87). A hardware lab host is a workload domain of one purpose; mixing a second job class into it is a consolidated architecture chosen by accident.

## Minimizing what the hardware host holds

The hardware-in-the-loop pattern on GitHub Actions offers a template for shrinking the trust surface: build firmware on a GitHub runner, then flash and test it on a real board over the cloud, with no secrets on the hardware-side runner, just the workflow (https://www.embeddedci.com/resources/running-hil-ci-with-github-actions, w 0.56). Applied to a lab host, the principle is: keep build and analysis on general capacity, keep only the physical interaction on the hardware host, and hold no credentials there beyond what flashing requires.

## Isolation reality on the host itself

Where multiple workloads must share a host, performance isolation is the realm of Linux cgroups (https://www.brendangregg.com/, w 0.47). But cgroups partition resources, not trust: container isolation analysis notes that containers share the host kernel, so a kernel vulnerability affects all containers on the host, making stock containers not suitable for untrusted code (https://northflank.com/blog/firecracker-vs-docker, w 0.32). For a hardware lab host the practical conclusion is that host-level segmentation (which jobs may run at all) carries the security weight, while in-host isolation is best-effort resource hygiene.

## Summary

Hardware-bound runners exist because the last mile is physical (w 0.51, w 0.45, w 0.64). Hardware labs solve routing with device identity (w 0.52, w 0.42), and the same identity discipline applies to a single lab host: one job class, one label, one workflow family. Keep the hardware host stateless of credentials (w 0.56), treat workload-domain consolidation as a deliberate decision rather than an accident (w 0.87), and remember that in-host isolation partitions resources, not trust (w 0.32).
