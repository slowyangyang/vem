<template>
  <div class="home">
    <!-- 导航栏 -->
    <nav-bar :title="title"/>
    
    <!-- 搜索 -->
    <Search @Search="Search" @Cancel="Cancel"/>
    
    <!-- 地图 -->
    <map-content class="map_box"/>
      
    
    <!-- 底部 -->
    <tab-bar/>
  </div>
</template>
<script>
import navBar from '@/components/navBar'
import tabBar from '@/components/tabBar'
import Search from './children/search'
import mapContent from './children/mapContent'
export default {
  name:'home',
  components: {
    navBar,
    tabBar,
    Search,
    mapContent
  },
  data(){
    return {
      title:'车辆监控'
    }
  },
  methods: {
   Search(e){
     console.log(e);
   },
   Cancel(){
     //清除搜索内容
   }
  }  
}
</script>
<style scoped>
.home{
  height:100%
}
/deep/.van-nav-bar__title{
  color: #fff;
}
/deep/.van-nav-bar__content{
  background: #1989fa;
}
.map_box{
  height: calc(100% - 50px - 46px - 54px);
}
</style>