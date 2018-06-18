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
    name: "Warrior",
    classColor: [199, 156, 110]
  },
  2: {
    name: "Paladin",
    classColor: [245, 140, 186]
  },
  3: {
    name: "Hunter",
    classColor: [102, 160, 77]
  },
  4: {
    name: "Rogue",
    classColor: [255, 245, 105]
  },
  5: {
    name: "Priest",
    classColor: [255, 255, 255]
  },
  6: {
    name: "Death Knight",
    classColor: [196, 31, 59]
  },
  7: {
    name: "Shaman",
    classColor: [196, 31, 59]
  },
  8: {
    name: "Mage",
    classColor: [0, 112, 222]
  },
  9: {
    name: "Warlock",
    classColor: [148, 130, 201]
  },
  10: {
    name: "Druid",
    classColor: [255, 125, 10]
  },
  11: {
    name: "Demon Hunter",
    classColor: [163, 48, 201]
  }
};

export const ENCHANTABLES = ["hands", "finger2", "finger2", "mainHand", "offHand"];
export const QUALITY_CLASSES = ["poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom"];

export const MYTHIC_PLUS_ACHIEVEMENT_LEVELS = [2, 5, 10, 15];
export const MYTHIC_PLUS_ACHIEVEMENTS = [11183, 11184, 11185, 11162];

const LEGION_AOTC_ACHIEVEMENTS = [11194, 11581, 11195, 11874, 12110];
const LEGION_CE_ACHIEVEMENTS = [11191, 11580, 11192, 11875, 12111];
export const LEGION_RAID_NAMES = ["Emerald Nightmare", "Trial of Valor", "The Nighthold", "Tomb of Sargeras", "Antorus, the Burning Throne"];

export const LEGION_RAID_ACHIEVEMENTS = [LEGION_AOTC_ACHIEVEMENTS, LEGION_CE_ACHIEVEMENTS];

// add achievement IDs and names for later raids here
const BFA_AOTC_ACHIEVEMENTS = [125360];
const BFA_CE_ACHIEVEMENTS = [12535];
export const BFA_RAID_NAMES = ["Uldir"];

export const BFA_RAID_ACHIEVEMENTS = [BFA_AOTC_ACHIEVEMENTS, BFA_CE_ACHIEVEMENTS];

var test = [{ name: "Emerald Nightmare", aotc: 11194, ce: 11191 }, { name: "Trial of Valor", aotc: 11581, ce: 11580 }];

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

export const BFA_FACTIONS: IConstFactionObj[] = [
  { name: "", id: 0 },
  { name: "", id: 0 },
  { name: "", id: 0 },
  { name: "", id: 0 },
  { name: "", id: 0 },
  { name: "", id: 0 }
];
