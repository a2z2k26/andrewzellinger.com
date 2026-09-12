import { gsap } from "gsap";
import { PHONE_MOTION, isPhoneWidth } from "../motion/profile.js";
const phone = () => typeof innerWidth !== "undefined" && isPhoneWidth(innerWidth);

export const TEXT_MOTION = Object.freeze({
  duration: Object.freeze({
    micro: .16,
    response: .24,
    reveal: .44,
    detail: .72,
    page: .85,
  }),
  stagger: Object.freeze({
    tight: .03,
    structural: .05,
  }),
  distance: Object.freeze({
    interactive: 4,
    reveal: 10,
  }),
  ease: Object.freeze({
    enter: "power3.out",
    exit: "power2.in",
    move: "power3.inOut",
  }),
});

const targetsFor = ({ label = null, body = null } = {}) => [label, body].filter(Boolean);

export function prepareStructuralText(parts) {
  const targets = targetsFor(parts);
  if (!targets.length) return targets;
  gsap.set(targets, {
    autoAlpha: 0,
    y: phone() ? PHONE_MOTION.distance.reveal : TEXT_MOTION.distance.reveal,
    willChange: "transform,opacity",
  });
  return targets;
}

export function revealStructuralText({ label = null, body = null, onComplete = null } = {}) {
  const targets = targetsFor({ label, body });
  const timeline = gsap.timeline({
    onComplete: () => {
      resetStructuralText({ label, body });
      onComplete?.();
    },
  });

  if (label) {
    timeline.to(label, {
      autoAlpha: 1,
      y: 0,
      duration: phone() ? PHONE_MOTION.duration.response : TEXT_MOTION.duration.response,
      ease: TEXT_MOTION.ease.enter,
    }, 0);
  }
  if (body) {
    timeline.to(body, {
      autoAlpha: 1,
      y: 0,
      duration: phone() ? PHONE_MOTION.duration.reading - PHONE_MOTION.stagger : TEXT_MOTION.duration.reveal,
      ease: TEXT_MOTION.ease.enter,
    }, label ? (phone() ? PHONE_MOTION.stagger : TEXT_MOTION.stagger.structural) : 0);
  }
  if (!targets.length) onComplete?.();
  return timeline;
}

export function resetStructuralText(parts) {
  const targets = targetsFor(parts);
  if (targets.length) {
    gsap.set(targets, {
      clearProps: "transform,opacity,visibility,willChange",
    });
  }
}
