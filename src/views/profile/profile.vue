<template>
  <div class="profile">
    <!-- 导航栏 -->
    <nav-bar :title="title"/>
    <user-info :infoList="infoList"/>
    <!-- 推送列表  -->
    <my-push-list/>
    <!-- 底部 -->
    <tab-bar/>
  </div>
</template>

<script>
import navBar from '@/components/navBar'
import tabBar from '@/components/tabBar'
import UserInfo from './children/userInfo'
import MyPushList from './children/myPushList.vue'
export default {
  name: "profile",
  data() {
      return {
        title:'我的',
        infoList:{
          title:"用户名",
          thumb:"https://img.yzcdn.cn/vant/ipad.jpeg"
        }
      }
  },
  components: {
    navBar,
    tabBar,
    UserInfo,
    MyPushList
  },
  methods: {}
}
</script>

<style scoped>
.profile{
  
}
/deep/.van-nav-bar__title{
  color: #fff;
}
/deep/.van-nav-bar__content{
  background: #1989fa;
}
</style>
