import { ref, computed, type Ref } from 'vue'

type Locale = 'zh' | 'en'

const currentLocale: Ref<Locale> = ref('zh')

const messages: Record<Locale, Record<string, string>> = {
  zh: {
    // Navbar
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.modal': '弹窗',
    'brand.text': 'VueModal',
    'github.aria': 'GitHub 仓库',

    // HomeView
    'home.badge': 'Vue 3 组件库',
    'home.title': '灵活的弹窗组件',
    'home.highlight': '基于 Vue 3',
    'home.desc': '一个轻量级、类型安全的 Modal 弹窗组件，完整支持 TypeScript。同时支持组件标签和插件函数两种使用方式。',
    'home.cta.demo': '查看组件演示',
    'home.cta.plugin': '插件 API',
    'home.feature1.title': '标签用法',
    'home.feature1.desc': '作为原生 Vue 组件使用，支持插槽、属性和事件。',
    'home.feature2.title': '插件 API',
    'home.feature2.desc': '通过 modal.show()、.confirm()、.info()、.warning()、.error() 命令式调用。',
    'home.feature3.title': 'TypeScript 优先',
    'home.feature3.desc': '完整的类型安全，支持 Props、Events、Slots 的泛型推导。',
    'home.demo.section': '组件通信演示',
    'home.demo.desc': '父子组件交互示例：props 向下传递，events 向上发送，expose 暴露引用。',
    'home.demo.counter': '计数器',
    'home.demo.readRef': '读取子组件引用',
    'home.demo.hint': '查看浏览器控制台输出',

    // AboutView
    'about.badge': '组件',
    'about.title': 'Modal - 标签用法',
    'about.desc': '将 <Modal> 作为原生 Vue 组件使用，通过 v-model、插槽、属性和事件实现完整的声明式控制。',
    'about.basic.title': '基础用法 - v-model 控制',
    'about.basic.desc': '通过 v-model 绑定控制弹窗的显示和隐藏。',
    'about.basic.btn': '打开弹窗',
    'about.basic.modal.title': '基础弹窗',
    'about.custom.title': '自定义配置',
    'about.custom.desc': '自定义宽度、按钮文字、关闭行为等。',
    'about.custom.btn': '打开自定义弹窗',
    'about.custom.modal.title': '自定义配置',
    'about.custom.item1': '宽度：600px',
    'about.custom.item2': '关闭按钮已隐藏',
    'about.custom.item3': '点击遮罩不关闭',
    'about.custom.item4': '自定义按钮文字',
    'about.custom.setting': '已应用的自定义设置',
    'about.form.title': '表单弹窗',
    'about.form.desc': '在弹窗中嵌入表单，支持验证和提交。',
    'about.form.btn': '打开表单',
    'about.form.modal.title': '用户信息',
    'about.form.name': '姓名',
    'about.form.email': '邮箱',
    'about.form.submit': '提交',
    'about.api.title': '后端 API 调用',
    'about.api.desc': '调用 Java 后端接口并显示结果。',
    'about.api.btn': '获取消息',
    'about.api.loading': '请求中...',
    'about.api.error': '请求失败，请检查后端是否启动。',
    'about.slot.title': '头部和底部插槽',
    'about.slot.desc': '通过命名插槽自定义头部和底部内容，实现完全灵活。',
    'about.slot.btn': '查看示例',
    'about.custom.modal.confirm': '知道了',
    'about.custom.modal.cancel': '关闭',

    // ModalDemo
    'modal.badge': '插件 API',
    'modal.title': 'Modal - 插件用法',
    'modal.desc': '通过 modal.show()、modal.confirm()、modal.info()、modal.warning() 和 modal.error() 命令式调用弹窗。返回 Promise 并解析用户的选择结果。',
    'modal.basic': '基础类型',
    'modal.basic.btn': '基础弹窗',
    'modal.basic.confirm': '确认弹窗',
    'modal.basic.info': '信息弹窗',
    'modal.alert': '警告类型',
    'modal.alert.warning': '警告弹窗',
    'modal.alert.error': '错误弹窗',
    'modal.content': '内容类型',
    'modal.content.html': 'HTML 内容',
    'modal.content.vnode': 'VNode 内容',
    'modal.advanced': '高级功能',
    'modal.advanced.async': '异步操作',
    'modal.advanced.custom': '自定义配置',
    'modal.advanced.closeAll': '关闭所有',
    'modal.api.ref': 'API 参考',
    'modal.api.show': '显示带有完整配置的弹窗。返回 Promise<boolean>。',
    'modal.api.confirm': '确认对话框。用户点击确认或取消。',
    'modal.api.info': '信息对话框，只有一个确定按钮。',
    'modal.api.warning': '警告对话框，带警告图标和样式。',
    'modal.api.error': '错误对话框，带错误图标和样式。',
    'modal.api.closeAll': '关闭当前所有打开的弹窗。',

    // Modal internal texts
    'modal.basic.content': '这是一个基础的 Modal 弹窗示例，支持确认和取消操作。',
    'modal.confirm.content': '此操作不可撤销。确定要继续吗？',
    'modal.confirm.title': '确认操作',
    'modal.info.content': '这是一条提示信息，只有一个确定按钮。',
    'modal.warning.content': '警告：此操作可能会产生副作用！',
    'modal.error.content': '错误：操作过程中发生了未知错误！',
    'modal.html.title': 'HTML 内容',
    'modal.html.h4': '通过 v-html 渲染',
    'modal.html.desc': '支持表格、列表和自定义样式内容。',
    'modal.html.prop': '属性',
    'modal.html.val': '值',
    'modal.vnode.title': 'VNode 示例',
    'modal.vnode.h4': 'VNode 内容',
    'modal.vnode.desc': '通过 VNode 渲染，支持完整的 Vue 响应式特性。',
    'modal.async.title': '异步操作',
    'modal.async.content': '点击确认后会执行异步操作（模拟 2 秒延迟）。',
    'modal.custom.title': '自定义配置',
    'modal.custom.content': '这个弹窗使用了自定义配置：宽度 600px，点击遮罩不关闭，隐藏关闭按钮。',
    'modal.custom.confirm': '同意',
    'modal.custom.cancel': '拒绝',

    // Footer
    'footer.text': '基于 Vue 3 + TypeScript 构建。Modal 弹窗组件演示。',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.modal': 'Modal',
    'brand.text': 'VueModal',
    'github.aria': 'GitHub repository',

    // HomeView
    'home.badge': 'Vue 3 Component Library',
    'home.title': 'Flexible Modal Component',
    'home.highlight': 'for Vue 3',
    'home.desc': 'A lightweight, type-safe modal dialog component with full TypeScript support. Supports both component-tag and plugin-function usage patterns.',
    'home.cta.demo': 'View Component Demo',
    'home.cta.plugin': 'Plugin API',
    'home.feature1.title': 'Tag Usage',
    'home.feature1.desc': 'Use as a native Vue component with slots, props, and events.',
    'home.feature2.title': 'Plugin API',
    'home.feature2.desc': 'Imperative calling via modal.show(), .confirm(), .info(), .warning(), .error().',
    'home.feature3.title': 'TypeScript First',
    'home.feature3.desc': 'Full type safety with generic inference for props, events, and slots.',
    'home.demo.section': 'Component Communication',
    'home.demo.desc': 'Parent-child component interaction demo: props down, events up, exposed refs.',
    'home.demo.counter': 'Counter',
    'home.demo.readRef': 'Read Child Ref',
    'home.demo.hint': 'Check browser console for output',

    // AboutView
    'about.badge': 'Component',
    'about.title': 'Modal - Tag Usage',
    'about.desc': 'Use <Modal> as a native Vue component with v-model, slots, props, and events for full declarative control.',
    'about.basic.title': 'Basic Usage - v-model Control',
    'about.basic.desc': 'Open and close the modal with v-model binding.',
    'about.basic.btn': 'Open Modal',
    'about.basic.modal.title': 'Basic Modal',
    'about.custom.title': 'Custom Configuration',
    'about.custom.desc': 'Custom width, button text, close behavior, and more.',
    'about.custom.btn': 'Open Custom Modal',
    'about.custom.modal.title': 'Custom Configuration',
    'about.custom.item1': 'Width: 600px',
    'about.custom.item2': 'Close button hidden',
    'about.custom.item3': 'Click backdrop won\'t close',
    'about.custom.item4': 'Custom button labels',
    'about.custom.setting': 'Custom Settings Applied',
    'about.form.title': 'Form Modal',
    'about.form.desc': 'Embed a form inside the modal with validation and submission.',
    'about.form.btn': 'Open Form',
    'about.form.modal.title': 'User Information',
    'about.form.name': 'Name',
    'about.form.email': 'Email',
    'about.form.submit': 'Submit',
    'about.api.title': 'Backend API Call',
    'about.api.desc': 'Call a Java backend API and display the result.',
    'about.api.btn': 'Fetch Message',
    'about.api.loading': 'Loading...',
    'about.api.error': 'Request failed. Please check if the backend is running.',
    'about.slot.title': 'Header & Footer Slots',
    'about.slot.desc': 'Customize header and footer with named slots for full flexibility.',
    'about.slot.btn': 'View Example',
    'about.custom.modal.confirm': 'Got It',
    'about.custom.modal.cancel': 'Close',

    // ModalDemo
    'modal.badge': 'Plugin API',
    'modal.title': 'Modal - Plugin Usage',
    'modal.desc': 'Call modals imperatively via modal.show(), modal.confirm(), modal.info(), modal.warning(), and modal.error(). Returns a Promise that resolves with the user\'s choice.',
    'modal.basic': 'Basic Types',
    'modal.basic.btn': 'Basic Modal',
    'modal.basic.confirm': 'Confirm',
    'modal.basic.info': 'Info',
    'modal.alert': 'Alert Variants',
    'modal.alert.warning': 'Warning',
    'modal.alert.error': 'Error',
    'modal.content': 'Content Types',
    'modal.content.html': 'HTML Content',
    'modal.content.vnode': 'VNode Content',
    'modal.advanced': 'Advanced Features',
    'modal.advanced.async': 'Async Operation',
    'modal.advanced.custom': 'Custom Config',
    'modal.advanced.closeAll': 'Close All',
    'modal.api.ref': 'API Reference',
    'modal.api.show': 'Show a modal with full configuration. Returns Promise<boolean>.',
    'modal.api.confirm': 'Confirmation dialog. User clicks confirm or cancel.',
    'modal.api.info': 'Info dialog with a single OK button.',
    'modal.api.warning': 'Warning dialog with warning icon and styling.',
    'modal.api.error': 'Error dialog with error icon and styling.',
    'modal.api.closeAll': 'Close all currently open modals.',

    // Modal internal texts
    'modal.basic.content': 'A basic modal dialog with confirm and cancel buttons.',
    'modal.confirm.content': 'This action cannot be undone. Are you sure?',
    'modal.confirm.title': 'Confirm Action',
    'modal.info.content': 'This is an informational message with a single OK button.',
    'modal.warning.content': 'Warning: This operation may cause side effects!',
    'modal.error.content': 'Error: An unknown error occurred during the operation!',
    'modal.html.title': 'HTML Content',
    'modal.html.h4': 'Rendered via v-html',
    'modal.html.desc': 'Supports tables, lists, and styled content.',
    'modal.html.prop': 'Property',
    'modal.html.val': 'Value',
    'modal.vnode.title': 'VNode Example',
    'modal.vnode.h4': 'VNode Content',
    'modal.vnode.desc': 'Rendered as VNode - fully reactive Vue component tree.',
    'modal.async.title': 'Async Operation',
    'modal.async.content': 'Click confirm to run an async operation (2s delay simulation).',
    'modal.custom.title': 'Custom Config',
    'modal.custom.content': 'Width 600px, click-on-backdrop disabled, close button hidden, custom button labels.',
    'modal.custom.confirm': 'Agree',
    'modal.custom.cancel': 'Decline',

    // Footer
    'footer.text': 'Built with Vue 3 + TypeScript. Modal component demo.',
  },
}

// 国际化组合函数，提供翻译、切换语言、设置语言等能力
export function useI18n() {
  // 当前语言
  const locale = computed(() => currentLocale.value)
  // 根据 key 翻译文本，未找到时返回 key 本身
  const t = (key: string): string => {
    return messages[currentLocale.value][key] ?? key
  }
  // 在中英文之间切换
  const toggleLocale = () => {
    currentLocale.value = currentLocale.value === 'zh' ? 'en' : 'zh'
  }
  // 设置指定语言
  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
  }
  return { locale, t, toggleLocale, setLocale }
}

// Global locale ref for use outside setup()
export { currentLocale }
