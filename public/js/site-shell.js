document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("h");
  const newYorkClockFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const updateClock = () => {
    clock.textContent = newYorkClockFormatter.format(new Date());
  };
  updateClock();
  setInterval(updateClock, 1000);

  const toggle = document.querySelector(".nav_toggle");
  const menu = document.querySelector(".nav_menu");
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    menu.classList.toggle("show");
    toggle.setAttribute("aria-expanded", String(toggle.classList.contains("active")));
  });
  toggle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle.click();
  });

});
