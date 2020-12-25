import axios from 'axios'
import store from '../store'
import {Toast,Notify} from 'vant'
import db from 'common/localstorage'
Toast.setDefaultOptions({
  forbidClick: true,
  duration:0
})

let FEBS_REQUEST = axios.create({
  baseURL: `http://192.168.1.140:9002`,
  responseType: 'json',
  validateStatus (status) {
    // 200 外的状态码都认定为失败
    return status === 200
  }
})

// 拦截请求
FEBS_REQUEST.interceptors.request.use((config) => {
  Toast.loading();
  // 有 token就带上
  if (store.state.token) {
    config.headers.Authentication = store.state.token
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 拦截响应
FEBS_REQUEST.interceptors.response.use((config) => {
  let token = config.headers['authentication']
  let TOKEN_INVALID = config.data
  if(config.status == 200){
    if(token){  //获取响应头里面的数据
      db.save("token",token)
      console.log(db.save("token",token));
      store.commit({type:'saveToken',token})
    }
  }
  if(config.data.status == 5){
    db.remove('token')
    db.remove('USER')
    location.reload()
    Notify({ type: 'primary', message: '登录已过期，请重新登录'});
  }
  Toast.clear()
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