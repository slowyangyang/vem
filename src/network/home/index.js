import { request } from '../request'
export function getSDK(url){
  return request({
    url:'/app/login/getTicket',
    data:url
  })
}