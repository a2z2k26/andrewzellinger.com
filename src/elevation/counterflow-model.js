const path = value => new URL(value, 'https://portfolio.invalid').pathname.replace(/\/$/, '') || '/';
const topLevelRoutes=new Set(['/','/projects','/articles','/history']);
export function counterflowDirection(from, to) {
  if (!from || !to) return 0;
  const origin=new URL(from,'https://portfolio.invalid').origin;
  if(new URL(to,origin).origin!==origin) return 0;
  const a=path(from), b=path(to);
  // Leaving a case study via Home is page navigation, not the detail-close
  // interaction. Keep collection returns and all detail arrivals independent.
  if (/^\/case-studies\/[^/]+$/.test(a) && b==='/') return 1;
  return a!==b && topLevelRoutes.has(a) && topLevelRoutes.has(b) ? 1 : 0;
}
export function counterflowTiming(width) {
  const compact=width<992;
  const stagger=compact?40:70;
  return {duration:compact?580:850,leftDelay:0,rightDelay:stagger};
}
export function counterflowTravel() {
  // Navigation order does not reverse the choreography: the right rail always
  // travels up, in the same direction as uninterrupted collection autoplay.
  return {leftOut:'100%',leftIn:'-100%',rightOut:'-100%',rightIn:'100%'};
}
export async function waitForVisualReadiness(promises, timeout=1600) {
  let timer;
  try {
    return await Promise.race([
      Promise.all(promises).then(()=>true,()=>false),
      new Promise(resolve=>{timer=setTimeout(()=>resolve(false),timeout);}),
    ]);
  } finally {clearTimeout(timer);}
}
