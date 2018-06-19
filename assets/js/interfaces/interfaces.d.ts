interface IClassInformationDetailObj {
  name: string;
  classColor: number[];
}

interface IClassInformationObj {
  [key: number]: IClassInformationDetailObj;
}

interface IRaceInformationObj {
  [key: number]: string;
}

interface IBlizzardTalentContainer {
  selected?: boolean;
  talents: object[];
  calcSpec: string;
  calcTalents: string;
  spec: IBlizzardTalentSpecContainer;
}

interface IBlizzardTalentSpecContainer {
  backgroundImage: string;
  description: string;
  icon: string;
  order: number;
  name: string;
  role: string;
}

interface ICustomTalentObj {
  specName: string;
  icon: string;
  role: string;
}

interface IBlizzardItemAppearanceObj {
  enchantDisplayInfoId: number;
  itemAppearanceModId: number;
  itemId: number;
  transmogItemAppearanceModId: number;
}

interface IBlizzardItemObj {
  appearance: IBlizzardItemAppearanceObj;
  armor: number;
  artifactAppearanceId: number;
  artifactId: number;
  artifactTraits: IBlizzardItemArtifactTraitsObj[];
  bonusLists: number[];
  context: string;
  displayInfoId: number;
  icon: string;
  id: number;
  itemLevel: number;
  name: string;
  quality: number;
  relics: IBlizzardItemArtifactRelicsObj[];
  stats: IBlizzardItemStatsObj[];
  tooltipParams: IBlizzardItemTooltipParamsObj;
  weaponInfo?: IBlizzardWeaponInfoObj;
}

interface IBlizzardWeaponInfoObj {
  damage: IBlizzardWeaponDamageObj;
  dps: number;
  weaponSpeed: number;
}

interface IBlizzardWeaponDamageObj {
  min: number;
  max: number;
  exactMin: number;
  exactMax: number;
}

interface IBlizzardItemTooltipParamsObj {
  gem0?: number;
  gem1?: number;
  gem2?: number;
  timewalkerLevel: number;
  transmogItem: number;
  set?: number[];
  enchant?: number;
}

interface IBlizzardItemStatsObj {
  stat: number;
  amount: number;
}

interface IBlizzardItemArtifactRelicsObj {
  socket: number;
  itemId: number;
  context: number;
  bonusLists: number[];
}

interface IBlizzardItemArtifactTraitsObj {
  id: number;
  rank: number;
}

interface IBlizzardItemsContainer {
  averageItemLevel: number;
  averageItemLevelEquipped: number;
  back: IBlizzardItemObj;
  chest: IBlizzardItemObj;
  shoulder: IBlizzardItemObj;
  tabard: IBlizzardItemObj;
  finger1: IBlizzardItemObj;
  finger2: IBlizzardItemObj;
  trinket1: IBlizzardItemObj;
  trinket2: IBlizzardItemObj;
  neck: IBlizzardItemObj;
  wrist: IBlizzardItemObj;
  hands: IBlizzardItemObj;
  waist: IBlizzardItemObj;
  legs: IBlizzardItemObj;
  feet: IBlizzardItemObj;
  mainHand: IBlizzardItemObj;
  offHand: IBlizzardItemObj;
}

interface ICustomItemInfoObj {
  itemLevel: number;
  enchant?: number;
  itemName?: string;
  itemID?: number;
  bonusLists: number[];
  armor?: number;
  quality?: number;
  gemID?: number;
}

interface ICustomItemObj {
  averageItemLevel: number;
  averageItemLevelEquipped: number;
  head?: ICustomItemInfoObj;
  neck?: ICustomItemInfoObj;
  shoulder?: ICustomItemInfoObj;
  back?: ICustomItemInfoObj;
  chest?: ICustomItemInfoObj;
  wrist?: ICustomItemInfoObj;
  hands?: ICustomItemInfoObj;
  waist?: ICustomItemInfoObj;
  legs?: ICustomItemInfoObj;
  feet?: ICustomItemInfoObj;
  finger1?: ICustomItemInfoObj;
  finger2?: ICustomItemInfoObj;
  trinket1?: ICustomItemInfoObj;
  trinket2?: ICustomItemInfoObj;
  mainHand?: ICustomItemInfoObj;
  offHand?: ICustomItemInfoObj;
  [key: string]: any;
}

interface IBlizzardAchievementsContainer {
  achievementsCompleted: number[];
  achievementsCompletedTimestamp: number[];
  criteria: number[];
  criteriaCreated: number[];
  criteriaQuantity: number[];
  criteriaTimestamp: number[];
}

interface ICustomMythicPlusAchievementObj {
  level: number | undefined;
  timestamp: number | undefined;
}

interface ICustomPvEAchievementObj {
  [key: string]: ICustomPvEAchievementSubObj;
}

interface ICustomPvEAchievementSubObj {
  aotc: boolean[];
  ce: boolean[];
  names: string[];
}

interface IConstFactionObj {
  name: string;
  id: number;
}

interface ICustomFactionProgressObj {
  [key: string]: (number | undefined)[];
}

interface IBlizzardAPIObject {
  achievementPoints: number;
  achievements: IBlizzardAchievementsContainer;
  battlegroup: string;
  calcClass: string;
  class: number;
  faction: number;
  gender: number;
  items: IBlizzardItemsContainer;
  lastModified: number;
  level: number;
  name: string;
  race: number;
  realm: string;
  statistics: IBlizzardStatisticsObj;
  talents: IBlizzardTalentContainer;
  thumbnail: string;
  totalHonorableKills: number;
}

interface IBlizzardStatisticsObj {
  id: number;
  name: string;
  subcategories: IBlizzardStatisticsSubCategories[];
}

interface IBlizzardStatisticsSubCategories {
  id: number;
  name: string;
  statistics: IBlizzardStatisticsSubcategoryStatistic[];
  subCategories: IBlizzardStatisticsSubcategorySubCategory[];
}

interface IBlizzardStatisticsSubcategoryStatistic {
  id: number;
  name: string;
  quantity: any;
  lastUpdated: any;
  money: boolean;
  highest: string;
}

interface IBlizzardStatisticsSubcategorySubCategory {
  id: number;
  name:
    | "Character"
    | "Combat"
    | "Kills"
    | "Deaths"
    | "Quests"
    | "Dungeons & Raids"
    | "Skills"
    | "Travel"
    | "Social"
    | "Player vs.Player"
    | "Pet Battles"
    | "Proving Grounds"
    | "Class Hall"
    | "Garrison";
  statistics: IBlizzardStatisticsSubcategorySubcategoryStatistics[];
}

interface IBlizzardStatisticsSubcategorySubcategoryStatistics {
  id: number;
  name: string;
  quantity: number;
  lastUpdated: any;
  money: boolean;
  highest: string;
}
