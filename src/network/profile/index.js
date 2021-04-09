import request from '../request'

//退出登录
export function exitLogin(OPENID){
  return request.get("/app/login/unbind?openId="+OPENID)
}

//获取报警设置
export function getPushList(){
  return request.get("/app/msg/push/setting/get")
}

//更新报警设置
export function updataPushList(params){
  return request.post("/app/msg/push/setting",params)
}


