<template>
  <div class="home">
    <!-- 导航栏 -->
    <nav-bar :title="title"/>
    
    <!-- 搜索 -->
    <Search @Search="Search" @Cancel="Cancel"/>
    
    <!-- 地图 -->
    <map-content class="map_box"/>
      
    <van-loading color="#1989fa" v-if="showLoading"/>
    <!-- 底部 -->
    <tab-bar/>
  </div>
</template>
<script>
import navBar from '@/components/navBar'
import tabBar from '@/components/tabBar'
import Search from './children/search'
import mapContent from './children/mapContent'
import {getCookie} from 'common/utils'
import { getSDK } from 'network/home'
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
      title:'车辆监控',
      showLoading:false
    }
  },
  mounted(){
    // this.getJsSdk()
  },
  methods: {
   Search(e){
     console.log(e);
   },
   Cancel(){
     //清除搜索内容
   },
   getJsSdk(){
    let url = location.href.split("#")[0]
    console.log(url);
    getSDK(url).then(res => {
      console.log(res);
    })
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
/deep/.amap-logo{
  display: none!important;
}
/deep/.amap-copyright{
  display: none!important;
}
/deep/.ztree *{
  font-size: 14px;
}
</style>