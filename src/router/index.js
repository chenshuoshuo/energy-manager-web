import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authRedirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/proManager',
    component: Layout,
    name: 'proManager',
    alwaysShow: true,
    redirect: '/proManager/apManager',
    meta: {
      title: '产品配置管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'apManager',
        component: () => import('@/views/proManager/apManager'),
        name: 'apManager',
        meta: {
          title: 'AP配置管理',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'switchManager',
        component: () => import('@/views/proManager/switchManager'),
        name: 'switchManager',
        meta: {
          title: '交换机配置管理',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/netManager',
    redirect: '/netManager/netApManager',
    component: Layout,
    alwaysShow: true,
    name: 'netManager',
    meta: {
      title: '网络设备管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'netApManager',
        component: () => import('@/views/netManager/netApManager'),
        name: 'netApManager',
        meta: {
          title: 'AP设备管理',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'netSwitchManager',
        component: () => import('@/views/netManager/netSwitchManager'),
        name: 'netSwitchManager',
        meta: {
          title: '交换机设备管理',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/warnSetting',
    redirect: '/warnSetting/apWarn',
    component: Layout,
    name: 'warnSetting',
    alwaysShow: true,
    meta: {
      title: '设备预警设置',
      icon: 'chart'
    },
    children: [
      {
        path: 'apWarn',
        component: () => import('@/views/warnSetting/apWarn'),
        name: 'apWarn',
        meta: {
          title: 'AP预警设置',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'swtichWarn',
        component: () => import('@/views/warnSetting/swtichWarn'),
        name: 'swtichWarn',
        meta: {
          title: '交换机预警设置',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/warnRecord',
    redirect: '/warnRecord/apRecord',
    component: Layout,
    name: 'warnSetting',
    alwaysShow: true,
    meta: {
      title: '设备预警记录',
      icon: 'chart'
    },
    children: [
      {
        path: '/apRecord',
        component: () => import('@/views/warnRecord/apRecord'),
        name: 'apRecord',
        meta: {
          title: 'AP预警就记录',
          roles: ['admin', 'editor']
        }
      },
      {
        path: '/swtichRecord',
        component: () => import('@/views/warnRecord/swtichRecord'),
        name: 'swtichRecord',
        meta: {
          title: '交换机预警记录',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
