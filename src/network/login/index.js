import request from '../request'

export function login(data){
  // return request({
  //   url:'/app/login/bind',
  //   method:'post',
  //   transformRequest: [(code) => {
  //     let result = ''
  //       Object.keys(code).forEach((key) => {
  //         if (!Object.is(code[key], undefined) && !Object.is(code[key], null)) {
  //           result += encodeURIComponent(key) + '=' + encodeURIComponent(code[key]) + '&'
  //         }
  //       })
  //     return result
  //   }],
  //   data:data
  // })
  return request.post("/app/login/bind",data)
}

export function isLogin(code){
  return request.post("/app/login/loginByCode",code)
}

