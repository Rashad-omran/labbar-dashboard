import {
  Navigate,
  RouteObject,
  createBrowserRouter,
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


const routeModules: AdminRouterItem[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...adminProductsRoutes,
]


const authRoutesFiltered: AdminRouterItem[] = []
const protectedRoutes: AdminRouterItem[] = []

const wrapWithProtectedRoute = (route: AdminRouterItem): AdminRouterItem => {
  const wrappedChildren = route.children?.map(child => wrapWithProtectedRoute(child)) as AdminRouterItem[] | undefined

  return {
    ...route,
    element: route.element ? (
      <ProtectedRoute>
        {route.element}
      </ProtectedRoute>
    ) : route.element,
    children: wrappedChildren,
  } as AdminRouterItem
}

routeModules.forEach(route => {

  if (route.path?.startsWith('auth/')) {
    authRoutesFiltered.push(route)
  } else {

    protectedRoutes.push(wrapWithProtectedRoute(route))
  }
})

export const routes: AdminRouterItem[] = [
  ...authRoutesFiltered,
  ...protectedRoutes,
  {
    path: '*',
    element: <Navigate to="/auth/login" replace />,
  },
]

const routerConfig: RouteObject[] = [{
  path: "/",
  element: <App />,
  children: routes,
}]

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(routerConfig)
export default router
