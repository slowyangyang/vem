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
import axios from 'axios'
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
  activated(){
    if(window.location.href.indexOf("?") !== -1){
      location.href=this.ridUrlParam(window.location.href,['code','state'])
    }
  },
  methods: {
    Search(e){
      console.log(e);
    },
    Cancel(){
      //清除搜索内容
    },
   //获取JSSDK鉴权
    getJsSdk(){
      let url = location.href.split("#")[0]
      console.log(url);
      getSDK(url).then(res => {
        console.log(res);
      })
    },
    //消除地址栏参数
    ridUrlParam(url,aParam){
      aParam.forEach(item => {
        const fromindex = url.indexOf(`${item}=`) //必须加=号，避免参数值中包含item字符串
        if (fromindex !== -1) {
          // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
          const startIndex = url.indexOf('=', fromindex)
          const endIndex = url.indexOf('&', fromindex)
          const hashIndex = url.indexOf('#', fromindex)
          
          let reg;
          if (endIndex !== -1) { // 后面还有search参数的情况
            const num = endIndex - startIndex
            reg = new RegExp(`${item}=.{${num}}`)
            url = url.replace(reg, '')
          } else if (hashIndex !== -1) { // 有hash参数的情况
            const num = hashIndex - startIndex - 1
            reg = new RegExp(`&?${item}=.{${num}}`)
            url = url.replace(reg, '')
          } else { // search参数在最后或只有一个参数的情况
            reg = new RegExp(`&?${item}=.+`)
            url = url.replace(reg, '')
          }
        }
      })
      const noSearchParam = url.indexOf('=') 
      if( noSearchParam === -1 ){
        url = url.replace(/\?/, '') // 如果已经没有参数，删除？号
      }
      return url    
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