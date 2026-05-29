# PersonFinder

> Search people by birthday range using the [fakerapi.it](https://fakerapi.it) API.

## Project structure

```
person-finder/
├── index.html                     # Entry point — links CSS + loads main.js as ESM
├── README.md
└── src/
    ├── styles/
    │   ├── base.css               # Design tokens, CSS reset, keyframes
    │   ├── layout.css             # Page wrapper, header, footer, cards-grid
    │   ├── responsive.css         # Breakpoint overrides (768 / 560 / 480 px)
    │   └── components/
    │       ├── search-panel.css   # Date form, options row, search button
    │       ├── controls-bar.css   # Sort buttons, filter input, result count
    │       ├── person-card.css    # Card layout, avatar, gender colours
    │       ├── skeleton.css       # Shimmer loading placeholders
    │       └── states.css         # Empty / error state boxes, toast
    └── js/
        ├── main.js                # Entry point — wires DOM, events, state subscriber
        ├── api/
        │   └── personsApi.js      # fetch wrapper, AbortController, typed response
        ├── state/
        │   └── appState.js        # Centralised state + subscriber pattern
        ├── ui/
        │   ├── renderCards.js     # Person cards + empty/error/no-match states
        │   ├── renderSkeleton.js  # Skeleton loader
        │   └── toast.js           # Toast notification
        └── utils/
            ├── dateUtils.js       # Pure date helpers (format, calcAge, yearsAgo)
            ├── debounce.js        # Generic debounce HOF
            └── validate.js        # Pure date-range validation (no DOM)
```

## How to run

Because the JavaScript uses native ES modules (`type="module"`), the page
must be served over HTTP — opening `index.html` directly via `file://`
will block the module imports with a CORS error.

**Option 1 — VS Code Live Server**
Install the *Live Server* extension, right-click `index.html` → *Open with Live Server*.

**Option 2 — Node http-server**
```bash
npx http-server . -p 3000 -o
```

**Option 3 — Python**
```bash
python -m http.server 3000
```

Then open `http://localhost:3000`.

## Features

| Feature | Detail |
|---|---|
| Date range form | Start + end birthday pickers with inline validation |
| API options | Quantity (5–100), gender filter, locale |
| Skeleton loading | Shimmer placeholders shown while fetching |
| Sort | By name / birthday / gender (toggle asc/desc) |
| Live filter | Debounced search across name, email, phone |
| Error handling | Timeout (12 s), HTTP errors, API errors |
| Accessibility | ARIA labels, `aria-live` regions, keyboard submit |
| Responsive | Desktop → tablet (768 px) → mobile (480 px) |

## Architecture decisions

- **No framework** — Vanilla JS with ES modules (native in all modern browsers)
- **State subscriber pattern** — `appState.js` holds truth; `main.js` subscribes and syncs UI
- **Pure utilities** — `validate.js` and `dateUtils.js` have zero DOM dependencies, making them trivially unit-testable
- **JSDoc types** — full `@typedef` annotations for IDE autocomplete without a build step
- **CSS component files** — one file per component mirrors a component-based framework structure
