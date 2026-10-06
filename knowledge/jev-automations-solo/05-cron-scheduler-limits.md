# 05 - Cron scheduler: batches sized to the CPU limit

Scope: the scheduler layer in the Jev Automations framing log: worker cron triggers create tasks for scheduled automations in batches sized to the 30 second CPU limit, and long-running research is chunked rather than stretched.

## The design

The framing log specifies that worker cron triggers create tasks for scheduled automations, with batch sizes set to the 30 second CPU limit, and explicitly rejects running long research in a single request in favor of chunking via cron batches (framing log, 2026-09-30). Its validation assumption is concrete: the audit lib must run within Workers CPU limits when chunked, tested as one Places batch of 20 sites with 4 fetches each (framing log, 2026-09-30).

## What the platform actually limits

Cloudflare Cron Triggers map a cron expression to a Worker via a scheduled() handler, designed for periodic jobs such as maintenance or calling third-party APIs to collect up-to-date data (https://developers.cloudflare.com/workers/configuration/cron-triggers/, jev weight 0.9583). CPU-time limits apply per execution: on the free plan each cron execution gets 10 ms of CPU time, the paid Bundled plan gets 50 ms, and the Standard (unbound) usage model extends CPU time to 30 seconds per execution (https://runhooks.app/blog/cloudflare-workers-cron-triggers-limits/, jev weight 0.37, weak backing). A second guide confirms the same tiering, adding that the 30 second tier applies to schedules more frequent than hourly (https://cronuru.com/guides/cloudflare-workers-cron-triggers, jev weight 0.1697, weak backing). The 30 second figure in the framing log therefore corresponds to the Standard usage model, and the batch-size assumption should be validated against the plan actually in use.

## Chunking as the standard answer

Background-job architecture guidance is unambiguous that jobs running independently of the UI cover batch jobs, intensive processing, and long-running workflows, and that such jobs need their own design rather than an in-request stretch (https://learn.microsoft.com/en-us/azure/architecture/best-practices/background-jobs, jev weight 0.5956). Spring Batch's scaling guidance starts conservative: many batch problems are solved by single-threaded, single-process jobs, and you should measure a realistic job and confirm the simplest implementation fails before reaching for parallelism (https://docs.spring.io/spring-batch/reference/scalability.html, jev weight 0.942). For complex jobs with interleaved reads, processing, and writes, chunk-oriented processing is the standard structure (https://www.javainuse.com/spring/batchtaskchunk, jev weight 0.3617, weak backing).

The scheduling-vs-events distinction also matters: traditional batch processing is time-driven (run this job daily at 2 AM), while event-driven batch processing is trigger-driven (run when a queue message or upload arrives), and scheduled tasks can be event-driven too (https://dev.to/aws-builders/event-driven-batch-processing-on-aws-from-scheduled-tasks-to-auto-scaling-workload, jev weight 0.3365, weak backing). The framing log's design mixes both: cron creates the tasks, but each task flows through the existing gate and approval machinery like any other trigger.

## Verdict

The scheduler design is the least novel part of the finalist and the most heavily corroborated. The platform constraint (cron triggers with per-execution CPU limits) is documented at weight 0.96, and the chunking answer has strong-weight backing from established batch-processing guidance. The remaining risk is not the pattern but the constant: whether a 20-site Places batch with 4 fetches per site fits inside the actual CPU allowance of the plan in use, which is exactly the assumption the framing log flags for testing.
