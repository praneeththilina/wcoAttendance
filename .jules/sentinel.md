## 2024-05-24 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** Found hardcoded fallback value 'your-secret-key' used for JWT_SECRET in `backend/src/services/authService.ts` and `backend/src/middleware/auth.ts`.
**Learning:** This existed to make local development easier but introduced a critical risk where production deployments missing the environment variable would silently use an insecure key, allowing forged tokens.
**Prevention:** Always enforce required cryptographic secrets to be explicitly set in the environment. Fail securely by throwing an error on module load if they are missing (with an exception only for explicit test environments).

## $(date +%Y-%m-%d) - Prevent mass assignment and type confusion in settings/profile updates
**Vulnerability:** The `/api/v1/admin/settings` and `/api/v1/auth/profile` endpoints directly destructured properties from `req.body` without prior type validation, enabling potential type-juggling attacks or persistence of malformed data into the database (e.g., negative integers for hour settings or XSS payloads in profile strings).
**Learning:** Destructuring request bodies does not validate the type or semantic safety of the data. Explicit Zod validation schemas are required to enforce boundaries and strip unexpected fields. Additionally, the pre-existing `clientSchema` incorrectly used `.required()`, which broke Prisma updates requiring partial parameters.
**Prevention:** Always attach the `validate(schema.shape)` middleware to Express routes and define strict boundary constraints (like `.min(0).max(23)` for hours) in the associated Zod schema to ensure input sanitization before reaching controller logic.

## 2024-05-24 - Mass Assignment Vulnerability in Prisma Updates
**Vulnerability:** Prisma `.update()` and `.create()` operations were receiving full `req.body` objects or lightly destructured fields without inner validation inside controller methods, even when route-level validation was present.
**Learning:** Route-level validation middleware (like `validate(schema)`) validates the request structure but doesn't necessarily sanitize or strip out unvalidated fields from `req.body` depending on Zod configuration (like `.strict()`). Passing `req.body` directly to Prisma methods allows malicious users to update protected fields (like passwordHashes, role escalation, or timestamps).
**Prevention:** Always parse `req.body` through the appropriate Zod schema directly within the controller logic (`schema.parse(req.body)`) before passing data to ORM functions to strip unexpected fields and enforce defense-in-depth, rather than relying solely on route middleware or manual destructuring/deleting of sensitive fields.
