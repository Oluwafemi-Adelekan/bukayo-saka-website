import {trophy} from './trophy'
import {beyondThePitchSlide} from './beyondThePitchSlide'
import {careerChapter} from './careerChapter'
import {careerMilestone} from './careerMilestone'
import {siteSettings} from './siteSettings'

export const schemaTypes = [
  // Singleton
  siteSettings,
  // Lists
  careerMilestone,
  careerChapter,
  trophy,
  beyondThePitchSlide,
]
