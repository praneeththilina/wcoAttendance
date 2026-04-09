## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2024-06-25 - React Multiple Derived States Filtering Performance
**Learning:** Using multiple `.filter()` calls on an array to compute different derived statistics (e.g. `array.filter(x => x.active).length` and `array.filter(x => !x.active).length`) in a React component causes O(k*N) complexity. This is extremely inefficient and computationally expensive, especially on large arrays.
**Action:** Consolidate multiple O(N) `.filter()` passes into a single O(N) loop (using a `for` loop or `reduce`) inside a single `useMemo` block to compute all required derived statistics at once. This reduces algorithmic complexity from O(kN) to O(N).
