import { RAID_IDS } from './constants';
import { API } from './secrets';
import * as REALMS from './realms.json';

export const returnURL = {
  Blizzard: (character: string, region: string, realm: string): string =>
    `https://${region}.api.battle.net/wow/character/${realm}/${character}?fields=items,statistics,achievements,talents&locale=en_GB&apikey=${API.Blizzard}`,
  Warcraftlogs: (character: string, region: string, realm: string): string[] => {
    let zoneURLs: string[];
    zoneURLs = [];

    RAID_IDS.forEach(id => {
      zoneURLs.push(`https://www.warcraftlogs.com:443/v1/parses/character/${character}/${realm}/${region}?zone=${id}&api_key=${API.Warcraftlogs}`);
    });

    return zoneURLs;
  },
  RaiderIO: (character: string, region: string, realm: string): string =>
    `http://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${character}&fields=gear,raid_progression,mythic_plus_scores,mythic_plus_best_runs,mythic_plus_highest_level_runs,mythic_plus_weekly_highest_level_runs,previous_mythic_plus_scores,previous_mythic_plus_ranks`,
};

export const getURLData = async (url: string): Promise<object> => await fetch(url).then(response => response.json());

export const prettyPrintSeconds = (s: number) => {
  s <= 1 ? 'just now' : void 0;

  s <= 90 ? `${s} seconds` : void 0;

  let m = Math.floor(s / 60);
  if (m <= 90) {
    let result = `${m} minute`;

    m !== 1 ? (result += 's') : void 0;
    s = Math.round((s / 60 - m) * 60);
    s > 0 ? (result += `, ${s} second`) : void 0;
    s > 1 ? (result += 's') : void 0;

    return result;
  }

  let h = Math.floor(m / 60);
  m %= 60;

  if (h <= 36) {
    let result = `${h} hour`;

    h !== 1 ? (result += 's') : void 0;
    result += `, ${m} minute`;
    m !== 1 ? (result += 's') : void 0;

    return result;
  }

  const d = Math.floor(h / 24);
  h %= 24;

  let result = `${d} day`;
  d !== 1 ? (result += 's') : void 0;
  result += `, ${h} hour`;
  h !== 1 ? (result += 's') : void 0;

  return result;
};

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const normalize = {
  lowerCaseCapitalization: (word: string) => capitalize(word.toLowerCase()),
  upperCase: (word: string) => word.toUpperCase(),
};

export const switchTabToCharacter = () => {
  (<HTMLUListElement>document.querySelector('[data-index="card_1"]')).click();
  (<HTMLCollectionOf<HTMLUListElement>>document.getElementsByClassName('card_1'))[0].style.display = 'list-item';
};

const populateRealmArr = (): IRealmLookupObj => {
  const defaultSubObj = Object.values(Object.entries(REALMS))[2][1];

  const realms: string[] = [];
  const slugs: string[] = [];

  const regions = ['US', 'EU'];

  defaultSubObj.forEach((region: IRealmsRegionObject) => {
    const index = defaultSubObj.indexOf(region);

    Object.values(region).forEach((realmObj: IRealmsRegionRealmObject) => {
      realms.push(`${regions[index]}-${realmObj.name}`);
      slugs.push(realmObj.slug);
    });
  });

  return { realms, slugs };
};

export const realmLookupObj: IRealmLookupObj = populateRealmArr();

export const emptyDatalist = (target: HTMLDataListElement) => {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
};

export const appendToLookupDatalist = (target: HTMLDataListElement, options: string[]) => {
  const fragment = document.createDocumentFragment();

  options.forEach(optionVal => {
    const option = document.createElement('option');
    option.value = optionVal;
    fragment.appendChild(option);
  });

  target.appendChild(fragment);
};
