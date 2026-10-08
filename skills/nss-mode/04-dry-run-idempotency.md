# 04 - Dry-run, check mode, and idempotency

Scope: dimensions 4 and 5 of the Mode axis: preview/check mode (`--dry-run`, `-n`, `--check`), mutation safety, and idempotency versus force.

## Dimension 4: preview and check mode (0-2)

The source doc requires that a preview "must be side-effect-free and specific about intended changes". Full credit is not earned by the existence of a `--dry-run` flag; it is earned by the behavioral contract: no side effects, a plan precise enough to act on, preserved output shape, and a defined exit status.

The best-documented production example is Terraform. Its `terraform plan` reference: "The terraform plan command creates an execution plan, which lets you preview the changes that Terraform plans to make to your infrastructure" (https://developer.hashicorp.com/terraform/cli/commands/plan, weight 0.92). The tutorial layer adds the workflow contract: build the plan, export it with the `-out` flag, review the plan contents, then apply the saved plan so apply cannot drift from what was previewed (https://developer.hashicorp.com/terraform/tutorials/cli/plan, weight 0.86). That is level-5-style mode composition: the preview artifact flows into the mutation step unchanged. A tool that prints a plausible plan but cannot feed it into the actual run scores below a tool that can.

rsync documents the lighter-weight variant: `--dry-run` (aliased `-n`) performs a trial run with no changes made, showing what would have been transferred (https://www.man7.org/linux/man-pages/man1/rsync.1.html, weight 0.80; same page mirrored at https://linux.die.net/man/1/rsync, weight 0.67). The rsync man page also documents the interaction subtleties that distinguish a real contract from a keyword: some options have no effect under `--dry-run`, and statistics are still produced.

The source doc's important distinction applies here: "`--check` is not automatically `--dry-run`. A check may validate drift without constructing the exact execution plan." Terraform again illustrates: `plan -refresh-only` checks for drift without proposing changes, a different commitment from a full plan (https://spacelift.io/blog/terraform-dry-run, weight 0.20, weak backing). A scorer awards dimension 4 points to a `--check` mode only if the file states what the check does and does not construct.

## Dimension 5: mutation safety and idempotency (0-2)

The source doc contract: re-running converges; already-satisfied operations return success; `--force` handles override, not non-idempotency. Idempotency has a precise definition to grade against: "an operation produces the same result regardless of how many times it runs" (https://khimananda.com/blog/idempotency-in-configuration-management, weight 0.17, weak backing). The configuration-management tradition (Ansible, Terraform, Chef) is where the convergence semantics come from: repeated application produces the same system state, which requires checking current state before acting (https://kokil.com.np/blog/idempotency-in-configuration-management, weight 0.14, weak backing). Chef's distinction between convergence and idempotence is the sharpened form: convergence describes the desired end state; idempotence describes the property that repeated runs do not compound side effects (https://stackoverflow.com/questions/30615588/difference-between-convergence-and-idempotence-in-chef, weight 0.14, weak backing).

The API world supplies the transactional sibling: applying the same request multiple times has the same final effect as applying it once, enforced with idempotency keys (https://cloud.google.com/discover/idempotency, weight 0.79 in the attempt-1 dig). CLI tools rarely have keys, so the CLI-grade contract is the convergence one: check, then act, then report success for already-satisfied state.

The trap the rubric watches for: a tool whose `--force` flag is the only mechanism for re-running, because force that "resets state to a default" is hiding non-idempotency (source doc, Red flags). The correct pattern is rerun-safety without force, with force reserved for genuine conflict overrides.

## Scoring notes

- Preview without specificity is not a preview: "the plan shows what will change" must survive the question "at what granularity?".
- A dry-run that writes logs, caches, or lock files has side effects; the contract must state the exemption list if there is one.
- Already-satisfied operations returning success is what makes cron and CI re-runs safe; a tool that errors on the second run forces callers to wrap it in state checks.
- The two dimensions are separable: a read-only checker scores high on 4 and can be silent on 5; a convergent installer that cannot preview scores the reverse.
- Numbers as digits: 2 dimensions, 0-2 each, maximum 4 of the 20 total points live in this doc's scope.
