import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = 10000

if (!baseURL) {
  throw new Error('缺少 VITE_API_BASE_URL 环境变量，请在 .env 文件中配置')
}

// 创建 Axios 实例，预设 baseURL、超时和默认请求头
const api: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：自动从 localStorage 读取 token 并附加到 Authorization 头
api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理 HTTP 错误，提取错误信息并返回友好的错误消息
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data as { message?: string }
      const message = data?.message || error.response.statusText || '请求失败'
      return Promise.reject(new Error(`HTTP ${error.response.status} - ${message}`))
    }

    if (error.request) {
      return Promise.reject(new Error('网络未响应，请检查您的连接'))
    }

    return Promise.reject(new Error(error.message))
  },
)

// 通用请求函数，返回 response.data，泛型 T 指定响应数据类型
export const request = async <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
  const response = await api.request<T>(config)
  return response.data
}

// GET 请求快捷方法
export const get = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  request<T>({ url, method: 'get', ...config })

// POST 请求快捷方法
export const post = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => request<T>({ url, method: 'post', data, ...config })

// PUT 请求快捷方法
export const put = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => request<T>({ url, method: 'put', data, ...config })

// DELETE 请求快捷方法
export const del = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  request<T>({ url, method: 'delete', ...config })

export default api
