import {
  AZERITE_SLOTS,
  BFA_FACTIONS,
  BFA_RAID_ACHIEVEMENTS,
  BFA_RAID_NAMES,
  CLASSES,
  ENCHANTABLES,
  ITEM_SLOTS,
  LEGION_FACTIONS,
  LEGION_RAID_ACHIEVEMENTS,
  LEGION_RAID_NAMES,
  MYTHIC_PLUS_ACHIEVEMENTS,
  MYTHIC_PLUS_ACHIEVEMENT_LEVELS,
  QUALITY_CLASSES,
  RACES,
  WEAPON_SLOTS,
} from './constants';
import { getURLData, normalize, prettyPrintSeconds, returnURL, switchTabToCharacter, validateRegion } from './helperFunctions';

export class BlizzardAPI {
  private data: IBlizzardAPIObject;
  private character: string;
  private region: string;
  private realm: string;

  private classInformation: IClassInformationDetailObj;
  private raceInformation: { name: string; icon: string };
  private selectedRole: { specName: string; icon: string; role: string };
  private items: ICustomItemObj;
  private raidAchievements: ICustomRaidAchievementObj;

  constructor(character: string, region: string, realm: string) {
    this.character = normalize.lowerCaseCapitalization(character);
    this.region = validateRegion(region) ? normalize.upperCase(region) : '';
    this.realm = normalize.lowerCaseCapitalization(realm);

    this.getData();
  }

  getData = () =>
    (async () => {
      this.data = <IBlizzardAPIObject> await getURLData(returnURL.Blizzard(this.character, this.region, this.realm));
      this.executeBlizzardAPI();
    })();

  executeBlizzardAPI = () => {
    this.classInformation = this.getClassInformation(this.data.class);
    this.raceInformation = this.getRaceInformation(this.data.race);
    this.selectedRole = this.getSelectedTalents(this.data.talents);
    this.items = this.getEquippedItems(this.data.items);
    this.raidAchievements = this.getRaidAchievements(this.data.achievements);

    const avatarLink = this.returnCharacterAvatar(this.region);

    this.setSplash(avatarLink.replace('avatar', 'main'));
    this.setAvatar(avatarLink);
    this.setSpecLogo();
    this.setCharacterPath();
    this.setRaceClass();
    this.setItems();
    this.setRaidAchievements();

    this.appendTooltipScript();
  };

  appendTooltipScript = () => {
    const script = document.createElement('script');
    script.src = 'https://wow.zamimg.com/widgets/power.js';
    document.body.appendChild(script);
  };

  returnCharacterAvatar = (region: string) => `https://render-${region}.worldofwarcraft.com/character/${this.data.thumbnail}`;

  setSplash = (url: string) => {
    const imgEl = <HTMLImageElement>document.getElementById('character-splash');
    imgEl.src = url;
    imgEl.onload = () => switchTabToCharacter();
  };

  setAvatar = (url: string) => ((<HTMLImageElement>document.getElementById('avatar')).src = url);

  setSpecLogo = () => ((<HTMLImageElement>document.getElementById('spec-logo')).src = this.selectedRole.icon);

  setCharacterPath = () => ((<HTMLParagraphElement>document.getElementById('character-path')).innerText = `${this.character} @ ${this.region}–${this.realm}`);

  setRaceClass = () => ((<HTMLParagraphElement>document.getElementById('race-class')).innerText = `${this.raceInformation.name} ${this.selectedRole.specName} ${this.classInformation.name}`);

  getRaceInformation = (raceIndex: number) => {
    const raceData: string = RACES[raceIndex];
    return {
      name: raceData,
      icon: `${raceData.toLowerCase().replace(/ /g, '')}.svg`,
    };
  };

  getClassInformation = (classIndex: number) => {
    const classData: IClassInformationDetailObj = CLASSES[classIndex];
    return {
      name: classData.name,
      icon: `${classData.name.toLowerCase().replace(/ /g, '')}.svg`,
    };
  };

  getSelectedTalents = (talentContainer: IBlizzardTalentContainer) => {
    const result: ICustomTalentObj = {
      specName: '',
      icon: '',
      role: '',
    };

    Object.values(talentContainer).forEach((possibleSpec: IBlizzardTalentContainer) => {
      if (possibleSpec.selected) {
        result.specName = possibleSpec.spec.name;
        result.icon = `http://media.blizzard.com/wow/icons/56/${possibleSpec.spec.icon}.jpg`;
        result.role = possibleSpec.spec.role;
      }
    });

    return result;
  };

