export default {
  path:'/policePush',
  name:'policePush',
  meta:{
    title:"报警推送"
  },
  component:() => import("@/views/profile/children/policePush")
}