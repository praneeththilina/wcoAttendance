## 2024-05-24 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** Found hardcoded fallback value 'your-secret-key' used for JWT_SECRET in `backend/src/services/authService.ts` and `backend/src/middleware/auth.ts`.
**Learning:** This existed to make local development easier but introduced a critical risk where production deployments missing the environment variable would silently use an insecure key, allowing forged tokens.
**Prevention:** Always enforce required cryptographic secrets to be explicitly set in the environment. Fail securely by throwing an error on module load if they are missing (with an exception only for explicit test environments).

## 2024-04-19 - Prevent mass assignment and type confusion in settings/profile updates
**Vulnerability:** The `/api/v1/admin/settings` and `/api/v1/auth/profile` endpoints directly destructured properties from `req.body` without prior type validation, enabling potential type-juggling attacks or persistence of malformed data into the database (e.g., negative integers for hour settings or XSS payloads in profile strings).
**Learning:** Destructuring request bodies does not validate the type or semantic safety of the data. Explicit Zod validation schemas are required to enforce boundaries and strip unexpected fields. Additionally, the pre-existing `clientSchema` incorrectly used `.required()`, which broke Prisma updates requiring partial parameters.
**Prevention:** Always attach the `validate(schema.shape)` middleware to Express routes and define strict boundary constraints (like `.min(0).max(23)` for hours) in the associated Zod schema to ensure input sanitization before reaching controller logic.

## 2024-04-19 - Prevent Type Safety Bypasses in Error Handling and Data Modification
**Vulnerability:** Widespread use of \`as any\` casts when inspecting error properties (e.g., \`(error as any).code\`) and modifying validated request data (e.g., \`delete (updateData as any).password\`).
**Learning:** Type assertion using \`any\` completely disables TypeScript's safety checks, potentially causing silent runtime crashes if the object shape changes or creating false confidence when bypassing protections (like mass assignments). Express controllers interacting with Prisma must handle errors structurally rather than coercing unknown error types.
**Prevention:** 1. Utilize \`error instanceof Prisma.PrismaClientKnownRequestError\` to safely infer types and inspect error properties like \`.code\`. 2. If an object from Zod parsing needs safe omission of fields, enforce strict typings locally before deleting or explicitly omit fields during assignment to prevent bypassing TypeScript entirely.
