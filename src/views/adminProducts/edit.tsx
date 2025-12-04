import { useEffect, useState } from 'react'
import { Button, Card, Image, message, Skeleton, Space, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from './components/ProductForm'
import { fetchProduct, updateProduct, type Product, type ProductPayload } from '../../api/products'

const AdminProductEditPage = () => {
  const { productId } = useParams()
  const [initialValues, setInitialValues] = useState<ProductPayload | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return
      setLoading(true)
      try {
        const productResponse = await fetchProduct(productId)
        setInitialValues({
          title: productResponse.title,
          category: productResponse.category,
          price: productResponse.price,
          description: productResponse.description,
        })
        setProduct(productResponse)
      } catch (error) {
        console.error(error)
        message.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const handleSubmit = async (values: ProductPayload) => {
    if (!productId) return
    setSaving(true)
    try {
      await updateProduct(productId, values)
      message.success('Product updated')
      navigate('/products', { replace: true })
    } catch (error) {
      console.error(error)
      message.error('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Edit Product
        </Typography.Title>
        <Typography.Text type="secondary">Update product information.</Typography.Text>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          {product?.images?.length ? (
            <Card size="small" title="Product Images">
              <Image.PreviewGroup>
                <Space wrap>
                  {product.images.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt={product.title}
                      width={120}
                      height={120}
                      style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
                    />
                  ))}
                </Space>
              </Image.PreviewGroup>
            </Card>
          ) : null}
          <ProductForm loading={saving} initialValues={initialValues ?? undefined} onSubmit={handleSubmit} />
        </>
      )}
      <Button onClick={() => navigate(-1)}>Back</Button>
    </Space>
  )
}

export default AdminProductEditPage
