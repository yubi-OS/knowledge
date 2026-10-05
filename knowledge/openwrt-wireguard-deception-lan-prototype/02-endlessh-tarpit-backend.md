# 02 - endlessh as the SSH tarpit backend

**Scope:** endlessh as the SSH tarpit backend: how it lures attackers, what it is not enough for, and why it fits OpenWrt.

## How the tarpit works

endlessh is an SSH tarpit that very slowly sends an endless, random SSH banner. It keeps SSH clients locked up for hours or even days at a time, and its stated purpose is to put the real SSH server out of the attacker's reach (source: https://github.com/skeeto/endlessh, jev weight 1.0). The mechanism exploits the SSH protocol's version-string exchange: immediately after the TCP connection is established, and before negotiating cryptography, both ends send an identification string, and endlessh abuses the server's freedom in how slowly it delivers that pre-authentication banner (source: https://nullprogram.com/blog/2019/03/22/, jev weight 1.0). The relevant rules live in RFC 4253, the SSH transport specification: before the client and server exchange protocol version strings, the server may send any number of lines, and endlessh deliberately dribbles these lines out at a glacial pace (source: https://www.sedunlab.com/posts/endlessh-ssh-tarpit-vps-en/, jev weight 1.0).

Independent behavior studies confirm the hook works in practice: one instrumented run of endlessh with a systemd unit observed connectors being held "on the hook" while the tool randomly doled out small amounts of banner data (source: https://github.com/bediger4000/ssh-tarpit-behavior, jev weight 1.0). A technical summary of the same design describes it as accepting SSH connections and then sending extremely slow, random banner text to waste the attacker's time and resources (source: https://deepwiki.com/skeeto/endlessh, jev weight 1.0).

## Why endlessh fits the OpenWrt prototype

endlessh is lightweight, which is the property that makes it a credible candidate for router-class hardware. Deployment guides for endlessh emphasize exactly this: a lightweight trap for potential attackers that locks up unauthorized SSH connections without giving them a system to attack (source: https://joshuarosato.com/posts/ssh-honeypot-endlessh-setup-guide/, jev weight 1.0). Minimalist honeypot projects built on the same principle describe the infinite banner loop as effectively delaying brute-force scanners with no real system behind it (source: https://github.com/SG-1031/EndLess_SSH_Honeypot, jev weight 1.0).

OpenWrt itself documents honeypots as a supported service category: running honeypots on OpenWrt allows detection of network intrusions and automatic alerting of the owner, with optional automatic isolation of offending devices (source: https://openwrt.org/docs/guide-user/services/honeypots, jev weight 1.0). The yubios-endlessh package in the prototype plan packages the tarpit as a standard OpenWrt service with Makefile, init, config, and firewall files, which is the packaging shape OpenWrt services expect.

## What endlessh is not

The prototype inherits an explicit caveat from the endlessh-fit analysis: endlessh is a tarpit, not the whole honeypot system. The pairing literature makes the gap concrete. Guides that deploy endlessh together with cowrie describe the division of labor: endlessh wastes bot time, while cowrie, a medium-interaction honeypot, is what captures credentials and attacker interaction (source: https://mylinux.work/guides/honeypot-setup/, jev weight 1.0). endlessh never lets the client negotiate cryptography, so an attacker who connects learns nothing beyond a stalled banner; studying attacker behavior in depth requires a backend that lets connections proceed further.

For the deception LAN prototype this split defines the roadmap: the tarpit is the cheap, safe, per-host lure layer that pads the decoy surface, while any higher-interaction study of attacker tactics would be separate follow-up work. The prototype design deliberately does not promise cowrie-class interactivity on the routers.

## Design conclusion

endlessh is the right tarpit backend for the prototype on 3 grounds: it is protocol-compliant (source: https://nullprogram.com/blog/2019/03/22/, jev weight 1.0), it is resource-light enough for OpenWrt hardware (source: https://joshuarosato.com/posts/ssh-honeypot-endlessh-setup-guide/, jev weight 1.0), and its limitation is known and planned for rather than hidden (source: https://mylinux.work/guides/honeypot-setup/, jev weight 1.0). Its role is luring and stalling, not studying; the evidence plan in doc 07 measures whether the luring works.
