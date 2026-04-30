## 2025-04-30 - Added Unit Tests for calculateDistance
**What:** The `calculateDistance` function in `frontend/src/services/locationService.ts` was untested.
**Coverage:** Wrote comprehensive tests covering normal valid distance, identical coordinates, commutativity (A to B equals B to A), 1 degree at the equator, and antipodal points (halfway around the globe) using Vitest.
**Result:** Coverage increased for core geographic/math logic, providing a safety net for future refactoring.
