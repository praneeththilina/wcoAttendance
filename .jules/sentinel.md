## 2024-05-24 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** Found hardcoded fallback value 'your-secret-key' used for JWT_SECRET in `backend/src/services/authService.ts` and `backend/src/middleware/auth.ts`.
**Learning:** This existed to make local development easier but introduced a critical risk where production deployments missing the environment variable would silently use an insecure key, allowing forged tokens.
**Prevention:** Always enforce required cryptographic secrets to be explicitly set in the environment. Fail securely by throwing an error on module load if they are missing (with an exception only for explicit test environments).

## $(date +%Y-%m-%d) - Prevent mass assignment and type confusion in settings/profile updates
**Vulnerability:** The `/api/v1/admin/settings` and `/api/v1/auth/profile` endpoints directly destructured properties from `req.body` without prior type validation, enabling potential type-juggling attacks or persistence of malformed data into the database (e.g., negative integers for hour settings or XSS payloads in profile strings).
**Learning:** Destructuring request bodies does not validate the type or semantic safety of the data. Explicit Zod validation schemas are required to enforce boundaries and strip unexpected fields. Additionally, the pre-existing `clientSchema` incorrectly used `.required()`, which broke Prisma updates requiring partial parameters.
**Prevention:** Always attach the `validate(schema.shape)` middleware to Express routes and define strict boundary constraints (like `.min(0).max(23)` for hours) in the associated Zod schema to ensure input sanitization before reaching controller logic.
## 2026-04-05 - [Mass Assignment in Controller Methods]
**Vulnerability:** Controller methods (createStaff and updateStaff) were passing `req.body` directly to ORM methods (prisma.user.update and prisma.user.create) without explicit validation or extraction, leading to mass assignment vulnerabilities.
**Learning:** Relying solely on route-level middleware for validation may be insufficient if the controller doesn't enforce schema validation when extracting fields, risking unauthorized data modification.
**Prevention:** Explicitly parse and validate `req.body` inside the controller method using Zod schema (e.g., `schema.shape.body.parse(req.body)`) and extract allowed fields explicitly before passing them to the ORM.
