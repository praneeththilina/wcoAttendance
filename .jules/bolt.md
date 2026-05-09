## 2024-05-09 - Push Deduplication Down to Prisma

**Learning:** When retrieving the "latest" status per related entity (e.g., latest attendance record per user today), a common anti-pattern is fetching all matching records and deduplicating them in-memory using a Map or loop. Prisma supports pushing this down to the database level using `distinct: ['relationId']` combined with an `orderBy`.

**Action:** Whenever tasked with finding "latest" records per entity or identifying manual deduplication patterns with `findMany` over related arrays, immediately look for opportunities to replace in-memory Map logic with Prisma's `distinct` to reduce Node.js memory overhead and network payload size.
