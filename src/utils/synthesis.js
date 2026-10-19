import { GRADE_CONFIG, CROSS_GRADE_PROBABILITIES } from '../constants/stoneData'

export const generateEntries = (grade, crownCount) => {
  const config = GRADE_CONFIG[grade]
  const entries = []
  
  for (let i = 0; i < config.entryCount; i++) {
    entries.push({
      id: `${grade}-${i}`,
      isCrown: i < crownCount,
      grade: grade
    })
  }
  
  return entries
}

export const synthesize = (stoneA, stoneB) => {
  const gradeA = stoneA.grade
  const gradeB = stoneB.grade
  const entriesA = generateEntries(gradeA, stoneA.crownCount)
  const entriesB = generateEntries(gradeB, stoneB.crownCount)
  
  const allEntries = [
    ...entriesA.map(e => ({ ...e, source: 'A' })),
    ...entriesB.map(e => ({ ...e, source: 'B' }))
  ]
  
  const n = GRADE_CONFIG[gradeA].entryCount
  const result = []
  const remainingEntries = [...allEntries]
  
  const probabilityKey = `${gradeA}+${gradeB}`
  const crossProbabilities = CROSS_GRADE_PROBABILITIES[probabilityKey]
  
  for (let i = 0; i < n; i++) {
    let weights
    if (gradeA === gradeB || !crossProbabilities) {
      // 同品级，或缺少跨品级概率配置时，退化为等概率，避免读 undefined 报错
      weights = remainingEntries.map(() => 1)
    } else {
      weights = remainingEntries.map(entry => crossProbabilities[entry.grade] ?? 1)
    }
    
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    const normalizedWeights = weights.map(w => w / totalWeight)
    
    const random = Math.random()
    let cumulative = 0
    let selectedIndex = 0
    
    for (let j = 0; j < normalizedWeights.length; j++) {
      cumulative += normalizedWeights[j]
      if (random <= cumulative) {
        selectedIndex = j
        break
      }
    }
    
    const selectedEntry = remainingEntries.splice(selectedIndex, 1)[0]
    result.push(selectedEntry)
  }
  
  return {
    grade: gradeA,
    entries: result.map((e, index) => ({
      id: `result-${index}`,
      isCrown: e.isCrown,
      source: e.source
    }))
  }
}
