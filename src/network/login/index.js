import {request} from '../request'
import Qs from 'qs'
import axios from 'axios'

export function login(data){
  return request({
    url:'/app/login/bind',
    method:'post',
    transformRequest: [(code) => {
      let result = ''
      // if (url.indexOf('login') > -1 || url.indexOf('regist') > -1) {
        Object.keys(code).forEach((key) => {
          if (!Object.is(code[key], undefined) && !Object.is(code[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(code[key]) + '&'
          }
        })
      // } else {
      //   result = JSON.stringify(params)
      // }
      return result
    }],
    data:data
  })
}

export function getAppId(code){
  return request({
    url:'/app/login/loginByCode',
    method:'post',
    transformRequest: [(code) => {
      let result = ''
      console.log(code);
      // if (url.indexOf('login') > -1 || url.indexOf('regist') > -1) {
        Object.keys(code).forEach((key) => {
          if (!Object.is(code[key], undefined) && !Object.is(code[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(code[key]) + '&'
          }
        })
      // } else {
      //   result = JSON.stringify(params)
      // }
      return result
    }],
    data:code
  })
}

