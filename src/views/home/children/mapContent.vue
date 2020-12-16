<template>
  <div class="map_content">
    <div id="map">

    </div>
    <button @click='addMarker' style="position: absolute;
    top: 150px;
    right: 20px;
    z-index: 100;">添加标记</button>
  </div>
</template>

<script>
import AMap from 'AMap' // 引入高德地图
export default {
  name: "mapContent",
  components: {},
  data() {
    return {
      center:[],
      map:null,
      marker:null
    }
  },
  mounted(){
    this.init()
  },
  methods: {
    init(){
      let _this = this
      this.map = new AMap.Map("map", {
        resizeEnable:true,
        center: [106.915181,27.712056],
        zoom: 13
    });
    this.marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [106.902139,27.608208],
            offset: new AMap.Pixel(-13, -30),
            label:{contetn:'健康减肥'}
        });
        this.marker.setMap(this.map);
    
// 将创建的点标记添加到已有的地图实例：
// this.map.add(marker);
      // this.map.plugin('AMap.Geolocation', function() {
      //   var geolocation = new AMap.Geolocation({
      //       enableHighAccuracy: true,//是否使用高精度定位，默认:true
      //       timeout: 10000,          //超过10秒后停止定位，默认：5s
      //       showButton:false,    //定位按钮的停靠位置
      //       buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      //       zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
      //       showMarker:true,
      //   });
      //   this.map.addControl(geolocation);
      //   geolocation.getCurrentPosition(function(status,result){
      //     console.log(status);
      //       if(status=='complete'){
      //           onComplete(result)
      //       }else{
      //           onError(result)
      //       }
      //   });
      // });
    },
    // 实例化点标记
    // 实例化点标记
    addMarker() {
        if(this.marker) {
          return;
        }
        this.marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [106.902139,27.608208],
            offset: new AMap.Pixel(-13, -30),
            label:{contetn:'健康减肥'}
        });
        this.marker.setMap(this.map);
    },
    //创建窗体
    updateContent() {
        if(!this.marker) {
          return;
        }
        // 自定义点标记内容
        var markerContent = document.createElement("div");

        // 点标记中的图标
        var markerImg = document.createElement("img");
        markerImg.className = "markerlnglat";
        markerImg.src = "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png";
        markerContent.appendChild(markerImg);

        // 点标记中的文本
        var markerSpan = document.createElement("span");
        markerSpan.className = 'marker';
        markerSpan.innerHTML = "Hi，我被更新啦！";
        markerContent.appendChild(markerSpan);

        this.marker.setContent(markerContent); //更新点标记内容
        this.marker.setPosition([116.391467, 39.927761]); //更新点标记位置
    }
  }
}
</script>

<style scoped>
  #map{
    width: 100%;
    height: 100%;
  }
  /deep/.amap-icon{
    width: 20px;
    height: 30px;
  }
</style>
