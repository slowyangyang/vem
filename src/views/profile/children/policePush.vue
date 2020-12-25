<template>
  <div class="policePush">
    <nav-bar :title="title" :left-arrow="true"/>
    <push-tab/>
    <!-- <tab-bar/> -->
  </div>
</template>

<script>
import navBar from '@/components/navBar'
import tabBar from '@/components/tabBar'
import PushTab from './pushTab.vue'
export default {
  name:'policePush',
  data(){
    return {
      title:'报警推送类型',
      infoList:{

      }
    }
  },
  components: {
    navBar,
    tabBar,
    PushTab,
    
  }
}
</script>

<style scoped>
.policePush{
  height: 100%;
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
</style>