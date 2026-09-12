const CAL_EMBED_URL = "https://app.cal.com/embed/embed.js";
const CAL_ORIGIN = "https://app.cal.com";
const CAL_NAMESPACE = "15min";

if (document.querySelector('[data-cal-link="andrewzellinger/15min"]')) {
  ((context, embedUrl, initCommand) => {
    const enqueue = (api, args) => api.q.push(args);
    const documentRef = context.document;

    context.Cal = context.Cal || function calEmbed() {
      const cal = context.Cal;
      const args = arguments;

      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = documentRef.createElement("script");
        script.src = embedUrl;
        documentRef.head.appendChild(script);
        cal.loaded = true;
      }

      if (args[0] === initCommand) {
        const api = function namespacedCalApi() {
          enqueue(api, arguments);
        };
        const namespace = args[1];
        api.q = api.q || [];

        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          enqueue(cal.ns[namespace], args);
          enqueue(cal, ["initNamespace", namespace]);
        } else {
          enqueue(cal, args);
        }
        return;
      }

      enqueue(cal, args);
    };
  })(window, CAL_EMBED_URL, "init");

  window.Cal("init", CAL_NAMESPACE, { origin: CAL_ORIGIN });
  window.Cal.config = window.Cal.config || {};
  window.Cal.config.forwardQueryParams = true;
  window.Cal.ns[CAL_NAMESPACE]("ui", {
    hideEventTypeDetails: false,
    layout: "month_view",
  });

  document.querySelectorAll(`[data-cal-namespace="${CAL_NAMESPACE}"]`).forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      let config = {};
      try {
        config = JSON.parse(trigger.dataset.calConfig || "{}");
      } catch {
        // The embed still opens with Cal.com's defaults if optional config is invalid.
      }

      window.Cal.ns[CAL_NAMESPACE]("modal", {
        calLink: trigger.dataset.calLink,
        config,
      });
    });
  });
}
