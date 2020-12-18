import request from '../request'
export function getSDK(url){
  return request.post("/app/login/getTicket",url)
}

/** Search**/ 
export function getZNodes(){
  return request.get("/app/gpsRealData/provideShowData")
}
export function queryLocal(bvId){
  return request.get("/app/vehicle/provideBVehicleInfo?bvId="+bvId.join(','))
}