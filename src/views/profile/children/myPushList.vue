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
    <van-button type="danger" round  @click="show = true">退出登录</van-button>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      description="确定退出吗？"
      close-on-click-action
      @select="exit"/>
  </div>
</template>

<script>
import db from 'common/localstorage'
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
        show:false,
        actions: [
        { name: '确定', color: '#ee0a24' },
      ],
    }
  },
  methods: {
    exit(e){
      db.remove("USER")
      db.remove("token")
      this.$router.push({path:'/login'})
    }
  }
}
</script>

<style>
.pushList{
  
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