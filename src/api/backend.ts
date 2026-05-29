import { get } from './request'

export interface HelloResponse {
  message: string
}

// 调用后端 /api/hello 接口获取问候消息
export const getHello = async (): Promise<HelloResponse> => {
  return get<HelloResponse>('/api/hello')
}
