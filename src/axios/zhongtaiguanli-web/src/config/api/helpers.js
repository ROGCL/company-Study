import axios from '@/util/axios'

export function get(url) {
  return function (params = {}) {
    return axios.get(url, {
      params
    }).then((res) => {
      return res
    }).catch((e) => {
    })
  }
}
export function post(url) {
  return function (params = {}) {
    return axios.post(url, {
      ...params
    }).then(res => {
      return res
    }).catch(() => {
    })
  }
}
export function form(url) {
  return function (params = {}) {
    return axios.post(url, {
      ...params
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => {
      return res
    }).catch(() => {
    })
  }
}
