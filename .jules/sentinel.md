## 2024-05-24 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** Found hardcoded fallback value 'your-secret-key' used for JWT_SECRET in `backend/src/services/authService.ts` and `backend/src/middleware/auth.ts`.
**Learning:** This existed to make local development easier but introduced a critical risk where production deployments missing the environment variable would silently use an insecure key, allowing forged tokens.
**Prevention:** Always enforce required cryptographic secrets to be explicitly set in the environment. Fail securely by throwing an error on module load if they are missing (with an exception only for explicit test environments).

## $(date +%Y-%m-%d) - Prevent mass assignment and type confusion in settings/profile updates
**Vulnerability:** The `/api/v1/admin/settings` and `/api/v1/auth/profile` endpoints directly destructured properties from `req.body` without prior type validation, enabling potential type-juggling attacks or persistence of malformed data into the database (e.g., negative integers for hour settings or XSS payloads in profile strings).
**Learning:** Destructuring request bodies does not validate the type or semantic safety of the data. Explicit Zod validation schemas are required to enforce boundaries and strip unexpected fields. Additionally, the pre-existing `clientSchema` incorrectly used `.required()`, which broke Prisma updates requiring partial parameters.
**Prevention:** Always attach the `validate(schema.shape)` middleware to Express routes and define strict boundary constraints (like `.min(0).max(23)` for hours) in the associated Zod schema to ensure input sanitization before reaching controller logic.

## 2024-04-26 - Mass Assignment Vulnerability in Controllers
**Vulnerability:** The `adminController.ts` directly destructured `req.body` and passed the resulting objects to Prisma `create` and `update` methods without explicit Zod parsing/sanitization in the controller logic itself.
**Learning:** Even if route-level validation middleware is present, or schemas exist in the codebase, directly destructuring `req.body` in the controller logic bypasses type safety and validation at the execution level, allowing attackers to inject unexpected fields (like `role` or `isActive`) if the route middleware is misconfigured or bypassed.
**Prevention:** Always use an allowlist approach by explicitly parsing the request body with Zod schemas (e.g., `schema.shape.body.parse(req.body)`) within the controller before passing data to Prisma. Maintain defense-in-depth by retaining explicit blocklist deletions (like `delete updateData.password`) for sensitive fields. Be aware that `as any` casting may be necessary to satisfy Prisma types when using strictly inferred Zod schemas for partial updates.
