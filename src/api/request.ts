import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = 10000

if (!baseURL) {
  throw new Error('缺少 VITE_API_BASE_URL 环境变量，请在 .env 文件中配置')
}

const api: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export const request = async <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
  const response = await api.request<T>(config)
  return response.data
}

export const get = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  request<T>({ url, method: 'get', ...config })

export const post = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => request<T>({ url, method: 'post', data, ...config })

export const put = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => request<T>({ url, method: 'put', data, ...config })

export const del = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  request<T>({ url, method: 'delete', ...config })

export default api
