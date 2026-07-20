---
name: create-experience-section-from-info
description: Use when the user provides project, job, research, publication, or portfolio information and wants a new Experience Navigator experience markdown section created under content/experiences, including media selection or a concept SVG fallback.
---

# Create Experience Section From Info

Use this skill to turn raw information about a project, role, research effort, publication, open-source library, or consulting engagement into a new Experience Navigator entry.

## Goal

Create one polished experience markdown file in `content/experiences/*.md` that matches the existing site format, connects cleanly to the graph through topics and skills, and includes a relevant media image. If a suitable image already exists in the project, use it. If not, create a concise concept SVG in `content/assets/`.

## First Read Existing Patterns

Before writing, inspect the project:

- Read 2-4 existing files in `content/experiences/*.md`.
- Check `content/assets/` for matching or reusable images.
- If needed, read `src/generator.js` to confirm supported frontmatter fields.
- Preserve the established tone: concrete, technical, portfolio-oriented, concise, and outcome-focused.

Existing experience entries normally have this shape:

```markdown
---
id: "kebab-case-id"
title: "Clear Project Or Experience Title"
period: "2024" or "2025-Present"
organization: "Organization, lab, employer, client, or personal/open-source context"
delivery: "Short noun phrase describing the delivered artifact"
projectType: "personal" or another existing/arbitrary type label
summary: "One compact sentence explaining what was built, studied, or delivered and why it matters."
topics: ["Topic A", "Topic B", "Topic C"]
skills: ["Skill A", "Skill B", "Skill C"]
links:
  - label: "GitHub repository"
    url: "https://example.com"
media:
  - type: "image"
    src: "assets/kebab-case-id.svg"
    alt: "Clear Project Or Experience Title concept diagram"
---

## Context

1-2 short paragraphs explaining the problem, domain, or motivation.

## Contribution

- Specific contribution or implementation detail.
- Specific contribution or implementation detail.
- Specific contribution or implementation detail.

## Outcome

1 short paragraph describing the result, impact, reusable asset, learning, or current status.
```

## Content Rules

- Use a stable `id` derived from the title in lowercase kebab-case.
- Filename should match the id: `content/experiences/<id>.md`.
- Keep `summary` to one sentence.
- Use 4-7 `topics`; these are graph concepts/domains.
- Use 5-10 `skills`; these are concrete capabilities, tools, methods, or implementation areas.
- Use `projectType` from the user's input if supplied. If not supplied, infer from existing patterns such as `personal`, `code-opensource`, `research`, `industry`, or create a clear lowercase label only when needed.
- Include `links` only for real URLs provided by the user or discoverable from the supplied information. Do not invent URLs.
- Use Markdown body sections `## Context`, `## Contribution`, and `## Outcome` unless the existing content has been intentionally changed.
- Avoid inflated claims. If impact is unknown, describe the artifact, capability, or current status instead.
- Preserve user-specific facts and dates exactly when provided. Ask one short question only if a missing fact would make the entry misleading.

## Media Selection

Always look for viable images before creating one:

- Search `content/assets/` for filenames related to the proposed id, title keywords, repository name, organization, method, or domain.
- Viable media can be `.svg`, `.png`, `.jpg`, `.jpeg`, or `.webp` if it is relevant and appropriate for portfolio display.
- Prefer an exact/relevant existing asset over generating a new one.
- Reference assets from experience markdown as `assets/<filename>`.
- Write a descriptive `alt` value that names the experience and describes the diagram/image.

If no viable image exists, create a concept SVG:

- Save it as `content/assets/<id>.svg`.
- Use simple inline SVG only; no external fonts, images, scripts, or CSS files.
- Match the established asset style: `viewBox="0 0 720 420"`, rounded background rectangle, title text, a few semantic shapes, muted palette, and readable contrast.
- Keep SVG compact and deterministic. Do not use random IDs or generated noise.
- Represent the concept, not a fake screenshot. Examples: graph/database nodes, infrastructure layers, model pipeline, simulation grid, dashboard panels, molecule/network motifs.
- Use ASCII text in the SVG unless the project title requires otherwise.

## Writing Workflow

1. Extract or infer: title, period, organization/context, delivery type, project type, summary, topics, skills, links, and body details.
2. Choose the `id` and check that `content/experiences/<id>.md` does not already exist.
3. Search `content/assets/` for a viable image.
4. If no image is viable, create `content/assets/<id>.svg` first.
5. Create `content/experiences/<id>.md` with complete frontmatter and the three body sections.
6. Run `npm run build` and fix any generator/frontmatter errors.
7. If practical, run `node --check src/generator.js`; run visual tests only when layout or app behavior changed.

## Quality Checklist

- The new markdown frontmatter is valid YAML.
- `id`, filename, and media filename are consistent.
- `media.src` points to an existing file.
- Topics and skills are specific enough to make useful graph nodes.
- The contribution bullets are concrete and not generic.
- The outcome does not overclaim.
- `npm run build` succeeds.

## Minimal SVG Template

Use this as a starting point when creating a concept SVG, adapting labels and shapes to the experience:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" role="img" aria-label="Experience title concept diagram">
  <rect width="720" height="420" rx="28" fill="#f6f0e7"/>
  <text x="64" y="68" font-family="Arial, sans-serif" font-size="25" font-weight="700" fill="#1f2633">Experience Title</text>
  <g fill="none" stroke="#315e7d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M140 270 C230 140 340 320 450 190 S585 220 610 130"/>
    <rect x="118" y="225" width="118" height="82" rx="18"/>
    <rect x="302" y="154" width="118" height="82" rx="18"/>
    <rect x="486" y="222" width="118" height="82" rx="18"/>
  </g>
  <g fill="#da5f3f">
    <circle cx="177" cy="266" r="15"/>
    <circle cx="361" cy="195" r="15"/>
    <circle cx="545" cy="263" r="15"/>
  </g>
</svg>
```
