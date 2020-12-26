import request from '../request'

//退出登录
export function exitLogin(code){
  return request.post("",code)
}

