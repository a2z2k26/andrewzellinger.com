import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/flow/step-two/index.html", "/index.html"]);
});

test("serves canonical routes from their generated index files", async () => {
  for (const pathname of ["/articles", "/projects", "/history"]) {
    const calls = [];
    const generatedPath = `${pathname}/index.html`;
    const response = await worker.fetch(
      new Request(`https://example.test${pathname}`, { headers: { accept: "text/html" } }),
      {
        ASSETS: {
          fetch: async (request) => {
            const requestedPath = new URL(request.url).pathname;
            calls.push(requestedPath);
            return new Response(requestedPath === generatedPath ? "page" : "missing", {
              status: requestedPath === generatedPath ? 200 : 404,
            });
          },
        },
      },
    );

    assert.equal(response.status, 200);
    assert.deepEqual(calls, [pathname, generatedPath]);
  }
});

test("redirects legacy routes to their canonical destinations", async () => {
  for (const [pathname, destination] of [["/index", "/"], ["/info", "/history"], ["/biography", "/history"], ["/portfolio", "/projects"]]) {
    let assetCalls = 0;
    const response = await worker.fetch(
      new Request(`https://example.test${pathname}?source=legacy`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => { assetCalls += 1; return new Response("missing", { status: 404 }); } } },
    );

    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `https://example.test${destination}?source=legacy`);
    assert.equal(assetCalls, 0);
  }
});

test("removed sections return 404 instead of falling back to Home", async () => {
  for (const pathname of ["/photography", "/video", "/discography", "/archive"]) {
    let assetCalls = 0;
    const response = await worker.fetch(
      new Request(`https://example.test${pathname}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => { assetCalls += 1; return new Response("missing", { status: 404 }); } } },
    );

    assert.equal(response.status, 404);
    assert.equal(assetCalls, 0);
  }
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/client/projects/index.html", import.meta.url));
  await access(new URL("../dist/client/history/index.html", import.meta.url));
  await access(new URL("../dist/client/articles/index.html", import.meta.url));
  await access(new URL("../dist/client/images/tasman-glacier-stand-in.jpg", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
  await assert.rejects(access(new URL("../dist/client/index/index.html", import.meta.url)));
  await assert.rejects(access(new URL("../dist/client/info/index.html", import.meta.url)));
});
