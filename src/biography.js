import { BIOGRAPHY, BIOGRAPHY_CONTACT } from "./biography-content.js";
import { createRotatingGlobeIcon } from "./rotating-globe-icon.js";
import "./biography.css";

function element(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function labeledSection(label, modifier) {
  const node = element("section", `biography-block biography-block--${modifier}`);
  node.append(element("h2", "biography-block__label", label));
  return node;
}

function prose(paragraphs) {
  const group = element("div", "biography-prose");
  paragraphs.forEach((paragraph) => group.append(element("p", "", paragraph)));
  return group;
}

function renderBiography() {
  const anchor = document.querySelector("[data-biography-content-anchor]");
  if (!anchor) return;

  const editorial = element("div", "biography-editorial");

  const introduction = element("header", "biography-introduction");
  introduction.append(
    element("p", "biography-introduction__lead", BIOGRAPHY.lead),
    element("p", "biography-introduction__practice-body", BIOGRAPHY.practice.body),
  );
  editorial.append(introduction);

  const experience = element("section", "biography-experience-section");
  experience.append(element("h2", "biography-experience-section__heading", BIOGRAPHY.experience.label));
  const experienceList = element("ol", "biography-experience");
  experienceList.setAttribute("aria-label", "Experience");
  BIOGRAPHY.experience.entries.forEach((entry) => {
    const item = element("li", "biography-experience__row");
    item.append(
      element("span", "biography-experience__organization", entry.organization),
      element("span", "biography-experience__role", entry.role),
      element("span", "biography-experience__dates", entry.dates),
    );
    experienceList.append(item);
  });
  experience.append(experienceList);
  editorial.append(experience);

  const education = labeledSection(BIOGRAPHY.education.label, "education");
  education.append(prose([BIOGRAPHY.education.body]));
  editorial.append(education);

  const clients = labeledSection("Select Clients", "clients");
  clients.append(element("p", "biography-clients__list", BIOGRAPHY.capabilities.clients.join(", ")));
  editorial.append(clients);

  const availability = labeledSection(BIOGRAPHY.availability.label, "availability");
  availability.append(prose([BIOGRAPHY.availability.body]));
  editorial.append(availability);

  anchor.replaceChildren(editorial);
}

function renderContact() {
  const anchor = document.querySelector("[data-biography-contact-anchor]");
  if (!anchor) return;

  const contact = element("section", "biography-contact");
  contact.setAttribute("aria-label", "Contact");

  const email = element("div", "biography-contact__item");
  const emailLink = element("a", "biography-contact__link", BIOGRAPHY_CONTACT.email);
  emailLink.href = `mailto:${BIOGRAPHY_CONTACT.email}`;
  email.append(element("div", "biography-contact__label", "Connect"), emailLink);

  contact.append(email);
  const socials = element("div", "biography-contact__socials");
  BIOGRAPHY_CONTACT.socialLinks.forEach(({ label, url }) => {
    const link = element("a", "biography-contact__link", label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    socials.append(link);
  });
  contact.append(socials);
  anchor.replaceChildren(contact);
}

function mountPortraitGlobes() {
  const viewport = document.querySelector(".biography-sweep-viewport");
  if (!viewport) return;
  const mounted = new WeakSet();
  const mount = () => {
    viewport.querySelectorAll(".biography-portrait-placeholder").forEach((portrait) => {
      if (mounted.has(portrait)) return;
      mounted.add(portrait);
      // Loop copies need their own animation and unique SVG clip IDs.
      portrait.querySelectorAll(".biography-portrait-globe").forEach((globe) => globe.remove());
      const globe = createRotatingGlobeIcon({
        fadeMeridians: false,
        duration: 8575,
        // Observe outside the entrance clip, which can suppress SVG visibility updates.
        visibilityTarget: portrait.closest(".biography-section"),
      });
      globe.classList.add("biography-portrait-globe");
      portrait.append(globe);
    });
  };
  mount();
  const observer = new MutationObserver(mount);
  observer.observe(viewport, { childList: true, subtree: true });
}

renderBiography();
renderContact();
mountPortraitGlobes();
