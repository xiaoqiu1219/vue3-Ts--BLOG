/**
 * 父组件传递给子组件的数据类型
 */
export interface FatherData {
  /** 名称 */
  name: string
  /** 编号 */
  number: number
}

/**
 * 空对象类型（严格空对象，无任何属性）
 * 用于表示无数据的编辑事件
 */
export type EmptyObject = Record<string, never>

/**
 * 编辑信息对象类型
 * 子组件向父组件传递编辑事件时使用
 */
export interface InfoObject {
  /** 可选的名称字段 */
  name?: string
  /** 必填的编号字段 */
  number: number
}

/**
 * 编辑事件的参数类型（可能是空对象或信息对象）
 */
export type EditInfo = EmptyObject | InfoObject
