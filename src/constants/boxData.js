// 超武盒子的掉落物品与游戏内真实概率。
// 这些数值对应 DNF 手游游戏内真实概率，重构时不要"修正"或取整。
// 概率单位为百分比（%），合计为 100。

export const BOX_ITEMS = [
  { name: '太古龙晶', amount: 10, probability: 0.0010, display: '0.0010%' },
  { name: '太古龙晶', amount: 8, probability: 0.0018, display: '0.0018%' },
  { name: '太古龙晶', amount: 6, probability: 0.0032, display: '0.0032%' },
  { name: '太古龙晶', amount: 4, probability: 0.0053, display: '0.0053%' },
  { name: '太古龙晶', amount: 2, probability: 0.0101, display: '0.0101%' },
  { name: '龙之雷焰', amount: 10, probability: 0.15, display: '0.15%' },
  { name: '龙之雷焰', amount: 8, probability: 0.65, display: '0.65%' },
  { name: '龙之雷焰', amount: 6, probability: 1.8, display: '1.8%' },
  { name: '龙之雷焰', amount: 4, probability: 3.5, display: '3.5%' },
  { name: '龙之雷焰', amount: 2, probability: 9.25, display: '9.25%' },
  { name: '矛盾的结晶体', amount: 1, probability: 10, display: '10%' },
  { name: '深渊-调律之痕', amount: 5, probability: 74.6286, display: '74.6286%' }
]

// 概率说明表格的分组展示配置。
// 分组只影响"物品概率说明"的排版，数值全部来自 BOX_ITEMS。
export const BOX_ITEM_GROUPS = [
  { title: '太古龙晶', headingClass: 'text-warning', itemName: '太古龙晶' },
  { title: '龙之雷焰', headingClass: 'text-success', itemName: '龙之雷焰' },
  {
    title: '其他物品',
    headingClass: 'text-info',
    itemName: null // null 表示"不属于前两组的其余物品"
  }
]

// 可选的开启数量
export const BOX_COUNT_OPTIONS = [100, 200, 500, 1000, 10000]
