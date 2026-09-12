// Seconds for GSAP; CSS consumers derive milliseconds from these same values.
export const PHONE_MOTION = Object.freeze({
  breakpoint: 600,
  duration: Object.freeze({ feedback: .12, response: .24, reading: .44, route: .36, exit: .16 }),
  distance: Object.freeze({ feedback: 4, reveal: 12, page: 8 }),
  stagger: .06,
  ease: Object.freeze({ enter: 'power3.out', exit: 'power2.in', move: 'power3.inOut' }),
  cssEase: Object.freeze({ enter: 'cubic-bezier(.16,1,.3,1)', exit: 'cubic-bezier(.4,0,1,1)', move: 'cubic-bezier(.65,0,.35,1)' }),
});
export const isPhoneWidth = width => width < PHONE_MOTION.breakpoint;
export function phoneCSSVariables() {
  return Object.fromEntries([
    ...Object.entries(PHONE_MOTION.duration).map(([key,value]) => [`--phone-motion-${key}`, `${value * 1000}ms`]),
    ...Object.entries(PHONE_MOTION.distance).map(([key,value]) => [`--phone-distance-${key}`, `${value}px`]),
    ...Object.entries(PHONE_MOTION.cssEase).map(([key,value]) => [`--phone-ease-${key}`, value]),
    ['--phone-motion-stagger', `${PHONE_MOTION.stagger * 1000}ms`],
  ]);
}
