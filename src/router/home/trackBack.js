export default {
  path: '/trackBack',
  name: 'trackBack',
  meta:{
    isAuthenticated:true,
    title:'轨迹回放'
  },
  component: () => import("views/home/children/trackBack")
}