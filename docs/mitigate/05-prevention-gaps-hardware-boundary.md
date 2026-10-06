# 05. What yubiOS Cannot Fully Prevent

Scope: the source doc's gap table (yubi-OS/yubiOS docs/MITIGATE.md, section "What yubiOS Cannot Fully Prevent") and the hardware selection escape routes the digs corroborate.

## The five declared gaps

All of the following are source doc claims:

- OEM ROM Absolute Persistence (Computrace). The firmware lives in UEFI ROM and runs before the SecureBoot chain starts, so yubiOS can detect it via chipsec and refuse enrollment, but cannot remove it without reflashing firmware. The path forward is reflash plus custom SecureBoot key enrollment and chipsec at first boot (issue #24).
- Hardware radio ignoring OS power commands. The TX/RX path is hardware wired below the OS layer. The path forward is hardware selection: open firmware devices, with Intel AX210 cited as the example without backdoored microcode.
- Novel kernel CVEs of the dirtyfrag class. These require an upstream kernel patch. The path forward is automated fedora-bootc:45 digest bumps through Renovate under the ADR-015 digest pin policy.
- qcom,dload on Qualcomm ARM64 hardware. dm-verity blocks library substitution, but the Qualcomm firmware sideload runs below the Merkle tree check, so the risk is present on Qualcomm based ARM64 boards. The path forward is preferring non Qualcomm ARM64 hardware: Ampere, RPi 5, Juno, with the board matrix in ADR-017.
- UEFI firmware supply chain root. If UEFI itself is malicious from the factory, the chain starts compromised. chipsec surfaces anomalies, but a hardware root of trust with verified boot firmware is beyond OS scope.

## Corroborating evidence from the digs

The vendor side of the Computrace gap is documented by Dell: the Computrace module has been replaced by the Absolute module in recent BIOS revisions, and the interface change is documented in Dell's support knowledge base (https://www.dell.com/support/kbdoc/en-us/000142862/computrace-replaced-by-absolute-module-in-newest-bios-revisions, jev weight 0.73). This matches the source doc's residual risk: the persistence module survives at a layer the OS does not reach.

The radio gap's escape route is corroborated by the kernel and vendor side: the AX210 is supported by mainline Linux iwlwifi configuration files in the torvalds tree (https://github.com/torvalds/linux/blob/master/drivers/net/wireless/intel/iwlwifi/cfg/ax210.c, jev weight 0.71), and Intel's support documentation tracks which wireless firmware and driver versions work with particular kernel versions (https://www.intel.com/content/www/us/en/support/articles/000005511/wireless.html, jev weight 0.69). Intel also ships the firmware packages under their own licence (https://www.intel.com/content/www/us/en/download/824804/intel-wireless-wi-fi-drivers-for-linux.html, jev weight 0.53). Note these sources establish AX210's Linux support status, not its microcode audit status; the "without backdoored microcode" characterisation remains a source doc claim.

The qcom,dload gap is the sharpest in the table: the source doc is explicit that dm-verity checks every dlopen() but the sideload executes below the Merkle tree boundary, so on Qualcomm ARM64 boards the mitigation is procurement discipline (avoid the hardware) rather than a software control.

## Why the gaps are stated at all

The source doc says it is intentionally concrete: if the project cannot currently mitigate something, that is stated plainly. The gap table is the operational consequence. Each row pairs a gap with a path forward that is either a procurement decision (hardware selection), a process decision (digest bumps, first boot chipsec), or an accepted limit (hardware root of trust beyond OS scope). Reading the gap table together with the coverage chart in doc 04 gives the full picture: green rows are controls, yellow rows are detections, and the gap table is where the yellow rows and the untabled rows end.
