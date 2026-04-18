import type { SpeciesData, CareerData, BackgroundData, SkillData, WeaponData, ArmorData } from './types'

import humanJson from '../data/species/human.json'
import elfJson from '../data/species/elf.json'
import dwarfJson from '../data/species/dwarf.json'

import warriorJson from '../data/careers/warrior.json'
import clericJson from '../data/careers/cleric.json'
import thiefJson from '../data/careers/thief.json'
import hunterJson from '../data/careers/hunter.json'
import sorcererJson from '../data/careers/sorcerer.json'
import merchantJson from '../data/careers/merchant.json'
import nobleJson from '../data/careers/noble.json'

import backgroundsJson from '../data/backgrounds.json'
import skillsJson from '../data/skills.json'
import weaponsJson from '../data/equipment/weapons.json'
import armorJson from '../data/equipment/armor.json'

const speciesMap: Record<string, SpeciesData> = {
  human: humanJson as SpeciesData,
  elf: elfJson as SpeciesData,
  dwarf: dwarfJson as SpeciesData,
}

const careersMap: Record<string, CareerData> = {
  warrior: warriorJson as CareerData,
  cleric: clericJson as CareerData,
  thief: thiefJson as CareerData,
  hunter: hunterJson as CareerData,
  sorcerer: sorcererJson as CareerData,
  merchant: merchantJson as CareerData,
  noble: nobleJson as CareerData,
}

const backgroundsData = backgroundsJson as { backgrounds: BackgroundData[] }
const skillsData = skillsJson as { skills: Record<string, SkillData> }
const weaponsData = weaponsJson as { weapons: WeaponData[] }
const armorData = armorJson as { armor: ArmorData[] }

export function loadSpecies(speciesId: string): SpeciesData {
  return speciesMap[speciesId] || speciesMap.human
}

export function loadCareer(careerId: string): CareerData {
  return careersMap[careerId]
}

export function getAllSpecies(): SpeciesData[] {
  return Object.values(speciesMap)
}

export function getAllCareers(): CareerData[] {
  return Object.values(careersMap)
}

export function getBackgrounds(): BackgroundData[] {
  return backgroundsData.backgrounds
}

export function getSkills(): Record<string, SkillData> {
  return skillsData.skills
}

export function getWeapons(): WeaponData[] {
  return weaponsData.weapons
}

export function getArmor(): ArmorData[] {
  return armorData.armor
}
