## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2024-03-24 - Prisma Data Fetching Deduplication
**Learning:** When retrieving the "latest" record per related entity (e.g., getting the latest check-in status per user), fetching all matching records from the database and using a JavaScript `Map()` to manually deduplicate them causes severe performance issues. This forces Node.js to allocate large arrays and blocks the event loop on O(N) operations, while also maximizing bandwidth used from Postgres to Node.
**Action:** Use Prisma's `distinct` operator combined with `orderBy` (e.g., `distinct: ['userId']`, `orderBy: { checkInTime: 'desc' }`) to push the deduplication logic down to the database engine. This prevents N+1 memory issues by only returning the exact unique records required.
