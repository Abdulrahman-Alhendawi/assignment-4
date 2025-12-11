# Technical Documentation

## Project overview

A small static personal portfolio website showcasing a bio, projects, and a contact form. Features implemented:

- Time-based greeting (Good morning / Good afternoon / Good evening).
- Contact form with client-side validation, accessible loading/confirmation states and a simulated 3‑second send delay.
- Smooth in-page scrolling and basic accessibility improvements.

## Repository layout

- index.html — main page markup and structure.
- css/styles.css — visual styles (includes smooth scrolling).
- js/script.js — contact form validation, loading simulation, accessibility helpers, and greeting functionality.
- assets/images/ — project and profile images.
- README.md — project description and run instructions.
- docs/ai-usage-report.md — AI usage and modifications.
- docs/technical-documentation.md — this file.
- presentation/ — slides and demo video.

## Key modules & behavior

### js/script.js (Greeting functionality)

- getGreeting(date) — returns a greeting string based on hour:
  - < 12 → "Good morning"
  - 12–17 → "Good afternoon"
  - ≥ 18 → "Good evening"
- init IIFE:
  - Finds `#greeting` element and writes greeting text.
  - Schedules updates at the next minute boundary and then every minute to keep greeting current without per-second work.

Design notes: lightweight and DOM-safe; uses polite live region (`aria-live="polite"`) to announce changes to assistive tech.

### js/script.js (Contact form)

- Caches DOM references for name, email, message, submit button and the form.
- clearErrors() / showError(el, text)
  - Adds error nodes, sets `aria-describedby` and `aria-invalid="true"`.
  - Focuses the first invalid input on failed validation.
- Validation rules:
  - Name: minimum 2 characters.
  - Email: basic RFC-like regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - Message: minimum 5 characters.
- Loading simulation:
  - showLoading() sets `aria-busy="true"`, disables inputs, inserts a loading status element (`role="status"`).
  - 3-second timeout then hides loading, re-enables inputs, shows confirmation (`role="status"`, `aria-live="polite"`), and resets form.

Accessibility & UX details:

- Errors connect to inputs via `aria-describedby`.
- Loading and confirmation use status roles and live regions to ensure screen-reader announcements.
- Inputs receive focus on validation error for keyboard and screen-reader users.

## Accessibility & Performance decisions

Accessibility

- `aria-live="polite"` on greeting to announce changes.
- `role="status"` + `aria-live` for confirmation/loading messages.
- `aria-invalid` and `aria-describedby` for errors.
- `aria-busy` on the form when simulating network activity.
- Focus management: focus first invalid input and move focus to confirmation as appropriate.

Performance

- Cached DOM references to avoid repeated queries.
- Reduced update frequency (minute-level update for greeting).
- CSS-based smooth scrolling (native, GPU-efficient): `html { scroll-behavior: smooth; }`.
- Minimal inline work; heavy styles can be moved to style.css if needed.

## How to run locally

From project root:

- Option A — open file:
  - Double-click `index.html` or open in browser.
- Option B — Python 3 simple server:
  - `cd "c:\Users\Abdulrahman\Desktop\Personal Portfolio Project SWE363\assignment-2"`
  - `python -m http.server 8000`
  - Open `http://localhost:8000`
- Option C — VS Code Live Server: right-click `index.html` → Open with Live Server.

## Testing

Manual tests to perform:

- Greeting: open page at different times or mock system clock; confirm greeting text changes at hour boundaries (page reload or wait minute).
- Contact form validation:
  - Submit with missing/invalid fields: errors appear, `aria-invalid` set, focus moved to first invalid.
  - Submit with valid fields: loading indicator appears for ~3s, inputs disabled, confirmation appears and is announced.
- Accessibility checks:
  - Use browser accessibility devtools / screen reader (NVDA/VoiceOver) to verify announcements and focus flow.
- Cross-browser: test in Chrome, Edge, Firefox, Safari.

## Known issues & limitations

- Contact form is client-side only; no backend submission is implemented.
- Email regex is intentionally simple and may not cover all valid addresses.
- Inline styles used for quick styling of messages; moving them into style.css is recommended.
- Image paths use project-local files and must exist (case-sensitivity may matter on other OS).

## Future improvements

- Replace simulated loading with real backend integration (POST endpoint) and proper error handling for network failures.
- Move inline styles for errors/loading/confirmation into `style.css`.
- Add unit / integration tests for validation logic.
- Improve email validation with more robust library if server-side validation is not available.
- Add localization for greeting and other UI strings.
- Add automated accessibility test runs (axe, Lighthouse CI).

## Contact / maintenance

- Repository owner: Abdulrahman Alhendawi
- For changes: update relevant file(s), run quick manual checks described under Testing, and commit with a descriptive message.