  getEquippedItems = (items: IBlizzardItemsContainer) => {
    const result: ICustomItemObj = {
      averageItemLevel: 0,
      averageItemLevelEquipped: 0,
    };

    const [ObjKeys, ObjValues] = [Object.keys(items), Object.values(items)];

    ObjKeys.forEach(resultProperty => {
      const currentValue: IBlizzardItemObj = ObjValues[ObjKeys.indexOf(resultProperty)];

      if (['averageItemLevel', 'averageItemLevelEquipped'].includes(resultProperty)) {
        result[resultProperty] = currentValue;
      } else {
        const tempObj: ICustomItemInfoObj = {
          itemID: currentValue.id,
          itemLevel: currentValue.itemLevel,
          itemName: currentValue.name,
          bonusLists: currentValue.bonusLists,
          armor: currentValue.armor,
          quality: currentValue.quality,
        };

        // check for gem
        if (currentValue.bonusLists.includes(1808)) {
          tempObj.gemID = currentValue.tooltipParams.gem0;
        }

        // check whether this item is enchantable
        if (ENCHANTABLES.includes(resultProperty)) {
          tempObj.enchant = currentValue.tooltipParams.enchant;
        }

        result[resultProperty] = tempObj;
      }
    });

    return result;
  };

  setItems = () => {
    const regularSlots = ITEM_SLOTS.filter(slot => AZERITE_SLOTS.concat(WEAPON_SLOTS).indexOf(slot) === -1);

    const azeriteContainer = <HTMLDivElement>document.getElementById('ci-azerite-slots');
    const weaponContainer = <HTMLDivElement>document.getElementById('ci-weapon-slots');
    const regularContainer = <HTMLDivElement>document.getElementById('ci-item-slots');

    Object.entries(this.items).forEach(subArr => {
      if (subArr[0] === 'averageItemLevel') (<HTMLSpanElement>document.getElementById('ci-ilvl-total')).innerText = subArr[1];

      if (subArr[0] === 'averageItemLevelEquipped') (<HTMLSpanElement>document.getElementById('ci-ilvl-equipped')).innerText = subArr[1];

      if (AZERITE_SLOTS.indexOf(subArr[0]) !== -1) azeriteContainer.insertAdjacentHTML('beforeend', this.returnItemTemplate(subArr[1]));

      if (WEAPON_SLOTS.indexOf(subArr[0]) !== -1) weaponContainer.insertAdjacentHTML('beforeend', this.returnItemTemplate(subArr[1]));

      if (regularSlots.indexOf(subArr[0]) !== -1) regularContainer.insertAdjacentHTML('beforeend', this.returnItemTemplate(subArr[1]));
    });

    // switch to full-width for single-wielding characters
    if (typeof this.items.offHand === 'undefined') weaponContainer.classList.replace('ci-items-50', 'ci-items-100');
  };

  returnItemTemplate = (item: ICustomItemInfoObj) => {
    let link = `${item.itemID}`;

    // append boni to link
    if (item.bonusLists.length > 0) {
      link += '?bonus=';
      item.bonusLists.forEach(bonus => (link += `${bonus}:`));
      link = link.slice(0, -1);
    }

    // append enchant
    if (item.enchant) link += `&ench=${item.enchant}`;

    // append gem
    if (item.gemID) link += `&gems=${item.gemID}`;

    // if enchanted but no boni, fix link
    if (item.bonusLists.length === 0) link = link.replace('&', '?');

    return `<div><a href="https://www.wowhead.com/item=${link}" target="_blank" class="${this.convertQualityToClass(item.quality!)}">${item.itemLevel}</a></div>`;
  };

  convertQualityToClass = (quality: number): string => `quality-${QUALITY_CLASSES[quality]}`;

  getHighestMythicPlusAchievement = (achievementContainer: IBlizzardAchievementsContainer): ICustomMythicPlusAchievementObj => {
    let highestMythicPlusAchievement;
    let timestamp: number = Date.now();

    MYTHIC_PLUS_ACHIEVEMENTS.forEach(achievementID => {
      if (achievementContainer.achievementsCompleted.includes(achievementID)) {
        highestMythicPlusAchievement = MYTHIC_PLUS_ACHIEVEMENT_LEVELS[MYTHIC_PLUS_ACHIEVEMENTS.indexOf(achievementID)];
        timestamp = achievementContainer.achievementsCompletedTimestamp[achievementContainer.achievementsCompleted.indexOf(achievementID)];
      }
    });

    return {
      level: highestMythicPlusAchievement,
      timestamp,
      age: `${prettyPrintSeconds((Date.now() - timestamp!) / 1000)} ago`,
    };
  };

