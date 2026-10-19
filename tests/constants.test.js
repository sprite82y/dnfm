// 用 Node 内置测试运行器（零依赖）：npm test
// 目的：把"游戏概率数值不许变"变成可执行断言，挡住后续重构带来的回归。
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  STONE_GRADES,
  GRADE_CONFIG,
  CROSS_GRADE_PROBABILITIES,
  crossGradeProbabilityTexts,
  firstDrawProbabilities
} from '../src/constants/stoneData.js'
import { BOX_ITEMS, BOX_ITEM_GROUPS, BOX_COUNT_OPTIONS } from '../src/constants/boxData.js'
import {
  AMPLIFY_RULES,
  MAX_LEVEL,
  LUCKY_CHARM_BONUS,
  FAILURE_RULES,
  getFailureRule,
  failureRuleSummaries
} from '../src/constants/amplifyData.js'
import { synthesize, generateEntries } from '../src/utils/synthesis.js'

// ---------- 源石 ----------

test('源石品级与词条数为游戏内数值', () => {
  assert.equal(GRADE_CONFIG[STONE_GRADES.EPIC].entryCount, 4)
  assert.equal(GRADE_CONFIG[STONE_GRADES.ARTIFACT].entryCount, 3)
  assert.equal(GRADE_CONFIG[STONE_GRADES.RARE].entryCount, 2)
})

test('跨品级概率保持游戏内原始数值，未取整', () => {
  const expected = {
    '史诗+神器': { 史诗: 20.22, 神器: 6.37 },
    '神器+史诗': { 史诗: 20.22, 神器: 6.37 },
    '史诗+稀有': { 史诗: 22.89, 稀有: 4.21 },
    '稀有+史诗': { 史诗: 22.89, 稀有: 4.21 },
    '神器+稀有': { 神器: 23.57, 稀有: 14.64 },
    '稀有+神器': { 神器: 23.57, 稀有: 14.64 }
  }
  assert.deepEqual(CROSS_GRADE_PROBABILITIES, expected)
})

test('跨品级概率说明文案与数据一致（文案表述为「权重」而非「概率」）', () => {
  const texts = crossGradeProbabilityTexts()
  assert.equal(texts.length, 3)
  assert.equal(texts[0].text, '史诗+神器：史诗词条权重 20.22，神器词条权重 6.37')
  assert.equal(texts[1].text, '史诗+稀有：史诗词条权重 22.89，稀有词条权重 4.21')
  assert.equal(texts[2].text, '神器+稀有：神器词条权重 23.57，稀有词条权重 14.64')
  // 防止有人把表述改回「概率」，那会与首抽 80.89% 的事实矛盾
  for (const t of texts) {
    assert.ok(!t.text.includes('%'), '权重文案不应带百分号')
  }
})

// 概率模型的权威口径：
// 1) 同品级 → 剩余词条等概率
// 2) 不同品级 → 按 CROSS_GRADE_PROBABILITIES 里的权重加权
// 3) 抽取不放回 → 每抽一条后剩余比例重新计算
// 下面用精确枚举（Plackett-Luce）把这三条钉死。

/** 精确枚举：按品级权重、不放回地抽取，返回结果中 A 品级词条数的分布 */
function exactSourceACounts (gradeA, gradeB) {
  const probs = CROSS_GRADE_PROBABILITIES[`${gradeA}+${gradeB}`]
  const wA = probs[gradeA]
  const wB = probs[gradeB]
  const a0 = GRADE_CONFIG[gradeA].entryCount
  const b0 = GRADE_CONFIG[gradeB].entryCount
  const memo = new Map()
  const rec = (a, b, left) => {
    if (left === 0) return new Map([[0, 1]])
    const key = `${a},${b},${left}`
    if (memo.has(key)) return memo.get(key)
    const out = new Map()
    const total = a * wA + b * wB
    if (a > 0) {
      const pr = (a * wA) / total
      for (const [k, v] of rec(a - 1, b, left - 1)) {
        out.set(k + 1, (out.get(k + 1) || 0) + pr * v)
      }
    }
    if (b > 0) {
      const pr = (b * wB) / total
      for (const [k, v] of rec(a, b - 1, left - 1)) {
        out.set(k, (out.get(k) || 0) + pr * v)
      }
    }
    memo.set(key, out)
    return out
  }
  return rec(a0, b0, a0)
}

