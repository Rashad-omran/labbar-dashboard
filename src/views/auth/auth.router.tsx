import { LoginOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import LoginPage from './login'

const authRoutes: AdminRouterItem[] = [
  {
    path: 'auth/login',
    element: <LoginPage />,
    meta: {
      label: 'Login',
      title: 'Login',
      key: '/auth/login',
      icon: <LoginOutlined />,
      hideInMenu: true,
    },
  },
]

export default authRoutes

