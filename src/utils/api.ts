import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login'
        }
      }

      return Promise.reject({
        status,
        message: data?.message || error.message || 'Request failed',
        data: data,
      })
    }

    return Promise.reject({
      status: 0,
      message: error.message || 'Network error, please check your network connection',
    })
  }
)




export const request = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.get(url, config)
  },
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return api.post(url, data, config) as Promise<T>
  },
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return api.put(url, data, config)
  },
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.delete(url, config)
  },
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return api.patch(url, data, config)
  },
}

export default api

