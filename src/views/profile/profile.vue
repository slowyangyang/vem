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
import db from 'common/localstorage'
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
  methods: {},
  mounted(){
    this.infoList = db.get("USER")
  }
}
</script>

<style scoped>
.profile{
  height: calc(100% - 46px - 44px);
}
/deep/.van-nav-bar__title{
  color: #fff;
}
/deep/.van-nav-bar__content{
  background: #1989fa;
}
/deep/.van-nav-bar .van-icon{
  color: #fff;
}
/deep/.van-button--normal{
  height: 0.44rem;
}
</style>
