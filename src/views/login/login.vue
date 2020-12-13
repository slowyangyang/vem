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
import { mapMutations  } from 'vuex'
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
    ...mapMutations({saveToken}),
    login(value){
      let that = this
      login().then(res => {
        console.log(res);
        //保存token
        // that.saveToken({ Authorization: _this.userToken })
        that.$router.push({path:'/home'})
      }).catch(err => {
        console.log(err);
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