import request from '../request'
export function getSDK(url){
  return request.post("/app/login/getTicket",url)
}

/**获取节点**/
export function getZNodes(treeCode=""){
  return request.get("/app/track/provideShowData?treeCode="+treeCode)
}
// 车牌搜索
export function searchPalteNo(search=""){
  return request.get("/app/track/provideShowData?search="+search)
}
/** Search**/ 
export function queryLocal(bvId){
  return request.get("/app/vehicle/provideBVehicleInfo?bvId="+bvId.join(','))
}
/** 轨迹 **/ 
export function trackQuery(plateno,stime,etime){
  return request.get("/app/track/getCarHistory",{
    plateNo:plateno,
    startTime:stime,
    endTime:etime
  })
}