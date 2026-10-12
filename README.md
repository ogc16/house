# The Pavilion House — Architectural Design Proposal

An interactive, single-page design proposal for **The Pavilion House** — a single-storey residence organized around a bold separation of public and private life. The social wing opens generously; the sleeping wing retreats into quiet, with a home office bridging both worlds.

This repository holds the responsive HTML/CSS/JS proposal site. It is open to suggestions, critiques, and alternative design proposals.

- **Project Ref:** ADS-2026-047
- **Type:** Residential — Single Storey
- **Location:** Kampala Region, Uganda
- **Total area:** ~2,200 sq ft

## Features

- **Interactive 3D model** — orbit, zoom, and pan a WebGL (Three.js) model of the house directly in the browser, with preset views (Isometric, Front, Side, Top/Plan, Pool & Terrace) and auto-rotate.
- **Dimensioned floor plan** — an annotated SVG ground-floor plan with a full room schedule and area summary.
- **Room descriptions** — a space-by-space breakdown of the nine principal rooms.
- **Design rationale** — the four organizing principles behind the layout, including the passive climate strategy for an equatorial site.
- **Zero build step** — plain HTML/CSS/JS served straight from disk.
- **Responsive layout** — adapts to desktop and mobile.

## Getting started

No tooling or install required.

1. Clone the repository:
   ```bash
   git clone https://github.com/ogc16/house.git
   cd house
   ```
2. Open `index.html` in any modern browser.

For live reloading while editing, serve the folder locally, e.g.:
```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Project structure

```
house/
├── index.html              # Markup only — links the styles and scripts
├── styles.css              # All styling for the proposal
├── app.js                  # Interactive 3D viewer + scroll animations
├── lib/
│   └── scene-math.js       # Pure, unit-tested camera/easing helpers
├── test/
│   └── scene-math.test.js  # Vitest unit tests
├── .github/workflows/
│   └── ci.yml              # CI: tests + coverage on push and PR
├── vitest.config.mjs       # Test + coverage configuration
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

## Tech stack

- Plain HTML5, CSS3, and vanilla JavaScript — no framework or build step.
- [Three.js](https://threejs.org/) (r128, via CDN) for the interactive 3D model.
- [Vitest](https://vitest.dev/) for unit tests and coverage.
- Google Fonts: *Cormorant Garamond* and *DM Mono*.

## Development

The runtime site has no dependencies beyond a browser. To work on the code or run the tests:

```bash
npm install
npm test              # run the unit tests
npm run test:coverage # run tests and write coverage/lcov.info
```

Pure geometry helpers live in `lib/scene-math.js` and are kept free of DOM/WebGL
dependencies so they can be unit tested in Node. `app.js` wires those helpers to
Three.js and the page, and is excluded from coverage as browser-only glue.

### Continuous integration

`.github/workflows/ci.yml` installs dependencies, runs the unit tests with
coverage, and uploads the coverage report as a build artifact on every push to
`main` and on pull requests.

## Proposals welcome

This is a design concept, not a finished set of construction documents. Feedback and alternative proposals are actively invited:

- Alternative plan layouts or room adjacencies
- Structural or material revisions
- Improvements to the passive climate and ventilation strategy
- Site-specific considerations

Open an issue with your idea, or submit a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Reference listings

- [Zillow — comparable listing](https://www.zillow.com/homedetails/9010-Heather-Ave-California-City-CA-93505/458627886_zpid/)

## License

Released under the [MIT License](LICENSE).
