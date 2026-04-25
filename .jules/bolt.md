## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.
## 2024-05-20 - Barrel Files Defeat React Lazy Loading
**Learning:** Importing components from barrel files (like `@/pages`) when using `React.lazy()` defeats the purpose of code splitting, because the barrel file statically imports and exports all components, causing them all to be bundled together.
**Action:** Always import components directly from their specific files (e.g., `import("@/pages/LoginPage")`) when lazy loading to ensure proper chunking and smaller initial bundle sizes.
