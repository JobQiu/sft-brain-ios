export interface LevelInfo {
  level: number
  title: string
  currentXP: number
  nextLevelXP: number
  progress: number
}

// XP calculation rules
const XP_PER_QA_ADDED = 10
const XP_PER_REVIEW = 5
const XP_PER_CORRECT_REVIEW = 3 // Bonus for correct answer

// Level titles
const LEVEL_TITLES = [
  "Beginner",
  "Learner",
  "Student",
  "Scholar",
  "Expert",
  "Master",
  "Guru",
  "Sage",
  "Legend",
  "Grand Master",
]

/**
 * Calculate XP required for a specific level
 * Formula: level * 100 (exponential growth)
 */
export function getXPForLevel(level: number): number {
  return level * 100
}

/**
 * Calculate total XP from QA statistics
 */
export function calculateTotalXP(qaCount: number, totalReviews: number, correctReviews: number): number {
  const qaXP = qaCount * XP_PER_QA_ADDED
  const reviewXP = totalReviews * XP_PER_REVIEW
  const correctXP = correctReviews * XP_PER_CORRECT_REVIEW

  return qaXP + reviewXP + correctXP
}

/**
 * Get level information from total XP
 */
export function getLevelInfo(totalXP: number): LevelInfo {
  let level = 1
  let xpForCurrentLevel = 0

  // Find current level
  while (totalXP >= xpForCurrentLevel + getXPForLevel(level)) {
    xpForCurrentLevel += getXPForLevel(level)
    level++
  }

  const currentXP = totalXP - xpForCurrentLevel
  const nextLevelXP = getXPForLevel(level)
  const progress = (currentXP / nextLevelXP) * 100

  const titleIndex = Math.min(Math.floor((level - 1) / 5), LEVEL_TITLES.length - 1)
  const title = LEVEL_TITLES[titleIndex]

  return {
    level,
    title,
    currentXP,
    nextLevelXP,
    progress,
  }
}

/**
 * Calculate level information from QA count and correct reviews
 * Convenience wrapper around calculateTotalXP and getLevelInfo
 */
export function calculateLevel(qaCount: number, correctReviews: number): LevelInfo {
  // Assume totalReviews equals correctReviews for simplicity
  // In a more complex system, you'd pass totalReviews separately
  const totalXP = calculateTotalXP(qaCount, correctReviews, correctReviews)
  return getLevelInfo(totalXP)
}