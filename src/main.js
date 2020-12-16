import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import $ from 'jquery'
// import request from 'network/request'
import { Toast } from 'vant';
import { Notify } from 'vant';
Notify.setDefaultOptions({background:'#adadad',duration: 1500})
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
