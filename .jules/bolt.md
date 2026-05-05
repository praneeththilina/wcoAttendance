## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2024-05-05 - Prisma Database-level Deduplication
**Learning:** Fetching large sets of records from the database only to deduplicate them in-memory using JavaScript (e.g. populating a `Map` to find the latest record per user) creates unnecessary Node.js memory overhead and network payload bloat.
**Action:** When finding the single latest record per related entity in Prisma, combine `distinct: ['relationId']` with `orderBy: { createdAt: 'desc' }` to push deduplication directly to the database level, improving both memory footprint and response time.
