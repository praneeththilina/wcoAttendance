## 2026-03-12 - Frontend List Filtering Performance
**Learning:** Using `useEffect` to synchronize a derived filtered list (e.g. `filteredClients`) with a search query causes unnecessary secondary renders and duplicate state.
**Action:** Replace `useState` + `useEffect` combinations for simple derived lists with `useMemo` to improve rendering performance and reduce memory usage.

## 2024-03-24 - React Filter String Processing Optimization
**Learning:** Performing multiple `.toLowerCase()` string transformations inside O(N) Array.filter loops inside React components can cause unnecessary allocation/overhead during frequent typing (e.g. typing in a search bar), even for small arrays. Combined with re-calculating the filter on every re-render (e.g. state changes not involving the search string or array), this causes significant performance drain on client devices.
**Action:** When filtering arrays by strings, hoist `toLowerCase()` conversions of search terms *outside* the filter loop and wrap the filtering logic in `useMemo` so it only re-runs when the dependencies (array reference or search term) actually change.

## 2024-05-18 - Prevent O(N) list item re-renders with React.memo()
**Learning:** Re-renders triggered by fast-changing parent state (like a search bar typing event) cause an O(N) re-render cascade for list items mapped directly inside the component, leading to sluggish UI and typing delays in long lists. Mutating array objects to store cached search values does not prevent this and breaks referential equality.
**Action:** Extract list items into distinct `React.memo()` components. This correctly limits re-rendering to only the list elements whose props actually changed, dramatically reducing CPU cycles during rapid parent component updates.
