// 增幅模拟器的游戏数值与规则。
// 这些数值对应 DNF 手游游戏内真实概率与消耗，重构时不要"修正"或取整。

// 每一级增幅的规则。level 表示"目标等级"，即从 level-1 强化到 level 时的参数。
export const AMPLIFY_RULES = [
  { level: 1, rate: 100, weaponContradiction: 35, nonWeaponContradiction: 26, luckyCharm: 0 },
  { level: 2, rate: 100, weaponContradiction: 53, nonWeaponContradiction: 39, luckyCharm: 0 },
  { level: 3, rate: 100, weaponContradiction: 73, nonWeaponContradiction: 54, luckyCharm: 0 },
  { level: 4, rate: 100, weaponContradiction: 97, nonWeaponContradiction: 72, luckyCharm: 0 },
  { level: 5, rate: 80, weaponContradiction: 126, nonWeaponContradiction: 94, luckyCharm: 1 },
  { level: 6, rate: 70, weaponContradiction: 164, nonWeaponContradiction: 123, luckyCharm: 1 },
  { level: 7, rate: 60, weaponContradiction: 203, nonWeaponContradiction: 152, luckyCharm: 1 },
  { level: 8, rate: 70, weaponContradiction: 280, nonWeaponContradiction: 210, luckyCharm: 1 },
  { level: 9, rate: 60, weaponContradiction: 357, nonWeaponContradiction: 267, luckyCharm: 1 },
  { level: 10, rate: 50, weaponContradiction: 472, nonWeaponContradiction: 354, luckyCharm: 1 },
  { level: 11, rate: 40, weaponContradiction: 587, nonWeaponContradiction: 440, luckyCharm: 2 },
  { level: 12, rate: 30, weaponContradiction: 646, nonWeaponContradiction: 484, luckyCharm: 2 }
]

export const MAX_LEVEL = 12

// 幸运符提供的成功率加成（百分点）
export const LUCKY_CHARM_BONUS = 5

// 失败处理规则。按 minLevel 从高到低匹配第一个满足 targetLevel >= minLevel 的规则。
// action: 'down' 掉级（amount 为掉几级，最低到 0）; 'break' 直接损坏; 'keep' 不掉级
export const FAILURE_RULES = [
  { minLevel: 11, action: 'break', amount: 0, label: '胚子直接损坏' },
  { minLevel: 8, action: 'down', amount: 3, label: '失败等级 -3' },
  { minLevel: 5, action: 'down', amount: 1, label: '失败等级 -1' },
  { minLevel: 1, action: 'keep', amount: 0, label: '失败不掉级' }
]

/**
 * 取目标等级对应的失败处理规则。
 * @param {number} targetLevel 目标等级（本次增幅要冲到的等级）
 */
export const getFailureRule = (targetLevel) => {
  return FAILURE_RULES.find(rule => targetLevel >= rule.minLevel) || FAILURE_RULES[FAILURE_RULES.length - 1]
}

/**
 * 把失败规则转成"目标等级 5~7：失败等级 -1"这样的展示文案。
 * 这样页面说明与判定逻辑共用同一份数据，不会各写一套而漂移。
 */
export const failureRuleSummaries = () => {
  return FAILURE_RULES
    .map((rule, index) => {
      // 上界由"更高一档的起始等级 - 1"决定；最高一档的上界就是 MAX_LEVEL
      const upper = index === 0 ? MAX_LEVEL : FAILURE_RULES[index - 1].minLevel - 1
      const lower = rule.minLevel
      let range
      if (rule.action === 'break') {
        range = `${lower}+`
      } else if (lower === upper) {
        range = `${lower}`
      } else {
        range = `${lower}~${upper}`
      }
      return { range, label: rule.label, action: rule.action }
    })
    // 'keep' 表示该区间失败不掉级，不构成"失败规则"的说明项
    .filter(rule => rule.action !== 'keep')
    .reverse()
}
