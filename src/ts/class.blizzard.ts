import { returnURL, getURLData, prettyPrintSeconds, validateRegion, switchTabToCharacter, normalize } from './helperFunctions';
import {
  RACES,
  CLASSES,
  ENCHANTABLES,
  QUALITY_CLASSES,
  MYTHIC_PLUS_ACHIEVEMENTS,
  MYTHIC_PLUS_ACHIEVEMENT_LEVELS,
  BFA_RAID_ACHIEVEMENTS,
  LEGION_RAID_ACHIEVEMENTS,
  LEGION_RAID_NAMES,
  BFA_RAID_NAMES,
  LEGION_FACTIONS,
  BFA_FACTIONS,
} from './constants';

export class BlizzardAPI {


  private data!: IBlizzardAPIObject;
  private character: string;
  private region: string;
  private realm: string;

  private classInformation!: IClassInformationDetailObj;
  private raceInformation!: {name: string, icon:string};
  private selectedRole!: {specName: string, icon: string, role: string};




  constructor(character: string, region: string, realm: string) {
    this.character = normalize.lowerCaseCapitalization(character);

    if (validateRegion(region)) {
      this.region = normalize.upperCase(region);
    } else {
      this.region = '';
    }

    this.realm = normalize.lowerCaseCapitalization(realm);

    this.getData();
  }

  getData = () => (async () => {
    this.data = <IBlizzardAPIObject>await getURLData(returnURL.Blizzard(this.character, this.region, this.realm));
    this.executeBlizzardAPI();
  })();




  executeBlizzardAPI = () => {
    this.classInformation = this.getClassInformation(this.data.class);
    this.raceInformation = this.getRaceInformation(this.data.race);
    this.selectedRole = this.getSelectedTalents(this.data.talents);

    const avatarLink = this.returnCharacterAvatar(this.region);

    this.setSplash(avatarLink.replace('avatar', 'main'));
    this.setAvatar(avatarLink);
    this.setSpecLogo();
    this.setCharacterPath();
    this.setRaceClass();
  }

  returnCharacterAvatar = (region: string) => `https://render-${region}.worldofwarcraft.com/character/${this.data.thumbnail}`;

  setSplash = (url: string) => {
    const imgEl = <HTMLImageElement>document.getElementById('character-splash');
    imgEl.src = url;
    imgEl.onload = () => switchTabToCharacter();
  };

  setAvatar = (url: string) => ((<HTMLImageElement>document.getElementById('avatar')).src = url);

  setSpecLogo = () => ((<HTMLImageElement>document.getElementById('spec-logo')).src = this.selectedRole.icon);

  setCharacterPath = () => (<HTMLParagraphElement>document.getElementById('character-path')).innerText = `${this.character} @ ${this.region}–${this.realm}`;

  setRaceClass = () => (<HTMLParagraphElement>document.getElementById('race-class')).innerText = `${this.raceInformation.name} ${this.selectedRole.specName} ${this.classInformation.name}`;

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

  convertQualityToClass = (quality: number): string => `quality-${QUALITY_CLASSES[quality]}`;

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
          itemID: currentValue.itemLevel,
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

  getHighestMythicPlusAchievement = (achievementContainer: IBlizzardAchievementsContainer): ICustomMythicPlusAchievementObj => {
    let highestMythicPlusAchievement;
    let timestamp: number = Date.now();

    MYTHIC_PLUS_ACHIEVEMENTS.forEach(achievementID => {
      if (achievementContainer.achievementsCompleted.includes(achievementID)) {
        highestMythicPlusAchievement = MYTHIC_PLUS_ACHIEVEMENT_LEVELS[MYTHIC_PLUS_ACHIEVEMENTS.indexOf(achievementID)];
        timestamp = achievementContainer.achievementsCompletedTimestamp[achievementContainer.achievementsCompleted.indexOf(achievementID)];
      }
    });

    return { level: highestMythicPlusAchievement, timestamp, age: `${prettyPrintSeconds((Date.now() - timestamp!) / 1000)} ago` };
  };

  extractRaidAchievements = (achievementConst: number[], achievementContainer: IBlizzardAchievementsContainer): boolean[] => {
    const resultingArr: boolean[] = [];

    achievementConst.forEach((achievementID: number) => {
      resultingArr.push(achievementContainer.achievementsCompleted.includes(achievementID));
    });

    return resultingArr;
  };

  getPvERaidAchievements = (achievementContainer: IBlizzardAchievementsContainer): ICustomPvEAchievementObj => ({
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


  //returnCharacterSplash = (region: string) => `https://render-${region}.worldofwarcraft.com/character/${this.data.thumbnail.replace('avatar', 'main')}`;


}
