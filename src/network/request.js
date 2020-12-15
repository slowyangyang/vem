import axios from 'axios'
import store from 'vuex'
export function request(config){
  const instance = axios.create({
    baseURL: 'http://192.168.1.136:9002',
    timeout: 5000,
  });

  // 请求拦截
  instance.interceptors.request.use(config => {
    // 有 token就带上
    console.log(store.getters.emitCookie);
  if(store.getters.emitCookie) {
    // config.headers.cookie = store.getters.emitCookie
    axios.defaults.withCredentials = true;
  }
    return config;
  }, error => {

    return Promise.reject(error);
  });

  // 响应拦截
  instance.interceptors.response.use(res => {

    return res;
  }, error => {

    return Promise.reject(error);
  });

  return instance(config)
}
