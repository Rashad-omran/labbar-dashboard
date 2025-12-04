import { useCallback, useEffect, useState } from 'react'
import { Button, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../api/products'
import {
  deleteProduct,
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
} from '../../api/products'

const PAGE_SIZE = 10

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const loadProducts = useCallback(async (pageNumber: number) => {
    setLoading(true)
    try {
      const skip = (pageNumber - 1) * PAGE_SIZE
      let data
      if (selectedCategory !== 'all') {
        data = await fetchProductsByCategory(selectedCategory, { limit: PAGE_SIZE, skip })
      } else if (searchTerm) {
        data = await searchProducts(searchTerm, { limit: PAGE_SIZE, skip })
      } else {
        data = await fetchProducts({ limit: PAGE_SIZE, skip })
      }
      setProducts(data.products)
      setTotal(data.total)
      setPage(pageNumber)
    } catch (error) {
      console.error(error)
      message.error('Unable to load products')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    loadProducts(1)
  }, [loadProducts])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        const normalized = (data ?? [])
          .map((category) => {
            if (typeof category === 'string') return category
            if (category && typeof category === 'object') {
              if (typeof category.slug === 'string') return category.slug
              if (typeof category.name === 'string') return category.name
            }
            return String(category ?? '')
          })
          .filter(Boolean)
        setCategories(normalized)
      } catch (error) {
        console.error(error)
        message.error('Unable to load categories')
      }
    }
    loadCategories()
  }, [])

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId)
      message.success('Product deleted')
      loadProducts(page)
    } catch (error) {
      console.error(error)
      message.error('Failed to delete product')
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (_value, record) => {
        const src = record.thumbnail ?? record.images?.[0]
        return src ? (
          <img
            src={src}
            alt={record.title}
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #f0f0f0' }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              border: '1px dashed #d9d9d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#999',
            }}
          >
            N/A
          </div>
        )
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => `$${value}`,
      width: 120,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space wrap size={8}>
          <Tooltip title="View / Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/products/${record.id}`)}
              aria-label="View or edit product"
            />
          </Tooltip>
          <Popconfirm
            title="Delete product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete product" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            Products
          </Typography.Title>
        </div>
      </Space>
      <Space wrap style={{ width: '100%', justifyContent: 'space-between', gap: 12 }}>
        <Input.Search
          placeholder="Search products"
          value={searchInput}
          allowClear
          onChange={(event) => {
            const value = event.target.value
            setSearchInput(value)
            if (!value) {
              setSearchTerm('')
            }
          }}
          onSearch={(value) => {
            setSearchInput(value)
            setSearchTerm(value.trim())
            setSelectedCategory('all')
          }}
          style={{ maxWidth: 320 }}
        />
        <Select
          value={selectedCategory}
          style={{ minWidth: 200 }}
          onChange={(value) => {
            setSelectedCategory(value)
            setSearchInput('')
            setSearchTerm('')
          }}
          options={[
            { label: 'All categories', value: 'all' },
            ...categories.map((category) => {
              const label = category
                .replace(/-/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .replace(/\b\w/g, (char) => char.toUpperCase())
              return { label, value: category }
            }),
          ]}
        />
      </Space>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            onChange: (nextPage) => loadProducts(nextPage),
          }}
          scroll={{ x: 900 }}
        />
      </div>
    </Space>
  )
}

export default AdminProductsPage
