import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(import.meta.dirname, "../..");
// Archival restoration only: never overwrite the accepted site with implicit inputs.
const sourceRoot = process.env.PORTFOLIO_IMPORT_ROOT;
const sourceOrigin = process.env.PORTFOLIO_IMPORT_ORIGIN;
if (!sourceRoot || !sourceOrigin) {
  throw new Error("Archival import requires PORTFOLIO_IMPORT_ROOT and PORTFOLIO_IMPORT_ORIGIN; it overwrites authored route files.");
}
const routes = [
  ["index.html", "index.html"],
  ["info.html", "info/index.html"],
];

const assetExtensions = new Set([
  ".avif", ".css", ".gif", ".ico", ".jpeg", ".jpg", ".js", ".otf",
  ".png", ".svg", ".ttf", ".webp", ".woff", ".woff2",
]);
const skippedExtensions = new Set([".mp4", ".m4v", ".mov", ".webm"]);
const localLenisShim = `
const lenis = {
  resize() {},
  start() {},
  stop() {},
  scrollTo(target, options = {}) {
    const top = typeof target === "number"
      ? target
      : target?.getBoundingClientRect
        ? target.getBoundingClientRect().top + window.scrollY
        : 0;
    window.scrollTo({ top, behavior: options.immediate ? "auto" : "smooth" });
  },
};
window.lenis = lenis;
`;
const newYorkClockScript = `const newYorkClockFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
function showTime() {
  const clockElement = document.getElementById("h");
  clockElement.textContent = newYorkClockFormatter.format(new Date());
}
setInterval(showTime, 1000);
showTime();`;
const scheduled = new Map();
const skippedVideos = new Set();
const failures = [];

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'");
}

function extensionFor(url) {
  return path.posix.extname(url.pathname).toLowerCase();
}

function hashedQuerySuffix(url) {
  if (!url.search) return "";
  return `-${createHash("sha1").update(url.search).digest("hex").slice(0, 8)}`;
}

