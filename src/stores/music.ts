import { ref } from 'vue'
import { defineStore } from 'pinia'
import audioSrc from '@/assets/music/gaobaiqiqiu.mp3'
import lrcRaw from '@/assets/music/gaobaiqiqiu.lrc?raw'

// 歌词行高度，用于计算滚动偏移
const LINE_HEIGHT = 36

interface LyricItem {
  time: number
  text: string
}

// 解析 LRC 歌词文本：将 [mm:ss.xx] 时间戳和歌词文本转换为结构化数组
function parseLrc(raw: string): LyricItem[] {
  const lines = raw.split('\n')
  const result: LyricItem[] = []
  const timeRe = /^\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  for (const line of lines) {
    const match = line.match(timeRe)
    if (!match) continue
    const [, m, s, msStr] = match
    if (!m || !s || !msStr) continue
    const mins = Number(m)
    const secs = Number(s)
    const ms = Number(msStr) / (msStr.length === 2 ? 100 : 1000)
    const time = mins * 60 + secs + ms
    const text = line.slice(match[0].length).trim()
    if (text) {
      result.push({ time, text })
    }
  }
  return result
}

// 全局音乐播放 Store —— 音频元素为单例，不受页面切换影响
export const useMusicStore = defineStore('music', () => {
  const audio = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const currentLyric = ref(-1)
  const hasError = ref(false)

  // 歌词数据（显式 ref，与 Pinia setup store 的响应式约定一致）
  const lyrics = ref<LyricItem[]>(parseLrc(lrcRaw))

  // 初始化全局音频元素（App.vue 中调用一次）
  function initAudio() {
    if (audio.value) return
    const el = new Audio(audioSrc)
    el.loop = true
    el.addEventListener('play', () => {
      isPlaying.value = true
    })
    el.addEventListener('pause', () => {
      isPlaying.value = false
    })
    el.addEventListener('error', () => {
      hasError.value = true
    })
    el.addEventListener('timeupdate', () => {
      const ct = el.currentTime
      const items = lyrics.value
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i]
        if (item && ct >= item.time) {
          currentLyric.value = i
          return
        }
      }
      currentLyric.value = -1
    })
    audio.value = el
  }

  // 切换播放/暂停
  function toggle() {
    if (!audio.value) return
    if (isPlaying.value) {
      audio.value.pause()
    } else {
      audio.value.play().catch(() => {
        hasError.value = true
      })
    }
  }

  return { audio, isPlaying, currentLyric, hasError, lyrics, LINE_HEIGHT, initAudio, toggle }
})
