export default {
  path:'/profile',
  name:'profile',
  meta:{
    isAuthenticated:true,
    title:'我的'
  },
  component:() => import("@/views/profile/profile")
}