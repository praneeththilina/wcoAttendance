## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.
## 2026-05-07 - Use database distinct instead of memory mapping
**Learning:** To optimize backend performance when retrieving the latest record per related entity (e.g., latest attendance status per user), avoid fetching all records and deduping them in memory. Instead, use Prisma's `distinct` operator combined with `orderBy` to push the deduplication to the database, reducing data transfer and Node.js memory overhead.
**Action:** When seeing Map or manual dedupe of arrays with database query outputs, look for `distinct` operator optimizations.
