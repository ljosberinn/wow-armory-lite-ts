import rp from "request-promise";

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
  BFA_FACTIONS
} from "./constants";
import { KEY } from "./secrets";

const returnAPIURL = (character: string, region: string, realm: string): string =>
  `https://${region}.api.battle.net/wow/character/${realm}/${character}?fields=items,statistics,achievements,talents&locale=en_GB&apikey=${KEY}`;

const getWoWArmoryData = async (url: string): Promise<object> => await rp({ uri: url, json: true });

const getRaceInformation = (raceIndex: number): object => {
  const raceData: string = RACES[raceIndex];
  return {
    name: raceData,
    icon: `${raceData.toLowerCase().replace(/ /g, "")}.svg`
  };
};

const getClassInformation = (classIndex: number): object => {
  const classData: IClassInformationDetailObj = CLASSES[classIndex];
  return {
    name: classData.name,
    color: classData.classColor,
    icon: `${classData.name.toLowerCase().replace(/ /g, "")}.svg`
  };
};

const getSelectedTalents = (talentContainer: IBlizzardTalentContainer): ICustomTalentObj => {
  const result = {
    specName: "",
    icon: "",
    role: ""
  };

  Object.values(talentContainer).forEach((possibleSpec: IBlizzardTalentContainer) => {
    if (possibleSpec.selected) {
      result.specName = possibleSpec.spec.name;
      result.icon = `http://media.blizzard.com/wow/icons/56/${possibleSpec.spec.icon}`;
      result.role = possibleSpec.spec.role;
    }
  });

  return result;
};

const convertQualityToClass = (quality: number): string => `quality-${QUALITY_CLASSES[quality]}`;

const getEquippedItems = (itemsContainer: IBlizzardItemsContainer): ICustomItemObj => {
  const result = {
    averageItemLevelEquipped: itemsContainer.averageItemLevelEquipped,
    averageItemLevel: itemsContainer.averageItemLevel
  };

  const ObjValues = Object.values(itemsContainer);

  ObjValues.forEach((subInfo: IBlizzardItemObj) => {
    if (typeof subInfo === "object") {
      let tempObj: ICustomItemInfoObj;

      tempObj = {
        itemID: subInfo.itemLevel,
        itemLevel: subInfo.itemLevel,
        itemName: subInfo.name,
        bonusList: subInfo.bonusLists,
        armor: subInfo.armor,
        quality: subInfo.quality
      };

      // check for gem
      if (tempObj.bonusList.includes(1808)) {
        tempObj.gemID = subInfo.tooltipParams.gem0;
      }

      // check whether this item is enchantable
      if (ENCHANTABLES.includes(Object.keys(itemsContainer)[ObjValues.indexOf(subInfo)])) {
        tempObj.enchant = subInfo.tooltipParams.enchant;
      }

      Object.assign(tempObj, result);
    }
  });

  return result;
};

const getHighestMythicPlusAchievement = (achievementContainer: IBlizzardAchievementsContainer): ICustomMythicPlusAchievementObj => {
  let highestMythicPlusAchievement = undefined;
  let timestamp = undefined;

  MYTHIC_PLUS_ACHIEVEMENTS.forEach(achievementID => {
    if (achievementContainer.achievementsCompleted.includes(achievementID)) {
      highestMythicPlusAchievement = MYTHIC_PLUS_ACHIEVEMENT_LEVELS[MYTHIC_PLUS_ACHIEVEMENTS.indexOf(achievementID)];
      timestamp = achievementContainer.achievementsCompletedTimestamp[achievementContainer.achievementsCompleted.indexOf(achievementID)];
    }
  });

  return { level: highestMythicPlusAchievement, timestamp: timestamp };
};

const extractRaidAchievements = (achievementConst: number[], achievementContainer: IBlizzardAchievementsContainer): boolean[] => {
  let resultingArr: boolean[];
  resultingArr = [];

  achievementConst.forEach((achievementID: number) => {
    resultingArr.push(achievementContainer.achievementsCompleted.includes(achievementID));
  });

  return resultingArr;
};

const getPvERaidAchievements = (achievementContainer: IBlizzardAchievementsContainer): ICustomPvEAchievementObj => {
  return {
    Legion: {
      aotc: extractRaidAchievements(LEGION_RAID_ACHIEVEMENTS[0], achievementContainer),
      ce: extractRaidAchievements(LEGION_RAID_ACHIEVEMENTS[1], achievementContainer),
      names: LEGION_RAID_NAMES
    },
    BfA: {
      aotc: extractRaidAchievements(BFA_RAID_ACHIEVEMENTS[0], achievementContainer),
      ce: extractRaidAchievements(BFA_RAID_ACHIEVEMENTS[1], achievementContainer),
      names: BFA_RAID_NAMES
    }
  };
};

const extractReputationProgress = (achievementContainer: IBlizzardAchievementsContainer, factionArray: IConstFactionObj[]): (number | undefined)[] => {
  let reputationArr: (number | undefined)[];
  reputationArr = [];

  factionArray.forEach(factionObj => {
    // if character has encountered faction, shove current reputation progress to reputationArr, else shove 0
    achievementContainer.criteria.includes(factionObj.id)
      ? reputationArr.push(achievementContainer.criteriaQuantity[achievementContainer.criteria.indexOf(factionObj.id)])
      : reputationArr.push(undefined);
  });

  return reputationArr;
};

const getReputationProgress = (achievementContainer: IBlizzardAchievementsContainer): ICustomFactionProgressObj => {
  return {
    Legion: extractReputationProgress(achievementContainer, LEGION_FACTIONS),
    BfA: extractReputationProgress(achievementContainer, BFA_FACTIONS)
  };
};

const convertReputationProgressToText = (reputation: number | undefined): object => {
  let standing: string;
  let progress: number;

  standing = "Faction not met";
  progress = 0;

  if (typeof reputation === "number") {
    standing = reputation < 3000 ? "Neutral" : reputation < 9000 ? "Friendly" : reputation < 21000 ? "Honored" : reputation < 42000 ? "Revered" : "Exalted";
    progress = reputation < 3000 ? reputation : reputation < 9000 ? reputation - 3000 : reputation < 21000 ? reputation - 9000 : reputation < 42000 ? reputation - 21000 : 21000;
  }

  return {
    standing: standing,
    className: `faction-${standing.replace(/ /g, "").toLowerCase()}`,
    progress: progress
  };
};
