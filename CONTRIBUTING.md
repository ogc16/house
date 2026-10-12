# Contributing to The Pavilion House

Thanks for your interest in improving this design proposal. Contributions of
every kind are welcome — code, copy, layout, and alternative design ideas.

This project is a design concept, not a set of construction documents. Treat
proposals as discussion starters rather than final answers.

## Ways to contribute

- **Report a problem** — a rendering bug, a broken link, a typo, or an
  accessibility issue. Open an issue describing what you saw and what you
  expected.
- **Suggest a design change** — layout, materials, adjacencies, or the passive
  climate strategy. Open an issue and explain the reasoning.
- **Submit a change** — fork the repository and open a pull request.

## Getting started

There is no build step. Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/ogc16/house.git
cd house
```

For live reload while editing, serve the folder locally:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Development guidelines

- Everything lives in a single `index.html`. Keep it self-contained; avoid
  introducing a build step or external tooling unless discussed first.
- Match the existing visual language — the type scale, spacing, and the warm
  paper/ink palette defined in the `:root` CSS variables.
- Keep JavaScript dependency-light. Three.js is loaded from a CDN; prefer
  vanilla JS otherwise.
- Test your change in a modern browser (Chrome, Firefox, or Safari) and check
  the responsive layout at mobile widths.

## Before opening a pull request

- Your change renders correctly and does not break the 3D model or the floor
  plan.
- The page still works by opening `index.html` directly (no server required).
- Your commit messages are clear and describe the *why*, not just the *what*.
- You have linked any related issue in the pull request description.

## Pull request process

1. Fork the repository and create a branch with a descriptive name.
2. Make your change with small, focused commits.
3. Open a pull request against `main` with a description of the change and
   screenshots for any visual updates.
4. A maintainer will review, request changes if needed, and merge.

## Code of Conduct

By participating, you agree to abide by the
[Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to
the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).
