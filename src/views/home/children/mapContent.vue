<template>
  <div class="map_content">
    <div id="map">

    </div>
    <!-- <button @click='addMarker' style="position: absolute;
    top: 150px;
    right: 20px;
    z-index: 100;">添加标记</button> -->
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
      center:[106.902139,27.608208],
      map:null,
      markers:[{
        longitude:'106.911736',
        latitude:'27.620252',
        plate:"川AA4156",
        speed:'40',
        time:'2020-12-17 14:11:22'
      },{
        longitude:'106.904402',
        latitude:'27.617172',
        plate:"川AA4156",
        speed:'45',
        time:'2020-12-15 14:23:56'
      },{
        longitude:'106.916665',
        latitude:'27.617158',
        plate:"川AA4156",
        speed:'38',
        time:'2020-12-14 14:11:22'
      }],
      baseUrl: process.env.BASE_URL

    }
  },
  created(){
    
  },
  activated(){
    this.$Bus.$on("getlocal",position => {
      // this.markers = []
      this.markers = position
      console.log([this.markers[0].longitude,this.markers[0].latitude]);
      this.addMarker()
    })
  },
  mounted(){
    this.$nextTick(()=> {
      this.init()
    })
  },
  beforeDestroy(){
    this.$Bus.$off("getlocal")
  },
  methods: {
    init(){
      let _this = this
      this.map = new AMap.Map("map", {
        resizeEnable: true,
        center: _this.center,
        zoom: 16
      });
    },
    // 实例化点标记
    addMarker() {
      let _this = this
      let facilities = []
      //设置Icon
      var startIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(25, 25),
        // 图标的取图地址
        image: _this.baseUrl+"marker.png", // 您自己的图标
        // 图标所用图片大小
        imageSize: new AMap.Size(25, 25),
      });
      //遍历标记数组
      this.markers.forEach((val,index) => {
        let mark = new AMap.Marker({
          icon: startIcon,
          position: [val.longitude,val.latitude],
          offset: new AMap.Pixel(-10,-5),
          label:{
                  offset: new AMap.Pixel(0, 10),  //设置文本标注偏移量
                  icon:startIcon,
                  content: `<div class='info'>${val.plateNo}</div>`, //设置文本标注内容
                  direction: 'right' //设置文本标注方位
          },
          extData:{
            plate:val.plateNo,
            local:val.location,
            speed:val.velocity,
            time:val.sendTime,
            weight:val.weightF8 ? val.weightF8/1000 : 0
          }
        });
        //添加窗体
        AMap.event.addListener( mark, "click",_this.createInfoWindow)
        facilities.push(mark)
      })
      //更新地图中心点
      this.map.setCenter([this.markers[0].longitude,this.markers[0].latitude])
      //清除覆盖物
      this.map.clearMap()
      //在地图中添加marker
      this.map.add(facilities);
    },
    //创建窗体
    createInfoWindow(e) {
      let _this = this
      let data = e.target.getExtData()
      // data.plate = '渝D44497'
      //实时视频本平台的车无数据，可能会无法观看
      let content = `<p class='w_title' style='text-align: center;font-size: 14px;font-weight:bold;margin-bottom:0.05rem'>${data.plate}</p>
                      <div class='w_content' style='margin-bottom:0.05rem'>
                        <p style='margin-bottom:0.05rem'>速度：${data.speed} (km/h)</p>
                        <p style='margin-bottom:0.05rem'>时间：${data.time}</p>
                        <p>重量：${data.weight}吨</p>
                      </div>
                      <div>地点：${data.local}</div>
                      <div class='w_tools' style='display:flex;justify-content:center;color:#4696e6'>
                      <div style='margin-right:0.1rem' onclick="playBack()">轨迹回放</div>
                      <div style=''">
                      <a style="color:#4696e6" href=https://zs.thygps.com/clbs/v/monitoring/forward?key=EFAD60B7A0EC7016EE4AFC9B3CE5D52E&VehPlateNum=${data.plate}&VehPlateColorCode=2&Channel=1,2">实时视频</a>
                      </div></div>`
      let infowindow = new AMap.InfoWindow({
        autoMove:true,
        offset: new AMap.Pixel(0, -10),
        content:content,
        showShadow:true,
        closeWhenClickMap:true
      })
      infowindow.open(this.map,e.target.getPosition())
      //轨迹回放
      window.playBack = ()=>{
        _this.$router.push({path:'/trackBack?plateNo='+data.plate})
      }
      window.playVideo = ()=>{

        // _this.$router.push({path:'/realVideo?plateNo='+data.plate})
      }
      //详情
      window.detail = ()=>{
        
      }
      
    },
    //逆地址解析
    regeoCode(lnglat){
      var geocoder = new AMap.Geocoder({
        city: "010", //城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      });
      geocoder.getAddress(lnglat, (status, result) =>{
        if (status === 'complete'&& result.regeocode) {
            var address = result.regeocode.formattedAddress;
            document.getElementById('address').value = address;
        }else{
            log.error('根据经纬度查询地址失败')
        }
      });
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
  /deep/.amap-marker-label{
    border:0;
    border-radius: 6px;
    padding: 5px;
    background: #329696;
    color: #000;
  }
  /deep/.amap-info-content{
    width: 250px;
    background:rgba(255,255,255,0.8);
    border:0.01rem solid #ccc;
  }
  .w_title{
    text-align: center;
    font-size: 14px;
    margin-bottom: 0.05rem;
  }
  .w_content{
    color: #151515;
  }
   .w_content > p:first-child{
     margin-bottom: 0.08rem;
   }
   .w_tools{
    background: red;
   }
   .w_tools > div:first-child{
     margin-right: 0.2rem;
   }
</style>
