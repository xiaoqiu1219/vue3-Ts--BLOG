/** 小游戏配置 — GamesHub + 导航 数据源 */

export interface GameItem {
  id: string
  name: string
  desc: string
  icon: string
  path: string
  color: string
  /** 难度标签 */
  difficulty: '简单' | '中等' | '困难'
  /** 是否已上线 */
  online: boolean
}

export const games: GameItem[] = [
  {
    id: 'whack-mole',
    name: '打地鼠',
    desc: '地鼠随机冒出，眼疾手快锤爆它们！20 秒倒计时挑战最高分',
    icon: '🔨',
    path: '/games/whack-mole',
    color: '#f59e0b',
    difficulty: '简单',
    online: true,
  },
  {
    id: 'guess-number',
    name: '猜数字',
    desc: '系统随机生成一个数字，在有限次数内猜对它',
    icon: '🔢',
    path: '/games/guess-number',
    color: '#06b6d4',
    difficulty: '简单',
    online: true,
  },
  // 后续新增游戏在此追加
]

/** 导航栏「小游戏」下拉项 */
export const gamesNav = games
  .filter(g => g.online)
  .map(g => ({ path: g.path, label: `${g.icon} ${g.name}` }))
