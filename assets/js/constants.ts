export const RACES: IRaceInformationObj = {
  1: "Human",
  2: "Orc",
  3: "Dwarf",
  4: "Night Elf",
  5: "Undead",
  6: "Tauren",
  7: "Gnome",
  8: "Troll",
  9: "Goblin",
  10: "Blood Elf",
  11: "Draenei",
  22: "Worgen",
  24: "Pandaren",
  25: "Pandaren",
  26: "Pandaren"
};

export const CLASSES: IClassInformationObj = {
  1: {
    name: "Warrior"
  },
  2: {
    name: "Paladin"
  },
  3: {
    name: "Hunter"
  },
  4: {
    name: "Rogue"
  },
  5: {
    name: "Priest"
  },
  6: {
    name: "Death Knight"
  },
  7: {
    name: "Shaman"
  },
  8: {
    name: "Mage"
  },
  9: {
    name: "Warlock"
  },
  10: {
    name: "Monk"
  },
  11: {
    name: "Druid"
  },
  12: {
    name: "Demon Hunter"
  }
};

export const ENCHANTABLES: string[] = ["hands", "finger1", "finger2", "mainHand", "offHand"];
export const QUALITY_CLASSES: string[] = ["poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom"];

export const MYTHIC_PLUS_ACHIEVEMENT_LEVELS: number[] = [2, 5, 10, 15];
export const MYTHIC_PLUS_ACHIEVEMENTS: number[] = [11183, 11184, 11185, 11162];

const LEGION_AOTC_ACHIEVEMENTS: number[] = [11194, 11581, 11195, 11874, 12110];
const LEGION_CE_ACHIEVEMENTS: number[] = [11191, 11580, 11192, 11875, 12111];
export const LEGION_RAID_NAMES: string[] = ["Emerald Nightmare", "Trial of Valor", "The Nighthold", "Tomb of Sargeras", "Antorus, the Burning Throne"];

export const LEGION_RAID_ACHIEVEMENTS: number[][] = [LEGION_AOTC_ACHIEVEMENTS, LEGION_CE_ACHIEVEMENTS];

// add achievement IDs and names for later raids here
const BFA_AOTC_ACHIEVEMENTS: number[] = [125360];
const BFA_CE_ACHIEVEMENTS: number[] = [12535];
export const BFA_RAID_NAMES: string[] = ["Uldir"];

export const BFA_RAID_ACHIEVEMENTS: number[][] = [BFA_AOTC_ACHIEVEMENTS, BFA_CE_ACHIEVEMENTS];

export const LEGION_FACTIONS: IConstFactionObj[] = [
  { name: "Highmountain Tribe", id: 30497 },
  { name: "Dreamweavers", id: 30500 },
  { name: "The Nightfallen", id: 30499 },
  { name: "Court of Farondis", id: 30501 },
  { name: "The Wardens", id: 30498 },
  { name: "Armies of Legionfall", id: 35977 },
  { name: "Argussian Reach", id: 0 },
  { name: "Army of the Light", id: 0 },
  { name: "Valarjar", id: 30501 }
];

export const BFA_FACTIONS: IConstFactionObj[] = [{ name: "", id: 0 }, { name: "", id: 0 }, { name: "", id: 0 }, { name: "", id: 0 }, { name: "", id: 0 }, { name: "", id: 0 }];

export const REGIONS: string[] = ["EU", "US"];
