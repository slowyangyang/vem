<template>
  <div class="profile">
    <!-- 导航栏 -->
    <nav-bar :title="title"/>
    <user-info :infoList="infoList"/>
    <!-- 推送列表  -->
    <my-push-list/>
    <!-- 退出登录 -->
    <van-button type="danger" round  @click="show = true">退出登录</van-button>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      description="确定退出吗？"
      close-on-click-action
      @select="exit"/>
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
        title:"叮叮当",
        thumb:"https://img.yzcdn.cn/vant/ipad.jpeg"
      },
      show:false,
        actions: [
        { name: '确定', color: '#ee0a24' }],
    }
  },
  components: {
    navBar,
    tabBar,
    UserInfo,
    MyPushList
  },
  methods: {
    exit(e){
      exitLogin().then(res => {
        if(res.data.code === '0'){
          db.remove("USER")
          db.remove("token")
          this.$router.push({path:'/login'})
        }else{
          this.$notify({ type: 'primary', message: '退出失败'});
        }
      })
    }
  },
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
.van-button--round{
  width: 85%;
  height:0.44rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.8rem;
}
</style>
