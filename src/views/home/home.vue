<template>
  <div class="home">
    <nav-bar
      :title="title"/>
    <Search 
      @Search="Search"
      @Cancel="Cancel"/>
    <tab-bar/>
  </div>
</template>
<script>
import navBar from '@/components/navBar'
import tabBar from '@/components/tabBar'
import Search from './children/search'
import NavBar from '../../components/navBar.vue'
export default {
  name:'home',
  components: {
    navBar,
    tabBar,
    Search
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
  /deep/.van-nav-bar__title{
  color: #1989fa;
}
</style>