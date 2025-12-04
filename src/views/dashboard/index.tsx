import { useEffect, useMemo, useState } from 'react'
import { Line, Pie } from '@ant-design/charts'
import { AppstoreOutlined, DollarOutlined, InboxOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Card, Col, List, Row, Skeleton, Space, Statistic, Tag, Typography, message, theme } from 'antd'
import { fetchProducts } from '../../api/products'

interface ProductDashboardStats {
  totalProducts: number
  averagePrice: number
  totalCategories: number
  totalStock: number
  priceTrend: { month: string; revenue: number }[]
  categoryDistribution: { type: string; value: number }[]
  featuredProducts: Array<{
    id: number
    title: string
    category: string
    brand?: string
    price: number
    stock?: number
  }>
}

const DashboardPage = () => {
  const [stats, setStats] = useState<ProductDashboardStats>()
  const [loading, setLoading] = useState(true)
  const { token } = theme.useToken()
  const chartThemeConfig = { theme: 'classicDark' }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchProducts({ limit: 100, skip: 0 })
        if (!mounted) return

        const products = data.products ?? []
        const totalProducts = data.total ?? products.length
        const averagePrice =
          products.length > 0 ? products.reduce((sum, product) => sum + product.price, 0) / products.length : 0
        const totalCategories = new Set(products.map(product => product.category)).size
        const totalStock = products.reduce((sum, product) => sum + (product.stock ?? 0), 0)

        const priceTrend = products.slice(0, 10).map(product => ({
          month: product.title,
          revenue: product.price,
        }))

        const categoryCounts = products.reduce<Record<string, number>>((acc, product) => {
          acc[product.category] = (acc[product.category] ?? 0) + 1
          return acc
        }, {})
        const categoryDistribution = Object.entries(categoryCounts)
          .map(([type, value]) => ({ type, value }))
          .sort((a, b) => b.value - a.value)

        const featuredProducts = products
          .slice()
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 5)
          .map(product => ({
            id: product.id,
            title: product.title,
            category: product.category,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
          }))

        setStats({
          totalProducts,
          averagePrice,
          totalCategories,
          totalStock,
          priceTrend,
          categoryDistribution,
          featuredProducts,
        })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load().catch(() => {
      message.error('Unable to load product insights right now.')
    })
    const timer = setInterval(() => {
      load().catch(() => {
        message.error('Unable to refresh product insights right now.')
      })
    }, 1000 * 60 * 5)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const metricCards = useMemo(() => ([
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? 0,
      suffix: 'items',
      icon: <ShoppingOutlined style={{ color: '#1890ff' }} />,
      trend: 'Live count from API',
      precision: undefined,
    },
    {
      title: 'Average Price',
      value: stats?.averagePrice ?? 0,
      prefix: '$',
      precision: 2,
      icon: <DollarOutlined style={{ color: '#52c41a' }} />,
      trend: 'Across loaded catalog',
    },
    {
      title: 'Categories',
      value: stats?.totalCategories ?? 0,
      suffix: 'unique',
      icon: <AppstoreOutlined style={{ color: '#fa8c16' }} />,
      trend: 'Computed from API data',
      precision: undefined,
    },
    {
      title: 'Total Stock',
      value: stats?.totalStock ?? 0,
      suffix: 'units',
      icon: <InboxOutlined style={{ color: '#722ed1' }} />,
      trend: 'Sum of product stock',
      precision: undefined,
    },
  ]), [stats])

  const metricCardStyle = {
    background: token.colorBgElevated,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  }

  if (loading && !stats) {
    return <Skeleton active paragraph={{ rows: 12 }} />
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {metricCards.map(card => (
          <Col key={card.title} xs={24} sm={12} lg={6}>
            <Card styles={{ body: { padding: 16 } }} style={metricCardStyle}>
              <Space align="start">
                {card.icon}
                <Statistic
                  title={card.title}
                  value={card.value}
                  prefix={card.prefix}
                  suffix={card.suffix}
                  precision={card.precision}
                  valueStyle={{ color: token.colorText }}
                />
              </Space>
              <Typography.Text style={{ color: token.colorTextSecondary }}>{card.trend}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Price Trend" extra={<Typography.Text type="secondary">Top 10 products</Typography.Text>}>
            {stats ? (
              <Line
                data={stats.priceTrend}
                xField="month"
                yField="revenue"
                smooth
                height={320}
                point={{ sizeField: 5 }}
                xAxis={{
                  label: { style: { fill: token.colorTextSecondary } },
                  line: { style: { stroke: token.colorBorderSecondary } },
                  tickLine: { style: { stroke: token.colorBorderSecondary } },
                }}
                yAxis={{
                  label: { style: { fill: token.colorTextSecondary } },
                  grid: { line: { style: { stroke: token.colorSplit, lineDash: [4, 4] } } },
                }}
                tooltip={{
                  formatter: (datum: { revenue: number }) => ({
                    name: 'Price',
                    value: `$${datum.revenue.toLocaleString()}`,
                  }),
                }}
                {...chartThemeConfig}
              />
            ) : (
              <Skeleton active />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Category Breakdown">
            {stats ? (
              <Pie
                data={stats.categoryDistribution}
                angleField="value"
                colorField="type"
                innerRadius={0.5}
                height={320}
                legend={{
                  position: 'bottom',
                  itemName: { style: { fill: token.colorTextSecondary } },
                }}
                label={{
                  text: 'value',
                  style: { fontWeight: 600, fill: token.colorText },
                }}
                {...chartThemeConfig}
              />
            ) : (
              <Skeleton active />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Product Highlights">
            <List
              dataSource={stats?.featuredProducts ?? []}
              renderItem={product => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Typography.Text strong>{product.title}</Typography.Text>
                        <Tag>{product.category}</Tag>
                      </Space>
                    }
                    description={`${product.brand ?? 'Unknown brand'} · $${product.price.toLocaleString()} · Stock: ${product.stock ?? 0
                      }`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Health Insights">
            <List
              dataSource={
                stats
                  ? [
                    {
                      title: 'Top Category',
                      description: `${stats.categoryDistribution[0]?.type ?? 'N/A'
                        } leads with ${stats.categoryDistribution[0]?.value ?? 0} items.`,
                    },
                    {
                      title: 'Average Price',
                      description: `Current average product price is $${stats.averagePrice.toFixed(2)}.`,
                    },
                    {
                      title: 'Inventory Watch',
                      description: `${(stats.featuredProducts || []).filter(product => (product.stock ?? 0) < 50).length
                        } featured products have stock under 50 units.`,
                    },
                  ]
                  : []
              }
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Typography.Text strong>{item.title}</Typography.Text>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default DashboardPage
