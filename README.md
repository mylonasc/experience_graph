# Experience Navigator

A portable static portfolio generator for professional experience data. It reads a profile JSON file plus Markdown experience pages, then emits a GitHub Pages-friendly static site in `dist/`.

## Build

```bash
npm run build
```

## Preview

```bash
npm run serve
```

Then open `http://localhost:8080`.

## Edit Content

- Update `content/profile.json` for the person, focus areas, and profile links.
- Add, edit, or delete Markdown files in `content/experiences/`; the generator discovers all `*.md` files automatically.
- Each Markdown file has frontmatter metadata followed by Markdown details.
- `projectType` can be any label. Project type filters and colors are generated dynamically from the labels found in the Markdown files.

## Publish

Push to `main`. The GitHub Actions workflow builds `dist/` and deploys it with GitHub Pages.

In the GitHub repository settings, configure Pages to use **GitHub Actions** as the source.

## Architecture

- `src/generator.js` reads content and writes the static site.
- `src/template.html` defines the page shell.
- `src/app.js` implements search, filters, graph rendering, and the detail panel.
- `src/styles.css` contains responsive styling.
- `dist/data.js` is generated data consumed by the browser.
