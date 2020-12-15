import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './home'
import  Monitor from './monitor'
import Profile from './profile'
import policePush from './profile/policePush'
import Login from './login'
import {getCookie} from 'common/utils'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/home'
  },
  Home,
  Monitor,
  Profile,
  Login,
  policePush
]

const router = new VueRouter({
  mode:'history',
  base: process.env.BASE_URL,
  routes
})
/*路由跳转之前判断*/
router.beforeEach((to, from, next)=>{
  let that = this
  console.log(to);
  if(to.matched.length == 0){
    next("/404")
  }
  if(to.path != '/login'){
    if(to.meta.isAuthenticated){
      const cookie = getCookie("JSESSIONID")
      if(!cookie) {
        next()
      }else{
        next('login')
      }
    }else{
      next()
    }
  }else{
    next()
  }
})

export default router
