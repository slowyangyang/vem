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
import {login, isLogin} from '@/network/login'
import { mapMutations  } from 'vuex'
import db from 'common/localstorage'
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
      // APPID :'wx94adebbf72b68282',
      local:'',
      openId:'',
    }
  },
  created(){
    this.getwxCode()
  },
  methods: {
    ...mapMutations(['saveUser']),
    login(value){
      let that = this
      if(this.openId){
        value.openId = this.openId
      }
      login(value).then(res => {
        let data = res.data
        // console.log(data);
        if(data.status == 0){
          //保存用户信息
          this.saveUser(data.result)
          db.save("USER",data.result)
          db.save("OPENID",data.result.openid)
          that.$router.push({path:'/home'})
          this.$Toast({message:"登录成功",duration:1500})
        }else{
          this.$Toast({message:"登录失败，请重新登录",duration:1500})
        }
      }).catch(err => {
        this.$notify({ type: 'primary', message: data.message});
      })
    },
    getwxCode() { // 非静默授权，第一次有弹框
      let code = this.getUrlParam('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      let local = window.location.href
      // return false
      if(code == null || code === '') {
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.APPID}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
      }else{
        this.getOpenId(code)
      }
    },
    getOpenId (code) { // 通过code获取 openId等用户信息
      let _this = this
      isLogin({code}).then((res) => {
        console.log(res);
          let data = res.data
          if (data.status === '0') {
            //保存用户信息
            this.saveUser(data.result)
            db.save("USER",data.result)
            this.$router.push({path:'/home'})
            
          }else{
            this.openId = data.result
            db.save("OPENID",data.result.openid)
            this.$router.push({path:'/login'})
            this.$notify({ type: 'primary', message: "请先登录"});
          }
      }).catch((error) => {
        console.log(error);
        // this.$notify({ type: 'danger', message: '服务器错误'});
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
/deep/.van-button--normal{
  height: 0.4rem;
}
</style>