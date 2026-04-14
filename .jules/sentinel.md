## 2024-05-18 - Mass Assignment in Admin Controller
**Vulnerability:** Unvalidated `req.body` directly passed to Prisma create/update methods in `adminController.ts`, causing a mass assignment risk.
**Learning:** Validation schemas must be explicitly invoked (e.g., `schema.shape.body.parse(req.body)`) prior to destructuring to strip unauthorized fields, rather than relying strictly on ad-hoc blocklist deletions (e.g. `delete data.password`).
**Prevention:** Ensure all controller methods explicitly validate input objects against strong Zod schemas or use global validation middlewares before interacting with the ORM.
