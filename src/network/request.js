import axios from 'axios'
export function request(config){
  const instance = axios.create({
    baseURL: '',
    timeout: 5000,
  });

  // 请求拦截
  axios.interceptors.request.use(config => {

    return config;
  }, error => {

    return Promise.reject(error);
  });

  // 响应拦截
  axios.interceptors.response.use(res => {

    return response;
  }, error => {

    return Promise.reject(error);
  });

  return instance(config)
}

