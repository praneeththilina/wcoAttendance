## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.
## 2026-05-15 - Prisma Distinct Deduplication Optimization
**Learning:** When using Prisma's `distinct` operator to fetch the latest record per entity (e.g., latest status per user) and reduce Node.js memory overhead, PostgreSQL strictly requires the left-most expression in the `orderBy` array to exactly match the fields in the `distinct` array. Failing to include `{ [distinctField]: 'asc'/'desc' }` as the first `orderBy` criteria will cause a `PrismaClientKnownRequestError` runtime crash.
**Action:** When implementing database-level deduplication with `distinct: ['field']` in Prisma, always configure the corresponding `orderBy` as `[{ field: 'asc' }, { sortField: 'desc' }]` to guarantee cross-database compatibility.
