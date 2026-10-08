# 05: Input Validation and Upload Safety

Scope: schema validation at system boundaries with zod, plus file upload safety: type and size limits, and magic-byte verification over extension trust. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## Validate at the boundary, return structured errors

The source doc's always-do tier requires validating all external input at the system boundary (API routes, form handlers). The concrete pattern is a zod schema declared once per endpoint:

```typescript
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional(),
});
```

The route handler calls `CreateTaskSchema.safeParse(req.body)`, returns 422 with a structured error body (`code: 'VALIDATION_ERROR'`, `message: 'Invalid input'`, `details: result.error.flatten()`) on failure, and proceeds with `result.data`, which is now typed and validated.

Zod's own documentation (weight 0.64, https://zod.dev/) describes the library as TypeScript-first schema validation, letting you define schemas from simple strings to complex nested objects and use them to validate data; the API reference (weight 0.77, https://zod.dev/api) documents the schema DSL the source doc's pattern uses, including permissiveness caveats for some built-in types (the URL-string check delegates to `new URL()` and can differ across platforms and runtimes). A low-weight writeup (0.20, https://www.api-contract-testing.com/schema-design-validation-patterns/runtime-validation-with-zod/) advises against `.passthrough()` on boundary schemas because it re-admits unknown keys into typed data; that advice is consistent with the source doc's boundary discipline but is weakly sourced, so treat it as guidance, not gospel.

## Never trust the client

The source doc's never-do tier states that client-side validation is never a security boundary. The server-side schema is the boundary; client-side checks exist for UX only. This is why the validation happens in the route handler, not in the browser.

## File uploads: type, size, and content

The source doc's upload pattern:

1. Restrict types to an explicit allowlist (`['image/jpeg', 'image/png', 'image/webp']`), rejecting anything else with a `ValidationError('File type not allowed')`.
2. Cap size (5 MB, `5 * 1024 * 1024`), rejecting larger files with `ValidationError('File too large (max 5MB)')`.
3. Do not trust the file extension. Check magic bytes if the content type is critical.

The OWASP File Upload Cheat Sheet (weight 0.84) is the primary external reference for this surface. Its key guidance aligns with and extends the source doc: "Ensure that the validation occurs after decoding the file name, and that a proper filter is set in place in order to avoid certain known bypasses" (https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html). In other words, filename handling is part of upload validation, and naive extension or MIME checks have documented bypasses.

Low-weight checklist writeups (0.16 to 0.20: coreupload.com, uploadkit.dev, truefilesize.com) enumerate the same control stack, MIME validation, magic-byte verification, size limits, filename sanitization, and storage isolation. They agree with the source doc and the OWASP cheat sheet but carry weak source quality; one survey-style claim they carry (that only 8% of organizations with file upload web applications had full protections in place, from helpnetsecurity.com at 0.20) is directional context only.

## Where this sits in the skill's tiers

Validation at the boundary is tier 1 (always do). Adding a file upload handler is tier 2 (ask first), because uploads create a new untrusted-input channel plus a new storage surface in one move. The verification checklist operationalizes both: all user input validated at system boundaries, and the input section of the checklist explicitly includes the derived-path safety check for destructive operations (covered in doc 06).

## Provenance

Source doc claims: the zod schema and handler pattern, the 422 error shape, the upload allowlist and size cap, the magic-bytes rule, and the tier assignments. Dig-backed claims: zod's description and API behavior (0.64 and 0.77, zod.dev), and the OWASP File Upload Cheat Sheet's decoded-filename and bypass-filter guidance (0.84). Weakly backed corroboration (labeled): the `.passthrough()` warning (0.20, api-contract-testing.com) and upload checklist writeups at 0.16 to 0.20 (coreupload.com, uploadkit.dev, truefilesize.com, helpnetsecurity.com).
