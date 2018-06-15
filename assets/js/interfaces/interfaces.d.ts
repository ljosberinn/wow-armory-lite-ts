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
  artifactTraits: IBlizzardItemArtifactTraitsArray;
  bonusLists: number[];
  context: string;
  displayInfoId: number;
  icon: string;
  id: number;
  itemLevel: number;
  name: string;
  quality: number;
  relics: IBlizzardItemArtifactRelicsArray;
  stats: IBlizzardItemStatsArray;
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

interface IBlizzardItemStatsArray {
  [key: number]: IBlizzardItemStatsObj;
}

interface IBlizzardItemStatsObj {
  stat: number;
  amount: number;
}

interface IBlizzardItemArtifactRelicsArray {
  [key: number]: IBlizzardItemArtifactRelicsObj;
}

interface IBlizzardItemArtifactRelicsObj {
  socket: number;
  itemId: number;
  context: number;
  bonusLists: number[];
}

interface IBlizzardItemArtifactTraitsArray {
  [key: number]: IBlizzardItemArtifactTraitsObj;
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
  itemName: string;
  itemID: number;
  bonusList: number[];
  armor: number;
  quality: number;
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
