# 06 - Error Specific Triage

Scope: the source doc's three error-class triage trees, test failure, build failure, and runtime error, and the concrete failure modes each tree encodes.

## Test failure triage

The source doc's tree for a test that fails after a code change has 3 branches:

- Did you change code the test covers? Then either the test is outdated (update the test) or the code has a bug (fix the code). The tree makes the blame decision explicit before any fix.
- Did you change unrelated code? Then it is likely a side effect: check shared state, imports, globals.
- Was the test already flaky? Check for timing issues, order dependence, and external dependencies.

The second branch is the one that surprises people: a change to unrelated code breaking a test is a state-leak signal, not a coincidence. The third branch connects to the reproduce step's state-dependent class: order dependence and shared caches are the recurring suspects.

When a test is hard to localize or flaky, the runtime dimension matters. Jest's own troubleshooting documentation explains that the --runInBand option makes Jest run tests in the same process rather than spawning worker processes, precisely because it is hard to debug many processes at once (https://jestjs.io/docs/troubleshooting, w 0.9). Running in band is the tool-level version of the source doc's "run the failing scenario in isolation" instruction.

## Build failure triage

The build-failure tree classifies failures by error kind, each with its own first check:

- Type error: read the error, check the types at the cited location
- Import error: check the module exists, exports match, paths are correct
- Config error: check build config files for syntax and schema issues
- Dependency error: check package.json, run the install command
- Environment error: check Node version, OS compatibility

Package-manager failure classes are documented in detail by the npm docs' common-errors page, which catalogs cases such as ENOSPC on install (no space or no write permission, with remediation steps like freeing disk space or moving the tmp folder) (https://docs.npmjs.com/common-errors/, w 0.86). The category structure of that reference, package-level, environment-level, and permission-level causes each with a distinct remediation, mirrors the source doc's 5-branch tree.

## Runtime error triage

The runtime tree starts from the symptom signature:

- TypeError reading a property of undefined: something is null or undefined that should not be; check the data flow to find where the value comes from
- Network error or CORS: check URLs, headers, and server CORS configuration
- Render error or white screen: check the error boundary, console, and component tree
- Unexpected behavior with no error: add logging at key points and verify the data at each step

The last branch is the bridge to the instrumentation guidelines (doc 07): when there is no error object to read, the failure announces itself only as a wrong value, and the only way to see it is to instrument the data flow. The first branch carries the doc's core debugging heuristic: for null or undefined errors, the fix is never at the crash site, it is upstream where the value became wrong.
