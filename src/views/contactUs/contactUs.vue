<template>
  <div class="contactUs">
    <!-- <nav-bar :title="title" /> -->
    <div class="top">
      <van-image width="60" height="60" :src="img" />
      <div style="text-align:center;">
        <p style="fontSize:18px;fontWeight: bold;color: #c9181e;">泰&nbsp;&nbsp;&nbsp;&nbsp;恒&nbsp;&nbsp;&nbsp;&nbsp;元</p>
      </div>
    </div>
    <p class="contact">
      <span style="font-size: 22px;color:rgba(0,0,0,.7)">联系我们</span>
      <span>Contact us</span>
    </p>
    <div class="content">
      <h1 style="fontSize:18px;color:rgba(0,0,0,0.7);font-weight:bold;fontFamily:cursive;text-align:center;">贵州泰恒元科技股份有限公司</h1>
      <div class="address" >
        <p><van-icon name="location-o" color="#1989fa"/><span>地址：{{info.adds}}</span></p>
        <p><van-icon name="phone-circle-o" color="#07c160"/><span>电话：{{info.tel}}</span></p>
        <p><van-icon name="envelop-o" color="#ee0a24"/><span>邮箱：{{info.email}}</span></p>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import navBar from '../../components/navBar.vue'
import AMap from 'AMap' // 引入高德地图
export default {
  components: { navBar },
  name:'contactUs',
  data(){
    return {
      title: "联系我们",
      img:require("assets/image/logo.png"),
      info:{
        adds:'贵州省遵义市播州区侨龙财智B栋6楼',
        tel:'0852-28983748',
        email:'411098245@qq.com'
      },
      map:null
    }
  },
  mounted(){
    this.calcMapH()
    this.initMap()
    this.addMarker()
  },
  methods: {
    initMap() {
      let _this = this
      this.map = new AMap.Map('map', {
        resizeEnable: true,
        center:[106.876606,27.615845],
        zoom: 17
      })
    },
    calcMapH(){
      let body = $("body").height()
      let h1 = $(".top").height()
      let h2 = $(".contact").height()
      let h3 = $(".content").height()
      let h4 = body-h1-h2-h3
      $("#map").height(h4)
    },
    // 实例化点标记
    addMarker() {
      let _this = this
      let facilities = []
      //遍历标记数组
      // this.markers.forEach((val,index) => {
        let mark = new AMap.Marker({
          position: [106.876606,27.615845],
          label:{
                offset: new AMap.Pixel(0, 10),  //设置文本标注偏移量
                content: `<div class='info'>点击去这里</div>`, //设置文本标注内容
                direction: 'right' //设置文本标注方位
          },
        });
        //添加窗体
        // AMap.event.addListener( mark, "click",_this.createInfoWindow)
        mark.on('click',function(e){
          mark.markOnAMAP({
              name:'侨龙财智大厦B座',
              position:mark.getPosition()
          })
        })
        facilities.push(mark)
      // })
      //更新地图中心点
      // this.map.setCenter([106.876606,27.615845])
      //清除覆盖物
      this.map.clearMap()
      //在地图中添加marker
      this.map.add(facilities);
    },
    //创建窗体
    createInfoWindow(e) {
      let _this = this
      let data = ''
      console.log(data);
      let content = `<p class='w_title' style='text-align: center;font-size: 14px;font-weight:bold;margin-bottom:0.05rem'><a style="color:blue;text-decoration:underline;font-weight:normal">点击去这里</a></p>` 
      let infowindow = new AMap.InfoWindow({
        autoMove:true,
        offset: new AMap.Pixel(0, -10),
        content:content,
        showShadow:true,
        closeWhenClickMap:true
      })
      infowindow.open(this.map,e.target.getPosition())
      
    },
  }
}
</script>

<style scoped>
.contactUs{
  height: 100%;
  overflow: hidden;
}
/deep/.van-nav-bar__title{
  color: #fff;
}
/deep/.van-nav-bar__content{
  background: #1989fa;
}
.top{
  text-align: center;
  /* display: flex; */
  align-items: center;
  justify-content: center;
  margin-top: 0.2rem;
  margin-bottom:0.3rem
}
.content{
  padding: 0 0.2rem;
}
.contact{
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-weight: bold;
  color: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.2rem;
}
.address{
  margin-bottom: 0.2rem;
}
.address > p{
  font-size: 15px;
  line-height: 3;
  vertical-align: middle;
  display: flex;
  align-items: center;
}
.address > p > span{
  margin-left:0.05rem
}
#map{
  width: 100%;
}
/deep/.amap-marker-label{
  box-shadow: 18px 13px 13px -5px #a7a7a7;
  border:none
}
</style>