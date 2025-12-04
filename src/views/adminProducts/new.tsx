import { useState } from 'react'
import { Button, message, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import ProductForm from './components/ProductForm'
import { createProduct, type ProductPayload } from '../../api/products'

const AdminProductCreatePage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: ProductPayload) => {
    setLoading(true)
    try {
      await createProduct(values)
      message.success('Product created')
      navigate('/products', { replace: true })
    } catch (error) {
      console.error(error)
      message.error('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Add Product
        </Typography.Title>
        <Typography.Text type="secondary">Provide the basic product details below.</Typography.Text>
      </div>
      <ProductForm loading={loading} onSubmit={handleSubmit} />
      <Button onClick={() => navigate(-1)}>Cancel</Button>
    </Space>
  )
}

export default AdminProductCreatePage
