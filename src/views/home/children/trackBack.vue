<template>
  <div class="trackBack">
    <nav-bar 
      :title="title" 
      :left-arrow="true"/>
    <tab-bar/>
  </div>
</template>

<script>
import NavBar from '../../../components/navBar.vue'
import tabBar from '../../../components/tabBar.vue'
export default {
  components: { tabBar,NavBar },
  name: "trackBack",
  data(){
    return {
      title:'轨迹回放'
    }
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