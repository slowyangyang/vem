<template>
  <div class="login">
    <nav-bar 
      :title="title"/>
    <select-type @login="login"></select-type>
  </div>
</template>

<script>
import selectType from './children/selectType'
import navBar from '@/components/navBar'
import {login} from '@/network/login'
export default {
  name: 'login',
  components: {
    navBar,
    selectType,
  },
  data(){
    return {
      title:'登录'
    }
  },
  methods: {
    login(value){
      login().then(res => {
        console.log(res);
      })
    }
  }
}
</script>

<style scoped>
/deep/.van-tabbar--fixed{
  display: none;
}
/deep/ .van-hairline--top-bottom{
  display: none;
}
/deep/.van-nav-bar__title{
  color: #1989fa;
}

</style>