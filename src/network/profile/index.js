import request from '../request'

//退出登录
export function exitLogin(OPENID){
  return request.get("/app/login/unbind?openId="+OPENID)
}

