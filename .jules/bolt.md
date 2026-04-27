## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.
## 2024-04-27 - Parallelize Prisma Queries with Promise.all
**Learning:** Database queries in Express controllers that are independent of each other (such as `findMany` and `count` on the same or different tables) are frequently executed sequentially using sequential `await` calls, creating an N+1 latency bottleneck.
**Action:** Always identify independent database operations and wrap them in `await Promise.all([...])` to execute them in parallel and reduce overall backend request latency.
