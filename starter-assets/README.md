# Starter Assets

This folder contains only the editable content needed to create a new Experience Navigator page.

## Use

1. Copy these files into the project `content/` folder.
2. Edit `profile.json` with the new person or organization details.
3. Add, remove, or edit Markdown files in `experiences/`.
4. Put images, diagrams, or other static media in `assets/`.
5. Run `npm run build` from the project root.

## Files

- `profile.json`: main profile, focus areas, and links. You do not need to list projects here.
- `experiences/*.md`: one Markdown file per project, role, publication, or professional experience.
- `assets/`: optional images referenced by experience Markdown frontmatter.
- `projectType`: any label you want, such as `academic work`, `code-opensource`, `client engagement`, or `consulting/FDE project`.

Each Markdown file must include a unique `id` in its frontmatter. The generator discovers all `*.md` files in `content/experiences/` automatically.

Example:

- The file is `experiences/customer-churn-modeling.md`
- The Markdown frontmatter includes `id: customer-churn-modeling`
