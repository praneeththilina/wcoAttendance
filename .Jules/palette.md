## 2024-03-12 - ARIA Labels for Icon-Only Buttons
**Learning:** Found several icon-only navigation buttons (e.g., arrow_back) lacking `aria-label`s, which causes screen readers to just announce "button" and provides no context. Care must be taken not to apply these globally (e.g. using a global replace) because different buttons need different labels even if they look similar structurally, to avoid mislabeling pagination or filter buttons with "Go back".
**Action:** Always add descriptive `aria-label` attributes to icon-only interactive elements and target them carefully, double-checking the element's actual function.

## 2025-01-20 - Accessible Interactive Icons in Forms
**Learning:** Found an interactive icon-only element (`span`) inside an input component used to toggle password visibility. Using a `span` lacks keyboard accessibility, semantic meaning, and screen reader support out of the box.
**Action:** Always convert interactive icons inside forms (like show/hide password toggles) into `<button type="button">` elements. Add `aria-label` and `title` attributes that dynamically update based on the state. Add proper focus styles (e.g. `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`) and hover states for visual feedback.
