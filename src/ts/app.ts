import Raven from 'raven-js';
import {
  RACES,
  CLASSES,
  ENCHANTABLES,
  QUALITY_CLASSES,
  MYTHIC_PLUS_ACHIEVEMENT_LEVELS,
  MYTHIC_PLUS_ACHIEVEMENTS,
  LEGION_RAID_ACHIEVEMENTS,
  LEGION_RAID_NAMES,
  BFA_RAID_ACHIEVEMENTS,
  BFA_RAID_NAMES,
  LEGION_FACTIONS,
  BFA_FACTIONS,
  REGIONS,
} from './constants';
import { initVisuals } from './visuals';
import { BlizzardAPI } from './class.blizzard';
import { WarcraftlogsAPI } from './class.warcraftlogs';

Raven.config('https://ca22106a81d147b586d31169dddfbfe4@sentry.io/1232788').install();

Raven.context(() => {
  initVisuals();
});

(async () => {
  // testing obj
  const cObj: { character: string; region: string; realm: string } = { character: 'Shakib', region: 'US', realm: 'Turalyon' };

  /* Blizzard API Access */
  console.log(await new BlizzardAPI(cObj.character, cObj.region, cObj.realm));
  /* Warcraftlogs API Access */
  //console.log(await new WarcraftlogsAPI(cObj.character, cObj.region, cObj.realm));
})();
