import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './home'
import  Monitor from './monitor'
import Profile from './profile'
import policePush from './profile/policePush'
import Login from './login'

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
  base: process.env.BASE_URL,
  routes
})
/*路由跳转之前判断*/
// router.beforeEach((to, from, next)=>{
//   if(to.name != 'login'){
//     if(to.meta.isAuthenticated){
//       const token = cookie.get(process.env.VUE_APP_SESSION_KEY)
//       if (typeof token !== 'string' || !token) {
//         return next('login')
//       }else{
//         next()
//       }
//     }else{
//       next()
//     }
//   }else{
//     next()
//   }
// })

export default router
