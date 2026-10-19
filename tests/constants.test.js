// 用 Node 内置测试运行器（零依赖）：npm test
// 目的：把"游戏概率数值不许变"变成可执行断言，挡住后续重构带来的回归。
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  STONE_GRADES,
  GRADE_CONFIG,
  CROSS_GRADE_PROBABILITIES,
  crossGradeProbabilityTexts
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

test('跨品级概率说明文案与数据一致', () => {
  const texts = crossGradeProbabilityTexts()
  assert.equal(texts.length, 3)
  assert.equal(texts[0].text, '史诗+神器：史诗词条 20.22%，神器词条 6.37%')
  assert.equal(texts[1].text, '史诗+稀有：史诗词条 22.89%，稀有词条 4.21%')
  assert.equal(texts[2].text, '神器+稀有：神器词条 23.57%，稀有词条 14.64%')
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
