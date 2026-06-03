<template>
  <Transition name="mini-fade">
    <div
      v-if="visible"
      class="music-mini"
      :class="{ expanded: isExpanded }"
      @mouseenter="expand"
      @mouseleave="collapse"
    >
      <!-- 边缘拉手（始终可见） -->
      <div class="mini-handle" @click.stop="toggleExpand">
        <div class="handle-bar"></div>
        <div class="handle-icon" :class="{ playing: store.isPlaying }">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M2 1.5v7l5.5-3.5z"/>
          </svg>
        </div>
      </div>

      <!-- 展开内容 -->
      <div class="mini-body">
        <!-- 迷你唱片 -->
        <div class="mini-disc" :class="{ spinning: store.isPlaying }">
          <div class="mini-grooves"></div>
          <div class="mini-shine"></div>
          <div class="mini-label"></div>
          <div class="mini-hole"></div>
        </div>

        <!-- 歌曲信息 -->
        <div class="mini-info">
          <span class="mini-song">告白气球</span>
          <div class="mini-wave" :class="{ active: store.isPlaying }">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </div>
        </div>

        <!-- 播放/暂停 -->
        <button class="mini-btn" @click.stop="store.toggle()" :title="store.isPlaying ? '暂停' : '播放'">
          <svg v-if="!store.isPlaying" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3 2v8l6-4z"/>
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="2" y="2" width="3" height="8" rx="0.5"/>
            <rect x="7" y="2" width="3" height="8" rx="0.5"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMusicStore } from '@/stores/music'

const route = useRoute()
const store = useMusicStore()

// 首页不显示迷你播放器
const visible = computed(() => route.path !== '/')

// 吸附展开状态
const isExpanded = ref(false)
let collapseTimer: ReturnType<typeof setTimeout> | null = null

// 触控切换（移动端点击展开/收起）
function toggleExpand() {
  if (isExpanded.value) {
    collapse()
  } else {
    expand()
  }
}

function expand() {
  if (collapseTimer) {
    clearTimeout(collapseTimer)
    collapseTimer = null
  }
  isExpanded.value = true
}

function collapse() {
  // 延迟 400ms 缩回，避免鼠标快速划过时闪烁
  collapseTimer = setTimeout(() => {
    isExpanded.value = false
  }, 400)
}
</script>

<style scoped>
/* ===== 容器：默认吸附右侧 ===== */
.music-mini {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 25;
  transform: translateX(calc(100% - 22px));
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
}

.music-mini.expanded {
  transform: translateX(0);
}

/* ===== 边缘拉手 ===== */
.mini-handle {
  width: 22px;
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(10, 10, 26, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-right: none;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.music-mini.expanded .mini-handle {
  opacity: 0.5;
  border-radius: 10px 0 0 10px;
}

.handle-bar {
  width: 2px;
  height: 16px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.handle-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.handle-icon.playing {
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.12);
  animation: handle-pulse 2s ease-in-out infinite;
}

@keyframes handle-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(6, 182, 212, 0); }
  50% { box-shadow: 0 0 6px rgba(6, 182, 212, 0.3); }
}

/* ===== 展开内容 ===== */
.mini-body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 10px 12px;
  background: rgba(10, 10, 26, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: none;
  border-radius: 0 28px 28px 0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

/* --- 迷你唱片 --- */
.mini-disc {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 35%,
    #282840 0%,
    #1a1a2e 40%,
    #111 100%
  );
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.mini-disc.spinning {
  animation: mini-spin 3s linear infinite;
}

@keyframes mini-spin {
  to { transform: rotate(360deg); }
}

.mini-grooves {
  position: absolute;
  inset: 20%;
  border-radius: 50%;
  background: repeating-radial-gradient(
    circle at center,
    transparent 0px,
    transparent 1.2px,
    rgba(255,255,255,0.02) 1.2px,
    rgba(255,255,255,0.02) 2px
  );
}

.mini-shine {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 30deg,
    transparent 0deg,
    transparent 30deg,
    rgba(255,255,255,0.04) 45deg,
    rgba(255,255,255,0.06) 55deg,
    transparent 70deg,
    transparent 360deg
  );
}

.mini-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e63946, #c1121f);
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

.mini-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2.5px;
  height: 2.5px;
  border-radius: 50%;
  background: #0a0a1a;
}

/* --- 歌曲信息 --- */
.mini-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.mini-song {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  line-height: 1;
}

/* 音波动画 */
.mini-wave {
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 8px;
}

.wave-bar {
  width: 2px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1px;
  transition: background 0.3s ease;
}

.wave-bar:nth-child(1) { height: 4px; }
.wave-bar:nth-child(2) { height: 8px; }
.wave-bar:nth-child(3) { height: 5px; }
.wave-bar:nth-child(4) { height: 7px; }

.mini-wave.active .wave-bar {
  background: var(--color-accent-cyan);
  animation: wave 0.9s ease-in-out infinite;
}
.mini-wave.active .wave-bar:nth-child(1) { animation-delay: 0s; }
.mini-wave.active .wave-bar:nth-child(2) { animation-delay: 0.15s; }
.mini-wave.active .wave-bar:nth-child(3) { animation-delay: 0.3s; }
.mini-wave.active .wave-bar:nth-child(4) { animation-delay: 0.45s; }

@keyframes wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.3); }
}

/* --- 播放按钮 --- */
.mini-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-cyan);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.mini-body:hover .mini-btn {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

/* ===== 过渡动画 ===== */
.mini-fade-enter-active,
.mini-fade-leave-active {
  transition: all 0.3s ease;
}

.mini-fade-enter-from,
.mini-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
