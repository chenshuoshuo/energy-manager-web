import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import { getToken, getRefresh, getExpirationDate, autoGetToken, setToken, removeRefresh, removeToken } from '@/utils/auth'

import { refreshToken, getUserInfo } from '@/api/zk'

import { Message } from 'element-ui'

// import axios from 'axios'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/404', '/401']

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  if (getToken()) { // determine if there has token
    if (store.getters.addRoutes.length > 0) {
      next()
    } else {
      var userinfoStr = window.atob(getToken().split('.')[1])

      const userInfo = JSON.parse(userinfoStr)

      getUserInfo(userInfo.user_name).then(res => {
        if (res.data.status) {
          window.cmips_userId = res.data.data.userId
          store.dispatch('permission/generateRoutes', [{ authority: 'admin' }]).then(res => {
            router.addRoutes([... res, { path: '*', redirect: '/404' }])
          })
        } else {
          next('/mylogin')
        }
      }).catch(() => {
        Message({
          type: 'error',
          message: '用户信息获取失败'
        })
      }).finally(() => {
        router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
      })
    }
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (getRefresh()) { // 如果有更新token
      refreshToken(getRefresh()).then(res => {
        setToken(res.data.access_token, res.data.expires_in)
        autoGetToken(getRefresh())
        next('/')
      }).catch(() => {
        removeToken()
        removeRefresh()
        next({ ...to, replace: true })
      })
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('/401')
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 页面刷新时重新设置定时器自动更新token

window.onload = function() {
  if (getRefresh() && getExpirationDate()) {
    autoGetToken(getRefresh())
  }
}
