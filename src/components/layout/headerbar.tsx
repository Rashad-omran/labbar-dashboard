import { Layout, Dropdown, Avatar, Button } from 'antd';
import { LogoutOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import useUserStore from '../../store/user';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
const { Header } = Layout;


const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  return { isMobile }
}

interface HeaderbarProps {
  colorBgContainer: string
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

const Headerbar = (props: HeaderbarProps) => {
  const { colorBgContainer, collapsed, onCollapse } = props
  const user = useUserStore(state => state.user)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()

  
  const { isMobile } = useResponsive()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <Header 
      title='Admin Dashboard' 
      style={{ 
        padding: 0, 
        background: colorBgContainer,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        height: '100%', 
        padding: isMobile ? "0 12px" : "0 20px", 
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {onCollapse && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => onCollapse(!collapsed)}
              style={{ fontSize: 16 }}
            />
          )}
          <h2 style={{ 
            margin: 0, 
            fontSize: isMobile ? '16px' : '20px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {isMobile ? 'Dashboard' : 'Admin Dashboard'}
          </h2>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                cursor: 'pointer', 
                padding: '0 8px',
                minWidth: 0,
              }}>
                <Avatar 
                  src={user.avatar} 
                  icon={!user.avatar && <UserOutlined />}
                  size="small"
                  style={{
                    background: user.avatar ? undefined : '#1890ff',
                  }}
                  alt={user.username}
                >
                  {!user.avatar ? user.username?.[0]?.toUpperCase() : null}
                </Avatar>
                {!isMobile && <span style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{user.username}</span>}
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </Header>
  )
}

export default Headerbar
