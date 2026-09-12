import { counterflowDirection, counterflowTiming, counterflowTravel, waitForVisualReadiness } from './counterflow-model.js';
import { PROJECTS } from '../project-content.js';
import { setMotionPause } from './motion-pause.js';
import { captureTitleCharacters, animateCapturedTitleCharacters } from './title-motion.js';
import './counterflow.css';
import { isPhone } from '../motion/phone.js';

const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const reduced=()=>reduce.matches || root.dataset.editionMotion==='reduced';
let active=null;
let sequence=0;
let safety=0;
let skipDeparture=false;
const warmed=new Map();
let restoreRail=()=>{};
let releaseTitleMotion=()=>{};

function destinationMedia(to) {
  const path=new URL(to,location.href).pathname.replace(/\/$/,'');
  if(path==='' || path==='/projects') return PROJECTS.slice(0,2).map(item=>item.media.src);
  if(path==='/articles') return [];
  if(path==='/history') return ['/images/history/az-headshot-extended-v1.png'];
  return [];
}

export const hasCounterflow = () => 'onpagereveal' in window && 'onpageswap' in window;
export const isCounterflowPair = (to) => !!counterflowDirection(location.href,to);
export const isCounterflowArrival = () => !!counterflowDirection(window.navigation?.activation?.from?.url,location.href);

function warmImage(src) {
  if(!warmed.has(src)) {
    const image=new Image();
    image.src=src;
    const decoding=image.decode().then(()=>true,()=>false);
    warmed.set(src,decoding);
  }
  return warmed.get(src);
}
export async function prepareCounterflow(to) {
  if (isPhone()) return true; // Native loading; never hold phone navigation for image decoding.
  const sources=destinationMedia(to);
  const ready=await waitForVisualReadiness([
    ...sources.map(src=>warmImage(src).then(ok=>{if(!ok) throw new Error('Image unavailable');})),
    document.fonts.load('500 80px Geist'),
  ]);
  return ready;
}
export function commitCounterflow(to, ready) {
  skipDeparture=!ready;
  location.assign(to);
}

// Warm route media once. Every destination still has bounded decode readiness.
if(hasCounterflow() && !reduced() && ['','/projects','/articles','/history'].includes(location.pathname.replace(/\/$/,''))) {
  for(const target of ['/','/articles','/history']) destinationMedia(target).forEach(warmImage);
}

function historyViewport() {
  const rail=document.querySelector('.biography-layout__content');
  const viewport=rail?.querySelector('.biography-sweep-viewport');
  // The carousel already owns a fixed, clipped reading window. Capture it
  // directly without applying the native document-scroll compensation.
  if(viewport?.querySelector('.history-motion-track')) return viewport;
  const content=viewport?.querySelector('.biography-sweep-content');
  if(!viewport || !content) return null;
  const rect=rail.getBoundingClientRect();
  const saved=[rail,viewport,content].map(node=>[node,node.getAttribute('style')]);
  // Preserve the document's height and exact visible reading position while
  // capturing only one viewport, not a many-thousand-pixel biography snapshot.
  rail.style.minHeight=`${rect.height}px`;
  Object.assign(viewport.style,{
    position:'fixed',left:`${rect.left}px`,top:'24px',width:`${rect.width}px`,
    height:`${innerHeight-48}px`,overflow:'clip',background:'#000',zIndex:'2',
  });
  content.style.transform=`translateY(${rect.top-24}px)`;
  restoreRail=()=>{
    for(const [node,style] of saved) {
      if(style===null) node.removeAttribute('style'); else node.setAttribute('style',style);
    }
    restoreRail=()=>{};
  };
  return viewport;
}

function caseStudyViewport() {
  const view=document.querySelector('.detail-view--project');
  const rail=view?.querySelector('.detail-rail');
  const content=rail?.querySelector('.detail-sets');
  if(!content) return null;
  const rect=rail.getBoundingClientRect();
  const inset=innerWidth<992?16:24;
  const saved=[view,rail,content].map(node=>[node,node.getAttribute('style')]);
  // Snapshot the current reading window, not all three circular detail sets.
  // Preserve both the document height and the pixels at the current scroll
  // position; no duplicate content or permanent wrapper is introduced.
  view.style.minHeight=`${view.getBoundingClientRect().height}px`;
  Object.assign(rail.style,{
    position:'fixed',left:`${rect.left}px`,top:`${inset}px`,width:`${rect.width}px`,
    height:`${innerHeight-inset*2}px`,margin:'0',padding:'0',
    overflow:'clip',background:'#000',zIndex:'2',
  });
  content.style.transform=`translateY(${rect.top-inset}px)`;
  restoreRail=()=>{
    for(const [node,style] of saved) {
      if(style===null) node.removeAttribute('style'); else node.setAttribute('style',style);
    }
    restoreRail=()=>{};
  };
  return rail;
}

