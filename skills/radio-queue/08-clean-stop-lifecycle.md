# 08. Clean stop, process ownership, and daemon lifecycle

**Scope.** Stopping the queue cleanly when play2.py runs as root: the sudo /proc walk to find surviving players, the pkill -f self-match hazard, daemon error resilience, the 5-second idle poll, and log truncation.

## The root-owned player problem

play2.py is launched as `sudo -n python3 /tmp/audio/play2.py`, so it runs as root. The bridge user on rock1 (shant) cannot signal it directly: kill -9 from the bridge fails with "Operation not permitted", and the music keeps playing even though queue.sh stop reported success (source doc, Recipes: stop everything cleanly).

## The hard-stop sequence

The source doc prescribes a 6-step sequence (source doc):

1. `sudo -n /tmp/audio/queue/queue.sh stop`, which kills queue_player.sh and the prequeue worker and signals play2.py with SIGTERM.
2. Wait 2 seconds for SIGTERM to propagate. The doc warns not to trust kill -0 for verification (see the anti-pattern below).
3. Walk /proc with sudo to find any surviving play2.py PIDs by reading each /proc/PID/cmdline.
4. sudo kill -9 each surviving PID by exact PID.
5. Verify the ALSA device is free: `sudo -n fuser /dev/snd/pcmC1D0p`, since fuser without sudo can give wrong answers.
6. Clean scratch: sudo rm -f current.*, next.*, prequeue.lock, prequeue.out.

The source doc records why this ritual exists: the 2026-08-05 SAMPLMAN-set stop demonstrated twice in a row that the daemon died and the verification grep returned nothing while play2.py was still alive and pumping audio to hw:1,0. The sudo /proc walk caught the surviving player at PID 17180 (source doc).

## The pkill -f self-match hazard

The /proc walk exists instead of `pkill -f play2.py` for a documented reason: the bash command line that contains the string "play2.py" is itself a process, and pkill would self-match and SIGKILL the cleanup script (source doc). This follows from pkill's documented semantics: it selects processes by extended regular expression matched against the process name or full command line with -f (Ubuntu manpage for pkill, https://manpages.ubuntu.com/manpages/xenial/man1/pkill.1.html, jev weight 0.88). A regex match against the full command line cannot distinguish the target from the command doing the matching, so an explicit /proc walk with exact PID kills is the safe shape. Related operational guidance on killing root-owned processes confirms the general shape: processes owned by root need root privileges to signal, which is exactly why the walk runs under sudo (Unix and Linux Stack Exchange, https://unix.stackexchange.com/questions/21258/terminate-root-processes, jev weight 0.42, weak backing).

## Daemon resilience and idle behavior

Three lifecycle quirks complete the picture (source doc, Quirks):

1. Errors do not kill the daemon. If yt-dlp or ffmpeg fails for one song, foreground or prequeue, the daemon logs it and moves to the next. Failed URLs stay consumed, so nothing loops forever.
2. The 5-second idle poll. When queue.txt is empty and there is no next.pcm to swap in, the daemon sleeps 5 seconds before re-checking; an append during that window starts on the next poll. The sleep can be dropped to 1 second for real-time responsiveness.
3. Log truncation. queue.log auto-truncates to its last half when it crosses 200 KB. Full history is not preserved; tail it externally if needed.

## Anti-patterns around stopping

- Do not kill -9 the daemon without first killing any in-flight play2.py or prequeue worker: the player keeps holding /dev/snd until it closes naturally, and the worker keeps downloading into next.* (source doc, Anti-patterns). queue.sh stop handles both cleanly, which is why it comes first in the sequence.
- Do not run the daemon twice; two daemons compete for the exclusive hw:1,0 device. Check with pgrep -af queue_player.sh or queue.sh status first (source doc, Anti-patterns).

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Recipes" (stop everything cleanly), "Quirks", "Anti-patterns" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
- Ubuntu manpage pkill, https://manpages.ubuntu.com/manpages/xenial/man1/pkill.1.html, weight 0.88
- Terminate root processes, https://unix.stackexchange.com/questions/21258/terminate-root-processes, weight 0.42 (weak)
