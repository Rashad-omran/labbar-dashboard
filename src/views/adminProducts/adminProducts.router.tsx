import { PlusOutlined, ShoppingOutlined } from '@ant-design/icons'
import type { AdminRouterItem } from '../../router'
import AdminProductsPage from '.'
import AdminProductCreatePage from './new'
import AdminProductEditPage from './edit'

const adminProductsRoutes: AdminRouterItem[] = [
  {
    path: 'products',
    element: <AdminProductsPage />,
    meta: {
      label: 'Products',
      title: 'Products',
      key: '/products',
      icon: <ShoppingOutlined />,
      order: 1,
    },
  },
  {
    path: 'products/new',
    element: <AdminProductCreatePage />,
    meta: {
      label: 'Add Product',
      title: 'Add Product',
      key: '/products/new',
      icon: <PlusOutlined />,
      hideInMenu: false,
      order: 2,
    },
  },
  {
    path: 'products/:productId',
    element: <AdminProductEditPage />,
    meta: {
      label: 'Edit Product',
      title: 'Edit Product',
      key: '/products/:productId',
      hideInMenu: true,
    },
  },
]

export default adminProductsRoutes
