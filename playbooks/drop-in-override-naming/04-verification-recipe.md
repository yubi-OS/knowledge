# The author-time verification recipe

Scope: the 4-step recipe from the playbook that proves a drop-in's effective sort order before shipping, what each step establishes, and why each step exists.

## Why verify mechanically

The playbook's decision rule ends with "Ordering is verified mechanically at author time, never inferred from the number" (source doc: yubi-OS/yubiOS playbooks/drop-in-override-naming.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/drop-in-override-naming.md). The OMN-149 incident showed why: a `53-` prefix was chosen for its numeric meaning, the directory sorted by full filename lexicographically, and the resulting order was the reverse of the intent with no error surfaced at any layer.

## Step 1: effective sort order for the touched directory

```
ls -1 usr/lib/tmpfiles.d/ | sort -u
```

This prints the effective lexicographic ordering of every file in the directory you touched, deduplicated. GNU sort sorts lines of text, by default comparing according to the current locale's collation order, and is the canonical tool for this check (https://www.gnu.org/software/bash/, jev 0.93, GNU Project page for the shell ecosystem; the sort behavior itself is documented in GNU coreutils). The playbook pairs `ls -1` with `sort -u` so the author sees the full ordered field the consuming tool will walk, not a mental model of it (source doc).

## Step 2: prove your file sorts after the upstream file

```
printf '%s\n%s\n' 'vfio-yubiOS-no-static-vfio.conf' \
                  'static-nodes-permissions.conf' | sort | tail -1
# must print YOUR filename
```

This is a pairwise assertion: feed exactly the 2 filenames that must be ordered and check which one survives at the end of the sort. The playbook requires the output to be the yubiOS filename (source doc). It converts the naming convention into a pass or fail result the author can read in one line, and it fails loudly when the first byte of the chosen prefix is wrong. In the OMN-149 fix, `vfio-yubiOS-no-static-vfio.conf` sorts after `static-nodes-permissions.conf` because `'v'` (0x76) is greater than `'s'` (0x73) (source doc).

## Step 3: upstream files that ship in the base image, not the repo

```
podman run --rm docker.io/0mniteck/yubios:latest \
  sh -c 'ls -1 /usr/lib/tmpfiles.d/ | sort -u'
```

The repo checkout does not contain every file that participates in the sort. Upstream packages ship files inside the base image, and those files are part of the ordering field. The recipe therefore lists the drop-in directory from inside the actual base image with a throwaway container (source doc).

The general difficulty of listing a container image's contents without running it is echoed in the dig, though those sources carry weak backing: How-To Geek notes the easiest way to explore an image's content involves starting a container (https://www.howtogeek.com/devops/how-to-inspect-a-docker-images-content-without-starting-a-container/, jev 0.24, weak), and Stack Overflow answers on the same problem conclude you mostly need to run the image in some form to look around (https://stackoverflow.com/questions/66141391/how-to-view-files-inside-docker-image-without-running-it-note-this-question-i, jev 0.14, weak; https://stackoverflow.com/questions/45423825/how-to-list-the-files-inside-a-docker-image-without-running-it-as-a-container, jev 0.13, weak). The playbook's `podman run --rm ... ls` form is the pragmatic answer: run it briefly, list the directory, discard it.

## Step 4: assert the runtime effect, not just the name

```
test ! -e /dev/vfio && echo PASS || { echo "FAIL: /dev/vfio present"; exit 1; }
```

Run in the guest, this asserts the actual outcome the ordering was chosen to produce, not the filename arithmetic. For OMN-149 the intended outcome was that `/dev/vfio` does not exist in a default yubiOS guest (source doc). A name-level check can pass while the runtime effect is still wrong (for example if another file re-creates the node), so the recipe closes with an effect-level assertion.

## The recipe as a set

Each step removes one class of false confidence: step 1 shows the real ordering field, step 2 proves the pairwise relation that matters, step 3 extends the field to files the repo cannot see, and step 4 proves the runtime consequence. Together they are the mechanical author-time gate the playbook's decision rule demands, and the doctrine doc of this corpus records that a proactive CI gate automating this recipe is still unbuilt (source doc).
