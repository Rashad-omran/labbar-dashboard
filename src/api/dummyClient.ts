import axios, { type AxiosRequestConfig } from 'axios'
import useUserStore from '../store/user'

const instance = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const token = useUserStore.getState().token || localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

const unwrap = <T>(promise: Promise<{ data: T }>) => promise.then((response) => response.data)

const dummyClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => unwrap<T>(instance.get<T>(url, config)),
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.post<T>(url, data, config)),
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.put<T>(url, data, config)),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => unwrap<T>(instance.delete<T>(url, config)),
}

export default dummyClient
