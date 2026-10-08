# 06 Step 3: Implement Documented Patterns and Surface Conflicts

Scope: writing code that matches what the fetched documentation shows, honoring deprecation warnings, and surfacing docs-versus-codebase conflicts instead of silently resolving them.

## The implementation rules

The ground skill gives 4 implementation rules (source doc: yubi-OS/yubiOS skills/source-driven-development/SKILL.md):

1. Use the API signatures from the docs, not from memory.
2. If the docs show a new way to do something, use the new way.
3. If the docs deprecate a pattern, do not use the deprecated version.
4. If the docs do not cover something, flag it as unverified.

Rule 1 is the payoff of the fetch: the signature on the docs page is the contract. Rules 2 and 3 require reading the page's own status markers, not just its code samples. Rule 4 protects the citation chain: an undocumented pattern gets the UNVERIFIED flag (doc 07), not silent treatment.

## A worked conflict, from the source doc

The skill's example conflict is React form state (source doc):

```
CONFLICT DETECTED:
The existing codebase uses useState for form loading state,
but React 19 docs recommend useActionState for this pattern.
(Source: react.dev/reference/react/useActionState)

Options:
A) Use the modern pattern (useActionState) - consistent with current docs
B) Match existing code (useState) - consistent with codebase
```

The instruction that follows is the whole rule: "Surface the conflict. Don't silently pick one" (source doc). The agent presents both options with the citation, and the user chooses.

The cited page backs the modern pattern: React's reference documents that "when you use useActionState, the reducerAction receives an extra argument as its first argument: the previous or initial state. The submitted form data is therefore its second argument instead of its first" (https://react.dev/reference/react/useActionState, jev weight 0.93, primary backing). The React 19 release post confirms the replacement: React 19 "introduces useOptimistic to manage optimistic updates, and a new hook React.useActionState to handle common cases for Actions", with forms managed "automatically" through Actions (https://react.dev/blog/2024/12/05/react-19, jev weight 0.82, primary backing). Both sources are tier 1 per doc 04, which is why the conflict is presented rather than dismissed.

## Deprecation and migration guidance as primary sources

Migration guides are official documentation for the question "is this pattern deprecated here?". Microsoft maintains a .NET upgrade documentation hub "about upgrading apps from .NET Framework to .NET" (https://learn.microsoft.com/en-us/dotnet/navigate/migration-guide/, jev weight 0.62, primary backing) and a step-by-step ASP.NET migration guide promising "practical approaches and step-by-step guidance" for moving Framework apps to ASP.NET Core (https://learn.microsoft.com/en-us/aspnet/core/migration/fx-to-core/?view=aspnetcore-10.0, jev weight 0.89, primary backing). These pages are where the docs-vs-memory question is settled for upgrade scenarios: if the migration guide says a pattern moved, it moved.

Third-party migration write-ups exist in volume but sit below tier 1 (source doc never-cite list). A third-party .NET migration walkthrough (https://wojciechowski.app/en/articles/dotnet-migration-guide, jev weight 0.11, weak backing) may help orientation, but the shipped code decision cites the Microsoft guide, not the blog.

## Conflicts have 2 sides

The skill's framing treats the existing codebase as a legitimate party. Option B in the worked example is real: codebase consistency has maintenance value, and the docs recommend but do not compel. What is forbidden is the silent merge of the two, where the agent half-adopts a modern API inside legacy structure and produces code matching neither source. The output of this step is either documented-pattern code with citations, or an explicit conflict block the user resolves (source doc).
