## 2024-05-24 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** Found hardcoded fallback value 'your-secret-key' used for JWT_SECRET in `backend/src/services/authService.ts` and `backend/src/middleware/auth.ts`.
**Learning:** This existed to make local development easier but introduced a critical risk where production deployments missing the environment variable would silently use an insecure key, allowing forged tokens.
**Prevention:** Always enforce required cryptographic secrets to be explicitly set in the environment. Fail securely by throwing an error on module load if they are missing (with an exception only for explicit test environments).

## $(date +%Y-%m-%d) - Prevent mass assignment and type confusion in settings/profile updates
**Vulnerability:** The `/api/v1/admin/settings` and `/api/v1/auth/profile` endpoints directly destructured properties from `req.body` without prior type validation, enabling potential type-juggling attacks or persistence of malformed data into the database (e.g., negative integers for hour settings or XSS payloads in profile strings).
**Learning:** Destructuring request bodies does not validate the type or semantic safety of the data. Explicit Zod validation schemas are required to enforce boundaries and strip unexpected fields. Additionally, the pre-existing `clientSchema` incorrectly used `.required()`, which broke Prisma updates requiring partial parameters.
**Prevention:** Always attach the `validate(schema.shape)` middleware to Express routes and define strict boundary constraints (like `.min(0).max(23)` for hours) in the associated Zod schema to ensure input sanitization before reaching controller logic.

## $(date +%Y-%m-%d) - Prevent XSS in Zod .url() validation
**Vulnerability:** The `/api/v1/auth/profile` endpoint used Zod's `.url()` to validate profile picture updates. However, Zod's `.url()` accepts ANY valid URL, including `javascript:alert(1)`, which can lead to Stored XSS if the URL is rendered in an `<img>` tag or `<a>` href on the frontend.
**Learning:** Zod's `.url()` validator only checks structural validity, not protocol safety. Malicious users can exploit this to inject JavaScript pseudo-protocols.
**Prevention:** Always use `.refine()` along with `.url()` to explicitly allowlist safe protocols (like `http:` and `https:`) when validating user-provided URLs that may be rendered in the browser.
