## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.
## 2024-05-21 - Prisma Distinct for Array Deduplication
**Learning:** Fetching large arrays of relational data into Node.js memory just to deduplicate them using `Map` or `Set` causes massive, unnecessary memory allocations and blocks the single thread. Prisma's `distinct` clause pushes this deduplication down to the database level, but requires careful alignment with the `orderBy` array to prevent runtime errors (the `distinct` field must be the leftmost field in the `orderBy` array).
**Action:** When finding the "latest" record per user or entity, use `distinct: ['relationId']` combined with `orderBy: [{ relationId: 'asc' }, { createdAt: 'desc' }]` instead of fetching everything and mapping in code.
