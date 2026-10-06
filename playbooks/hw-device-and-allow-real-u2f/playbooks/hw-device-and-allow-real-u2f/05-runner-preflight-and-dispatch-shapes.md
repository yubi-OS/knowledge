# 05 - Runner pre-flight checks and the three dispatch shapes

Scope: the commands to run on a runner before any destructive dispatch, the 3 dispatch JSON shapes, and the symptom/cause/action table.

The source doc prescribes a runner pre-flight block before any destructive dispatch (source doc: yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md):

```bash
lsusb | grep -i -E 'yubico|1050:' && echo "REAL KEY PRESENT"   # => allow_real_u2f MUST be true
lsblk -o NAME,SIZE,TYPE,MOUNTPOINTS,MODEL
findmnt -n /dev/sdX && { echo "REFUSE: mounted"; exit 1; }
uname -r; sysctl -n kernel.unprivileged_userns_clone 2>/dev/null   # rootless lane
ls /sys/kernel/iommu_groups | wc -l                               # vgpu lane
```

External backing for the checks:

- The Yubico detection line works because Yubico's USB vendor ID is 1050 (0x1050). Yubico's support article lists the USB ID values for YubiKey models (https://support.yubico.com/s/article/YubiKey-USB-ID-values, jev weight 0.86), and a companion article explains how to find a YubiKey's USB product ID (https://support.yubico.com/s/article/How-to-find-the-USB-Product-ID-PID-of-your-YubiKey, jev weight 0.92). The `lsusb` vendor field renders as the hex form `1050:`, which the playbook's grep pattern matches case-insensitively against both the vendor string `yubico` and the ID.
- `lsblk(8)` lists block devices; the playbook requests the NAME, SIZE, TYPE, MOUNTPOINTS, and MODEL columns so the operator can pick a spare device and see at a glance whether it is mounted (https://www.man7.org/linux/man-pages/man8/lsblk.8.html, jev weight 0.84). Weak backing for the mount check: a findmnt command guide (https://linuxhandbook.com/findmnt-command-guide/, jev weight 0.20, weak) describes using `findmnt` to test for mounted filesystems; the mount-refusal check itself is from the source doc.

The 3 dispatch shapes, sent to the dispatch endpoints of `ci_test-vm.yml` and `ci_test-vgpu-vm.yml` with `IMG=docker.io/0mniteck/yubios:dev-<short-sha>` (source doc):

```jsonc
{"ref":"main","inputs":{"image":"$IMG","hw_device":"","allow_real_u2f":"false"}}  // hosted, no real key
{"ref":"main","inputs":{"image":"$IMG","hw_device":"","allow_real_u2f":"true"}}   // rock1 w/ real key
{"ref":"main","inputs":{"image":"$IMG","hw_device":"/dev/sdX","allow_real_u2f":"true"}} // DESTRUCTIVE, Jenny-approved
```

(source doc)

Symptom, cause, action table (all rows from the source doc):

| Symptom | Cause | Action |
|---|---|---|
| guard refuses, passless test skipped | real key attached, flag unset | re-dispatch with `allow_real_u2f: true`. Do not unplug the key mid-run or patch the guard |
| `422 Unprocessable Entity` | flag forwarded to a workflow that does not declare it | forward only declared inputs; use `--ref` for branch selection |
| destructive leg silently skipped | `hw_device` empty | intended default. Name the device if you wanted it |
| passless test passes with a real key and `allow_real_u2f: false` | guard bypassed | treat the result as void, not green |

The pre-flight also serves 2 other yubiOS lanes: `uname -r` and `kernel.unprivileged_userns_clone` for the rootless lane, and the IOMMU group count for the vgpu lane (source doc). The playbook's overall discipline: verify the runner's hardware reality before encoding it into dispatch inputs, never infer (02).
