import request from '../request'

//退出登录
export function exitLogin(OPENID){
  return request.get("/app/login/unbind?openId="+OPENID)
}

//报警设置
export function pushPolic(data){
  return request.get("")
}

