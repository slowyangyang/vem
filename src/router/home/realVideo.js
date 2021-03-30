export default {
  path: '/realVideo',
  name: 'realVideo',
  meta:{
    isAuthenticated:true,
    title:'实时视频'
  },
  component: () => import("views/home/children//realVideo")
}