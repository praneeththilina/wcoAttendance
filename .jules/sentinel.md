## 2024-03-25 - [Mass Assignment in Prisma Update]
**Vulnerability:** Mass assignment in user profile updates allowing modification of protected fields like passwordHash.
**Learning:** Destructuring and explicitly defining allowed fields prevents attackers from modifying unintended fields when passing req.body to ORM update methods.
**Prevention:** Always extract and assign allowed fields explicitly rather than passing the entire request body object.
