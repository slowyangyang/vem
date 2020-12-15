<template>
  <div class="login">
    <nav-bar 
      :title="title"/>
    <select-type @login="login"></select-type>
    <van-loading color="#1989fa" v-if="showLoading"/>
  </div>
</template>
<script>
// 判断是否为公众号模拟器环境
	const isWechat = () => {
		return String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) === "micromessenger";
	}

// 判断公众号截取code
	const getUrlParam = (name) => {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		let r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}
import selectType from './children/selectType'
import navBar from '@/components/navBar'
import {login, getAppId} from '@/network/login'
import { mapMutations  } from 'vuex'
import { GetUrlParam, setCookie, getCookie} from '@/common/utils'
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
      showLoading:false
    }
  },
  created(){
    this.getwxCode()
  },
  methods: {
    ...mapMutations(['saveCookie']),
    login(value){
      let that = this
      if(this.openID){
        value.openID = this.openID
      }
      this.showLoading = true
      login(value).then(res => {
        let data = res.data
        this.showLoading = false
        if(data.status == 0){
          //设置coolie
          setCookie("JSESSIONID",data.jwtToken)
          // 保存cookie
            that.saveCookie({ JSESSIONID: data.jwtToken})
            that.$router.push({path:'/home'})
            this.$notify({ type: 'primary', message: '登录成功',duration: 2000, });
          }else{
            this.$notify({ type: 'danger', message: '登陆失败,请重新登录',duration: 1000, });
        }
      }).catch(err => {
        this.showLoading = false
        this.$notify({ type: 'primary', message: '登录超时，请重新登录',duration: 1000, });
      })
    },
    getwxCode() { // 非静默授权，第一次有弹框
      let code = this.getUrlParam('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      this.local = window.location.href
      if(code == null || code === '') {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +this.APPID + '&redirect_uri=' + encodeURIComponent(this.local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
      }else{
        this.getOpenId(code) //把code传给后台获取用户信息
      }
    },
    getOpenId (code) { // 通过code获取 openId等用户信息
      let _this = this
      this.showLoading = true
      getAppId({code}).then((res) => {
        console.log(res);
        this.showLoading = false
          let data = res.data
          if (data.status == 0) {
            this.$router.push({path:'/home'})
          }else{
            this.openID = data.result
            this.$router.push({path:'/login'})
            this.$notify({ type: 'warning', message: '请先登录',duration: 1000, });
          }
      }).catch((error) => {
        this.showLoading = false
        this.$notify({ type: 'warning', message: '请先登录',duration: 1000, });
         console.log(error)
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