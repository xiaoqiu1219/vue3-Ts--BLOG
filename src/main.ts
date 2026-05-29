// 应用入口：创建 Vue 实例 → 注册 Pinia 状态管理 → 注册路由 → 挂载到 #app
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