test('抽取不放回：结果中 A 品级词条数的分布符合精确枚举', () => {
  const cases = [
    ['史诗', '神器', { 1: 1.01, 2: 19.65, 3: 57.86, 4: 21.48 }],
    ['史诗', '稀有', { 2: 3.91, 3: 45.71, 4: 50.37 }],
    ['神器', '稀有', { 1: 17.19, 2: 63.35, 3: 19.45 }],
    ['稀有', '史诗', { 0: 81.58, 1: 18.05, 2: 0.37 }]
  ]
  for (const [gradeA, gradeB, expected] of cases) {
    const dist = exactSourceACounts(gradeA, gradeB)
    for (const [count, expectPct] of Object.entries(expected)) {
      const actualPct = (dist.get(Number(count)) || 0) * 100
      assert.ok(
        Math.abs(actualPct - expectPct) < 0.02,
        `${gradeA}+${gradeB} 抽到 ${count} 条 ${gradeA}: 期望 ${expectPct}%, 实际 ${actualPct.toFixed(2)}%`
      )
    }
  }
})

test('抽取不放回：实测分布与精确枚举一致（含顺序影响）', () => {
  // 不放回的关键证据：把 A/B 顺序调换后分布不同（因为各自条数不同）
  const forward = exactSourceACounts('史诗', '神器')
  const reverse = exactSourceACounts('神器', '史诗')
  const mean = (dist) => [...dist.entries()].reduce((s, [k, v]) => s + k * v, 0)
  assert.ok(mean(forward) > 2.9, '史诗在前时结果以史诗词条为主')
  assert.ok(mean(reverse) < 0.8, '神器在前时结果以神器词条为主')

  // 实测抽样收敛到理论值
  const N = 60000
  const hist = {}
  for (let i = 0; i < N; i++) {
    const r = synthesize({ grade: '史诗', crownCount: 0 }, { grade: '神器', crownCount: 0 })
    const k = r.entries.filter(e => e.source === 'A').length
    hist[k] = (hist[k] || 0) + 1
  }
  for (const [k, v] of forward) {
    const simulated = (hist[k] || 0) / N
    assert.ok(
      Math.abs(simulated - v) < 0.01,
      `${k} 条: 理论 ${(v * 100).toFixed(2)}%, 实测 ${(simulated * 100).toFixed(2)}%`
    )
  }
})

test('首次抽取概率不等于权重本身（权重需按条数放大）', () => {
  const first = firstDrawProbabilities('史诗', '神器')
  const epic = first.find(f => f.grade === '史诗')
  const artifact = first.find(f => f.grade === '神器')
  // 4×20.22 vs 3×6.37
  assert.ok(Math.abs(epic.probability - 80.89) < 0.02, `史诗首抽应为 80.89%，实际 ${epic.probability.toFixed(2)}%`)
  assert.ok(Math.abs(artifact.probability - 19.11) < 0.02)
  assert.ok(Math.abs(epic.probability + artifact.probability - 100) < 1e-9, '同一组首抽概率应合计 100%')
})

test('同品级合成时所有剩余词条等概率（不受权重影响）', () => {
  // 同品级时不存在跨品级权重，应退化为等概率：
  // 史诗2冠 + 史诗2冠，抽 4 条，皇冠数服从超几何分布，均值 2
  const N = 40000
  let sum = 0
  for (let i = 0; i < N; i++) {
    const r = synthesize({ grade: '史诗', crownCount: 2 }, { grade: '史诗', crownCount: 2 })
    sum += r.entries.filter(e => e.isCrown).length
  }
  assert.ok(Math.abs(sum / N - 2) < 0.03, `同品级等概率时平均皇冠数应为 2，实际 ${(sum / N).toFixed(3)}`)
})

test('合成结果条数取决于源石A的品级', () => {
  const a = { grade: '稀有', crownCount: 0 }
  const b = { grade: '史诗', crownCount: 0 }
  const result = synthesize(a, b)
  assert.equal(result.grade, '稀有')
  assert.equal(result.entries.length, GRADE_CONFIG['稀有'].entryCount)
})

test('同品级合成时概率均等，皇冠数不会超过源石总词条', () => {
  const a = { grade: '史诗', crownCount: 2 }
  const b = { grade: '史诗', crownCount: 2 }
  for (let i = 0; i < 200; i++) {
    const crowns = synthesize(a, b).entries.filter(e => e.isCrown).length
    assert.ok(crowns >= 0 && crowns <= 4, `皇冠数越界: ${crowns}`)
  }
})

test('generateEntries 皇冠数正确', () => {
  const entries = generateEntries('史诗', 3)
  assert.equal(entries.length, 4)
  assert.equal(entries.filter(e => e.isCrown).length, 3)
})

