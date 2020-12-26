import request from '../request'

export function login(data){
  return request.post("/app/login/bind",data)
}
//是否登录过
export function isLogin(code){
  return request.post("/app/login/loginByCode",code)
}
//退出登录
export function exitLogin(code){
  return request.post("/app/login/loginByCode",code)
}

