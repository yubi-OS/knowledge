# 07 - Operational lessons from the field

Scope: three recorded lessons about assumptions, latency, and runner hygiene, each earned the hard way. Internal-record subtopic, no dig: everything here comes from the source doc.

## Lesson 1: uptime is not tailnet age

The ubuntu box had 13 days of uptime when it joined the tailnet on 2026-09-24 (source doc). A "new device" in the tailnet can be an old box on its first tailnet day. The practical check before assuming freshness: `uptime` and `who -b` (source doc). Both run fine over the bridge and take one line each.

Why it matters: conclusions that assume a fresh box (package cache state, pending reboots, image lineage, "nobody has touched this since flash") are silently wrong on a recycled machine. The 13 day delta on join day is the recorded proof. The same trap applies in reverse: an old uptime does not mean the tailnet membership is old.

## Lesson 2: ping before long pushes

A 1-byte `echo alive` POST first saves 20 to 30 seconds on a doomed call (source doc; Jenny's directive, 2026-08-01). The canonical shape from doc 01 already carries a 30 second timeout, so the worst case for a dead bridge is exactly that: 30 wasted seconds. The ping converts worst-case discovery into a 1 second probe.

```
curl -sS -m 30 -X POST https://<host>.tail3a04f5.ts.net/run \
  -H "Content-Type: application/json" \
  -d '{"command":["bash","-lc","echo alive"]}'
```

Make the ping unconditional before any call that ships a payload, a long script, or a multi-step batch. The directive is from 2026-08-01 and predated the rock1 restoration; it survived it (source doc).

## Lesson 3: a runner host is a CI box; sweep it like one

On a runner host, one line each for `/var/run/reboot-required` and `apt list --upgradable` belongs in any state sweep (source doc). The box runs CI, so patch state is not cosmetic: a reboot-pending kernel or a stale package list changes what a CI run will do. Both runner hosts (ubuntu agentId 22, rock1 agentId 23, doc 02) qualify.

## A standard first-touch sequence

Combining the lessons with the source doc's verification pattern (echo ping plus full state probe round-trip, doc 02), a standard first-touch sequence on either box:

1. `echo alive` ping (lesson 2): confirms the bridge end to end in about a second.
2. `cat /var/run/reboot-required 2>/dev/null; echo rc=$?` (lesson 3): flags pending reboots.
3. `apt list --upgradable 2>/dev/null | head -20` (lesson 3): surfaces patch state, capped in size.
4. `uptime; who -b` (lesson 1): grounds any freshness assumption.

Every line is head/tail-sized per the contract rule (doc 01), and the whole sequence fits inside the 30 second default timeout.

## The meta-lesson

All three lessons are cheap: two commands and one probe. Each one exists because a more expensive assumption failed first (a stale device assumption, a doomed long call, a CI box treated as a laptop). When writing a new sweep script for the boxes, include all three checks by default and let the exceptions argue their way out. The cost asymmetry is the point: the checks cost seconds, the assumptions they replace cost minutes or a misdiagnosed outage (doc 04).
