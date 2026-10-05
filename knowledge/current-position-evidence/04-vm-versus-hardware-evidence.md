# VM-proven versus hardware-proven: the evidence ladder between simulation and the physical device

Scope: why CI and VM-lane evidence cannot back hardware or physical-device claims (token enumeration, physical key validation), and the ladder between simulated and real-hardware proof.

## The ladder

Security products that depend on physical devices sit on a ladder of evidence classes, and a claim is only as strong as the rung it stands on:

1. Nothing: the capability is described but never executed.
2. Software emulation in CI: the logic runs in a VM lane with no physical device.
3. Simulated device presence: a software token emulates the device protocol well enough for code paths to execute.
4. One physical device, manual test: a human validates on one unit.
5. Physical device in automated CI: hardware-in-the-loop, repeatable.
6. Physical device across models and failure modes: the claim covers real deployment diversity.

The yubiOS evidence-boundary snapshot (OMN-68, 2026-07-25) encodes exactly this ladder in its blockers. B-VM-CTAP2 states that no FIDO2 token enumerates in the VM CI lane, so LUKS2 FIDO2 unlock, systemd-homed, and ed25519-sk SSH are unproven even in software: the project had not yet reached rung 2 for its headline capability. B-REAL-FIDO2 states that no physical-YubiKey run has validated unlock, homed, resident SSH, PAM presence, PIV signing, recovery, or failure handling on real hardware: rung 4 through 6 remain unvisited. The snapshot's claim governance follows from the ladder: "ARM64 support as a shipped capability" is off-limits while the ARM64 work is groundwork only (6 forks staged per ADR-018/019/020), because a staged fork is rung 1.

## Why emulation cannot close the gap

The general evidence for why simulation under-proves hardware claims comes from semiconductor security verification. A 2026 arXiv survey on emulation-based SoC security verification states that while simulation and formal verification remain indispensable, they often struggle to expose vulnerabilities that emerge only under realistic execution conditions (https://arxiv.org/abs/2604.15073, weight 0.71, primary). The same holds one level up: a VM lane can prove code paths execute, but it cannot prove a real CTAP2 authenticator's timing, transport quirks, or failure behavior.

Concrete hardware-in-the-loop reality checks support the point. A dedicated FIDO2 test suite notes that when testing a hardware authenticator, stdin/stdout capturing must typically be disabled so the prompts to power-cycle the authenticator can be seen and continued (https://github.com/trussed-dev/fido2-tests, weight 0.80, primary). Power-cycling a device mid-test is not a thing a VM lane does. A browser bug report documents a real-world integration failure invisible to any emulator: a YubiKey 5Ci's LED blinks on iOS 14.0 but Safari does not recognize the activation gesture, so the prompt can only be cancelled (https://bugs.webkit.org/show_bug.cgi?id=214266, weight 0.65, primary). Physical transport and platform integration produce failure classes that software-only runs cannot generate.

Vendor release notes for FPGA tooling (https://www.amd.com/en/products/software/adaptive-socs-and-fpgas/vitis/vitis-whats-new.html, weight 0.63, primary vendor documentation) illustrate the mainstream tooling assumption: hardware verification is its own stage with its own tools, distinct from simulation.

## Writing the boundary honestly

For a project like yubiOS, the honest statement pattern per rung is:

1. "X is unproven even in software" when the VM lane cannot yet enumerate the device class (B-VM-CTAP2).
2. "X is proven in VM CI by run N" once rung 2 closes, citing the run.
3. "X is proven on physical hardware, model Y, by run or session N" only after a real-device run, and only for the specific functions exercised (unlock, homed, PAM, PIV, recovery), because the yubiOS blocker correctly enumerates functions individually rather than waving at "FIDO2 support."
4. "X is production-ready" only when the blocker list says so; the yubiOS snapshot keeps "production-ready" off-limits until at minimum B-VM-CTAP2, B-HARDENING-RUNTIME, and B-REAL-FIDO2 close.

The function-level enumeration in B-REAL-FIDO2 is worth copying: hardware claims decompose (unlock, resident credentials, PIV signing, failure handling), and each sub-capability needs its own rung assessment. A blanket "FIDO2 works" after a successful unlock test would itself be an overclaim, since recovery and failure handling are exactly where hardware behavior diverges from emulation.

Practitioner material at weaker weights covers the same ground from the how-to angle: a guide to FIDO2 authenticator testing distinguishes hardware keys from software strategies (https://helpmetest.com/blog/fido2-authenticator-testing/, weight 0.22, weak), and a how-to on YubiKey U2F/FIDO2 hardware authentication for Linux sudo and SSH shows the real-device setup steps a VM lane skips (https://www.sudo.academy/blog/implementing-yubikey-u2f-fido2-hardware-authentication-for-linux-sudo-and-ssh/, weight 0.36, weak). A low-quality SEO page on the same topic (https://tech-insider.org/fido2-hardware-security-key-setup-2026/, weight 0.07, weak) is cited here only as an example of the noise floor.

## The audit question

Any downstream business document can be audited with one question per hardware claim: which rung, which run or session, which device model? If the answer is a design document or a plan, the claim is rung 1 and must be labeled aspirational. The yubiOS snapshot states the global rule directly: any statement beyond its verified facts should be treated as aspirational until a specific PR or CI run closes the relevant blocker, with the live blocker list as the single source of truth.
