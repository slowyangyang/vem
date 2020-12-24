export default {
  path: '/trackBack',
  name: 'trackBack',
  meta:{
    isAuthenticated:true
  },
  component: () => import("views/home/children/trackBack")
}