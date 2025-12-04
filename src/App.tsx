import React, { useEffect } from 'react'
import PageLayout from './components/layout'
import { ConfigProvider } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import useUserStore from './store/user'
import darkTheme from './config/theme'

const App: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useUserStore(state => state.isAuthenticated)

  useEffect(() => {
    if (location.pathname === '/') {
      if (!isAuthenticated) {
        navigate('/auth/login', { replace: true })
      } else {
        navigate('/products', { replace: true })
      }
    }
  }, [location.pathname, isAuthenticated, navigate])

  const isAuthPage = location.pathname.startsWith('/auth/')

  return (
    <ConfigProvider theme={darkTheme}>
      {isAuthPage ? <Outlet /> : <PageLayout />}
    </ConfigProvider>
  )
}

export default App
