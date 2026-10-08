# 09. Example playlists and the skill's file inventory

**Scope.** The shipped example playlists (classic-rock, upbeat-verified, jacob-collier, lofi-verified, samplman), their yt-dlp verification discipline, and the complete file inventory of the skill.

*Internal-record subtopic, no dig: grounded in the source doc (yubi-OS/yubiOS skills/radio-queue/SKILL.md), which owns this content.*

## The file inventory

The skill ships pure bash plus the GNU userland; no Python dependencies beyond the parent skill's play2.py and set_mixer.py (source doc, "Files in this skill"):

| file | role |
|---|---|
| SKILL.md | the ground doc |
| scripts/install.sh | installs ffmpeg and yt-dlp on rock1, creates /tmp/audio/queue/ |
| scripts/queue_player.sh | the daemon (foreground loop plus spawned prequeue worker) |
| scripts/queue.sh | CLI helper: add, list, clear, status, skip, stop |
| scripts/examples/playlist-classic-rock.md | classic-rock seed URLs |
| scripts/examples/playlist-upbeat-verified.md | 6 verified upbeat IDs |
| scripts/examples/playlist-jacob-collier.md | 6 verified Jacob Collier IDs |
| scripts/examples/playlist-lofi-verified.md | 6 verified lo-fi and chillhop IDs |
| scripts/examples/playlist-samplman.md | full-channel dump archetype |

## The five example playlists

1. **playlist-classic-rock.md**. Sample classic-rock URLs to seed a new queue. Its Don't Stop Me Now entry carried a wrong video ID, HgzGwKwLmgQ instead of the correct HgzGwKwLmgM; fixed 2026-08-05 with a comment annotation. It is the cautionary example that motivated the verify-before-queueing recipe (doc 07).
2. **playlist-upbeat-verified.md**. 6 upbeat YouTube IDs verified via yt-dlp on 2026-08-05: Don't Stop Me Now, Walking on Sunshine, Happy, September, I Gotta Feeling, Uptown Funk. The new default for "queue something upbeat" requests.
3. **playlist-jacob-collier.md**. 6 verified Jacob Collier IDs: Don't You Worry 'Bout a Thing, Hideaway, Little Blue, In The Real Early Morning, Dancing Queen, Fix You. Curator-selected to span studio solo, orchestral live, and high-profile collabs.
4. **playlist-lofi-verified.md**. 6 verified lo-fi and chillhop IDs: Nujabes (Feather), Idealism (Both Of Us, Amaranthine), Wyl & Wun Two (Kübla), Tom Misch (It Runs Through Me), and Ensemble (Dreamy Lofi Hiphop). The curator's pick for chill study or work background. Lofi Girl 24/7 livestream IDs are explicitly excluded: live stream recordings are not downloadable.
5. **playlist-samplman.md**. The full-channel dump archetype: all 65 uploads from the SAMPLMAN - Topic YouTube channel (UCcxS3mHY3ITjmLv5M00lCpQ), yt-dlp verified 2026-08-05, total runtime about 1 hour 53 minutes. Two numbered series (ITS A BEAUTIFUL DAY FOR A DAY, 15 entries; SEETHROUGH, 11 entries) plus about 39 standalone cuts. Distinct from the other examples, which are hand-picked; this is the "play me everything by X" template. It is not triggered on rock1 per user directive.

## The verification discipline they encode

Every example carries a verification date (2026-08-05) and was checked through yt-dlp before shipping. The classic-rock wrong-ID incident is documented in the source doc twice, as the motivation for the URL-probe recipe and as a fixed annotation in the playlist itself. The upbeat playlist is designated the default for upbeat requests, which makes verification a precondition for becoming a default, not an afterthought (source doc).

## Relationship to the rest of the corpus

- The playlists are the ready-to-use input for the append interface (doc 06): each file's URLs are queue.txt lines, optionally with clip args.
- The verified playlists are what make the prequeue (doc 05) look seamless: a queue of resolvable URLs means no cold-download stalls from dead entries.
- The samplman playlist doubles as the stress-test case for the clean-stop sequence (doc 08): a 1 hour 53 minute dump queue is exactly the situation where a stopped-but-still-playing state was demonstrated (source doc, Recipes).

## Sources

- Source doc: yubi-OS/yubiOS skills/radio-queue/SKILL.md, sections "Files in this skill", "Recipes", "Quirks" (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/radio-queue/SKILL.md)
