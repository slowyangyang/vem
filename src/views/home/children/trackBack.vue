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
export default {
  components: { tabBar,NavBar },
  name: "trackBack",
  data(){
    return {
      title:'轨迹回放',
      map:null,
      center:null,
      lineArr :[[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]],
      marker:null,
      polyline:null,
      passedPolyline:null,
      i:0
    }
  },
  mounted(){
    this.init()
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
      this.marker = new AMap.Marker({
        position: _this.lineArr[0],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle:-90,
      });
      
      //更新地图中心点
      this.map.setCenter(_this.lineArr[0])
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
      this.marker.on('moving', function (e) {
        console.log(e);
        passedPolyline.setPath(e.passedPath);
        // 设置地图中心点
        _this.map.setCenter(e.target.getPosition())
        // 设置旋转角
        // _this.map.setRotation(-e.target.getOrientation())
      });

    },
    addmarker(){
      let _this = this
      this.marker = new AMap.Marker({
        map: _this.map,
        position: this.lineArr[0],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle:-90,
      });
      this.marker.on('moving', function (e) {
        _this.passedPolylines.setPath(e.passedPath);
      });
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
        this.marker.moveAlong(_this.lineArr, 200);
    },

    pauseAnimation () {
        this.marker.pauseMove();
    },

    resumeAnimation () {
        this.marker.resumeMove();
    },

    stopAnimation () {
        this.marker.stopMove();
    }
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
/deep/.amap-icon{
  width: 50px;
  height: 30px;
}
.input-card{
  position: fixed;
  bottom: 0;
}
</style>