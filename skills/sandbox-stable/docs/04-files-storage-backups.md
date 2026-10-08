# 04. Files, storage, and backups

Scope: the filesystem surfaces of the stable package: the Files API for reading and writing files in the running container, file watching, the Storage API for mounting S3-compatible buckets, and the Backups API for snapshot and restore.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## Files API: read and write in the container

The source doc points file work at the Files API, the manage-files guide, and file watching, and instructs you to use the main docs for signatures and "trust installed stable types". The stable Files API page is the canonical reference (https://developers.cloudflare.com/sandbox/api/files/, jev weight 0.82). The 0.x Files class reference describes the object directly: "Reference for the Files class in @cloudflare/sandbox, which reads and writes files in a running container" (https://developers.cloudflare.com/sandbox/reference/files/, jev weight 0.78).

The clearest signature-level detail from the dig is the readFile contract: "readFile() Read a file from the sandbox. By default returns the content as a string. This is useful for small text files. For larger files and binary data use encoding: "none" to get back a ReadableStream with the file data" (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/sdk/api/files.mdx, jev weight 0.74). That string-by-default, stream-on-request split is the pattern to carry into stable code review: text for small reads, ReadableStream for anything big or binary.

## Storage and mounted buckets

Persistent data on the stable package comes from mounting object storage. The Storage API page: "Mount S3-compatible storage buckets into the Sandbox SDK filesystem for persistent data access", dated Jun 8, 2026 (https://developers.cloudflare.com/sandbox/api/storage/, jev weight 0.78). The mount-buckets guide frames the why: "Mount S3-compatible object storage as local filesystems for persistent data storage" (https://developers.cloudflare.com/sandbox/guides/mount-buckets/, jev weight 0.81).

The s3-mount example adds the security model that matters for review: "Mount an AWS S3 bucket as a normal read/write folder inside a Cloudflare Sandbox container. The container never sees a long-lived AWS key — it gets short-lived credentials on demand, issued by the Worker. This demo requires FUSE support in the container environment" (https://github.com/cloudflare/sandbox-sdk/tree/main/examples/s3-mount, jev weight 0.73). Two review-relevant facts fall out: bucket mounts need FUSE in the container image, and credential issuance is a Worker-side job, which is why secrets discipline (doc 07) and mounts interact.

## Backups: a source-doc pointer with a dig gap

The source doc's retrieve table names the Backups API (https://developers.cloudflare.com/sandbox/api/backups/) and the backup and restore guide (https://developers.cloudflare.com/sandbox/guides/backup-restore/). This subtopic's dig did not return a backups-specific result, so no dig-backed claims about backup signatures are made here. The honest position, matching the source doc's own retrieval discipline, is that backup and restore signatures must be confirmed against the installed stable types and the Backups API page before use.

## Why this subtopic stayed in the corpus

The outline validator scored this subtopic 1.09, in the "marginal: keep only if the dig comes back strong" band. The dig came back strong: eight of nine results scored 0.5 or higher, led by Cloudflare docs pages at 0.81 and 0.82 and the official s3-mount example at 0.73. It is kept on dig strength.

## Weak-source caution

The vendor landing page (0.59) and marketing page (0.25) provide no mechanism detail and are not cited for claims (https://sandbox.cloudflare.com/, https://www.cloudflare.com/, weak backing below 0.5). One general cloudflare.com homepage hit (0.25) is off-topic and unused.
