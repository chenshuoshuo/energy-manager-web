import Cookies from 'js-cookie'
import { listSysconfig } from '@/api/sysconfig'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: 'zh',
  size: Cookies.get('size') || 'medium',
  coordinateSystem: '',
  isSupportDoor: false
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_COORDINATESYSTEM: (state, coordinateSystem) => {
    state.coordinateSystem = coordinateSystem
  },
  SET_ISSUPPORTDOOR: (state, isSupportDoor) => {
    state.isSupportDoor = isSupportDoor
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  // 获取配置项
  initSystemConfig({ commit }) {
    return new Promise(async(resolve, reject) => {
      const res = await listSysconfig()
      if (res.data.status) {
        const coordinateSystem = res.data.data.find(item => item.k === 'CoordinateSystem')
        const isSupportDoor = res.data.data.find(item => item.k === 'isOpenSanbao')
        coordinateSystem ? commit('SET_COORDINATESYSTEM', coordinateSystem.v) : reject('地理坐标获取失败')
        isSupportDoor ? commit('SET_ISSUPPORTDOOR', !!parseInt(isSupportDoor.v)) : reject('门前三包配置获取失败')
        resolve()
      } else {
        reject('初始化失败')
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
