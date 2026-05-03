## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2024-03-24 - React useMemo Object Reference Consistency
**Learning:** When generating a transformed/normalized array in a `useMemo` hook to optimize operations (e.g. mapping objects to add `_normalizedName` for faster filtering), returning the *original* array under certain conditions (like an empty search query) and the *transformed* array under others creates a subtle React anti-pattern. This causes object references for every item to change unexpectedly when the condition toggles, potentially triggering massive re-renders in child components that rely on reference equality.
**Action:** When filtering or processing lists, ensure the returned list maintains consistent object references regardless of the filter state. If you map the original array to create normalized items, return those normalized items consistently, even when the filter is skipped/empty.
