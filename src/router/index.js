import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './home'
import  Monitor from './monitor'
import Profile from './profile'
import policePush from './profile/policePush'
import Login from './login'
import trackBack from './home/trackBack'
import realVideo from './home/realVideo'
import contactUs from './contactUs'
import db from 'common/localstorage'

// 全局Router异常处理
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => { if (typeof err !== 'undefined')console.log(err) })
}

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/home'
  },
  {
    path:'/empty',
    name:'empty',
    component: () => import('@/views/empty/index')
  },
  Home,
  Monitor,
  Profile,
  Login,
  policePush,
  contactUs,
  trackBack,
  realVideo
]

const router = new VueRouter({
  // mode:'history',
  base: process.env.BASE_URL,
  routes
})
/*路由跳转之前判断*/
router.beforeEach((to, from, next)=>{
  let that = this
  // console.log(to);
  // if(to.meta.title){
  //   document.title = to.meta.title
  // }
  if(to.matched.length == 0){
    next("/empty")
  }
  if(to.path != '/login'){
    if(to.meta.isAuthenticated){
      let token = db.get('token')
      if(token) {
        next()
      }else{
        next('/login')
      }
    }else{
      next()
    }
  }else{
    next()
  }
})

export default router
