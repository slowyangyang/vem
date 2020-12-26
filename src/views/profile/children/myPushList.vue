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
import db from 'common/localstorage'
import { exitLogin } from 'network/profile'
export default {
  name:'pushList',
  data(){
    return {
      list:[{
          id:0,
          title:'报警推送类型',
          icon:'',
          link:'/policePush'
        }],
    }
  },
  methods: {
  
  }
}
</script>

<style scoped>
.pushList{
  
}

</style>