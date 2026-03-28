## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2024-05-15 - [Anti-pattern avoidance: IIFEs in JSX]
**Learning:** Even when optimizing algorithmic complexity (e.g., reducing O(kN) `.filter()` passes to a single O(N) loop), placing the optimized logic inside an Immediately Invoked Function Expression (IIFE) within the React JSX tree is considered an anti-pattern. While functionally correct and safe, it significantly degrades code readability.
**Action:** Always extract optimized computational logic outside the JSX tree, typically into a `useMemo` block defined before the `return` statement, to maintain idiomatic React practices and ensure readability is not sacrificed for performance.
