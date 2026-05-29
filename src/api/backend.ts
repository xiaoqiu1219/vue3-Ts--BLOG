import { get } from './request'

export interface HelloResponse {
  message: string
}

export const getHello = async (): Promise<HelloResponse> => {
  return get<HelloResponse>('/api/hello')
}
