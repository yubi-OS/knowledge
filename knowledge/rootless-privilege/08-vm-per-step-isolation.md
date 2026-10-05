# VM per build step: the isolation answer and its cost

## Scope

Full virtual machines and microVMs as a build-isolation mechanism: what the hardware boundary buys, what per-build versus per-step isolation costs, and why the VM is an isolation answer being offered where a privilege question stands.

## What the microVM boundary buys

Firecracker is an open source virtualization technology purpose-built for creating and managing secure, multi-tenant container and function-based services; it deploys workloads in lightweight microVMs that provide enhanced security and workload isolation over traditional VMs while enabling the speed of containers (Firecracker site, https://firecracker-microvm.github.io/; project README, https://github.com/firecracker-microvm/firecracker). Docker's own sandbox architecture argues for the same boundary: each sandbox gets its own kernel, which is hardware-boundary isolation (Docker blog, https://www.docker.com/blog/why-microvms-the-architecture-behind-docker-sandboxes/). The shared-kernel problem is concrete in multi-tenant CI: a shared-kernel build pod runs a tenant's arbitrary install scripts and Dockerfiles next to every other tenant's, and Firecracker microVMs close that gap per build, with real numbers from BuildBuddy's production fleet (bex.co, https://bex.co/blog/2026/07/29/dagger-firecracker-microvm-build-isolation).

## Per-build versus per-step

The cost curve is the decision variable. Per-build microVM isolation is shipped and measured: CI platforms isolate each job in its own hardware-virtualised micro-VM with network default-deny and an ephemeral design (tempus.build, https://tempus.build/en/security/), and Firecracker-and-Kata runner designs rotate immutable build images and use per-bridge network allowlists so a VM cannot reach hosts the bridge does not allow (systemshardening.com, https://www.systemshardening.com/articles/cicd/firecracker-kata-ci-runners/). Per-step isolation is a different and much worse trade, explicitly described as one nobody has actually shipped (bex.co, https://bex.co/blog/2026/07/29/dagger-firecracker-microvm-build-isolation): paying VM start and image-load cost for every RUN step multiplies build minutes for a boundary that the rootless builder already provides at process granularity.

The same cost logic appears in platform migrations: the Swift Package Index moved to ephemeral macOS build runners with fresh VMs per build, accepting dedicated hardware because per-build VMs were the unit that made reuse-of-state attacks impossible (Swift Package Index blog, https://swiftpackageindex.com/blog/switching-to-ephemeral-macos-build-runners). Guides on ephemeral build environments frame the threat precisely: an attacker who compromises a build environment can target the software supply chain rather than just the environment, which is why ephemeral-by-design runners matter (dev.to, https://dev.to/varunvarde/how-do-you-secure-ephemeral-build-environments-4ee4).

## Why it is the wrong answer to the privilege question

A VM boundary answers the isolation question: what can this workload see and reach, kernel included. It does not answer the privilege question: the workload inside the VM can still run as root inside its own kernel, and a privileged build step still holds its privileges, merely confined. For builds, the privilege risk (arbitrary Dockerfile RUN steps holding uid 0 on shared infrastructure) is better closed by rootless execution, which costs nothing per step. For tests, especially hardware-in-the-loop and destructive tests, the VM boundary is adopted deliberately: the cost is accepted per test, not per step, because the test's isolation needs exceed what namespaces provide.

## Position

MicroVMs are the ceiling of isolation and the wrong default for privilege. The mature allocation: rootless builds for the privilege floor, per-job microVMs where tenants share infrastructure, and per-step VMs nowhere, because the per-step cost buys isolation that rootless execution already delivers more cheaply.
