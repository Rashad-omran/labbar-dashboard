import {
  Navigate,
  RouteObject,
  createBrowserRouter,
  Outlet,
} from "react-router-dom";
import App from "../App";
import { MenuItemType } from "antd/es/menu/interface";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import authRoutes from '../views/auth/auth.router'
import dashboardRoutes from '../views/dashboard/dashboard.router'
import adminProductsRoutes from '../views/adminProducts/adminProducts.router'

export type AdminRouterItem = RouteObject & {
  meta?: MenuItemType & {
    hideInMenu?: boolean
    requiresAuth?: boolean
    order?: number
  }
  children?: AdminRouterItem[]
}

// 1. تقسيم المسارات
const publicRoutes: AdminRouterItem[] = [...authRoutes]
const privateRoutes: AdminRouterItem[] = [
  ...dashboardRoutes,
  ...adminProductsRoutes,
]

// 2. تصدير القائمة الكاملة للـ Sidebar
export const routes: AdminRouterItem[] = [
  ...publicRoutes,
  ...privateRoutes,
]

// 3. إعداد الـ Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // المسارات العامة (Login)
      ...publicRoutes,

      // المسارات المحمية (Dashboard, Products)
      {
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: privateRoutes,
      },

      // توجيه أي رابط خاطئ لصفحة الدخول
      {
        path: '*',
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
])

export default router
