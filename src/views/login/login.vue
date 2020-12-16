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
import {login, getAppId} from '@/network/login'
import { mapMutations  } from 'vuex'
// import { GetUrlParam, setCookie, getCookie} from '@/common/utils'
export default {
  name: 'login',
  components: {
    navBar,
    selectType,
  },
  data(){
    return {
      title:'登录',
      code:'',
      APPID :'wxf41afaa220983a6c',
      local:'',
      openId:'',
    }
  },
  created(){
    this.getwxCode()
  },
  methods: {
    ...mapMutations(['saveToken']),
    login(value){
      let that = this
      if(this.openID){
        value.openID = this.openID
      }
      login(value).then(res => {
        let data = res.data
        if(data.status == 0){
          //保存token
          localStorage.Authorization = JSON.stringify(data.jwtToken)
          that.saveToken({ token: data.jwtToken})
          that.$router.push({path:'/home'})
          this.$notify({ type: 'primary', message: '登录成功'});
        }else{
          this.$notify({ type: 'danger', message: '登陆失败,请重新登录'});
        }
      }).catch(err => {
        this.$notify({ type: 'primary', message: '登录超时，请重新登录'});
      })
    },
    getwxCode() { // 非静默授权，第一次有弹框
      let code = this.getUrlParam('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      this.local = window.location.href
      if(code == null || code === '') {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +this.APPID + '&redirect_uri=' + encodeURIComponent(this.local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
      }else{
        this.getOpenId(code)
      }
    },
    getOpenId (code) { // 通过code获取 openId等用户信息
      let _this = this
      getAppId({code}).then((res) => {
        console.log(res);
          let data = res.data
          if (data.status == 0) {
            this.$router.push({path:'/home'})
          }else{
            this.openID = data.result
            this.$router.push({path:'/login'})
            this.$notify({ type: 'primary', message: '请先登录'});
          }
      }).catch((error) => {
        console.log(error);
        this.$notify({ type: 'danger', message: '验证失败'});
      })
    },
    getUrlParam(name){
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
      }
    },
    
   
    
}
</script>

<style scoped>
/deep/.van-nav-bar__title{
  color: #fff;
}
/deep/.van-nav-bar__content{
  background: #1989fa;
}
/deep/.van-tabbar--fixed{
  display: none;
}
/deep/ .van-hairline--top-bottom{
  display: none;
}
</style>