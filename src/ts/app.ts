import Raven from 'raven-js';
import { BlizzardAPI } from './class.blizzard';
import { initVisuals } from './visuals';

Raven.config('https://ca22106a81d147b586d31169dddfbfe4@sentry.io/1232788').install();

Raven.context(() => {
  initVisuals();
});


/*
(async () => {

  const cObj: { character: string; region: string; realm: string } = { character: 'Shakib', region: 'US', realm: 'Turalyon' };
  const cObj: { character: string; region: string; realm: string } = { character: 'Jixzy', region: 'EU', realm: 'Blackmoore' };


  await new BlizzardAPI(cObj.character, cObj.region, cObj.realm);

  console.log(await new WarcraftlogsAPI(cObj.character, cObj.region, cObj.realm));
})();
*/