## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.
## 2024-05-15 - Prisma Data Deduplication
**Learning:** When retrieving the latest record per related entity (e.g., latest attendance status per user), using Prisma's `distinct: ['userId']` operator combined with `orderBy` pushes the deduplication down to the database level. This significantly reduces data transfer and Node.js memory overhead compared to fetching all records and deduplicating them in memory using a `Map`.
**Action:** Utilize Prisma's `distinct` and `orderBy` whenever deduplication based on a single field is needed to optimize database performance.
