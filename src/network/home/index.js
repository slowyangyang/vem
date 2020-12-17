import request from '../request'
export function getSDK(url){
  return request.post("/app/login/getTicket",url)
}

/** Search**/ 
export function getZNodes(){
  return request.post("/app/gpsRealData/provideShowData")
}