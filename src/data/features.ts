/** 经历页功能数据 — ExperienceView 数据源 */

export interface FeatureItem {
  id: string
  name: string
  description: string
  tags: string[]
  icon: string
  color: string
}

export const features: FeatureItem[] = [
  {
    id: 'f01',
    name: 'HTML Canvas 海报生成',
    description: '基于 Canvas 实现自定义海报绘制，支持上传照片、编辑文字、选择模板，一键生成并保存分享海报。',
    tags: ['Canvas', 'HTML5', 'JavaScript'],
    icon: '▣',
    color: 'linear-gradient(135deg, #f472b6, #a78bfa)',
  },
  {
    id: 'f02',
    name: '公众号埋点监控',
    description: '公众号全页面埋点数据采集与分析，追踪用户行为路径、页面停留时长，输出转化漏斗与数据看板。',
    tags: ['埋点SDK', '数据分析', '公众号'],
    icon: '◉',
    color: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  },
  {
    id: 'f03',
    name: '小程序一键获取手机号',
    description: '对接微信一键授权获取手机号，实现免密登录与手机号绑定，优化注册转化流程。',
    tags: ['微信小程序', '授权登录', '手机号'],
    icon: '◎',
    color: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  },
  {
    id: 'f04',
    name: '小程序跳转实名认证',
    description: '公众号跳转微信小程序，拉起第三方实名认证流程，完成身份核验后结果回传业务系统。',
    tags: ['小程序跳转', '实名认证', '公众号'],
    icon: '◈',
    color: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    id: 'f05',
    name: '公众号实名认证',
    description: '自建公众号实名认证流程，对接运营商三要素核验，支持身份证 OCR 识别与活体检测。',
    tags: ['实名认证', 'OCR', '活体检测'],
    icon: '◆',
    color: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    id: 'f06',
    name: '微信支付',
    description: '集成微信 JSAPI 支付、H5 支付、小程序支付，覆盖充值、缴费、订单等场景与退款对账全流程。',
    tags: ['微信支付', 'JSAPI', '支付回调'],
    icon: '◇',
    color: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    id: 'f07',
    name: '支付宝支付',
    description: '接入支付宝 PC 网站支付与 H5 支付，实现多渠道支付统一管理与支付路由降级策略。',
    tags: ['支付宝', 'H5支付', '支付路由'],
    icon: '◈',
    color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  {
    id: 'f08',
    name: '管理平台轮询扫码支付',
    description: '后台生成支付二维码，前端轮询支付状态，成功后自动更新订单并触发后续业务流程。',
    tags: ['轮询', '扫码支付', '订单管理'],
    icon: '▣',
    color: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  },
  {
    id: 'f09',
    name: 'RBAC 权限管理',
    description: '基于角色的访问控制体系，用户-角色-权限三级管理，动态路由过滤，按钮级权限控制。',
    tags: ['RBAC', '权限控制', '动态路由'],
    icon: '▥',
    color: 'linear-gradient(135deg, #ef4444, #f97316)',
  },
  {
    id: 'f10',
    name: 'ECharts 数据可视化',
    description: '封装 ECharts 图表组件库，支持折线/柱状/饼图/仪表盘等多种类型，实现业务数据可视化。',
    tags: ['ECharts', '数据可视化', '组件封装'],
    icon: '◉',
    color: 'linear-gradient(135deg, #06b6d4, #f59e0b)',
  },
  {
    id: 'f11',
    name: '虚拟滚动表格',
    description: '二次封装高性能虚拟滚动表格组件，仅渲染可视区域数据行，解决大数据量渲染性能瓶颈。',
    tags: ['虚拟滚动', '性能优化', '组件封装'],
    icon: '▦',
    color: 'linear-gradient(135deg, #6366f1, #a78bfa)',
  },
  {
    id: 'f12',
    name: 'PC/H5 双端自适应官网',
    description: '搭建企业级官网，PC 与 H5 双端自适应响应式布局，封装通用组件库，集成在线客服系统。',
    tags: ['响应式', 'Vue 3', '组件库'],
    icon: '▤',
    color: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  },
]

/** 技能标签云 */
export const heroSkillPills: string[] = [
  'Vue 3',
  'TypeScript',
  'UniApp',
  '微信 SDK',
  '支付对接',
  'ECharts',
  'Element-UI',
  'View Design',
  '实名认证',
]
