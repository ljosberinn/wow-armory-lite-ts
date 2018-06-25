import {
  RACES,
  CLASSES,
  ENCHANTABLES,
  QUALITY_CLASSES,
  MYTHIC_PLUS_ACHIEVEMENT_LEVELS,
  MYTHIC_PLUS_ACHIEVEMENTS,
  LEGION_RAID_ACHIEVEMENTS,
  LEGION_RAID_NAMES,
  LEGION_RAID_IDS,
  BFA_RAID_ACHIEVEMENTS,
  BFA_RAID_NAMES,
  BFA_RAID_IDS,
  LEGION_FACTIONS,
  BFA_FACTIONS,
  REGIONS
} from "./constants";
import { API } from "./secrets";
import { initialize } from "./visuals";

const returnURL = {
  Blizzard: (character: string, region: string, realm: string): string =>
    `https://${region}.api.battle.net/wow/character/${realm}/${character}?fields=items,statistics,achievements,talents&locale=en_GB&apikey=${API.Blizzard}`,
  Warcraftlogs: (character: string, region: string, realm: string): string[] => {
    let zoneURLs: string[];
    zoneURLs = [];

    LEGION_RAID_IDS.forEach(id => {
      zoneURLs.push(`https://www.warcraftlogs.com:443/v1/parses/character/${character}/${realm}/${region}?zone=${id}&api_key=${API.Warcraftlogs}`);
    });

    return zoneURLs;
  },
  RaiderIO: (character: string, region: string, realm: string): string => `http://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${character}&fields=mythic_plus_scores`
};

const getURLData = async (url: string): Promise<object> =>
  await fetch(url).then(response => {
    return response.json();
  });

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
      result.icon = `http://media.blizzard.com/wow/icons/56/${possibleSpec.spec.icon}.jpg`;
      result.role = possibleSpec.spec.role;
    }
  });

  return result;
};

const convertQualityToClass = (quality: number): string => `quality-${QUALITY_CLASSES[quality]}`;

const getEquippedItems = (items: IBlizzardItemsContainer): ICustomItemObj => {
  const result: ICustomItemObj = {
    averageItemLevel: 0,
    averageItemLevelEquipped: 0
  };

  const [ObjKeys, ObjValues] = [Object.keys(items), Object.values(items)];

  ObjKeys.forEach(resultProperty => {
    const currentValue: IBlizzardItemObj = ObjValues[ObjKeys.indexOf(resultProperty)];

    if (["averageItemLevel", "averageItemLevelEquipped"].includes(resultProperty)) {
      result[resultProperty] = currentValue;
    } else {
      let tempObj: ICustomItemInfoObj = {
        itemID: currentValue.itemLevel,
        itemLevel: currentValue.itemLevel,
        itemName: currentValue.name,
        bonusLists: currentValue.bonusLists,
        armor: currentValue.armor,
        quality: currentValue.quality
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

const prettyPrintSeconds = (s: number) => {
  s <= 1 ? "just now" : void 0;

  s <= 90 ? `${s} seconds` : void 0;

  let m = Math.floor(s / 60);
  if (m <= 90) {
    let result = `${m} minute`;

    m !== 1 ? (result += "s") : void 0;
    s = Math.round((s / 60 - m) * 60);
    s > 0 ? (result += `, ${s} second`) : void 0;
    s > 1 ? (result += "s") : void 0;

    return result;
  }

  let h = Math.floor(m / 60);
  m = m % 60;

  if (h <= 36) {
    let result = `${h} hour`;

    h !== 1 ? (result += "s") : void 0;
    result += `, ${m} minute`;
    m !== 1 ? (result += "s") : void 0;

    return result;
  }

  let d = Math.floor(h / 24);
  h = h % 24;

  let result = `${d} day`;
  d !== 1 ? (result += "s") : void 0;
  result += `, ${h} hour`;
  h !== 1 ? (result += "s") : void 0;

  return result;
};

const getHighestMythicPlusAchievement = (achievementContainer: IBlizzardAchievementsContainer): ICustomMythicPlusAchievementObj => {
  let highestMythicPlusAchievement = undefined;
  let timestamp: number | undefined = undefined;

  MYTHIC_PLUS_ACHIEVEMENTS.forEach(achievementID => {
    if (achievementContainer.achievementsCompleted.includes(achievementID)) {
      highestMythicPlusAchievement = MYTHIC_PLUS_ACHIEVEMENT_LEVELS[MYTHIC_PLUS_ACHIEVEMENTS.indexOf(achievementID)];
      timestamp = achievementContainer.achievementsCompletedTimestamp[achievementContainer.achievementsCompleted.indexOf(achievementID)];
    }
  });

  return { level: highestMythicPlusAchievement, timestamp: timestamp, age: `${prettyPrintSeconds((Date.now() - timestamp) / 1000)} ago` };
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

const validateRegion = (region: string) => REGIONS.includes(region);

const returnBlizzardAvatar = (BlizzardAPIData: IBlizzardAPIObject, region: string) => `https://render-${region}.worldofwarcraft.com/character/${BlizzardAPIData.thumbnail}`;

const splitWarcraftlogsByDifficulty = (response: IWarcraftlogsAPIObject[]): ICustomWarcraftlogsObject => {
  const responseJSON = {
    lfr: [],
    normal: [],
    heroic: [],
    mythic: []
  };

  response.forEach(logData => {
    const diff = logData.difficulty;
    const cleanedUpLog = cleanUpLogData(logData);

    diff === 5
      ? responseJSON.mythic.push(cleanedUpLog)
      : diff === 4 ? responseJSON.heroic.push(cleanedUpLog) : diff === 3 ? responseJSON.normal.push(cleanedUpLog) : diff === 1 ? responseJSON.lfr.push(cleanedUpLog) : void 0;
  });

  return responseJSON;
};

const cleanUpLogDataSpec = (specs: IWarcraftlogsAPISpecs[]) => {
  let arr: IWarcraftlogsAPICleanSpec[];
  arr = [];

  specs.forEach(originalLogSpec => {
    arr.push({
      best_allstar_points: originalLogSpec.best_allstar_points,
      best_duration: originalLogSpec.best_duration,
      best_historical_percent: originalLogSpec.best_historical_percent,
      best_talents: originalLogSpec.best_talents,
      killCount: originalLogSpec.historical_total,
      historical_avg: originalLogSpec.historical_avg,
      historical_median: originalLogSpec.historical_median,
      spec: originalLogSpec.spec
    });
  });

  return arr;
};
const cleanUpLogData = (logData: IWarcraftlogsAPIObject): IWarcraftlogsAPICleanObject => {
  return {
    kill: logData.kill,
    name: logData.name,
    size: logData.size,
    specs: cleanUpLogDataSpec(logData.specs)
  };
};

initialize();

(async () => {
  const URLS = returnURL.Warcraftlogs("Shakib", "US", "Turalyon");

  URLS.forEach(async url => {
    const data = await getURLData(url);

    console.log(splitWarcraftlogsByDifficulty(data));
  });
})();
