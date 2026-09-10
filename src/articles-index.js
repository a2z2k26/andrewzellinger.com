import { ARTICLE_DETAILS } from "./article-content.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function articleMarkup(entry) {
  const metaLabel = entry.meta.join(", ");
  return `<li>
    <a href="${escapeHtml(entry.path)}" class="portfolio-detail-link articles-entry-link" data-portfolio-detail-link data-detail-kind="article" data-detail-slug="${escapeHtml(entry.slug)}" aria-label="Read article: ${escapeHtml(entry.title)}">
      <article class="articles-entry" data-article-card-copy>
        <div class="articles-entry__body">
          <h2 class="articles-entry__title heading-style-h2 new">${escapeHtml(entry.title)}</h2>
          <div class="articles-entry__meta display-inlineflex categories works-meta-spacing" aria-label="${escapeHtml(metaLabel)}">
            ${entry.meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
          </div>
          <p class="articles-entry__excerpt works-project-description">${escapeHtml(entry.summary)}</p>
        </div>
      </article>
    </a>
  </li>`;
}

const list = document.querySelector(".articles-entry-list");
if (list) list.innerHTML = ARTICLE_DETAILS.map(articleMarkup).join("");