// ---------- 超武盒子 ----------

test('盒子概率合计正好 100%', () => {
  const sum = BOX_ITEMS.reduce((s, item) => s + item.probability, 0)
  assert.ok(Math.abs(sum - 100) < 1e-9, `合计为 ${sum}`)
})

test('盒子数值保持游戏内原始精度', () => {
  const byKey = Object.fromEntries(BOX_ITEMS.map(i => [`${i.name}*${i.amount}`, i.probability]))
  assert.equal(byKey['太古龙晶*10'], 0.0010)
  assert.equal(byKey['太古龙晶*2'], 0.0101)
  assert.equal(byKey['龙之雷焰*10'], 0.15)
  assert.equal(byKey['龙之雷焰*2'], 9.25)
  assert.equal(byKey['矛盾的结晶体*1'], 10)
  assert.equal(byKey['深渊-调律之痕*5'], 74.6286)
})

test('盒子展示字符串保留原始小数位（0.0010 不塌成 0.001）', () => {
  const first = BOX_ITEMS[0]
  assert.equal(first.display, '0.0010%')
  assert.equal(first.probability.toString(), '0.001', 'JS 数值本身会丢失尾随零，靠 display 字段保留')
})

test('概率说明分组覆盖全部物品且不重复', () => {
  const named = BOX_ITEM_GROUPS.filter(g => g.itemName).map(g => g.itemName)
  const rest = BOX_ITEMS.filter(i => !named.includes(i.name))
  const covered = [
    ...BOX_ITEMS.filter(i => named.includes(i.name)),
    ...rest
  ]
  assert.equal(covered.length, BOX_ITEMS.length)
  assert.equal(rest.length, 2, '其他物品应为矛盾的结晶体与深渊-调律之痕')
})

test('开启数量选项与默认值', () => {
  assert.deepEqual(BOX_COUNT_OPTIONS, [100, 200, 500, 1000, 10000])
})

// ---------- 增幅 ----------

test('增幅规则共 12 级且等级连续', () => {
  assert.equal(AMPLIFY_RULES.length, MAX_LEVEL)
  AMPLIFY_RULES.forEach((rule, index) => assert.equal(rule.level, index + 1))
})

test('增幅概率与消耗保持游戏内原始数值', () => {
  const rule = (lv) => AMPLIFY_RULES.find(r => r.level === lv)
  assert.equal(rule(1).rate, 100)
  assert.equal(rule(5).rate, 80)
  assert.equal(rule(10).rate, 50)
  assert.equal(rule(12).rate, 30)
  assert.equal(rule(1).weaponContradiction, 35)
  assert.equal(rule(10).weaponContradiction, 472)
  assert.equal(rule(12).nonWeaponContradiction, 484)
  assert.equal(rule(11).luckyCharm, 2)
})

test('幸运符加成为 5 个百分点', () => {
  assert.equal(LUCKY_CHARM_BONUS, 5)
})

test('失败规则边界与游戏内一致', () => {
  assert.equal(getFailureRule(4).action, 'keep')
  for (const lv of [5, 6, 7]) {
    assert.deepEqual(
      { action: getFailureRule(lv).action, amount: getFailureRule(lv).amount },
      { action: 'down', amount: 1 },
      `目标等级 ${lv} 应 -1`
    )
  }
  for (const lv of [8, 9, 10]) {
    assert.deepEqual(
      { action: getFailureRule(lv).action, amount: getFailureRule(lv).amount },
      { action: 'down', amount: 3 },
      `目标等级 ${lv} 应 -3`
    )
  }
  for (const lv of [11, 12]) {
    assert.equal(getFailureRule(lv).action, 'break', `目标等级 ${lv} 应损坏`)
  }
})

test('失败规则说明文案由数据生成且与判定一致', () => {
  const summaries = failureRuleSummaries()
  assert.deepEqual(summaries.map(s => s.range), ['5~7', '8~10', '11+'])
  assert.deepEqual(summaries.map(s => s.label), ['失败等级 -1', '失败等级 -3', '胚子直接损坏'])
})

test('失败规则按 minLevel 降序排列，保证首个匹配即最严格', () => {
  for (let i = 1; i < FAILURE_RULES.length; i++) {
    assert.ok(
      FAILURE_RULES[i].minLevel < FAILURE_RULES[i - 1].minLevel,
      'FAILURE_RULES 必须从高到低排列'
    )
  }
})
