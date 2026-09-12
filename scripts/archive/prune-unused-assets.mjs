import { readdir, readFile, rm, rmdir, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const publicRoot = path.join(projectRoot, "public");
const apply = process.argv.includes("--apply");
// This legacy scanner does not follow the current application module graph.
// An explicit guard prevents accidental deletion of live assets.
if (apply && process.env.PORTFOLIO_ALLOW_ARCHIVE_PRUNE !== "1") {
  throw new Error("Archival prune is guarded: review its dry-run report and references before setting PORTFOLIO_ALLOW_ARCHIVE_PRUNE=1. It is not safe as routine maintenance.");
}
const entryFiles = [
  path.join(projectRoot, "index.html"),
  path.join(projectRoot, "articles/index.html"),
  path.join(projectRoot, "info/index.html"),
];
const localAssetPattern = /\/(?:assets|css|fonts|images|js|videos)\/[^\"'()<>,\s]+/g;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    if (entry.isFile()) files.push(absolute);
  }
  return files;
}

async function pruneEmptyDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) await pruneEmptyDirectories(path.join(directory, entry.name));
  }

  if (directory !== publicRoot && (await readdir(directory)).length === 0) {
    await rmdir(directory);
  }
}

function toPublicPath(assetUrl) {
  const pathname = assetUrl.split(/[?#]/, 1)[0];
  return path.join(publicRoot, decodeURIComponent(pathname));
}

async function collectReferences() {
  const referenced = new Set();
  const queue = [...entryFiles];
  const scanned = new Set();

  while (queue.length) {
    const file = queue.shift();
    if (scanned.has(file)) continue;
    scanned.add(file);

    let contents;
    try {
      contents = await readFile(file, "utf8");
    } catch {
      continue;
    }

    for (const match of contents.matchAll(localAssetPattern)) {
      const asset = toPublicPath(match[0]);
      referenced.add(asset);
      if (/\.(?:css|js)$/i.test(asset)) queue.push(asset);
    }
  }

  return referenced;
}

const referenced = await collectReferences();
const publicFiles = await walk(publicRoot);
const unused = publicFiles.filter((file) => !referenced.has(file));
let unusedBytes = 0;
const groups = {};

for (const file of unused) {
  unusedBytes += (await stat(file)).size;
  const group = path.relative(publicRoot, file).split(path.sep)[0];
  groups[group] = (groups[group] ?? 0) + 1;
  if (apply) await rm(file);
}

if (apply) await pruneEmptyDirectories(publicRoot);

console.log(JSON.stringify({
  mode: apply ? "applied" : "dry-run",
  retainedFiles: publicFiles.length - unused.length,
  removedFiles: unused.length,
  removedMegabytes: Number((unusedBytes / 1024 / 1024).toFixed(2)),
  removedByTopLevelDirectory: groups,
}, null, 2));
