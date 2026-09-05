import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { copyFile, mkdir } from "node:fs/promises";
import { ARTICLE_DETAILS, CASE_STUDIES } from "./src/detail-content.js";

const routeFiles = new Map([
  ["/articles", "/articles/index.html"],
  ["/projects", "/index.html"],
  ["/history", "/info/index.html"],
]);
const legacyRedirects = new Map([
  ["/index", "/"],
  ["/info", "/history"],
  ["/biography", "/history"],
  ["/portfolio", "/projects"],
]);
const removedRoutes = new Set(["/photography", "/video", "/discography", "/archive"]);
const detailRoutes = new Set(
  [...CASE_STUDIES, ...ARTICLE_DETAILS].map((entry) => entry.path.replace(/\/$/, "")),
);

function routeRequest(request, response) {
  const url = new URL(request.url, "http://localhost");
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  const redirectTarget = legacyRedirects.get(pathname);
  if (redirectTarget && ["GET", "HEAD"].includes(request.method ?? "GET")) {
    response.statusCode = 308;
    response.setHeader("Location", `${redirectTarget}${url.search}`);
    response.end();
    return false;
  }
  if (removedRoutes.has(pathname)) {
    response.statusCode = 404;
    response.end("Not Found");
    return false;
  }
  if (detailRoutes.has(pathname)) {
    request.url = `/detail-shell.html${url.search}`;
    return true;
  }
  if (pathname.startsWith("/case-studies/") || (pathname.startsWith("/articles/") && pathname !== "/articles")) {
    response.statusCode = 404;
    response.end("Not Found");
    return false;
  }
  const routeFile = routeFiles.get(pathname);
  if (routeFile) request.url = `${routeFile}${url.search}`;
  return true;
}

const prettyRoutePlugin = {
  name: "pretty-route-html",
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      if (!routeRequest(request, _response)) return;
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((request, _response, next) => {
      if (!routeRequest(request, _response)) return;
      next();
    });
  },
};

const detailRouteAliasesPlugin = {
  name: "detail-route-aliases",
  async closeBundle() {
    const shell = resolve(import.meta.dirname, "dist/client/detail-shell.html");
    await Promise.all([...detailRoutes].map(async (route) => {
      const destinationDirectory = resolve(import.meta.dirname, `dist/client${route}`);
      await mkdir(destinationDirectory, { recursive: true });
      await copyFile(shell, resolve(destinationDirectory, "index.html"));
    }));
  },
};

export default defineConfig({
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        articles: resolve(import.meta.dirname, "articles/index.html"),
        info: resolve(import.meta.dirname, "info/index.html"),
        detailShell: resolve(import.meta.dirname, "detail-shell.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [prettyRoutePlugin, detailRouteAliasesPlugin, react()],
});
