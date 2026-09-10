import test from 'node:test';
import assert from 'node:assert/strict';
import { counterflowDirection, counterflowTiming, counterflowTravel, waitForVisualReadiness } from '../src/elevation/counterflow-model.js';

test('all six top-level route pairs share one upward sweep', () => {
  const routes=['/','/articles','/history'];
  for(const from of routes) for(const to of routes) {
    assert.equal(counterflowDirection(from,to),from===to?0:1,`${from} → ${to}`);
  }
  assert.equal(counterflowDirection('https://site.test/', 'https://site.test/articles/'),1);
  assert.equal(counterflowDirection('/history?x=1','/'),1);
  for (const pair of [['/','/projects'],['/projects/','/'],['/','/case-studies/audible-sleep/'],['/articles/a-story','/'],['/','/articles/a-story'],['/projects','/projects/'],[undefined,'/'],['https://outside.test/','https://site.test/projects']]) {
    assert.equal(counterflowDirection(...pair),0);
  }
});

test('case-study logo departure to the Projects landing page joins the sweep', () => {
  assert.equal(counterflowDirection('/case-studies/andrew-eccles/', '/'), 1);
  assert.equal(counterflowDirection('/case-studies/andrew-eccles/', '/projects'), 1);
  assert.equal(counterflowDirection('https://site.test/case-studies/audible-sleep/', 'https://site.test/'), 1);
  assert.equal(counterflowDirection('/case-studies/audible-sleep/', '/history'), 0);
  assert.equal(counterflowDirection('/case-studies/', '/'), 0);
});

test('visual readiness releases on decode, failure, or a bounded timeout', async () => {
  assert.equal(await waitForVisualReadiness([Promise.resolve()],20),true);
  assert.equal(await waitForVisualReadiness([Promise.reject(new Error('decode'))],20),false);
  assert.equal(await waitForVisualReadiness([new Promise(()=>{})],5),false);
});

test('direction and timing stay consistent even when reversing navigation', () => {
  assert.deepEqual(counterflowTravel(1), {leftOut:'100%',leftIn:'-100%',rightOut:'-100%',rightIn:'100%'});
  assert.deepEqual(counterflowTravel(-1),counterflowTravel(1));
  const a=counterflowTiming(1440,1),b=counterflowTiming(1440,-1);
  assert.equal(a.duration+a.rightDelay,920);
  assert.deepEqual(a,b);
  assert.equal(counterflowTiming(390,1).duration+counterflowTiming(390,1).rightDelay,620);
});
