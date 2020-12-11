export default {
  path:'/home',
  name:'home',
  meta:{
    isAuthenticated:true
  },
  component:() => import("@/views/home/home")
}