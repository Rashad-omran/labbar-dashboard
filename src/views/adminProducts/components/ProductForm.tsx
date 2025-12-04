import { Form, Input, InputNumber, Button, Space } from 'antd'
import { useEffect } from 'react'
import type { ProductPayload } from '../../../api/products'

interface ProductFormProps {
  initialValues?: ProductPayload
  loading?: boolean
  onSubmit: (values: ProductPayload) => Promise<void> | void
}

const ProductForm = ({ initialValues, loading, onSubmit }: ProductFormProps) => {
  const [form] = Form.useForm<ProductPayload>()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [initialValues, form])

  const handleFinish = (values: ProductPayload) => {
    onSubmit(values)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ?? { title: '', price: 0, category: '', description: '' }}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please enter product title' }]}
      >
        <Input placeholder="Product title" />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: 'Please enter price' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: 'Please enter category' }]}
      >
        <Input placeholder="Category" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <Input.TextArea rows={4} placeholder="Short description" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ProductForm
