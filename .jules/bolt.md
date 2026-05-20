## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2024-05-18 - Prisma Distinct Query Deduplication
**Learning:** Fetching many records using `findMany` and using an in-memory loop (e.g. `forEach` with a `Map` or `Set`) to deduplicate arrays (such as getting the latest record per entity) incurs unnecessary database I/O, network bandwidth overhead, and Node.js memory bloat, especially as datasets grow.
**Action:** Instead of manual JS deduplication, push the workload down to the database level. Use Prisma's `distinct` clause (e.g., `distinct: ['userId']`) combined with `orderBy` (e.g., `orderBy: [{ userId: 'asc' }, { checkInTime: 'desc' }]`) to fetch only the required unique records. For PostgreSQL compatibility, ensure the `distinct` field is the left-most field in the `orderBy` array.
