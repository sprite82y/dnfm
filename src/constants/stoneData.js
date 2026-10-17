export const STONE_GRADES = {
  EPIC: '史诗',
  ARTIFACT: '神器',
  RARE: '稀有'
}

export const GRADE_CONFIG = {
  [STONE_GRADES.EPIC]: {
    entryCount: 4,
    crownRange: [0, 4]
  },
  [STONE_GRADES.ARTIFACT]: {
    entryCount: 3,
    crownRange: [0, 3]
  },
  [STONE_GRADES.RARE]: {
    entryCount: 2,
    crownRange: [0, 2]
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
