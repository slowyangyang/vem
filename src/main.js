import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
// z-tree
// import "../public/js/jquery.ztree.core.min.js"
// import "../public/js/jquery.ztree.excheck.min.js"
// import '../public/css/zTreeStyle.css'
// import '../public/css/img'
import $ from 'jquery'

Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
