import axios from 'axios'
import { getToken } from '@/utils/auth'

export const cmips = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_CMIPS_SERVER : window.g.BASE_IPS, // api 的 base_url
  withCredentials: true // 跨域请求时发送 cookies
})

// request interceptor
cmips.interceptors.request.use(
  config => {
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// response interceptor
cmips.interceptors.response.use(
  response => Promise.resolve(response),
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export const cmgis = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_CMGIS_SERVER : window.g.BASE_GIS, // api 的 base_url
  withCredentials: true // 跨域请求时发送 cookies
})

cmgis.interceptors.request.use(
  config => {
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

export const cmccr = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_CMCCR_SERVER : window.g.BASE_CCR, // api 的 base_url
  withCredentials: true // 跨域请求时发送 cookies
})

cmccr.interceptors.request.use(
  config => {
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

