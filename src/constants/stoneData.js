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

// 所有品级里最多的词条数。合成结果的皇冠档位（0 ~ MAX_ENTRY_COUNT）
// 与统计卡片的行数都由它派生，新增品级时无需再改页面。
export const MAX_ENTRY_COUNT = Math.max(
  ...Object.values(GRADE_CONFIG).map(config => config.entryCount)
)

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
 * 生成"不同品级合成"的说明文案。
 *
 * 注意：CROSS_GRADE_PROBABILITIES 里的数值是**逐条抽取权重**，不是最终概率。
 * 抽取时按"剩余词条数 × 该品级权重"加权，抽走即不放回，越到后面比例变化越大。
 * 例如史诗(4条,权重20.22) + 神器(3条,权重6.37) 的首抽概率是 80.89%，
 * 而不是 20.22%。这里统一表述为"权重"，避免读者误解为成品概率。
 *
 * @returns {{key: string, text: string}[]}
 */
export const crossGradeProbabilityTexts = () => {
  return CROSS_GRADE_DISPLAY_ORDER.map(([gradeA, gradeB]) => {
    const key = `${gradeA}+${gradeB}`
    const probs = CROSS_GRADE_PROBABILITIES[key]
    const parts = Object.entries(probs).map(([grade, value]) => `${grade}词条权重 ${value}`)
    return { key, text: `${key}：${parts.join('，')}` }
  })
}

/**
 * 计算指定组合的"首次抽取"实际概率，用于页面补充说明。
 * 首抽概率 = A 的剩余权重 / 总权重，其中 剩余权重 = 词条数 × 权重。
 */
export const firstDrawProbabilities = (gradeA, gradeB) => {
  const probs = CROSS_GRADE_PROBABILITIES[`${gradeA}+${gradeB}`]
  if (!probs) return null
  const weights = Object.entries(probs).map(([grade, weight]) => ({
    grade,
    weight,
    count: GRADE_CONFIG[grade].entryCount
  }))
  const total = weights.reduce((sum, w) => sum + w.count * w.weight, 0)
  return weights.map(w => ({
    grade: w.grade,
    probability: (w.count * w.weight) / total * 100
  }))
}
