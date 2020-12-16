// import axios from 'axios'
// import store from '../store'
// export function request(config){
//   const instance = axios.create({
//     baseURL: 'http://192.168.1.137:9002',
//     timeout: 5000,
//   });

//   // 请求拦截
//   instance.interceptors.request.use(config => {
//     // 有 token就带上
//     console.log(store.getters.emitCookie);
//   if(store.getters.emitCookie) {
//     config.headers.cookie = store.getters.emitCookie
//     // axios.defaults.withCredentials = true;
//   }
//     return config;
//   }, error => {

//     return Promise.reject(error);
//   });

//   // 响应拦截
//   instance.interceptors.response.use(res => {

//     return res;
//   }, error => {

//     return Promise.reject(error);
//   });

//   return instance(config)
// }

import axios from 'axios'
import store from '../store'
import {Toast} from 'vant'
Toast.setDefaultOptions({
  forbidClick: true,
  duration:0
})

let FEBS_REQUEST = axios.create({
  baseURL: `http://192.168.1.137:9002`,
  responseType: 'json',
  validateStatus (status) {
    // 200 外的状态码都认定为失败
    return status === 200
  }
})

// 拦截请求
FEBS_REQUEST.interceptors.request.use((config) => {
  // let expireTime = store.state.account.expireTime
  // let now = moment().format('YYYYMMDDHHmmss')
  // // 让token早10秒种过期，提升“请重新登录”弹窗体验
  // if (now - expireTime >= -10) {
  //   Modal.error({
  //     title: '登录已过期',
  //     content: '很抱歉，登录已过期，请重新登录',
  //     okText: '重新登录',
  //     mask: false,
  //     onOk: () => {
  //       return new Promise((resolve, reject) => {
  //         db.clear()
  //         location.reload()
  //       }).catch(function (reason) {
  //         console.log('catch:', reason)
  //       })
  //     }
  //   })
  // }
  Toast.loading();
  // 有 token就带上
  if (store.state.JSESSIONID) {
    config.headers.Authorization = store.state.Authorization
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 拦截响应
FEBS_REQUEST.interceptors.response.use((config) => {
  return config
}, (error) => {
  if (error.response) {
    let errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
    Toast({message:errorMessage})
  }
  Toast.clear()
  return Promise.reject(error)
})

const request = {
  post (url, params) {
    let contentType = (url.indexOf('login') > -1) || (url.indexOf('regist') > -1) ? 'application/x-www-form-urlencoded' : 'application/json'
    return FEBS_REQUEST.post(url, params, {
      transformRequest: [(params) => {
        let result = ''
        if (url.indexOf('login') > -1 || url.indexOf('regist') > -1) {
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
            }
          })
        } else {
          console.log(5656);
          result = JSON.stringify(params)
        }
        return result
      }],
      headers: {
        'Content-Type': contentType
      }
    })
  },
  put (url, params) {
    let contentType = (url.indexOf('login') > -1 || url.indexOf('avatar') > -1 || url.indexOf('password') > -1 || url.indexOf('password/reset') > -1) ? 'application/x-www-form-urlencoded' : 'application/json'
    return FEBS_REQUEST.put(url, params, {
      transformRequest: [(params) => {
        let result = ''
        if (url.indexOf('login') > -1 || url.indexOf('avatar') > -1 || url.indexOf('password') > -1 || url.indexOf('password/reset') > -1) {
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
            }
          })
        } else {
          result = JSON.stringify(params)
        }
        return result
      }],
      headers: {
        'Content-Type': contentType
      }
    })
  },
  get (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return FEBS_REQUEST.get(`${url}${_params}`)
  },
  delete (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return FEBS_REQUEST.delete(`${url}${_params}`)
  }
}

export default request