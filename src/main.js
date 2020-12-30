import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import "../src/assets/css/reset.css"
import 'vant/lib/index.css';
import $ from 'jquery'
// import request from 'network/request'
import { Toast } from 'vant';
import { Notify } from 'vant';
//全局消息提示
Notify.setDefaultOptions({background:'#adadad',duration: 1500})
// 注册全局事件总线
Vue.prototype.$Bus = new Vue()
Vue.use(Vant);
Vue.use(Toast);
Vue.prototype.$Toast = Toast
// Vue.prototype.$post = request.post
// Vue.prototype.$get = request.get
// Vue.prototype.$put = request.put
// Vue.prototype.$delete = request.delete

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
