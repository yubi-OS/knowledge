# 04 - Transferring the clip and player over the shell bridge

Scope: moving the clip and player scripts to rock1 over the shell bridge: base64 encoding, about 60KB chunk sizes, tee to truncate-or-create then tee -a to append, and the argv and POST-body size limits that force chunking.

## The size math

For a 4 second clip the source doc (yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md) gives the transfer budget: about 176KB of raw PCM, which becomes about 235KB once base64 encoded. The skill transfers that in 4 chunks of base64, about 59KB each. The player script play.py is about 5KB and transfers as a single chunk. For clips longer than about 8 seconds, chunk into about 60KB base64 chunks (source doc).

## The chunking pattern

The first chunk creates or truncates the target file with tee; every later chunk appends with tee -a (source doc):

```bash
# First chunk (creates the file):
printf '%s' '[b64]' | base64 -d | tee /tmp/audio/clip.pcm
# Subsequent chunks (append):
printf '%s' '[b64-2]' | base64 -d | tee -a /tmp/audio/clip.pcm
```

The same pattern moves the player script itself. base64 is the standard binary-to-text encoding: it represents each 6-bit segment of the input as one of 64 printable characters (weak backing, weight 0.06, https://en.wikipedia.org/wiki/Base64), and the coreutils base64 -d form decodes from a pipe (weak backing, weight 0.05, https://www.baeldung.com/linux/cli-base64-encode-decode).

## Why chunking is mandatory

Two hard limits make one-shot transfer impossible:

1. argv limits. The maximum length of the argument list for a new process is bounded by ARG_MAX, queryable with getconf ARG_MAX (weak backing, weight 0.07, https://www.cyberciti.biz/faq/linux-unix-arg_max-maximum-length-of-arguments/). ARG_MAX is defined in limits.h and bounds the combined size of arguments and environment passed to exec (weak backing, weight 0.04, https://unix.stackexchange.com/questions/120642/what-defines-the-maximum-size-for-a-command-single-argument). The canonical reference on this limit and how much of it is effectively usable is maintained at in-ulm.de (weak backing, weight 0.03, https://www.in-ulm.de/~mascheck/various/argmax/). This is why the anti-pattern list says: don't send the full PCM as one argv; chunk into base64 of about 60KB or less each so the bridge stays under any practical argv limit (source doc).
2. POST-body limits. Bridge POST bodies are fine up to about 240KB of JSON (source doc), so a 235KB base64 clip sits right at the edge; chunking keeps every request comfortable.

## Where the chunks run

The chunk commands execute on rock1 through the shell bridge, the Bearer-auth HTTP bridge described by the debug-with-cli skill (source doc). Each bridge call sends one chunk command; the decode-and-append happens on rock1 itself, so the Sauna side never holds the assembled file.

## Order matters

Because the first chunk truncates and later chunks append, chunks must be sent strictly in order, and a re-send of chunk 1 must restart the whole file. The loop recipes in doc 05 assume the file at /tmp/audio/clip.pcm is complete and byte-exact; a missing or duplicated chunk corrupts the PCM stream and the player will play garbage or fail its frame counts.