function nameSurfaces(direction, phase) {
  if (!direction || reduced()) return false;
  if (isPhone()) {
    root.dataset.phoneRoute = 'active';
    captureTitleCharacters(phase);
    // Close the drawer synchronously before the browser captures the old page.
    window.dispatchEvent(new Event('portfolio:phone-route-capture'));
    for (const [selector, name] of [
      ['.nav_brand', 'phone-brand'],
      ['.nav_h', 'phone-clock'], ['.site-navigation__menu-toggle:not([hidden])', 'phone-control'],
    ]) {
      const node = document.querySelector(selector);
      if (node && node.getBoundingClientRect().height) node.style.viewTransitionName = name;
    }
    return true;
  }
  const title=document.querySelector('.title');
  // On compact layouts capture only the first media frame, never the entire
  // long collection. The document below it stays in its native reading flow.
  restoreRail();
  // A detail may retain its hidden collection DOM. Resolve its visible rail
  // first so Home departure cannot accidentally capture that hidden source.
  const media=root.classList.contains('detail-route') ? caseStudyViewport() : innerWidth<992
    ? document.querySelector('.index-static-field, .works-motion-card .media-background-holder, .articles-entry__body, .portrait-study-stage--history, .biography-portrait-placeholder')
    : document.querySelector('.index-static-field, .works-motion-field, .articles-index__list') || historyViewport();
  if (!title || !media) return false;
  captureTitleCharacters(phase);
  media.style.viewTransitionName='counterflow-media';
  for(const [selector,name] of [['.nav_wrapper','control'],['.nav_brand','brand'],['.nav_h','clock']]) {
    const node=document.querySelector(selector);
    if(node) node.style.viewTransitionName=`counterflow-${name}`;
  }
  const timing=counterflowTiming(innerWidth,direction);
  root.dataset.counterflow='up';
  root.dataset.railSweep='up';
  root.style.setProperty('--cf-duration',`${timing.duration}ms`);
  root.style.setProperty('--cf-left-delay',`${timing.leftDelay}ms`);
  root.style.setProperty('--cf-right-delay',`${timing.rightDelay}ms`);
  for (const [key,value] of Object.entries(counterflowTravel(direction))) {
    root.style.setProperty(`--cf-${key.replace(/[A-Z]/g,x=>`-${x.toLowerCase()}`)}`,value);
  }
  return true;
}

function clearNames() {
  document.querySelectorAll('[style*="view-transition-name"]').forEach(node=>node.style.removeProperty('view-transition-name'));
}
function settle(token, focus=false) {
  if(token!==sequence) return;
  clearTimeout(safety);
  releaseTitleMotion();
  releaseTitleMotion=()=>{};
  clearNames();
  restoreRail();
  delete root.dataset.phoneRoute;
  delete root.dataset.counterflow;
  delete root.dataset.railSweep;
  root.dataset.transitionPhase='idle';
  active=null;
  setMotionPause('navigation',false);
  if(focus && (!document.activeElement || document.activeElement===document.body)) {
    const heading=document.querySelector('.title h1');
    heading?.setAttribute('tabindex','-1');
    heading?.focus({preventScroll:true});
  }
}
function cancel() {
  active?.skipTransition();
  settle(++sequence);
}

window.addEventListener('pageswap',event=>{
  const direction=counterflowDirection(location.href,event.activation?.entry?.url);
  if(!event.viewTransition) return;
  // Chrome rejects ready when a transition is skipped (including departures).
  // Register the rejection handler before any early skip or cancellation.
  event.viewTransition.ready.catch(()=>{});
  if(skipDeparture || !nameSurfaces(direction, 'out')) {event.viewTransition.skipTransition();skipDeparture=false;return;}
  const token=++sequence;
  active=event.viewTransition;
  root.dataset.transitionPhase='exit';
  setMotionPause('navigation',true);
  // The browser owns the actual navigation; no delayed callback can later
  // send the reader to an obsolete destination.
  event.viewTransition.finished.catch(()=>{}).then(()=>settle(token));
});

window.addEventListener('pagereveal',event=>{
  const direction=counterflowDirection(window.navigation?.activation?.from?.url,location.href);
  if(!event.viewTransition) {settle(sequence);return;}
  event.viewTransition.ready.catch(()=>{});
  if(!nameSurfaces(direction, 'in')) {event.viewTransition.skipTransition();settle(sequence);return;}
  const token=++sequence;
  active=event.viewTransition;
  setMotionPause('navigation',true);
  window.dispatchEvent(new CustomEvent('portfolio:rail-sweep-arrival'));
  root.dataset.transitionPhase='enter';
  event.viewTransition.ready.then(()=>{
    if(token===sequence) {
      releaseTitleMotion=animateCapturedTitleCharacters();
      root.dataset.transitionPhase='animating';
      root.dataset.transitionVerified=isPhone()?'phone-fade-through':'rail-sweep-up';
    }
  }).catch(()=>settle(token));
  event.viewTransition.finished.catch(()=>{}).then(()=>settle(token,true));
  safety=setTimeout(cancel,2200);
});

window.addEventListener('pointerdown', () => { if (active && isPhone()) cancel(); }, { capture: true });
window.addEventListener('resize',cancel);
reduce.addEventListener('change',()=>{if(reduce.matches) cancel();});
window.addEventListener('pageshow',event=>{
  if(event.persisted && !active) settle(sequence);
});

// Early listener setup is imported by a render-blocking entry, so the
// incoming page cannot paint an unclassified transition first.
root.dataset.counterflowCapability=hasCounterflow()?'native':'fallback';
