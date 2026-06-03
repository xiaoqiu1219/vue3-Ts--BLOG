/** 项目经历 */
export interface Project {
  /** 项目名称 */
  name: string
  /** 简短描述 */
  description: string
  /** 成果/亮点 */
  highlights: string[]
  /** 技术栈标签 */
  techStack: string[]
  /** 在职时间段，如 "2019.06 - 2020.03" */
  period: string
}

/** 工作经历节点 */
export interface Experience {
  id: string
  /** 日期，精确到月份，如 "2019.06" */
  date: string
  /** 公司名称 */
  company: string
  /** 职位 */
  position: string
  /** 参与项目 */
  projects: Project[]
}
