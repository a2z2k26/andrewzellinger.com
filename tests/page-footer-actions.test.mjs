import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("collection pages expose the same Cal.com and Email footer actions", async () => {
  const pages = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("articles/index.html", root), "utf8"),
    readFile(new URL("info/index.html", root), "utf8"),
  ]);

  for (const html of pages) {
    assert.equal(html.match(/class="page-footer-actions"/g)?.length, 1);
    assert.equal(html.match(/class="page-title-actions"/g)?.length, 1);
    assert.match(html, /href="https:\/\/cal\.com\/andrewzellinger\/15min"[^>]*data-cal-link="andrewzellinger\/15min"[^>]*data-cal-namespace="15min"[^>]*data-cal-config='\{"layout":"month_view","useSlotsViewOnSmallScreen":"true"\}'[^>]*>Cal\.com<\/a>/);
    assert.match(html, /href="mailto:hello@andrewzellinger\.com">Email<\/a>/);
    assert.match(html, /<script type="module" src="\/src\/cal-overlay\.js"><\/script>/);
  }
});

test("Cal.com embed initializes the namespaced month-view overlay", async () => {
  const embed = await readFile(new URL("src/cal-overlay.js", root), "utf8");

  assert.match(embed, /https:\/\/app\.cal\.com\/embed\/embed\.js/);
  assert.match(embed, /window\.Cal\("init", CAL_NAMESPACE, \{ origin: CAL_ORIGIN \}\);/);
  assert.match(embed, /window\.Cal\.config\.forwardQueryParams = true;/);
  assert.match(embed, /window\.Cal\.ns\[CAL_NAMESPACE\]\("ui", \{[\s\S]*?hideEventTypeDetails: false,[\s\S]*?layout: "month_view",/);
  assert.match(embed, /trigger\.addEventListener\("click", \(event\) => \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);/);
  assert.match(embed, /window\.Cal\.ns\[CAL_NAMESPACE\]\("modal", \{[\s\S]*?calLink: trigger\.dataset\.calLink,[\s\S]*?config,/);
  assert.doesNotMatch(embed, /cal-overlay-close|site-close-override|closeModal/);
});

test("footer actions are compact phone-only controls above the mobile navigation", async () => {
  const css = await readFile(new URL("src/elevation/styles.css", root), "utf8");
  const phone = css.slice(css.indexOf('@media (max-width: 599px) {'));

  assert.match(css, /:is\(\.page-footer-actions, \.page-title-actions\) \{ display: none; \}/);
  assert.match(css, /@media \(min-width: 992px\)[\s\S]*?\.page-title-actions \{[\s\S]*?top: calc\(100% \+ 40px\);[\s\S]*?display: flex;[\s\S]*?gap: 16px;/);
  assert.match(phone, /\.page-footer-actions \{[\s\S]*?display: flex;[\s\S]*?justify-content: flex-start;[\s\S]*?gap: 16px;[\s\S]*?padding-bottom: calc\(111px \+ env\(safe-area-inset-bottom, 0px\)\);/);
  assert.match(phone, /:is\(\.articles-index, \.biography-sweep-content\) > \.page-footer-actions \{\s*margin-inline: 0;/);
  assert.match(css, /\.page-footer-actions__link \{[\s\S]*?min-height: 36px;[\s\S]*?padding-inline: 18px;[\s\S]*?border-radius: 10px;[\s\S]*?background: #121212;[\s\S]*?font-size: 12px;[\s\S]*?text-transform: none;/);
});
