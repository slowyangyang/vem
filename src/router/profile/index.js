export default {
  path:'/profile',
  name:'profile',
  meta:{
    isAuthenticated:true
  },
  component:() => import("@/views/profile/profile")
}