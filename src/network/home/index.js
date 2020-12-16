import request from '../request'
export function getSDK(url){
  return request.post("/app/login/getTicket",url)
}