## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.
## 2024-05-17 - Pushing deduplication to the database
**Learning:** Querying arrays and deduplicating them in JavaScript memory is slow, uses excess application memory, and incurs unnecessary network transfer cost. When attempting to fetch the latest record per entity (e.g., getting a user's latest attendance status), we can use Prisma's `distinct: ['userId']` to do the heavy lifting in PostgreSQL.
**Action:** Always prefer pushing deduplication and filtering to the database level using `distinct` and `orderBy` instead of fetching full arrays and using JavaScript `Map` or `Set`.
