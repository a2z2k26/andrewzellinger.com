import { BIOGRAPHY, BIOGRAPHY_CONTACT } from "./biography-content.js";
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
    element("h2", "biography-introduction__practice-label", BIOGRAPHY.practice.label),
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

  const capabilities = labeledSection(BIOGRAPHY.capabilities.label, "capabilities");
  const capabilitiesContent = element("div", "biography-capabilities-content");
  const capabilityGrid = element("dl", "biography-capabilities");
  BIOGRAPHY.capabilities.groups.forEach((group) => {
    const item = element("div", "biography-capability");
    item.append(
      element("dt", "biography-capability__label", group.label),
      element("dd", "biography-capability__items", group.items.join(" · ")),
    );
    capabilityGrid.append(item);
  });
  const clients = element("div", "biography-clients");
  clients.append(
    element("h3", "biography-clients__label", "Selected clients"),
    element("p", "biography-clients__list", BIOGRAPHY.capabilities.clients.join(" · ")),
  );
  capabilitiesContent.append(capabilityGrid);
  capabilities.append(capabilitiesContent, clients);
  editorial.append(capabilities);

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
  email.append(element("div", "biography-contact__label", "Email"), emailLink);

  const website = element("div", "biography-contact__item");
  const websiteLink = element("a", "biography-contact__link", BIOGRAPHY_CONTACT.websiteLabel);
  websiteLink.href = BIOGRAPHY_CONTACT.websiteUrl;
  websiteLink.target = "_blank";
  websiteLink.rel = "noreferrer";
  website.append(element("div", "biography-contact__label", "Website"), websiteLink);

  contact.append(email, website);
  anchor.replaceChildren(contact);
}

renderBiography();
renderContact();
