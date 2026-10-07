# 02 - Slicing Strategies

Scope: the three slicing patterns from the source doc, vertical slices through the stack, contract-first slicing for parallel backend and frontend work, and risk-first slicing that proves the riskiest piece first.

## Vertical slices, the preferred default

The source doc (`yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`) marks vertical slicing as preferred. A vertical slice builds one complete path through the stack. The doc's worked example slices a task manager four ways: Slice 1 creates a task (database, API, and basic UI, verified by tests passing and a user creating a task through the UI), Slice 2 lists tasks, Slice 3 edits a task, Slice 4 deletes a task. Each slice delivers working end-to-end functionality, so after every slice the product does one more complete thing.

Vertical slice architecture is the code-organization counterpart of the same idea: instead of structuring the application horizontally, separating everything into technical layers, you organize the code around the feature or slice it serves (https://milanjovanovic.tech/blog/vertical-slice-architecture, jev weight 0.44, weak backing). Advocates of the pattern cite faster feedback loops as the core benefit, because each slice is small enough to build and validate in one pass (https://monday.com/blog/rnd/vertical-slice/, jev weight 0.19, weak backing).

## Contract-first slicing

When backend and frontend need to develop in parallel, the source doc inserts a Slice 0 that defines the API contract: types, interfaces, or an OpenAPI spec. Backend then implements against the contract with API tests, frontend implements against mock data that matches the contract, and only Slice 2 integrates and tests end to end.

The contract-first pattern is documented the same way in the wild: the API contract comes first, and both teams agree on what the API will do before either writes a line of implementation code, which is what unblocks parallel work (https://medium.com/@janakchamantha12/unblock-your-development-the-contract-first-strategy-for-parallel-frontend-and-backend-teams-7eaa82f10e23, jev weight 0.17, weak backing). To make it work, the contract should be written early, reviewed by both product and engineering, and treated as the reference point for implementation and test fixtures including mocks (https://nhimg.org/faq/how-should-teams-implement-contract-first-api-development-when-front-end-and-bac/, jev weight 0.12, weak backing).

The general API-first framing backs the same claim with better numbers: API-first development creates shared contracts that prevent integration surprises and align frontend and backend teams from the start of the project (https://strapi.io/blog/api-first-development-guide, jev weight 0.54). Industry adoption is still the minority: one 2026 survey-style guide reports that only 17% of teams use contract-first development in practice, which makes the discipline a differentiator rather than a default (https://signeasy.com/esign-api-guide/api-contract, jev weight 0.52).

## Risk-first slicing

The third strategy reorders the slices by uncertainty instead of by feature value. The source doc's example: Slice 1 proves the WebSocket connection works (the highest-risk element), Slice 2 builds real-time task updates on the proven connection, Slice 3 adds offline support and reconnection. The stated rationale: if Slice 1 fails, you discover it before investing in Slices 2 and 3.

Risk-first slicing is the only one of the three strategies that changes the order of the work rather than the boundaries. It pairs well with the increment cycle: the riskiest slice still ends with a test, a verification, and a commit, so even a negative result from Slice 1 is a committed, documented finding rather than a lost week.

## Choosing between them

Use vertical slices as the default for any feature that has a UI, an API, and storage, because every slice ships observable value. Switch to contract-first when two workstreams must run in parallel and the contract is cheap to write up front. Switch to risk-first when one technical unknown dominates the estimate, because the cost of proving that unknown first is small and the cost of discovering it last is a rewrite of everything downstream.
