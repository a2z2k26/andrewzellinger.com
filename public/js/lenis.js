
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
