## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2026-03-24 - Prisma nested select to avoid O(N) memory mapping
**Learning:** In Prisma queries (e.g. inside `adminController.ts`), fetching all records matching a date range and then manually aggregating or mapping them inside a Node.js map/loop can cause massive overhead, pulling far more fields into JS memory than needed and resulting in N+1 loops.
**Action:** When determining a computed or derived state (like a single user's latest attendance), use Prisma's nested `select` syntax with `orderBy` and `take: 1` directly inside the parent `findMany` query to push the filter and aggregation logic down into the SQL database.
