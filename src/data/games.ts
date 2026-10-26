/** 小游戏配置 — GamesHub 数据源。name/desc 为 i18n key，difficulty 为机器值。 */

export interface GameItem {
  id: string
  /** i18n key */
  name: string
  /** i18n key */
  desc: string
  icon: string
  path: string
  color: string
  /** 难度机器值，渲染时用 t('games.diff.<value>') 翻译 */
  difficulty: 'easy' | 'medium' | 'hard'
  /** 是否已上线 */
  online: boolean
}

export const games: GameItem[] = [
  {
    id: 'whack-mole',
    name: 'games.whackMole',
    desc: 'games.whackMoleDesc',
    icon: '🔨',
    path: '/games/whack-mole',
    color: '#f59e0b',
    difficulty: 'easy',
    online: true,
  },
  {
    id: 'guess-number',
    name: 'games.guessNumber',
    desc: 'games.guessNumberDesc',
    icon: '🔢',
    path: '/games/guess-number',
    color: '#06b6d4',
    difficulty: 'easy',
    online: true,
  },
  // 后续新增游戏在此追加
]