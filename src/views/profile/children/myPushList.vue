<template>
  <div class="pushList">
    <van-list>
      <van-cell 
        v-for="item in list" 
        :key="item.id" 
        :title="item.title" 
        :icon="item.icon"
        :to="item.link" 
        is-link/>
    </van-list>
  </div>
</template>

<script>
export default {
  name:'pushList',
  data(){
    return {
      list:[
        {
          id:0,
          title:'平台绑定',
          icon:'',
          link:''
        },{
          d:0,
          title:'报警推送类型',
          icon:'',
          link:'/policePush'
        }]
    }
  }
}
</script>

<style>

</style>