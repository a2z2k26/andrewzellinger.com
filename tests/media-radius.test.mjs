import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("all image surfaces use the shared 8px corner radius", async () => {
  const styles = await readFile(new URL("../public/css/site-base.css", import.meta.url), "utf8");

  assert.match(styles, /--media--image-radius:\s*8px;/);
  assert.match(styles, /img\s*\{[^}]*border-radius:\s*var\(--media--image-radius\);/s);
  assert.match(styles, /\.media-background-holder\s*\{[^}]*overflow:\s*hidden;[^}]*border-radius:\s*var\(--media--image-radius\);/s);
});
