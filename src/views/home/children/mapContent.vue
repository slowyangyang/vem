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
let marker,map
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
    this.$nextTick(()=> {

      this.init()
    })
  },
  methods: {
    init(){
      this.map = new AMap.Map("map", {
        resizeEnable: true,
        center: [106.902139,27.608208],
        zoom: 16
      });
    },
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
