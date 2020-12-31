export default {
  path:'/home',
  name:'home',
  meta:{
    isAuthenticated:true,
    title:'首页'
  },
  component:() => import("@/views/home/home")
}