# Migration Patterns: Strangler, Adapter, and Feature Flag

Scope: the 3 migration patterns the skill teaches for moving consumers from an old system to a new one without a cutover event, with the strongest external grounding in the corpus (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "Migration Patterns").

## Strangler pattern

The source doc defines the pattern as running old and new systems in parallel and routing traffic incrementally from old to new, with removal when the old system handles 0% of traffic. Its phase ladder:

1. New system handles 0%, old handles 100%.
2. New system handles 10% (canary).
3. New system handles 50%.
4. New system handles 100%, old system idle.
5. Remove old system.

This is the strongest-digged subtopic in the corpus, with 3 sources above the 0.5 authoritative bar. Microsoft's Azure Architecture Center documents the pattern as an incremental process to replace specific pieces of functionality with new applications and services, where "customers continue to use the same interface and are unaware that a migration is in progress" (https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig, jev weight 0.92). AWS Prescriptive Guidance documents it as the way to migrate a monolithic application to a microservices architecture incrementally, with reduced transformation risk and business disruption (https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/strangler-fig.html, jev weight 0.90). Sam Newman's canonical description: the new system "wraps around" the existing system, intercepting calls to old functionality, and redirecting those calls to the new implementation (https://samnewman.io/patterns/refactoring/strangler-fig-application/, jev weight 0.69).

The dig record corroborates the attribution to Martin Fowler at lower weights (https://synchronium.github.io/software-architecture-wiki/patterns/strangler-fig.html, jev weight 0.24, weak backing; https://softwarepatternslexicon.com/microservices/microservices-decomposition-patterns/strangler-fig-pattern/, jev weight 0.30, weak backing).

The pattern is the traffic-level implementation of the skill's step 3 "migrate incrementally" (see 04-migration-process.md). The canary phase at 10% is the skill's "verify behavior matches" step applied to real production traffic before commitment.

## Adapter pattern

The source doc's adapter pattern keeps consumers on the old interface while the backend migrates underneath. Its TypeScript example defines a `LegacyTaskService` implementing the old `OldTaskAPI`, holding a reference to the new `NewTaskService`, translating method signatures (numeric `id` to string id) and output formats on the way through.

```typescript
class LegacyTaskService implements OldTaskAPI {
  constructor(private newService: NewTaskService) {}

  getTask(id: number): OldTask {
    const task = this.newService.findById(String(id));
    return this.toOldFormat(task);
  }
}
```

The adapter is the pattern that honors Hyrum's Law most directly (see 01-core-principles.md): consumers keep depending on the observable behaviors of the old interface, including its quirks, while the implementation underneath is replaced. It is also the pattern with a cost trap: an adapter that translates every call forever is a permanent second implementation of the old system. The skill's removal step therefore still applies; the adapter is a migration vehicle, not a destination, and it should be removed when the last old-interface consumer migrates.

## Feature flag migration

The source doc's third pattern switches consumers from old to new one at a time at the code level:

```typescript
function getTaskService(userId: string): TaskService {
  if (featureFlags.isEnabled('new-task-service', { userId })) {
    return new NewTaskService();
  }
  return new LegacyTaskService();
}
```

This is per-user (or per-tenant) routing rather than percentage routing: the flag check is the seam. Feature-flag migration is the design-time-planning principle made concrete (see 01-core-principles.md); a system built without the seam cannot use this pattern. It also composes with the strangler pattern: flags can gate which consumers' traffic the strangler proxy routes to the new system.

## Choosing between the patterns

The patterns are not mutually exclusive; they operate at different layers:

- Strangler: infrastructure and traffic layer. Best when consumers are external or the old system is a service boundary.
- Adapter: code and interface layer. Best when consumers cannot change quickly but the backend must.
- Feature flag: consumer-cohort layer. Best when consumers are internal and individually addressable, and when you need instant rollback per consumer.

All 3 share the property the skill demands of every migration: reversibility. No pattern in the set requires a cutover event where the only way back is a rollback plan. The 5-phase strangler ladder makes this explicit; the adapter keeps the old interface alive; the flag flips per consumer. A deprecation program that has none of these seams available is a program planning a big-bang rewrite, which the skill's process section explicitly rules out.
