import rp from "request-promise";
import { RACES, CLASSES, ENCHANTABLES, QUALITY_CLASSES, MYTHIC_PLUS_ACHIEVEMENT_LEVELS, MYTHIC_PLUS_ACHIEVEMENTS } from "./constants";
import { KEY } from "./secrets";

const returnAPIURL = (character: string, region: string, realm: string): string =>
  `https://${region}.api.battle.net/wow/character/${realm}/${character}?fields=items,statistics,achievements,talents&locale=en_GB&apikey=${KEY}`;

const getWoWArmoryData = async (url: string): Promise<object> => await rp({ uri: url, json: true });

const getRaceInformation = (raceIndex: number): object => {
  const raceData: string = RACES[raceIndex];
  return {
    name: raceData,
    icon: `${raceData.toLowerCase().replace(/s+/g, "")}.svg`
  };
};

const getClassInformation = (classIndex: number): object => {
  const classData: IClassInformationDetailObj = CLASSES[classIndex];
  return {
    name: classData.name,
    color: classData.classColor,
    icon: `${classData.name.toLowerCase().replace(/s+/g, "")}.svg`
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
  const ObjKeys = Object.keys(itemsContainer);

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
      if (ENCHANTABLES.includes(ObjKeys[ObjValues.indexOf(subInfo)])) {
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
