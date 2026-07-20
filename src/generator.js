import { mkdir, readFile, writeFile, copyFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      html.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      html.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
      continue;
    }
    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return html.join("\n");
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error("Experience markdown must start with frontmatter.");

  const meta = {};
  const lines = match[1].split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyValue) {
      i += 1;
      continue;
    }
    const [, key, value] = keyValue;
    if (value) {
      meta[key] = parseScalar(value);
      i += 1;
      continue;
    }

    const collection = [];
    i += 1;
    while (i < lines.length && lines[i].startsWith("  - ")) {
      const item = {};
      const first = lines[i].slice(4);
      const firstMatch = first.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (firstMatch) item[firstMatch[1]] = parseScalar(firstMatch[2]);
      i += 1;
      while (i < lines.length && lines[i].startsWith("    ")) {
        const nested = lines[i].trim().match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (nested) item[nested[1]] = parseScalar(nested[2]);
        i += 1;
      }
      collection.push(item);
    }
    meta[key] = collection;
  }

  return { meta, body: match[2] };
}

async function build() {
  const profile = JSON.parse(await readFile(path.join(contentDir, "profile.json"), "utf8"));
  const experienceFiles = await discoverExperienceFiles();
  const ordering = new Map((profile.experiences || []).map((id, index) => [id, index]));
  const experiences = [];

  for (const filePath of experienceFiles) {
    const markdown = await readFile(filePath, "utf8");
    const { meta, body } = parseFrontmatter(markdown);
    if (!meta.id) throw new Error(`Experience file ${path.relative(root, filePath)} is missing required frontmatter field "id".`);
    experiences.push({
      ...meta,
      projectType: meta.projectType || "uncategorized",
      detailHtml: markdownToHtml(body),
      detailMarkdown: body.trim()
    });
  }

  experiences.sort((first, second) => {
    const firstOrder = ordering.has(first.id) ? ordering.get(first.id) : Number.POSITIVE_INFINITY;
    const secondOrder = ordering.has(second.id) ? ordering.get(second.id) : Number.POSITIVE_INFINITY;
    if (firstOrder !== secondOrder) return firstOrder - secondOrder;
    return first.title.localeCompare(second.title);
  });

  const generatedProfile = {
    ...profile,
    experiences: experiences.map((item) => item.id)
  };

  await mkdir(distDir, { recursive: true });
  await mkdir(path.join(distDir, "assets"), { recursive: true });
  await mkdir(path.join(distDir, "vendor"), { recursive: true });
  await copyAssets();

  const template = await readFile(path.join(srcDir, "template.html"), "utf8");
  const assetVersion = String(Date.now());
  const html = template
    .replace('href="styles.css"', `href="styles.css?v=${assetVersion}"`)
    .replace('src="data.js"', `src="data.js?v=${assetVersion}"`)
    .replace('src="app.js"', `src="app.js?v=${assetVersion}"`);
  await writeFile(path.join(distDir, "index.html"), html, "utf8");
  await copyFile(path.join(srcDir, "styles.css"), path.join(distDir, "styles.css"));
  await copyFile(path.join(srcDir, "app.js"), path.join(distDir, "app.js"));
  await copyFile(path.join(root, "node_modules", "d3", "dist", "d3.min.js"), path.join(distDir, "vendor", "d3.min.js"));
  await writeFile(
    path.join(distDir, "data.js"),
    `window.EXPERIENCE_NAVIGATOR_DATA = ${JSON.stringify({ profile: generatedProfile, experiences }, null, 2)};\n`,
    "utf8"
  );
}

async function discoverExperienceFiles() {
  const experiencesDir = path.join(contentDir, "experiences");
  const entries = await readdir(experiencesDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(experiencesDir, entry.name));
}

async function copyAssets() {
  const assetsDir = path.join(contentDir, "assets");
  let entries = [];
  try {
    entries = await readdir(assetsDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    await copyFile(path.join(assetsDir, entry.name), path.join(distDir, "assets", entry.name));
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
