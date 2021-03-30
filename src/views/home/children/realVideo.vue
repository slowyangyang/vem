<template>
  <div class="realVideo">
    <!-- 导航栏 -->
    <nav-bar :title="title" :left-arrow="true"/>
    <van-button size="mini" url="https://zs.thygps.com/clbs/v/monitoring/forward?key=EFAD60B7A0EC7016EE4AFC9B3CE5D52E&VehPlateNum=贵ED08707&VehPlateColorCode=2&Channel=1,2">点击</van-button>
    <!-- <van-button size="mini" url="https://www.baidu.com">百度</van-button> -->
  </div>
</template>

<script>
import navBar from '@/components/navBar.vue'
import request from 'network/request.js'
export default {
  name: 'realVideo',
  components: {
    navBar
  },
  data(){
    return {
      title:'实时视频'
    }
  },
  created(){
   
  }
}
</script>

<style scoped>
/deep/.van-nav-bar__title{
  color: #fff;
}
/deep/.van-nav-bar__content{
  background: #1989fa;
}
/deep/.van-nav-bar .van-icon{
  color: #fff;
}
</style>