  extractRaidAchievements = (achievementConst: number[], achievementContainer: IBlizzardAchievementsContainer): boolean[] => {
    const resultingArr: boolean[] = [];

    achievementConst.forEach((achievementID: number) => {
      resultingArr.push(achievementContainer.achievementsCompleted.includes(achievementID));
    });

    return resultingArr;
  };

  getRaidAchievements = (achievementContainer: IBlizzardAchievementsContainer): ICustomRaidAchievementObj => ({
    Legion: {
      aotc: this.extractRaidAchievements(LEGION_RAID_ACHIEVEMENTS[0], achievementContainer),
      ce: this.extractRaidAchievements(LEGION_RAID_ACHIEVEMENTS[1], achievementContainer),
      names: LEGION_RAID_NAMES,
    },
    BfA: {
      aotc: this.extractRaidAchievements(BFA_RAID_ACHIEVEMENTS[0], achievementContainer),
      ce: this.extractRaidAchievements(BFA_RAID_ACHIEVEMENTS[1], achievementContainer),
      names: BFA_RAID_NAMES,
    },
  });

  setRaidAchievements = () => {
    const legionTarget = <HTMLDivElement>document.getElementById('ci-raid-achv-legion');
    const bfaTarget = <HTMLDivElement>document.getElementById('ci-raid-achv-bfa');

    console.log(Object.entries(this.raidAchievements));

    Object.entries(this.raidAchievements).forEach(expansion => {
      const target = <HTMLDivElement>document.getElementById(`ci-raid-achv-${expansion[0].toLowerCase()}`);

      expansion[1].names.forEach(name => {
        target.insertAdjacentHTML('beforeend', `<div>${name}</div>`);
      });

      const achievementIDs = expansion[0] === "Legion" ? LEGION_RAID_ACHIEVEMENTS : BFA_RAID_ACHIEVEMENTS;
      target.insertAdjacentHTML('beforeend', this.returnRaidAchievementMarkup(achievementIDs, expansion[1]));
    });
  };

  returnRaidAchievementMarkup = (achievementIDs:number[][], container: ICustomRaidAchievementSubObj): string => {
    let markup: string = '';

    for (let i = 0; i < container.names.length; i += 1) {
      markup += `<div>
      <a href="https://wowhead.com/achievement=${achievementIDs[0][i]}" class="${container.aotc[i] ? 'success' : 'warning'}">AOTC</a>
      <a href="https://wowhead.com/achievement=${achievementIDs[1][i]}" class="${container.ce[i] ? 'success' : 'warning'}">CE</a>
      </div>`;
    }

    return markup;
  };

  extractReputationProgress = (achievementContainer: IBlizzardAchievementsContainer, factionArray: IConstFactionObj[]): (number | undefined)[] => {
    const reputationArr: (number | undefined)[] = [];

    factionArray.forEach(factionObj => {
      // if character has encountered faction, shove current reputation progress to reputationArr, else shove 0
      achievementContainer.criteria.includes(factionObj.id)
        ? reputationArr.push(achievementContainer.criteriaQuantity[achievementContainer.criteria.indexOf(factionObj.id)])
        : reputationArr.push(undefined);
    });

    return reputationArr;
  };

  getReputationProgress = (achievementContainer: IBlizzardAchievementsContainer): ICustomFactionProgressObj => ({
    Legion: this.extractReputationProgress(achievementContainer, LEGION_FACTIONS),
    BfA: this.extractReputationProgress(achievementContainer, BFA_FACTIONS),
  });

  convertReputationProgressToText = (reputation: number | undefined): object => {
    let standing = 'Faction not met';
    let progress = 0;

    if (typeof reputation === 'number') {
      standing = reputation < 3000 ? 'Neutral' : reputation < 9000 ? 'Friendly' : reputation < 21000 ? 'Honored' : reputation < 42000 ? 'Revered' : 'Exalted';
      progress = reputation < 3000 ? reputation : reputation < 9000 ? reputation - 3000 : reputation < 21000 ? reputation - 9000 : reputation < 42000 ? reputation - 21000 : 21000;
    }

    return {
      standing,
      className: `faction-${standing.replace(/ /g, '').toLowerCase()}`,
      progress,
    };
  };
}
