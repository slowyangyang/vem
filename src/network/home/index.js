import request from '../request'
export function getSDK(url){
  return request.post("/app/login/getTicket",url)
}

/**获取节点**/
export function getZNodes(){
  return request.get("/app/track/provideShowData")
}
/** Search**/ 
export function queryLocal(bvId){
  return request.get("/app/vehicle/provideBVehicleInfo?bvId="+bvId.join(','))
}
/** 轨迹 **/ 
export function backPlay(plateno,stime,etime){
  return request.get("/app/track/getCarHistory",{
    plateNo:plateno,
    startTime:stime,
    endTime:stime
  })
}