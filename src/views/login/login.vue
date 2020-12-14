<template>
  <div class="login">
    <nav-bar 
      :title="title"/>
    <select-type @login="login"></select-type>
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
      title:'登录',
      code:''
    }
  },
  mounted(){
    this.getWxCode()
  },
  methods: {
    ...mapMutations(['saveToken']),
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
    },
    getWxCode(){
				if (isWechat()) {
					let appid = "wxf41afaa220983a6c"; //为测试号id
					let code = getUrlParam("code"); //是否存在code
					let local = window.location.href;
					// let local = 'http://h5.x*****o.com/'		//测试路径
					if (code == null || code === "") {				
						//不存在就打开上面的地址进行授权
						window.location.href =
							`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlencode(local)}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;				
						// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxae048f1b059e77c0&redirect_uri=http://devapi.xingyeqiao.com/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect								
					}else{
						this.code = code
					}
				}
			}
  }
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