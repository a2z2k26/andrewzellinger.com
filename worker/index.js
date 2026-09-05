export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const normalizedPath = requestUrl.pathname.replace(/\/$/, "");
    const legacyRedirects = new Map([
      ["/index", "/"],
      ["/info", "/history"],
      ["/biography", "/history"],
      ["/portfolio", "/projects"],
    ]);
    const redirectTarget = legacyRedirects.get(normalizedPath);
    if (redirectTarget && ["GET", "HEAD"].includes(request.method)) {
      requestUrl.pathname = redirectTarget;
      return Response.redirect(requestUrl.toString(), 308);
    }
    if (["/photography", "/video", "/discography", "/archive"].includes(normalizedPath)) {
      return new Response("Not Found", { status: 404 });
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const routeUrl = new URL(request.url);
    if (routeUrl.pathname !== "/" && !routeUrl.pathname.endsWith("/index.html")) {
      routeUrl.pathname = `${routeUrl.pathname.replace(/\/$/, "")}/index.html`;
      routeUrl.search = "";
      const routeResponse = await env.ASSETS.fetch(new Request(routeUrl, request));
      if (routeResponse.status !== 404) return routeResponse;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
