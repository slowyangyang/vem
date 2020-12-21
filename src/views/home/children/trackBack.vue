<template>
  <div class="trackBack">
    <nav-bar 
      :title="title" 
      :left-arrow="true"/>
    <div id="map">
    </div>
    <div class="input-card">
    <div class="input-item">
        <input type="button" class="btn" value="开始动画" id="start" @click="startAnimation()"/>
        <input type="button" class="btn" value="暂停动画" id="pause" @click="pauseAnimation()"/>
    </div>
    <div class="input-item">
        <input type="button" class="btn" value="继续动画" id="resume" @click="resumeAnimation()"/>
        <input type="button" class="btn" value="停止动画" id="stop" @click="stopAnimation()"/>
    </div>
</div>
  </div>
</template>

<script>
import NavBar from '../../../components/navBar.vue'
import tabBar from '../../../components/tabBar.vue'
import AMap from 'AMap' // 引入高德地图
import { backPlay } from 'network/home'
import pako from 'pako'
export default {
  components: { tabBar,NavBar },
  name: "trackBack",
  data(){
    return {
      title:'轨迹回放',
      map:null,
      center:null,
      result:[],
      lineArr :[],
      marker:null,
      polyline:null,
      passedPolyline:null,
      baseUrl: process.env.BASE_URL
    }
  },
  mounted(){
    this.fetch()
    // this.addmarker()
  },
  methods: {
    init(){
      let _this = this
      this.map = new AMap.Map("map", {
        resizeEnable: true,
        center: _this.center,
        zoom: 15
      });
      this.marker = []
      this.marker.push(new AMap.Marker({
        position:[_this.lineArr[0][0],_this.lineArr[0][1]] || [],
        icon: _this.IconType(0,40,30),
        offset: new AMap.Pixel(-15, -25),
        angle:-90,
        zIndex:20
      }))
      this.marker.push(new AMap.Marker({
        position:[_this.lineArr[0][0],_this.lineArr[0][1]] || [],
        icon: _this.IconType(2,28,20),
        offset: new AMap.Pixel(-20, -9),
        autoRotation: true,
        angle:-90,
      }))
      this.marker.push(new AMap.Marker({
        position: [_this.lineArr[_this.lineArr.length-1][0],_this.lineArr[_this.lineArr.length-1][1]] || [],
        icon: _this.IconType(1,40,30),
        offset: new AMap.Pixel(-25,-25),
        autoRotation: true,
        zIndex:20
      }))
      
      //更新地图中心点
      this.map.setCenter(_this.lineArr ?  [_this.lineArr[0][0],_this.lineArr[0][1]] : [])
      // //在地图中添加marker
      this.map.add(_this.marker);
      //途径
      let passedPolyline = new AMap.Polyline({
        map: _this.map,
        // path: _this.lineArr,
        strokeColor: "#AF5",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式,
        extData:{rr:0}
      });
      //画线
      let polyline = new AMap.Polyline({
        map: _this.map,
        path: _this.lineArr,
        showDir:true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
      this.marker[1].on('moving', function (e) {
        passedPolyline.setPath(e.passedPath);
        // 设置地图中心点
        _this.map.setCenter(e.target.getPosition())
      });
      this.map.setFitView()
    },
    IconType(index,w,h){
      let _this = this
      let imgUrl
      if(index === 0 ){
        imgUrl = this.baseUrl+"startmarker.png"
      }else if(index === 1){
        imgUrl = this.baseUrl+"endmarker.png"
      }else if(index == 2){
        imgUrl = "https://webapi.amap.com/images/car.png"
      }
      let Icon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(w, h),
        // 图标的取图地址
        image: imgUrl,
        // 图标所用图片大小
        imageSize: new AMap.Size(w, h),
      })
      return Icon
    },
    // 绘制轨迹
    Polylines(){
      let _this = this
    this.polyline = new AMap.Polyline({
        map: _this.map,
        path: _this.lineArr,
        showDir:true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
    });
    },
    passedPolylines(){
      let _this = this
      this.passedPolyline = new AMap.Polyline({
        map: _this.map,
        // path: lineArr,
        strokeColor: "#AF5",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
    },
    startAnimation () {
      let _this = this
        this.marker[1].moveAlong(_this.lineArr, 3000);
    },
    pauseAnimation () {
        this.marker[1].pauseMove();
    },
    resumeAnimation () {
        this.marker[1].resumeMove();
    },
    stopAnimation () {
        this.marker[1].stopMove();
    },
    fetch(){
      let data = this.$route.query
      let plateno = data.plateNo
      let sTime = this.getNowDate("00:00:00")
      let eTime = this.getNowDate("23:59:59")
      console.log(sTime,eTime,plateno);
      backPlay(plateno,sTime,eTime).then(res => {
        if(res.data.status == 0){
          let data = res.data.result.carHistory
          this.result = this.unzip(data)
          console.log(this.lineArr);
          console.log(this.result);
          if(this.result.length !== 0){
            this.lineArr = []
            this.result.forEach(val => {
              this.lineArr.push([val.longitude,val.latitude])
            })
            //初始化地图
            this.init()
          }else{
             this.$notify({ type: 'primary', message: '暂无历史轨迹'});
             //初始化地图
            this.init()
          }
          
        }
      })
    },
    getNowDate(t){
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
      return y+'-'+m+'-'+d+' '+t
    },
    // 解析
    unzip(key) {
      let charData = key.split('').map(item => item.charCodeAt(0))
      let array = pako.inflate(charData)
      // 如果字符太大，会导致内存溢出报错，这里使用分片处理
      return this.Utf8ArrayToStr(array)
    },
    Utf8ArrayToStr(array) {
      var out, i, len, c;
      var char2, char3;
      out = "";
      len = array.length;
      i = 0;
      while (i < len) {
        c = array[i++];
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
          case 12:
          case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(((c & 0x0F) << 12) |
              ((char2 & 0x3F) << 6) |
              ((char3 & 0x3F) << 0));
            break;
        }
      }
      return JSON.parse(out)
    },
  }
}
    
</script>

<style scoped>
.trackBack{
  height: 100%;
}
/deep/.van-nav-bar__title{
  color: #fff;
}
/deep/.van-nav-bar__content{
  background: #1989fa;
}
/deep/.van-nav-bar .van-icon{
  color: #fff;
}
#map{
  width: 100%;
  height: calc(100% - 46px);
}
/deep/.amap-logo{
  display: none!important;
}
/deep/.amap-copyright{
  display: none!important;
}
/* /deep/.amap-icon{
  width: 32px;
  height: 20px;
} */
.input-card{
  position: fixed;
  bottom: 0;
}
</style>