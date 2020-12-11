import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './home'
import  Monitor from './monitor'
import Profile from './profile'
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
  Login
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next)=>{
//   console.log(to.meta.isAuthenticated);
//   if(to.name != 'login'){
//     if(to.meta.isAuthenticated){
//       next('login')
//     }else{
//       next()
//     }
//   }else{
//     next()
//   }
// })

export default router
