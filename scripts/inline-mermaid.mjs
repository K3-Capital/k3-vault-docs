#!/usr/bin/env node
/**
 * Inline Mermaid diagrams as static SVG in the HonKit/GitBook build output.
 *
 * Why this exists:
 *   GitBook.com renders ```mermaid fenced blocks natively on its platform, but the
 *   GitHub Pages path builds the book with HonKit, which has no Mermaid renderer and
 *   emits the source as an inert <pre><code class="lang-mermaid">…</code></pre> block.
 *   This is the Pages-only step: after `honkit build`, run this script to replace every
 *   Mermaid code block in the generated HTML with the corresponding rendered <svg>.
 *
 *   It only touches the generated _book output — the Markdown ```mermaid sources are
 *   left untouched, so GitBook keeps rendering them natively.
 *
 * Usage (run from the repository root, after `honkit build . _book`):
 *   npm install --no-save @mermaid-js/mermaid-cli
 *   node scripts/inline-mermaid.mjs [build-dir]
 *
 * The build directory defaults to `_book` (matches .github/workflows/pages.yml).
 * Renders via @mermaid-js/mermaid-cli's `mmdc` binary (resolved from ./node_modules).
 */
import { spawnSync } from "node:child_process";
import { readdir, readFile, writeFile, stat, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const buildDir = path.resolve(root, process.argv[2] || "_book");

// ---------------------------------------------------------------------------
// mmdc discovery
// ---------------------------------------------------------------------------
async function findMmdc() {
  const exe = process.platform === "win32" ? "mmdc.cmd" : "mmdc";
  const local = path.join(root, "node_modules", ".bin", exe);
  try {
    await stat(local);
    return local;
  } catch {
    return "mmdc"; // fall back to PATH
  }
}

// HTML entity decoding for the small set HonKit escapes inside code blocks.
function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// HonKit renders ```mermaid as: <pre><code class="lang-mermaid">SOURCE</code></pre>.
function findMermaidBlocks(html) {
  const out = [];
  const re = /<pre><code class="lang-mermaid">([\s\S]*?)<\/code><\/pre>/g;
  let m;
  while ((m = re.exec(html))) {
    out.push({ raw: m[0], source: decodeEntities(m[1]), start: m.index, end: m.index + m[0].length });
  }
  return out;
}

function tmpPaths(buildDir, index) {
  return { in: path.join(buildDir, `.mermaid-inline-${index}.mmd`), out: path.join(buildDir, `.mermaid-inline-${index}.svg`) };
}

async function renderOne(mmdc, index, buildDir, source) {
  const { in: inFile, out: outFile } = tmpPaths(buildDir, index);
  const ppConfig = process.env.PUPPETEER_CONFIG_FILE || path.join(root, ".github", "mermaid-puppeteer.json");
  await writeFile(inFile, source);
  try {
    await rm(outFile, { force: true }).catch(() => {});
    const res = spawnSync(mmdc, ["-i", inFile, "-o", outFile, "-b", "transparent", "-p", ppConfig]);
    if (res.status !== 0) {
      const err = (res.stderr || res.stdout || "mmdc failed").toString().trim();
      throw new Error(`mmdc failed (exit ${res.status}): ${err}`);
    }
    let st;
    try { st = await stat(outFile); } catch { throw new Error("mmdc produced no output SVG"); }
    if (st.size === 0) throw new Error("mmdc produced an empty SVG");
    const svg = await readFile(outFile, "utf8");
    await rm(inFile, { force: true }).catch(() => {});
    await rm(outFile, { force: true }).catch(() => {});
    return svg;
  } catch (e) {
    await rm(inFile, { force: true }).catch(() => {});
    await rm(outFile, { force: true }).catch(() => {});
    throw e;
  }
}

async function walk(dir) {
  const hits = [];
  for (const name of await readdir(dir)) {
    if (name === ".git" || name.startsWith(".mermaid-inline")) continue;
    const p = path.join(dir, name);
    let st;
    try { st = await stat(p); } catch { continue; }
    if (st.isDirectory()) hits.push(...await walk(p));
    else if (name.endsWith(".html")) hits.push(p);
  }
  return hits;
}

async function main() {
  const mmdc = await findMmdc();
  const files = await walk(buildDir);
  let total = 0;
  for (const file of files) {
    const html = await readFile(file, "utf8");
    const blocks = findMermaidBlocks(html);
    if (blocks.length === 0) continue;

    const parts = [];
    let cursor = 0;
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      parts.push(html.slice(cursor, b.start));
      const svg = await renderOne(mmdc, i, buildDir, b.source);
      // Centred, horizontally-scrollable container so wide diagrams stay usable.
      const wrap = `<div class="mermaid-inline" style="text-align:center;overflow-x:auto;margin:1em 0">\n${svg}\n</div>`;
      parts.push(wrap);
      cursor = b.end;
      total++;
    }
    parts.push(html.slice(cursor));
    await writeFile(file, parts.join(""));
    console.log(`inlined ${blocks.length} mermaid block(s) -> ${path.relative(root, file)}`);
  }
  console.log(total === 0 ? "no mermaid blocks found" : `total mermaid blocks inlined: ${total}`);
}

main().catch((e) => { console.error("inline-mermaid failed:", e); process.exit(1); });