export const STONE_GRADES = {
  EPIC: '史诗',
  ARTIFACT: '神器',
  RARE: '稀有'
}

// entryCount 决定该品级源石有几条词条；皇冠词条数范围即 0~entryCount，
// 由 StoneConfigPanel 依据 entryCount 生成，故不再单独维护 crownRange。
export const GRADE_CONFIG = {
  [STONE_GRADES.EPIC]: {
    entryCount: 4
  },
  [STONE_GRADES.ARTIFACT]: {
    entryCount: 3
  },
  [STONE_GRADES.RARE]: {
    entryCount: 2
  }
}

export const CROSS_GRADE_PROBABILITIES = {
  '史诗+神器': {
    '史诗': 20.22,
    '神器': 6.37
  },
  '神器+史诗': {
    '史诗': 20.22,
    '神器': 6.37
  },
  '史诗+稀有': {
    '史诗': 22.89,
    '稀有': 4.21
  },
  '稀有+史诗': {
    '史诗': 22.89,
    '稀有': 4.21
  },
  '神器+稀有': {
    '神器': 23.57,
    '稀有': 14.64
  },
  '稀有+神器': {
    '神器': 23.57,
    '稀有': 14.64
  }
}

// 页面上「合成概率规则」的展示顺序与文案。
// 数值全部取自 CROSS_GRADE_PROBABILITIES，避免模板里再手写一遍。
const CROSS_GRADE_DISPLAY_ORDER = [
  ['史诗', '神器'],
  ['史诗', '稀有'],
  ['神器', '稀有']
]

/**
 * 生成"不同品级合成"的说明文案，例如：
 * [{ key: '史诗+神器', text: '史诗+神器：史诗词条 20.22%，神器词条 6.37%' }]
 */
export const crossGradeProbabilityTexts = () => {
  return CROSS_GRADE_DISPLAY_ORDER.map(([gradeA, gradeB]) => {
    const key = `${gradeA}+${gradeB}`
    const probs = CROSS_GRADE_PROBABILITIES[key]
    const parts = Object.entries(probs).map(([grade, value]) => `${grade}词条 ${value}%`)
    return { key, text: `${key}：${parts.join('，')}` }
  })
}
