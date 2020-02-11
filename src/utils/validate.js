/**
 * Created by jiachenpan on 16/11/18.
 */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  if (/^[a-zA-Z\u4e00-\u9fa5\d]+$/.test(str)) {
    return true
  } else {
    return false
  }
}
export function validPassword(str) {
  if (/^[a-zA-Z\d]+$/.test(str)) {
    return true
  } else {
    return false
  }
}
export function validIP(str) {
  if (/^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/g.test(str)) {
    return true
  } else {
    return false
  }
}

export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validateNumber(str) {
  const reg = /^[0-9]*$/
  return reg.test(str)
}
export function validateDay(str) {
  const reg = /^[1-9][0-9]{0,3}$/
  return reg.test(str)
}

export function validateLng(str) {
  const reg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d*)|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0*|180)$/
  return reg.test(str)
}
export function validateLat(str) {
  const reg = /^(\-|\+)?([0-8]?\d{1}\.\d*|90\.0*|[0-8]?\d{1}|90)$/
  return reg.test(str)
}
export function validaTelephone(phone) {
  const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
  return reg.test(phone)
}
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

