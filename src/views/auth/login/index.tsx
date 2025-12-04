import React, { useState, useMemo } from 'react'
import { Form, Input, Button, Card, message, Typography, Space, theme } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../../store/user'
import dummyClient from '../../../api/dummyClient'

const { Title, Text } = Typography

interface LoginFormValues {
  username: string
  password: string
}

interface LoginResponse {
  accessToken?: string
  token?: string
  refreshToken?: string
  user?: {
    id: string | number
    username: string
    email?: string
    firstName?: string
    lastName?: string
    image?: string
  }
  id?: number
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  image?: string
}



const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)
  const { token } = theme.useToken()

  const toRgba = (color: string, alpha: number) => {
    if (!color) return `rgba(0,0,0,${alpha})`
    if (color.startsWith('rgb')) {
      return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
    }
    let hex = color.replace('#', '')
    if (hex.length === 3) {
      hex = hex.split('').map((char) => char + char).join('')
    }
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const backgroundStyle = useMemo(() => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: token.colorBgLayout,
    backgroundImage: `
      radial-gradient(circle at 15% 20%, ${toRgba(token.colorPrimary, 0.18)}, transparent 55%),
      radial-gradient(circle at 85% 10%, ${toRgba(token.green8, 0.16)}, transparent 50%),
      linear-gradient(0deg, ${toRgba(token.colorSplit, 0.8)} 1px, transparent 1px),
      linear-gradient(90deg, ${toRgba(token.colorSplit, 0.6)} 1px, transparent 1px)
    `,
    backgroundSize: 'auto, auto, 32px 32px, 32px 32px',
    backgroundAttachment: 'fixed'
  }), [token])



  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      const response = await dummyClient.post<LoginResponse>('/auth/login', {
        username: values.username,
        password: values.password,
        expiresInMins: 30,
      })

      const token = response.accessToken || response.token
      if (!token) {
        throw new Error('Missing token in login response')
      }

      const userProfile = response.user ?? {
        id: response.id ?? values.username,
        username: response.username ?? values.username,
        email: response.email ?? '',
        avatar: response.image,
      }

      const avatar =
        'image' in userProfile && userProfile.image
          ? userProfile.image
          : (userProfile as { avatar?: string }).avatar

      login(
        {
          id: userProfile.id,
          username: userProfile.username,
          email: userProfile.email || `${userProfile.username}@example.com`,
          avatar,
        },
        token
      )

      message.success('Login successful!')

      const redirectOverride = new URLSearchParams(window.location.search).get('redirect')
      if (redirectOverride) {
        navigate(redirectOverride)
      } else {
        navigate('/products', { replace: true })
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Login failed, please check your username and password'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div style={backgroundStyle}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>Login</Title>
            <Text type="secondary">Welcome back, please login to your account</Text>
          </div>

          <Form
            name="login"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please enter username or email' },
                { min: 3, message: 'Username must be at least 3 characters' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username or email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                Login
              </Button>
            </Form.Item>
          </Form>


        </Space>
      </Card>
    </div>
  )
}

export default LoginPage
