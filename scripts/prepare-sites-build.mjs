#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const projects = path.join(dist, "client", "projects", "index.html");
const biographySource = path.join(dist, "client", "info", "index.html");
const history = path.join(dist, "client", "history", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");

for (const file of [index, biographySource, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
mkdirSync(path.dirname(projects), { recursive: true });
mkdirSync(path.dirname(history), { recursive: true });
copyFileSync(index, projects);
copyFileSync(biographySource, history);
rmSync(path.dirname(biographySource), { recursive: true, force: true });
rmSync(path.join(dist, "client", "index"), { recursive: true, force: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

console.log("Prepared Sites build: canonical /projects and /history routes, legacy redirects in the worker, dist/server/index.js, and dist/.openai/hosting.json");
