## 2024-03-12 - ARIA Labels for Icon-Only Buttons
**Learning:** Found several icon-only navigation buttons (e.g., arrow_back) lacking `aria-label`s, which causes screen readers to just announce "button" and provides no context. Care must be taken not to apply these globally (e.g. using a global replace) because different buttons need different labels even if they look similar structurally, to avoid mislabeling pagination or filter buttons with "Go back".
**Action:** Always add descriptive `aria-label` attributes to icon-only interactive elements and target them carefully, double-checking the element's actual function.

## 2025-01-20 - Accessible Interactive Icons in Forms
**Learning:** Found an interactive icon-only element (`span`) inside an input component used to toggle password visibility. Using a `span` lacks keyboard accessibility, semantic meaning, and screen reader support out of the box.
**Action:** Always convert interactive icons inside forms (like show/hide password toggles) into `<button type="button">` elements. Add `aria-label` and `title` attributes that dynamically update based on the state. Add proper focus styles (e.g. `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`) and hover states for visual feedback.

## 2024-05-15 - [Added aria-labels to icon-only back buttons]
**Learning:** In the project, there is a recurring pattern of creating icon-only back buttons using either `<button>` tags without `aria-label`s or semantically incorrect `<div>` tags acting as buttons. This makes navigation significantly harder for screen-reader users, as they are left without context about the button's action.
**Action:** When adding new navigation buttons or fixing existing ones, always ensure `aria-label`s exist for icon-only buttons. If the element is a `div` acting as a button, convert it to a semantic `<button type="button">` or at minimum add `role="button"` and `tabIndex={0}`. Adding proper `focus-visible` states using Tailwind (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`) also drastically improves keyboard navigation.

## 2024-05-07 - Screen Reader Support for Interactive Icons
**Learning:** We discovered several instances of `button` elements containing only Google Material icon spans (e.g., `<span className="material-symbols-outlined">help</span>`) that lacked `aria-label`s. Without these labels, screen readers will announce these as empty buttons. Also, discovered disabled buttons did not explain *why* they were disabled, a key usability issue.
**Action:** When implementing icon-only controls, always add a descriptive `aria-label`. For disabled buttons, use `title` or visually hidden text to convey the required prerequisites. Adding `aria-hidden="true"` to decorative icons within complex layouts reduces noise.
