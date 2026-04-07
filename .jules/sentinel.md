## 2024-05-24 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** Found hardcoded fallback value 'your-secret-key' used for JWT_SECRET in `backend/src/services/authService.ts` and `backend/src/middleware/auth.ts`.
**Learning:** This existed to make local development easier but introduced a critical risk where production deployments missing the environment variable would silently use an insecure key, allowing forged tokens.
**Prevention:** Always enforce required cryptographic secrets to be explicitly set in the environment. Fail securely by throwing an error on module load if they are missing (with an exception only for explicit test environments).

## $(date +%Y-%m-%d) - Prevent mass assignment and type confusion in settings/profile updates
**Vulnerability:** The `/api/v1/admin/settings` and `/api/v1/auth/profile` endpoints directly destructured properties from `req.body` without prior type validation, enabling potential type-juggling attacks or persistence of malformed data into the database (e.g., negative integers for hour settings or XSS payloads in profile strings).
**Learning:** Destructuring request bodies does not validate the type or semantic safety of the data. Explicit Zod validation schemas are required to enforce boundaries and strip unexpected fields. Additionally, the pre-existing `clientSchema` incorrectly used `.required()`, which broke Prisma updates requiring partial parameters.
**Prevention:** Always attach the `validate(schema.shape)` middleware to Express routes and define strict boundary constraints (like `.min(0).max(23)` for hours) in the associated Zod schema to ensure input sanitization before reaching controller logic.

## $(date +%Y-%m-%d) - Prevent mass assignment in client creation and update endpoints
**Vulnerability:** The `/api/v1/admin/clients` and `/api/v1/admin/clients/:id` endpoints defined a Zod schema but incorrectly parsed the request body and used `as any` or partial parsing without validating types at the route level, allowing potentially unvalidated or unexpected fields to bypass strict checking and reach Prisma.
**Learning:** Extracting only specific fields from `req.body` directly inside the controller provides a defense-in-depth against mass assignment, especially when combined with middleware validation schemas.
**Prevention:** Use Zod schemas and route-level validation middleware to enforce types, and explicitly destructure only allowed fields from `req.body` before passing them to the database layer.
