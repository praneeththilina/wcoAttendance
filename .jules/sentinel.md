## 2024-05-24 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** Found hardcoded fallback value 'your-secret-key' used for JWT_SECRET in `backend/src/services/authService.ts` and `backend/src/middleware/auth.ts`.
**Learning:** This existed to make local development easier but introduced a critical risk where production deployments missing the environment variable would silently use an insecure key, allowing forged tokens.
**Prevention:** Always enforce required cryptographic secrets to be explicitly set in the environment. Fail securely by throwing an error on module load if they are missing (with an exception only for explicit test environments).

## $(date +%Y-%m-%d) - Prevent mass assignment and type confusion in settings/profile updates
**Vulnerability:** The `/api/v1/admin/settings` and `/api/v1/auth/profile` endpoints directly destructured properties from `req.body` without prior type validation, enabling potential type-juggling attacks or persistence of malformed data into the database (e.g., negative integers for hour settings or XSS payloads in profile strings).
**Learning:** Destructuring request bodies does not validate the type or semantic safety of the data. Explicit Zod validation schemas are required to enforce boundaries and strip unexpected fields. Additionally, the pre-existing `clientSchema` incorrectly used `.required()`, which broke Prisma updates requiring partial parameters.
**Prevention:** Always attach the `validate(schema.shape)` middleware to Express routes and define strict boundary constraints (like `.min(0).max(23)` for hours) in the associated Zod schema to ensure input sanitization before reaching controller logic.
## 2024-03-22 - [Fix Mass Assignment in Staff Updates]
**Vulnerability:** The `updateStaff` endpoint in `backend/src/controllers/adminController.ts` was taking `req.body` and passing it directly to `prisma.user.update()` with only the `password` field removed.
**Learning:** This allowed for mass assignment vulnerabilities where any user with access could modify fields they shouldn't be able to (like `role` or `id`), or arbitrary properties, bypassing intention.
**Prevention:** Use Zod schemas (e.g. `updateStaffSchema.shape.body.parse(req.body)`) to strictly define and parse expected input fields before passing them to the database update operation.
