## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2024-05-15 - Prisma In-Memory Deduplication Optimization
**Learning:** When retrieving the latest record per related entity (e.g., latest attendance status per user), fetching all records and deduplicating them in memory via loops or Maps causes unnecessary N+1 memory usage and processing overhead in Node.js.
**Action:** Use Prisma's `distinct` operator (e.g., `distinct: ['userId']`) combined with `orderBy` to push the deduplication to the database. For PostgreSQL compatibility, the `distinct` field must be the left-most field in the `orderBy` array (e.g., `orderBy: [{ userId: 'asc' }, { checkInTime: 'desc' }]`) to avoid Prisma runtime errors.
