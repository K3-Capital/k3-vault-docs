import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { llmsFromPages } from "@lacspace/llms-txt";

const outputDirectory = process.argv[2] ?? "_book";
const baseUrl = "https://k3-capital.github.io/k3-vault-docs/";
const summaryPath = "SUMMARY.md";

/** Parse SUMMARY.md into an ordered list of pages, each grouped under its top-level section. */
function parseSummary(summary) {
  const pages = [];
  let currentSection = null;

  for (const line of summary.split("\n")) {
    const match = line.match(/^(\s*)-\s+\[([^\]]+)\]\(([^)]+\.md)\)\s*$/);
    if (!match) continue;

    const [, indent, title, source] = match;
    const isTopLevel = indent.length === 0;

    if (isTopLevel) {
      currentSection = title;
      pages.push({ title, source, section: title });
    } else {
      pages.push({ title, source, section: currentSection ?? "Docs" });
    }
  }

  return pages;
}

/** Relative page URL within the site (README.md -> index.html, others -> <path>.html). */
function pageUrl(source) {
  if (source === "README.md") return baseUrl;
  return `${baseUrl}${source.replace(/\.md$/, ".html")}`;
}

const summary = await readFile(summaryPath, "utf8");
const pages = parseSummary(summary);

const llmsPages = [];
for (const page of pages) {
  const content = await readFile(page.source, "utf8");
  llmsPages.push({
    title: page.title,
    url: pageUrl(page.source),
    content,
    section: page.section,
  });
}

const { txt, full } = llmsFromPages(llmsPages, {
  title: "K3 Vaults",
  summary:
    "Documentation for the K3 epoch-staged ERC-7540 vault infrastructure and the K3 cbBTC Vault: architecture, security & trust assumptions, integration guides for deposits/redeems, and contract references.",
  details:
    "K3 Capital builds institutional-grade, actively managed on-chain vault infrastructure. These docs describe the proprietary vault, its epoch lifecycle and settlement, security model, integration APIs for requesting and claiming deposits/redeems, and on-chain reference data.",
  defaultSection: "Docs",
});

const llmsTxtPath = join(outputDirectory, "llms.txt");
const llmsFullPath = join(outputDirectory, "llms-full.txt");
await writeFile(llmsTxtPath, txt);
await writeFile(llmsFullPath, full);

console.log(`Generated ${llmsPages.length} page entries: ${llmsTxtPath} and ${llmsFullPath}.`);
