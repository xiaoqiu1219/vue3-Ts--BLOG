# Modal 弹窗组件

一个功能完善的 Vue 3 Modal 弹窗组件，支持函数式调用、TypeScript、全局配置和国际化。

## 特性

- ✅ 函数式 API 调用，无需在模板中声明组件
- ✅ 支持 TypeScript，完整的类型定义
- ✅ 支持 HTML 字符串和 VNode 作为内容
- ✅ 全局配置支持
- ✅ 国际化支持
- ✅ 多种快捷方法：confirm、info、warning、error
- ✅ 优雅的过渡动画
- ✅ 独立挂载到 body，不受父组件样式影响

## 安装使用

### 方式一：直接导入 API

```typescript
import { modal } from '@/components/Modal'

// 基础用法
const result = await modal.show({
  title: '提示',
  content: '确定要执行此操作吗？'
})
```

### 方式二：全局注册插件

```typescript
// main.ts
import { createApp } from 'vue'
import { ModalPlugin } from '@/components/Modal'
import App from './App.vue'

const app = createApp(App)

// 注册插件并配置
app.use(ModalPlugin, {
  confirmText: '确认',
  cancelText: '取消',
  closeOnClickModal: true,
  i18n: {
    confirm: 'Confirm',
    cancel: 'Cancel'
  }
})

app.mount('#app')
```

然后在组件中使用：

```typescript
// 组合式 API
import { inject } from 'vue'
const $modal = inject('$modal')

// 或者在模板中使用
this.$modal.show({ ... })
```

## API

### modal.show(options)

显示一个自定义弹窗，返回 `Promise<boolean>`。

```typescript
const result = await modal.show({
  title: '标题',
  content: '内容'
})
// result: true 表示点击确认，false 表示取消或关闭
```

### modal.confirm(content, title?)

显示确认弹窗。

```typescript
const result = await modal.confirm('确定要删除吗？', '删除确认')
```

### modal.info(content, title?)

显示信息弹窗（只有确认按钮）。

```typescript
await modal.info('操作成功')
```

### modal.warning(content, title?)

显示警告弹窗。

```typescript
await modal.warning('请注意风险')
```

### modal.error(content, title?)

显示错误弹窗。

```typescript
await modal.error('操作失败')
```

### modal.closeAll()

关闭所有弹窗。

```typescript
modal.closeAll()
```

### modal.config(options)

配置全局默认值。

```typescript
modal.config({
  confirmText: '确认',
  cancelText: '取消',
  closeOnClickModal: false,
  width: 500,
  zIndex: 3000
})
```

### modal.setI18n(i18n)

设置国际化文本。

```typescript
modal.setI18n({
  confirm: 'OK',
  cancel: 'Cancel'
})
```

## Options 配置项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | `'提示'` | 弹窗标题 |
| content | `string \| VNode` | - | 弹窗内容，支持字符串或 VNode |
| confirmText | `string` | `'确定'` | 确认按钮文字 |
| cancelText | `string` | `'取消'` | 取消按钮文字 |
| showConfirm | `boolean` | `true` | 是否显示确认按钮 |
| showCancel | `boolean` | `true` | 是否显示取消按钮 |
| closeOnClickModal | `boolean` | `true` | 点击遮罩层是否关闭 |
| showClose | `boolean` | `true` | 是否显示关闭图标 |
| customClass | `string` | - | 自定义类名 |
| customStyle | `Record<string, string>` | - | 自定义样式 |
| width | `string \| number` | `'480px'` | 弹窗宽度 |
| zIndex | `number` | `2000` | 弹窗层级 |
| onConfirm | `() => void \| Promise<void>` | - | 确认回调 |
| onCancel | `() => void` | - | 取消回调 |
| onClose | `() => void` | - | 关闭回调 |
| onOpen | `() => void` | - | 打开后回调 |

## 使用示例

### 基础用法

```typescript
import { modal } from '@/components/Modal'

const handleDelete = async () => {
  const result = await modal.confirm('确定要删除这条数据吗？')
  if (result) {
    // 执行删除操作
    await deleteItem()
  }
}
```

### 自定义 HTML 内容

```typescript
await modal.show({
  title: '用户协议',
  content: `
    <div>
      <h4>服务条款</h4>
      <p>欢迎使用我们的服务...</p>
    </div>
  `
})
```

### VNode 内容

```typescript
import { h } from 'vue'

const vnode = h('div', [
  h('h4', '动态内容'),
  h('p', '这是通过 VNode 渲染的内容')
])

await modal.show({
  title: 'VNode 示例',
  content: vnode
})
```

### 异步操作

```typescript
const result = await modal.show({
  title: '提交确认',
  content: '确定要提交吗？',
  onConfirm: async () => {
    // 提交数据
    await submitData()
    console.log('提交成功')
  }
})
```

### 全局配置

```typescript
// 在应用初始化时配置
import { modal } from '@/components/Modal'

// 设置默认配置
modal.config({
  width: 500,
  closeOnClickModal: false,
  confirmText: '确认',
  cancelText: '取消'
})

// 设置国际化
modal.setI18n({
  confirm: 'Confirm',
  cancel: 'Cancel'
})
```

## 目录结构

```
src/components/Modal/
├── index.ts          # 主入口
├── Modal.vue         # Modal 组件
├── modal.ts          # Modal API 服务
├── plugin.ts         # Vue 插件
├── types/
│   └── index.ts      # TypeScript 类型定义
└── README.md         # 使用文档
```

## TypeScript 支持

组件提供完整的 TypeScript 类型定义：

```typescript
import type {
  ModalOptions,
  ModalContentType,
  ModalConfig,
  ModalI18n,
  ModalPluginOptions
} from '@/components/Modal'
```