function assetInfo(rawValue, baseUrl) {
  const value = decodeHtml(rawValue.trim()).replace(/^['"]|['"]$/g, "");
  if (!value || value.startsWith("#") || value.startsWith("data:") || value.startsWith("mailto:")) {
    return null;
  }

  let url;
  try {
    url = new URL(value, baseUrl);
  } catch {
    return null;
  }

  if (url.hostname === "d3e54v103j8qbb.cloudfront.net" && url.pathname.includes("jquery-3.5.1")) {
    return { url, localUrl: "/js/jquery.js", target: path.join(projectRoot, "public/js/jquery.js") };
  }
  if (url.hostname === "assets.koal.ch" && url.pathname === "/koa/js/lenis.js") {
    return { url, localUrl: "/js/lenis.js", target: path.join(projectRoot, "public/js/lenis.js") };
  }

  const extension = extensionFor(url);
  if (skippedExtensions.has(extension) || !assetExtensions.has(extension)) return null;

  let localUrl;
  if (url.origin === sourceOrigin) {
    localUrl = url.pathname;
  } else {
    const suffix = hashedQuerySuffix(url);
    const ext = extension || ".bin";
    const pathname = suffix
      ? `${url.pathname.slice(0, -ext.length)}${suffix}${ext}`
      : url.pathname;
    localUrl = `/assets/external/${url.hostname}${pathname}`;
  }

  const safePath = decodeURIComponent(localUrl)
    .split("/")
    .filter((part) => part && part !== "." && part !== "..")
    .join("/");
  const target = path.join(projectRoot, "public", safePath);
  scheduled.set(url.href, { url: url.href, localUrl, target });
  return { url, localUrl, target };
}

function rewriteSingle(value, baseUrl) {
  const info = assetInfo(value, baseUrl);
  return info ? info.localUrl : value;
}

function rewriteSrcset(value, baseUrl) {
  return value
    .split(",")
    .map((candidate) => {
      const match = candidate.trim().match(/^(.*?)(\s+\d+(?:\.\d+)?[wx])$/);
      const asset = match ? match[1] : candidate.trim();
      const descriptor = match ? match[2] : "";
      return `${rewriteSingle(asset, baseUrl)}${descriptor}`;
    })
    .join(", ");
}

function rewriteEmbeddedAssets(html, baseUrl) {
  html = html.replace(
    /\b(src|href|poster|content|data-src|data-poster-url|srcset|data-srcset)=(['"])(.*?)\2/gis,
    (full, name, quote, value) => {
      const next = name.toLowerCase().includes("srcset")
        ? rewriteSrcset(value, baseUrl)
        : rewriteSingle(value, baseUrl);
      return `${name}=${quote}${next}${quote}`;
    },
  );

  html = html.replace(
    /("(?:url|thumbnailUrl)"\s*:\s*")(.*?)(")/g,
    (full, before, value, after) => `${before}${rewriteSingle(value, baseUrl)}${after}`,
  );

  html = html.replace(
    /url\((?:&quot;|['"])?(.*?)(?:&quot;|['"])?\)/gi,
    (full, value) => `url(${rewriteSingle(value, baseUrl)})`,
  );

  return html;
}

const placeholderStyles = `
  <style id="local-scrollbar-policy">
    html, body {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    html::-webkit-scrollbar, body::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }
  </style>
  <style id="local-video-placeholders">
    .video-placeholder-image {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .media-background-video { position: relative; }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
    }
  </style>
  <style id="local-index-page-spacing">
    html.works-motion-route {
      --works-card-gap: 40px;
    }
    html.works-motion-route body {
      min-height: 300svh;
    }
    html.index-route body {
      min-height: 0;
    }
    html.works-motion-route .works-motion-field {
      z-index: 0;
      position: fixed;
      top: 0;
      right: var(--structure--padding-desktop);
      bottom: 0;
      left: calc(50% + (var(--structure--grid-row-gap) / 2));
      display: flex;
      flex-direction: column;
      row-gap: var(--works-card-gap);
      overflow: hidden;
      contain: layout paint;
    }
    html.works-motion-route .works-motion-card {
      flex: 0 0 auto;
      width: 100%;
      min-width: 0;
    }
    html.works-motion-route .project-media-placeholder {
      background-color: #2b2b2b !important;
    }
    html.works-motion-route .works-motion-card .grid._3-col > :nth-child(2) {
      grid-area: span 1 / span 2 / span 1 / span 2;
    }
    html.works-motion-route .works-motion-card .works-media-spacing {
      margin-bottom: 32px;
    }
    @media screen and (min-width: 992px) {
      html.works-motion-route .works-motion-card .works-meta-spacing {
        margin-bottom: 8px;
      }
    }
    html.works-motion-route .works-motion-card .heading-style-h2.new {
      font-family: "Geist", sans-serif;
      font-size: 16px;
      line-height: 1.08;
      font-weight: 500;
      letter-spacing: .01em;
      text-transform: none;
    }
    html.works-motion-route .works-motion-card .display-inlineflex.categories {
      gap: 24px;
      font-family: var(--fonts--family-mono);
      font-size: var(--typography--mono-size);
      font-weight: 400;
      line-height: 13px;
      letter-spacing: .36px;
      text-transform: uppercase;
    }
    html.works-motion-route .works-motion-card .works-project-description {
      display: -webkit-box;
      overflow: hidden;
      font-family: "Geist", sans-serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0;
      text-transform: uppercase;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
    html.works-motion-route .works-motion-track,
    html.works-motion-route .works-motion-set {
      display: flex;
      flex: 0 0 auto;
      flex-direction: column;
      row-gap: var(--works-card-gap);
      width: 100%;
    }
    html.works-motion-route .works-scroll-space {
      height: 300svh;
      pointer-events: none;
    }
    html.works-motion-route[data-works-motion="running"] .works-motion-track {
      will-change: transform;
    }
    html.index-route .index-media-placeholder {
      width: 100%;
      height: 100%;
      min-height: 0;
      --portfolio-media-image: url("/images/home/az-hero-extended-v2.png");
      background-color: #2b2b2b;
    }
    html.index-route .index-static-field {
      z-index: 0;
      position: fixed;
      top: var(--structure--padding-desktop);
      right: var(--structure--padding-desktop);
      bottom: var(--structure--padding-desktop);
      left: calc(50% + (var(--structure--grid-row-gap) / 2));
      overflow: hidden;
      contain: layout paint;
    }
    @media screen and (min-width: 992px) {
      html.index-route .index-media-placeholder {
        background-position: center center !important;
        background-size: cover !important;
        transform: scale(1.1);
        transform-origin: center center;
      }
    }
    @media screen and (max-width: 991px) {
      html.works-motion-route .works-motion-field,
      html.index-route .index-static-field {
        top: 100px;
        right: var(--structure--padding-tablet);
        bottom: var(--structure--padding-tablet);
        left: var(--structure--padding-tablet);
      }
      html.works-motion-route[data-works-motion="mobile-static"] body {
        min-height: 0;
      }
      html.works-motion-route[data-works-motion="mobile-static"] .works-motion-field,
      html.index-route .index-static-field {
        position: relative;
        inset: auto;
        width: auto;
        height: auto;
        margin: 0 var(--structure--padding-tablet) var(--structure--padding-tablet);
        overflow: visible;
        contain: none;
      }
      html.works-motion-route[data-works-motion="mobile-static"] .works-scroll-space {
        display: none;
      }
      html.works-motion-route[data-works-motion="mobile-static"] .works-motion-card {
        transform: none !important;
        will-change: auto !important;
      }
      html.index-route .index-media-placeholder {
        height: auto;
        aspect-ratio: 3 / 2;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      html.works-motion-route body {
        min-height: 0;
      }
      html.works-motion-route .works-motion-field,
      html.index-route .index-static-field {
        position: relative;
        inset: auto;
        width: calc(50% - (var(--structure--padding-desktop) + (var(--structure--grid-row-gap) / 2)));
        height: auto;
        margin: var(--structure--padding-desktop) var(--structure--padding-desktop) var(--structure--padding-desktop) auto;
        overflow: visible;
        contain: none;
      }
      html.works-motion-route .works-scroll-space {
        display: none;
      }
      html.works-motion-route .works-motion-card,
      html.works-motion-route .works-motion-track {
        transform: none !important;
        will-change: auto !important;
      }
    }
    @media screen and (max-width: 991px) and (prefers-reduced-motion: reduce) {
      html.works-motion-route .works-motion-field,
      html.index-route .index-static-field {
        width: auto;
        margin: 0 var(--structure--padding-tablet) var(--structure--padding-tablet);
      }
    }
  </style>
  <script id="local-home-route-state">
    document.addEventListener("DOMContentLoaded", () => {
      const pagePath = window.location.pathname.replace(/\\\/$/, "");
      const projectsLink = document.querySelector('[data-nav-menu-list] a[href="/"]');
      const heading = document.querySelector(".title .heading");
      const canonical = document.querySelector('link[rel="canonical"]');

      if (pagePath !== "" && pagePath !== "/projects") return;
      projectsLink?.setAttribute("aria-current", "page");
      projectsLink?.classList.add("w--current");
      if (heading && heading.textContent !== "Projects") heading.textContent = "Projects";
      document.title = "Andrew Zellinger • Projects";
      document.querySelector('meta[property="og:title"]')?.setAttribute("content", "Andrew Zellinger • Projects");
      document.querySelector('meta[property="twitter:title"]')?.setAttribute("content", "Andrew Zellinger • Projects");
      canonical?.setAttribute("href", "/");
    });
  </script>
  <script type="module" id="local-project-route-customization">
    import {
      PROJECTS,
      projectCardDescription,
      projectCardTags,
    } from "/src/project-content.js";

    const makeElement = (tagName, className, text) => {
      const element = document.createElement(tagName);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    };

    const createProjectCard = (project) => {
      const card = makeElement("div", "col_project works-motion-card");
      const link = makeElement("a", "portfolio-detail-link works-detail-link");
      link.href = project.path;
      link.dataset.portfolioDetailLink = "";
      link.dataset.detailKind = "project";
      link.dataset.detailSlug = project.slug;
      link.setAttribute("aria-label", "Open case study: " + project.title);

      const mediaSpacing = makeElement("div", "margin-bottom space-small works-media-spacing");
      const media = makeElement("div", "media-background-holder landscape project-media-placeholder");
      media.setAttribute("role", "img");
      media.setAttribute("aria-label", project.media.label);
      if (project.media.src) {
        media.style.setProperty("--portfolio-media-image", 'url("' + project.media.src + '")');
      }
      mediaSpacing.append(media);

      const copySpacing = makeElement("div", "margin-bottom space-medium");
      copySpacing.dataset.projectCardCopy = "";
      const grid = makeElement("div", "grid _3-col");
      const title = makeElement("h2", "heading-style-h2 new", project.title);
      const details = makeElement("div");
      const metaSpacing = makeElement("div", "margin-bottom space-medium works-meta-spacing");
      const categories = makeElement("div", "display-inlineflex categories");
      projectCardTags(project)
        .forEach((item) => categories.append(makeElement("div", "", item)));
      metaSpacing.append(categories);

      const summarySpacing = makeElement("div", "margin-bottom space-medium");
      summarySpacing.append(makeElement("p", "works-project-description", projectCardDescription(project)));
      details.append(metaSpacing, summarySpacing);
      grid.append(title, details);
      copySpacing.append(grid);
      link.append(mediaSpacing, copySpacing);
      card.append(link);
      return card;
    };

    const initializeProjectRoute = () => {
      const pagePath = window.location.pathname.replace(/\\\/$/, "");
      const anchor = document.querySelector("[data-project-content-anchor]");
      if (!anchor) return;

      if (pagePath === "" || pagePath === "/projects") {
        document.documentElement.classList.add("works-motion-route");
        const motionField = makeElement("div", "works-motion-field");
        motionField.setAttribute("aria-label", "Projects");
        PROJECTS.forEach((project) => motionField.append(createProjectCard(project)));

        const scrollSpace = makeElement("div", "works-scroll-space");
        scrollSpace.setAttribute("aria-hidden", "true");
        anchor.replaceWith(motionField, scrollSpace);
      }

    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeProjectRoute, { once: true });
    } else {
      initializeProjectRoute();
    }
  </script>
  <script type="module" src="/src/site-motion.js"></script>
  <script type="module" src="/src/detail-state.js"></script>`;

const accessibilityScript = `
  <script id="local-accessibility">
    document.addEventListener("DOMContentLoaded", () => {
      const toggle = document.querySelector(".nav_toggle");
      if (toggle) {
        toggle.addEventListener("click", () => {
          toggle.setAttribute("aria-expanded", String(toggle.classList.contains("active")));
        });
      }

      document.querySelectorAll('[role="button"][tabindex="0"]').forEach((control) => {
        control.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          control.click();
        });
      });

      document.querySelectorAll(".accordion-title").forEach((title) => {
        title.addEventListener("click", () => {
          title.setAttribute("aria-expanded", String(title.getAttribute("aria-expanded") !== "true"));
        });
      });
    });
  </script>`;

function transformHtml(source, sourceFile) {
  for (const match of source.matchAll(/(?:https?:\/\/[^\"'<>]+|videos\/[^\"'<>]+)\.(?:mp4|webm)/gi)) {
    skippedVideos.add(match[0]);
  }

  let html = source
    .replace(
      /<video\b[^>]*style="background-image:url\(&quot;(.*?)&quot;\)"[^>]*>[\s\S]*?<\/video>/gi,
      (full, poster) => `<img src="${poster}" class="video-placeholder-image" loading="lazy" alt="Video still placeholder">`,
    )
    .replace(/\sdata-video-urls="[^"]*"/gi, "")
    .replace(/\sdata-poster-url="[^"]*"/gi, "")
    .replace(/<video\b[\s\S]*?<\/video>/gi, '<div class="video-placeholder-card" role="img" aria-label="Video placeholder"></div>')
    .replace(/\s*<div class="noise"><\/div>/gi, "")
    .replace(/\s*<div class="margin-bottom space-medium">\s*<div class="thread"><\/div>\s*<\/div>/gi, "")
    .replace(/\s*<a href="(?:photography|video|discography|projects)" class="nav_link">.*?<\/a>/gi, "")
    .replace(
      /<a\b([^>]*class="[^"]*\bnav_link\b[^"]*"[^>]*)>Selected works<\/a>/gi,
      (_link, attributes) => `<a${attributes.replace(/href="[^"]*"/i, 'href="/"')}>Projects</a>`,
    )
    .replace(/<a href="info"([^>]*)>(?:Info|Biography|About)<\/a>/gi, '<a href="/history"$1>History</a>')
    .replace(/\s*<meta\b[^>]*property="og:image"[^>]*>/gi, "")
    .replace(
      /<a\b[^>]*class="[^"]*\bnav_brand\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
      (brand) => brand
        .replace(/href="[^"]*"/i, 'href="/"')
        .replace(/\saria-current="page"/i, "")
        .replace(/\s+w--current\b/i, "")
        .replace(
          /<div>[^<]*<\/div>/i,
          '<div>ZELLINGER</div>',
        ),
    )
    .replace(/<div id="h">(?:NYC )?00:00(?::00)?<\/div>/g, '<div id="h">00:00:00</div>')
    .replace(
      /function showTime\(\) \{[\s\S]*?\n\}\nsetInterval\(showTime, 1000\);\nshowTime\(\);/g,
      newYorkClockScript,
    )
    .replace(
      /<a href="archive"[^>]*>Archive<\/a>(?:\s*<div> <\/div>)+(?=<a href="info")/gi,
      '<a href="/articles" class="nav_link">Articles</a>\n                <div> </div>\n                ',
    )
    .replace('class="nav_toggle"', 'class="nav_toggle" role="button" tabindex="0" aria-label="Toggle navigation" aria-expanded="false"')
    .replace(/class="accordion-title"/g, 'class="accordion-title" role="button" tabindex="0" aria-expanded="false"')
    .replace(/<\/head>/i, `${placeholderStyles}\n</head>`)
    .replace(/<\/body>/i, `${accessibilityScript}\n</body>`);

  if (sourceFile === "") {
    const projectStart = html.indexOf(
      '<section class="section">',
      html.indexOf('<div class="title">'),
    );
    const scriptStart = html.indexOf("<script src=", projectStart);
    const pageClose = html.lastIndexOf("    </div>\n  </div>\n", scriptStart);
    if (projectStart === -1 || scriptStart === -1 || pageClose === -1) {
      throw new Error("Unable to locate the mirrored Home project markup");
    }
    html = `${html.slice(0, projectStart)}<div data-project-content-anchor></div>\n${html.slice(pageClose)}`;
    html = html.replace(
      /<div class="media-background-holder landscape"><img\b[^>]*class="media-background-image"[^>]*><\/div>/gi,
      '<div class="media-background-holder landscape project-media-placeholder" role="img" aria-label="Tasman Glacier landscape stand-in for project"></div>',
    );
    html = html.replace(
      /<h1 class="heading">Selected works<\/h1>/i,
      '<h1 class="heading">Projects</h1>',
    );
    html = html
      .replace(/<title>[^<]*<\/title>/i, "<title>Andrew Zellinger • Projects</title>")
      .replace(/<meta content="[^"]*" property="og:title">/i, '<meta content="Andrew Zellinger • Projects" property="og:title">')
      .replace(/<meta content="[^"]*" property="twitter:title">/i, '<meta content="Andrew Zellinger • Projects" property="twitter:title">')
      .replace(/<meta content="summary_large_image" name="twitter:card">/i, '<meta content="summary_large_image" name="twitter:card">\n  <link rel="canonical" href="/">')
      .replace(/<a href="\/" class="nav_link">Projects<\/a>/i, '<a href="/" aria-current="page" class="nav_link w--current">Projects</a>');
  }

  html = rewriteEmbeddedAssets(html, `${sourceOrigin}/${sourceFile}`);

  if (sourceFile === "info") {
    const biographyDescription = "Andrew Zellinger is a New York City-based principal AI product designer, product strategist, design engineer, and fractional design partner.";
    html = html
      .replace(/<title>[^<]*<\/title>/i, "<title>Andrew Zellinger • History</title>")
      .replace(/<meta content="[^"]*" name="description">/i, `<meta content="${biographyDescription}" name="description">`)
      .replace(/<meta content="[^"]*" property="og:title">/i, '<meta content="Andrew Zellinger • History" property="og:title">')
      .replace(/<meta content="[^"]*" property="og:description">/i, `<meta content="${biographyDescription}" property="og:description">`)
      .replace(/<meta content="[^"]*" property="twitter:title">/i, '<meta content="Andrew Zellinger • History" property="twitter:title">')
      .replace(/<meta content="[^"]*" property="twitter:description">/i, `<meta content="${biographyDescription}" property="twitter:description">`)
      .replace('<h1 class="heading">Info</h1>', '<h1 class="heading">History</h1>')
      .replace(/<meta content="summary_large_image" name="twitter:card">/i, '<meta content="summary_large_image" name="twitter:card">\n  <link rel="canonical" href="/history">')
      .replace(
        /<div class="media-background-holder landscape"><img\b[^>]*class="media-background-image about"[^>]*><\/div>/i,
        '<div class="media-background-holder landscape biography-portrait-placeholder" role="img" aria-label="Andrew Zellinger in profile"></div>',
      )
      .replace(
        /(<div class="margin-bottom space-small">\s*<div class="media-background-holder landscape biography-portrait-placeholder"[^>]*><\/div>\s*<\/div>)\s*<div>[\s\S]*?(?=\s*<div id="w-node-fcc7ec25-d021-fce2-4020-63bb76c6a32c-5991fa8c" class="grid _2-col">)/,
        `$1\n              <div>\n                <div data-biography-content-anchor></div>`,
      )
      .replace(
        /<\/head>/i,
        '  <link href="/src/biography.css" rel="stylesheet" type="text/css">\n  <script type="module" src="/src/biography.js"></script>\n</head>',
      )
      .replace(/<a href="mailto:[^"]+">[^<]+<\/a>/i, '<a href="mailto:hello@andrewzellinger.com">hello@andrewzellinger.com</a>')
      .replace(
        /<div>Instagram<\/div>\s*<\/div>\s*<a href="[^"]+"[^>]*>[^<]+<\/a>/i,
        '<div>Website</div>\n                    </div>\n                    <a href="https://andrewzellinger.com" target="_blank" rel="noreferrer">andrewzellinger.com</a>',
      );
  }

  html = html
    .replace(
      /<script src="\/js\/jquery\.js"([^>]*)\sintegrity="[^"]+"([^>]*)>/i,
      '<script src="/js/jquery.js"$1$2>',
    )
    .replace(/<script type="module" src="\/js\/lenis\.js"><\/script>/i, '<script type="module" src="/js/lenis.js"></script>');

  return html;
}

async function curlDownload({ url, target }) {
  await mkdir(path.dirname(target), { recursive: true });
  try {
    await access(target);
    return;
  } catch {
    // Continue with the download when the asset is not already localized.
  }
  try {
    await execFileAsync("/usr/bin/curl", ["-fsSL", "--retry", "2", url, "-o", target], {
      maxBuffer: 1024 * 1024,
    });
  } catch (error) {
    failures.push({ url, message: error.stderr?.trim() || error.message });
  }
}

async function downloadBatch(entries, concurrency = 10) {
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < entries.length) {
      const current = entries[cursor++];
      await curlDownload(current);
    }
  });
  await Promise.all(workers);
}

async function rewriteCssAssets() {
  const cssEntries = [...scheduled.values()].filter((entry) => entry.localUrl.endsWith(".css"));
  for (const entry of cssEntries) {
    let css;
    try {
      css = await readFile(entry.target, "utf8");
    } catch {
      continue;
    }
    const rewritten = css.replace(/url\((['"]?)(.*?)\1\)/gi, (full, quote, value) => {
      return `url(${quote}${rewriteSingle(value, entry.url)}${quote})`;
    });
    await writeFile(entry.target, rewritten);
  }
}

async function main() {
  for (const [sourceFile, outputFile] of routes) {
    const source = await readFile(path.join(sourceRoot, sourceFile), "utf8");
    const output = transformHtml(source, sourceFile === "index.html" ? "" : sourceFile.replace(".html", ""));
    const target = path.join(projectRoot, outputFile);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, output);
  }

  const firstBatch = [...scheduled.values()];
  await downloadBatch(firstBatch);
  await rewriteCssAssets();
  const secondBatch = [...scheduled.values()].slice(firstBatch.length);
  await downloadBatch(secondBatch);

  const jquerySource = "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=65369deee5d18227f5ece1cf";
  await downloadBatch([
    { url: jquerySource, target: path.join(projectRoot, "public/js/jquery.js") },
  ], 1);
  await writeFile(path.join(projectRoot, "public/js/lenis.js"), localLenisShim);

  const manifest = {
    generatedAt: new Date().toISOString(),
    routes: routes.map(([, output]) => output),
    localizedAssets: scheduled.size,
    skippedVideoAssets: skippedVideos.size,
    failures,
  };
  await writeFile(path.join(projectRoot, "docs/archive/source-capture.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  if (failures.length) {
    console.error(JSON.stringify(manifest, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log(JSON.stringify(manifest, null, 2));
}

await main();
