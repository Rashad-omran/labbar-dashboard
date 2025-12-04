import dummyClient from './dummyClient'

export interface ProductPayload {
  title: string
  price: number
  description: string
  category: string
}

export interface Product extends ProductPayload {
  id: number
  stock?: number
  brand?: string
  thumbnail?: string
  rating?: number
  images?: string[]
}

export interface ProductListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export const fetchProducts = (params: { limit: number; skip: number }) => {
  return dummyClient.get<ProductListResponse>('/products', { params })
}

export const fetchProductsByCategory = (category: string, params: { limit: number; skip: number }) => {
  return dummyClient.get<ProductListResponse>(`/products/category/${category}`, { params })
}

export const searchProducts = (query: string, params: { limit: number; skip: number }) => {
  return dummyClient.get<ProductListResponse>('/products/search', {
    params: { ...params, q: query },
  })
}

export const fetchProduct = (id: string | number) => {
  return dummyClient.get<Product>(`/products/${id}`)
}

export const createProduct = (payload: ProductPayload) => {
  return dummyClient.post<Product>('/products/add', payload)
}

export const updateProduct = (id: string | number, payload: ProductPayload) => {
  return dummyClient.put<Product>(`/products/${id}`, payload)
}

export const deleteProduct = (id: string | number) => {
  return dummyClient.delete<Product>(`/products/${id}`)
}

type CategoryResponse = string | { slug?: string; name?: string }

export const fetchCategories = () => {
  return dummyClient.get<CategoryResponse[]>('/products/categories')
}
