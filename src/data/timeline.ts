/** 时间线经历数据 — TimelineView 数据源 */
import type { Experience } from '@/views/types/timeline'

/** 阶段一：2019 — 2022 教育 & 工作经历 */
export const stageOne: Experience[] = [
  {
    id: 'edu-1',
    date: '2019.09',
    company: '江西冶金职业技术学院',
    position: '计算机网络技术 · 大专',
    projects: [
      {
        name: '专业课程学习',
        description: '系统学习计算机网络基础、前端开发技术，在校期间自学 HTML/CSS/JavaScript 并参与实际项目实践，为后续职业发展奠定技术基础。',
        highlights: ['掌握前端三大件 HTML/CSS/JS 核心基础', '自学 Vue 框架并完成个人练手项目', '在校期间开始接触实际企业项目'],
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'Vue'],
        period: '2019.09 - 2021.06',
      },
    ],
  },
  {
    id: 'exp-1',
    date: '2020.07',
    company: '江西时励软件技术有限公司',
    position: '前端开发工程师',
    projects: [
      {
        name: '时励员工后台管理系统',
        description: '企业内部人事权限管理系统，搭建项目基础架构，实现精细化角色权限控制，封装统一请求拦截器，完成数据可视化与公共组件抽象。',
        highlights: [
          '从零搭建项目基础架构，制定标准化开发规范',
          '实现精细化角色权限控制，提升系统安全性',
          '封装统一请求拦截器与公共组件，提升团队研发效率',
          '主导性能优化，解决页面卡顿、渲染延迟等瓶颈',
        ],
        techStack: ['Vue', 'Element-UI', 'Vuex', 'ECharts'],
        period: '2020.07 - 2022.06',
      },
    ],
  },
]

/** 阶段二：2022 — 2026 工作经历 */
export const stageTwo: Experience[] = [
  {
    id: 'exp-2',
    date: '2022.07',
    company: '深圳市诚讯德通信服务有限公司',
    position: '前端开发工程师',
    projects: [
      {
        name: '博通互联官网',
        description: '企业级官方展示与客户服务平台，支持 PC/H5 双端自适应。封装通用布局与业务组件，实现路由动态适配切换，集成在线客服系统。',
        highlights: ['PC/H5 双端自适应适配', '封装通用布局与业务组件库', '集成在线客服系统，提升客户对接效率'],
        techStack: ['Vue 3', 'TypeScript', 'Element-UI'],
        period: '2022.07 - 2026.03',
      },
      {
        name: '企尚 QISHANG 公众号',
        description: '设备信息查询服务公众号，从零搭建实名核验、充值缴费、设备查询、在线客服等核心能力。自定义操作引导流程与实名组件，对接多渠道支付。',
        highlights: ['从 0 到 1 独立搭建完整产品', '自定义实名核验组件与操作引导流程', '对接多渠道支付，全页面埋点数据分析', '优化登录兜底策略，提升用户转化率'],
        techStack: ['UniApp', 'Vue', '微信 SDK'],
        period: '2022.07 - 2026.03',
      },
      {
        name: '博通 IOT 后台管理系统',
        description: '物联网领域企业级管理平台，支撑卡片、设备、出入库、订单、店铺全流程管理。基于 ECharts 封装数据可视化模块，二次封装虚拟表格解决大数据渲染性能问题。',
        highlights: ['支撑卡片/设备/出入库/订单/店铺全流程管理', '基于 ECharts 封装数据可视化模块', '二次封装虚拟表格解决大数据渲染性能瓶颈', '模块化架构设计提升系统可扩展性'],
        techStack: ['Vue', 'View Design', 'ECharts', 'WebSocket'],
        period: '2022.07 - 2026.03',
      },
    ],
  },
]
