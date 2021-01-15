<template>
  <div class="trackBack">
    <nav-bar 
      :title="$route.query.plateNo" 
      :left-arrow="true"/>
    <div id="map"></div>
    <!-- 播放控制 -->
    <div class="control">
      <van-row type="flex" justify="space-between" align="center" gutter="10">
       <van-col :span="3" v-if="isPlay && palyStayus === 0"><van-icon name="play-circle-o" :size="24" @click="navgControl('start')"/></van-col>
        <van-col :span="3" v-if="isPlay && palyStayus === 1"><van-icon name="play-circle-o" :size="24" @click="navgControl('resume')"/></van-col>
        <van-col :span="3" v-if="!isPlay"><van-icon name="pause-circle-o" :size="24" @click="navgControl('pause')"/></van-col>
        <van-col :span="16"><van-slider v-model="sliderVal" button-size="20"  @change="onChange" @input="onInput"/></van-col>
        <van-col :span="2">
          <van-popover
            v-model="showPopover"
            trigger="click"
            :actions="actions"
            theme="dark"
            placement="top"
            @select="changeSpeed">
            <template #reference>
              <van-button size="samll">x{{times}}</van-button>
            </template>
          </van-popover>
        </van-col>
        <van-col :span="3"><van-icon name="setting-o" :size="24" @click="openSetting"/></van-col>
      </van-row>
    </div>
    <!-- 参数查询 -->
    <van-overlay :show="show">
      <div class="wrapper" @click.stop>
        <div class="block">
          <p style="text-align:center;margin:0.1rem 0">查询参数</p>
          <div style="margin-bottom:0.1rem">
            <van-row type="flex" justify="space-around" align="center">
              <van-col v-for="(item,index) in parmaList" :key="index"><van-button type="info" round size="mini" @click="dateClick(index)">{{item}}</van-button></van-col>
            </van-row>
          </div>
          <div style="margin-bottom:0.5rem">
            <div>
            <van-cell is-link @click="pickShow1 = true">开始时间：{{startTime}}</van-cell>
            <van-popup v-model="pickShow1" position="bottom" :style="{ height: '40%' }">
              <van-datetime-picker
                v-model="scurrentDate"
                type="datetime"
                title="选择开始时间"
                :formatter="formatter"
                @confirm="spickerConfirm"
                @cancel="pickerCancel"/>
            </van-popup>
          </div>
          <div>
            <van-cell is-link @click="pickShow2 = true">结束时间：{{endTime}}</van-cell>
            <van-popup v-model="pickShow2" position="bottom" :style="{ height: '30%' }">
              <van-datetime-picker
                v-model="ecurrentDate"
                type="datetime"
                title="选择结束时间"
                :formatter="formatter"
                @confirm="epickerConfirm"
                @cancel="pickerCancel"/>
            </van-popup>
          </div>
          </div>
          <!-- <div>
            <van-cell is-link @click="lowSpeed=true">低速(最高)：{{speed1}}</van-cell>
            <van-popup v-model="lowSpeed" position="bottom" :style="{ height: '30%' }">
              <van-picker
                title="速度选择"
                show-toolbar
                :columns="columns1"
                @confirm="lowConfirm"
                @cancel="lowSpeed = false"/>
            </van-popup>
          </div>
          <div>
            <van-cell is-link @click="heightSpeed=true">中速(最高)：{{speed2}}</van-cell>
            <van-popup v-model="heightSpeed" position="bottom" :style="{ height: '30%' }">
              <van-picker
                title="速度选择"
                show-toolbar
                :columns="columns2"
                @confirm="heightConfirm"
                @cancel="heightSpeed = false"/>
            </van-popup>
          </div> -->
          <div class="w_bottom">
            <div class="btn" @click="show = false">取消</div>
            <div class="btn" @click="btnConfirm">确认</div>
          </div>
        </div>
      </div>
    </van-overlay>
    <!-- 轨迹详情 -->
    <div class="trackInfo" v-if="infoShow">
      <p>位置：{{trackInfo.location}}</p>
      <p><span>速度：</span>{{trackInfo.velocity}} km/h</p>
      <p><span>时间：</span>{{trackInfo.sendTime}}</p>
      <p><span>重量：</span>{{trackInfo.weight}}吨</p>
      <p><span>里程：</span>{{parseInt(trackInfo.distance)/1000}}km</p>
    </div>
    <!-- 载重 -->
    <div class="carLoad" ref="carLoad">
      <p class="controlCharts" @click="trolHandel"><van-icon :name="loadShow ? 'arrow-down' : 'arrow-up'" /></p>
      <!-- <div class="loadBox"> -->
        <div id="loadMain" class="loadMain" ref="loadMain" style="width: 100%;"></div>
        <!-- <van-empty image="https://img.yzcdn.cn/vant/custom-empty-image.png" image-size="70" description="载重图暂无数据" v-else/> -->
      <!-- </div> -->
    </div>
    <!-- 定位 -->
    <!-- <div class="nowPosition" @click="getCurrentPosition">
      <van-icon name="aim" />
    </div> -->
  </div>
</template>

<script>
 let lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];
let columns1=[]
let columns2=[]
for(let i = 1; i < 80; i++){
  columns1.push(i)
}
for(let i = 60; i < 120; i++){
  columns2.push(i)
}
import NavBar from '../../../components/navBar.vue'
import tabBar from '../../../components/tabBar.vue'
import AMap from 'AMap' // 引入高德地图
import { trackQuery } from 'network/home'
import pako from 'pako'
import loginVue from '../../login/login.vue';
import db from 'common/localstorage'
import axios from 'axios'
var echarts = require('echarts');
export default {
  components: { tabBar,NavBar },
  name: "trackBack",
  data(){
    return {
      title:'',
      map:null,
      center:null,
      result:[],
      plateNo:null,
      lineArr :[],
      marker:null,
      polyline:null,
      passedPolyline:null,
      speedRate:1,
      value:0,
      speed:1,
      playing:true,
      show:false,
      scurrentDate: new Date(),
      ecurrentDate: new Date(),
      startTime:null,
      endTime:null,
      pickShow1:false,
      pickShow2:false,
      columns1:columns1,
      columns2:columns2,
      lowSpeed:false,
      heightSpeed:false,
      speed1:40,
      speed2:80,
      parmaList:['今天','昨天','近三天','近一周'],
      showPopover:false,
      actions:[{ text: '2' },{ text: '4' },{ text: '8' },{ text: '16' },{ text: '32' }],
      REPLAY_INDEX:0,
      baseUrl: process.env.BASE_URL,
      t_car:require("assets/image/car.png"),
      // 信息窗体
      infoWindow: null,
      // 巡航轨迹
      AMap: null,
      PathSimplifier: null,
      isPlay: true,
      sliderVal: 0, // 进度条
      times: 2, // 倍速
      maxSpeed: 32, // 最高倍速
      navgtrSpeed: 800, // 速度
      isMinSpeed: true,
      isMaxSpeed: false,
      navgtr: null,
      pathSimplifierIns: null,
      actualList: [],
      defaultRenderOptions: {
        renderAllPointsIfNumberBelow: -1, // 描绘路径点，如不需要设为-1
        pathTolerance: 2,
        keyPointTolerance: 0,
        pathLineStyle: {
          lineWidth: 6,
          strokeStyle: '#409eff',
          borderWidth: 1,
          borderStyle: '#eeeeee',
          dirArrowStyle: false
        },
        pathLineHoverStyle: {
          lineWidth: 6,
          strokeStyle: '#ff0000',
          borderWidth: 1,
          borderStyle: '#cccccc',
          dirArrowStyle: false
        },
        dirArrowStyle: {
          stepSpace: 30,
          strokeStyle: "#ffffff",
          lineWidth: 2
        },
        pathLineSelectedStyle: {
          lineWidth: 6,
          strokeStyle: '#409eff',
          borderWidth: 1,
          borderStyle: '#cccccc',
          dirArrowStyle: true
        },
        keyPointStyle: {
          radius: 0,
          fillStyle: 'rgba(8, 126, 196, 1)',
          lineWidth: 1,
          strokeStyle: '#eeeeee'
        },
        keyPointHoverStyle: {
          radius: 0,
          fillStyle: 'rgba(0, 0, 0, 0)',
          lineWidth: 2,
          strokeStyle: '#ffa500'
        },
        keyPointOnSelectedPathLineStyle: {
          radius: 0,
          fillStyle: 'rgba(8, 126, 196, 1)',
          lineWidth: 2,
          strokeStyle: '#eeeeee'
        }
      },
      isCursorAtPathEnd: false,
      palyStayus: 0, //0->未开始  1->行驶中  2->暂停
      value: 0,  // 进度条初始化
      signMarker: null,
      currentPoint: null,
      timeValue: '',
      trackData: [],
      trackInfo:{},
      infoShow:false,
      coordinateX:[],
      chartsData:[],
      myChart:null,
      loadShow:false
    }
  },
  mounted(){
    let that = this
    if(typeof(AMapUI) == 'undefined'){
      axios.get("https://webapi.amap.com/ui/1.1/main.js").then(res=>{
        if(typeof(AMapUI) !== 'undefined'){
          this.fetch()
        }else{
          alert("无法加载地图，请打开网络")
        }
      })
    }else{
      this.fetch()
      // this.Init()
    }
  },
  methods: {
    //初始化echarts
    chartsInit(){
      let that = this
      this.myChart = echarts.init(document.getElementById("loadMain"));
      let data = this.chartsData
      let coordX = this.coordinateX
      //绘制图表
      let option = {
        title:{
          show:true,
          text: '载重图',
          textStyle:{
            color:"#000",
            fontSize:'14px',
            fontWeight:500
          },
          left: "center",
        },
        toolbox: {
          feature: {
            // dataZoom: {
            //   yAxisIndex: 'none'
            // },
            restore: {},
            // saveAsImage: {}
          },
          top:0
        },
        tooltip: {
          show:true,
          trigger: 'axis',
          showContent:true,
          axisPointer: {
            type: 'line',
            lineStyle:{
              color:'#ff0000'
            }
          },
        //  alwaysShowContent:true,
          formatter:function(params,ticket,callback){
            let str = `${params[0].name}:<br/>
            <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
              <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span>
              <span>${params[0].data}吨</span>
            </div>`
            return str
          }
        },
        xAxis: {
          type: 'category',
          data: coordX,
          show:false,
        },
        yAxis: {
          type: 'value',
          splitLine:{
            show:false
          },
          axisLine:{
            show:true,
            lineStyle:{
              color:"#9a9595"
            }
          },
          min:function(val){
            return val.min
          },
          max:function(val){
            return val.max
          },
          splitNumber:3
        },
        dataZoom: [{
          type:'slider',
        }],
        grid: {
          top: '20%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [{
          data: data,
          type: 'line',
          lineStyle:{
            color:'red'
          },
          itemStyle:{
            color:"red"
          }
        }]
      };
      //显示图表。
      this.myChart.setOption(option);
      // this.myChart.on('mousemove', function (params) {
      //   console.log(params);
      //   let time = params.name
      //   that.result.forEach((val,index) => {
      //     if(val.sendTime == time){
      //       console.log(index);
      //       // 移动巡航器
      //       that.navgtr.moveToPoint(index);
      //       that.pathSimplifierIns.renderLater();
      //     }
      //   })
      // });
    },
    trolHandel(){
      $(".loadMain").slideToggle()
      this.loadShow = !this.loadShow
    },
    // 初始化巡航组件实例
    initPathSimplifier() {
      let that = this
      console.log(that.chartsData);
      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }
        that.initSimplifier = true
        that.signMarker.setLabel({})
        if (window.pathSimplifierIns && that.pathSimplifierIns) {
          //清空上次传入的轨迹
          that.pathSimplifierIns.setData([]);
        }
        // TODO
        let linArray = this.lineArr
        let pointDataList = this.result
        // let pointDataList = path
        // 初始化坐标点
        if (linArray.length > 0) {
          that.signMarker.show()
          that.signMarker.setPosition(linArray[0])
          that.actualList = linArray
          //创建一个巡航轨迹路线
          that.pathSimplifierIns = new PathSimplifier({
            zIndex: 100,//地图层级，
            map: this.map, //所属的地图实例
            //巡航路线轨迹列表
            getPath: (pathData, pathIndex) => {
              return pathData.path
            },
            //hover每一个轨迹点，展示内容
            getHoverTitle: function(pathData, pathIndex, pointIndex) {
              return ''
            },
            //绘制路线节点
            renderOptions: that.defaultRenderOptions
          })
          window.pathSimplifierIns = that.pathSimplifierIns
          //设置数据
          that.pathSimplifierIns.setData([{
            name: '轨迹路线',
            path: that.actualList
          }])
          that.pathSimplifierIns.setSelectedPathIndex(0)

          function onload() {
            that.pathSimplifierIns.renderLater()
          }
          function onerror(e) {
            console.log('图片加载失败！')
          }
          //对第一条线路创建一个巡航器
          let image = PathSimplifier.Render.Canvas.getImageContent("https://img-blog.csdnimg.cn/20201229115537203.png", onload, onerror)
          that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
            loop: false, //循环播放
            speed: that.navgtrSpeed, //巡航速度，单位千米/小时
            pathNavigatorStyle: {
              width: 40,
              height: 25,
              content: image, // 自定义巡航样式
              strokeStyle: null,
              fillStyle: null,
              autoRotate:true,
              initRotateDegree:-90,
              //经过路径的样式
              pathLinePassedStyle: {
                lineWidth: 6,
                strokeStyle: '#69f81e',
                dirArrowStyle: {
                  stepSpace: 15,
                  strokeStyle: '#FFF'
                }
              }
            }
          })
          that.navgtr.on('start resume', function() {
            that.navgtr._startTime = Date.now()
            that.navgtr._startDist = this.getMovedDistance()
          })
          that.navgtr.on('stop pause', function() {
            that.navgtr._movedTime = Date.now() - that.navgtr._startTime
            that.navgtr._movedDist = this.getMovedDistance() - that.navgtr._startDist
          })
          that.navgtr.on('move', function(data, position) {
            //更新地图中心点,视野跟随
            that.map.setCenter(that.lineArr[position.dataItem.pointIndex])
            that.isCursorAtPathEnd = false
            let idx = position.dataItem.pointIndex //走到了第几个点
            let tail = position.tail //至下一个节点的比例位置
            let totalIdx = idx + tail
            let len = position.dataItem.pathData.path.length
            // 设置当前点位
            that.currentPoint = that.actualList[idx]
            that.velocity = pointDataList[idx]
            that.trackInfo = {
              location:pointDataList[idx].location,
              velocity:pointDataList[idx].velocity,
              sendTime:pointDataList[idx].sendTime,
              weight:(pointDataList[idx].weightF8)/1000,
              distance:that.navgtr.getMovedDistance()
            }
            if(that.myChart){
              that.myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: idx
              }); 
            }
            
            // 打开信息窗体
            // let content = [
            //   '<div style="padding: 5px;">',
            //   '<div>接收时间 : ' + pointDataList[idx].sendTime + '</div>',
            //   '<div>速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度 : ' + pointDataList[idx].velocity + '(km/h)</div>',
            //   '<div>经&nbsp;&nbsp;纬&nbsp;&nbsp;度 : ' + pointDataList[idx].longitude + ',' + pointDataList[idx].latitude + '</div>',
            //   '</div>'
            // ]
            // that.infoWindow.setContent(content.join(''))
            // that.infoWindow.open(that.map, that.actualList[idx])
            if(idx < len - 1) {
              that.navgtr.setSpeed(that.navgtrSpeed * that.times)
            }
            // 进度条实时展示tail
            !that.isOnSlider && (that.sliderVal = (totalIdx / len) * 100)
            // 如果到头了，回到初始状态
            if (that.navgtr.isCursorAtPathEnd()) {
              that.isCursorAtPathEnd = true
              that.initPlayBox()
            }
          })
          // 加载完成
          that.beforeInit = false
          }else {
            that.signMarker.hide()
            that.signMarker.setLabel({})
          }
          that.initSimplifier = false
      })
    },
    //初始化markers
    initMarkers(){
      let _this = this
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
    //手动拖动进度条过程中实时触发：移动车辆，定位车辆回放位置
    onInput(e){
      // 先改为播放状态
      if (this.palyStayus === 0) {
        this.navgControl('start')
        this.navgControl('pause')
      }
      // 移动巡航器
      let newVal = typeof(newVal)==='number' ? val : this.sliderVal
      let num = parseInt((newVal / 100) * this.actualList.length);
      let decimal = String((newVal / 100) * this.actualList.length).split('.')[1]||0
      this.navgtr.moveToPoint(num, Number('0.'+decimal));
      this.pathSimplifierIns.renderLater();
    },
    //当进度条拖动结束
    onChange(e){
      if (this.currentPoint) {
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          this.map.setCenter(this.currentPoint)
        }, 0)
      }
    },
    // 改变倍速
    changeSpeed(e) {
      let sp = e.text
      this.times = e.text;
    },
    fetch(){
      let _this = this
      this.plateNo = this.$route.query.plateNo
      let sTime = this.startTime || this.getNowDate("00:00:00")
      let eTime = this.endTime || this.getNowDate("23:59:59")
      console.log(this.plateNo,sTime,eTime);
      trackQuery(this.plateNo,sTime,eTime).then(res => {
        console.log(res);
        //隐藏载重折线图
        if(res.data.status === '0'){
          let data = res.data.result.carHistory
          this.result = this.unzip(data)
          console.log(this.result);
          if(this.result.length !== 0){
            //数据重置
            this.lineArr = []
            this.coordinateX = []
            this.chartsData = []
            console.log(this.result[0].weightF8);
            this.result.forEach(val => {
              //轨迹数据
              this.lineArr.push([val.longitude,val.latitude])
              //载重图X轴
              this.coordinateX.push(val.sendTime)
              if(!val.weightF8 || val.weightF8 == "" || val.weightF8 == 'undefined'){
                this.chartsData.push(0)
              }else{
                this.chartsData.push((val.weightF8/1000))
              }
            })
            console.log(this.chartsData);
            //初始化地图及相关api
            this.Init()
            $(".loadMain").hide()
            this.$notify({ type: 'primary', message: '请开始播放'});
          }else{
            this.$notify({ type: 'primary', message: '暂无历史数据'});
            // 初始化地图
            this.initMap()
            $(".loadMain").hide()
          }
        }else{
          this.initMap()
          $(".loadMain").hide()
          this.$notify({ type: 'primary', message: res.data.msg});
        }
      }).catch(err=>{
        // 初始化地图
        this.initMap()
        $(".loadMain").hide()
        console.log(err);
      })
    },
    //总体初始化
    Init(){
      // 初始化地图
      this.initMap()
      // 初始化点位
      this.initMarker()
      // 初始化信息窗体
      this.initInfoWindow()
      this.initPlayBox()
      this.initPathSimplifier()
      this.chartsInit()
    },
    // 初始化地图
    initMap() {
      let _this = this
      this.map = new AMap.Map('map', {
        resizeEnable: true,
        zoom: 15
      })
      this.map.plugin(["AMap.MapType"],function(){
        //地图类型切换
        var type= new AMap.MapType({
        defaultType:0,//使用2D地图
        showRoad:true,
        showTraffic:true
      });
        _this.map.addControl(type);
      });
      this.map.plugin(["AMap.ControlBar"],function(){
        var controlBar = new AMap.ControlBar({
          position:{bottom:'-80px',right:'10px'},
          showZoomBar:true,
          showControlButton:false
        })
        _this.map.addControl(controlBar)
      });
    },
    //初始化markers(废)
    initMarker() {
      // 引入Marker,绘制点标记
      this.signMarker = new AMap.Marker({
        map: this.map,
        offset: new AMap.Pixel(-4, -4),
        visible: false,
        content: '<div style="text-align:center; background-color: hsla(180, 100%, 50%, 0.9); height: 10px; width: 10px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>'
      })
    },
    //初始化infoWindow
    initInfoWindow() {
      // 创建 infoWindow 实例
      this.infoWindow = new AMap.InfoWindow({
        anchor: 'bottom-center',
        autoMove: false,
        offset: new AMap.Pixel(0, -20),
        content: ''  //传入 dom 对象，或者 html 字符串
      })
    },
    // 控制播放按钮
    navgControl(type) {
      if(!this.navgtr || !type) {
        return
      }
      if(type === 'start' || type === 'resume') {
        this.infoShow = true
        this.isPlay = false
        this.palyStayus = 2
        // 如果已经到了终点，重新定位坐标
        if(this.isCursorAtPathEnd && this.actualList.length > 0) {
          this.map.setCenter(this.actualList[0])
        }
      }else if (type === 'pause') {
        this.isPlay = true
        this.palyStayus = 1
      }
      this.navgtr[type]()
    },
    // 初始化播放器状态
    initPlayBox() {
      // 暂停
      this.navgControl('pause')
      this.playIcon = 'start';
      this.isPlay = true // 播放图标
      this.palyStayus = 0 // 继续状态
      this.sliderVal = 0; // 进度条清0
      this.times = 2
    },
    //定位,需用https
    getCurrentPosition(){
      let _this = this
      AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：5s
            buttonPosition:'RB',    //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
            showButton:false,
            showMarker:true,
            useNative:true,
        });
        _this.map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status,result){
            if(status=='complete'){
          
            }else{
              _this.$notify({ type: 'primary', message: '定位失败'});
            }
        });
      });
    },
    //打开设置
    openSetting(){
      this.show = true
      this.initDate()
    },
    getNowDate(t){
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth()+1
      m = m < 10 ? '0'+m : m
      let d = date.getDate()
      d = d < 10 ? '0'+d : d
      return y+'-'+m+'-'+d+' '+t
    },
    spickerConfirm(val){
      this.scurrentDate = val
      this.startTime = this.formatterTime(val)
      this.pickShow1 = false
    },
    epickerConfirm(val){
      this.ecurrentDate = val
      this.endTime = this.formatterTime(val)
      this.pickShow2 = false
    },
    pickerCancel(){
      this.pickShow1 = false
      this.pickShow2 = false
    },
    initDate(){
      this.startTime = this.getNowDate("00:00:00")
      this.endTime = this.getNowDate("23:59:59")
      this.scurrentDate = new Date()
      this.ecurrentDate = new Date()
    },
    dateClick(index){
      let _this = this
      if(index == 0){
        this.initDate()
      }else if(index == 1){
        this.startTime = this.getDay(-2,"00:00:00")
        this.endTime = this.getDay(-2,"23:59:59")
        this.scurrentDate = new Date(_this.getDay(-2,"00:00:00"))
        this.ecurrentDate = new Date(_this.getDay(-2,"23:59:59"))
      }else if(index == 2){
        this.startTime = this.getDay(-3,"00:00:00")
        this.endTime = this.getNowDate("23:59:59")
        this.scurrentDate = new Date(_this.getDay(-3,"00:00:00"))
        this.ecurrentDate = new Date()
      }else if(index == 3){
        this.startTime = this.getDay(-7,"00:00:00")
        this.endTime = this.getNowDate("23:59:59")
        this.scurrentDate = new Date(_this.getDay(-7,"00:00:00"))
        this.ecurrentDate = new Date()
      }
    },
    lowConfirm(value, index) {
      this.speed1 = value
      this.lowSpeed = false
    },
    heightConfirm(value, index) {
      this.speed2 = value
      this.heightSpeed = false
    },
    btnConfirm(){
      this.show = false
      this.fetch()
    },
    /**---------------------------------tools-----------------------------**/
    //标准时间转化年月日
    formatterTime(date) {
      console.log(date);
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      var second = date.getSeconds()
      second = second < 10 ? '0' + second : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute +':' + second
    },
    formatter(type,val){
      if(type == 'year'){
        return `${val}年`
      }
      if(type == 'month'){
        return `${val}月`
      }
      if(type == 'day'){
        return `${val}日`
      }
      if(type == 'hour'){
        return `${val}时`
      }
      if(type == 'minute'){
        return `${val}分`
      }
    },
    // 计算前n天的日期
    getDay(day,t){  
       var today = new Date();  
       var targetday_milliseconds=today.getTime() + 1000*60*60*24*(day+1);          
       today.setTime(targetday_milliseconds); 
       var tYear = today.getFullYear();  
       var tMonth = today.getMonth();  
       var tDate = today.getDate();  
       tMonth = this.doHandleMonth(tMonth + 1);  
       tDate = this.doHandleMonth(tDate);  
       return tYear+"-"+tMonth+"-"+tDate+' '+t;  
    }, 
    doHandleMonth(month){  
      var m = month;  
      if(month.toString().length == 1){  
        m = "0" + month;  
      }  
      return m;  
    },
    // 解析压缩包数据
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
  height: calc(100% - 46px);
  position: relative;
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
.control{
  width: 100%;
  /* height: 0.44rem; */
  background: #fff;
  box-shadow: 0 0.01rem 0.8rem 0.1rem #d0d0d0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
/deep/.van-button--default{
  border: 0;
}
/deep/.van-col{
  text-align: center;
}
/deep/.van-cell--clickable{
  padding: 7px 16px;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  width: 3rem;
  background-color: #fff;
  position: relative;
}
.w_bottom{
  width: 100%;
  height: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
  line-height: 0.4rem;
  border-top: 0.01rem solid #dce0e4;
  color: #1989fa;
  position: absolute;
  bottom: 0;
  left: 0;
}
.w_bottom > div{
  flex: 1;
}
.w_bottom > div:first-child{
  border-right: 0.01rem solid #dce0e4;
}
.trackInfo{
  width: 100%;
  /* height:1.2rem; */
  color: #fff;
  background: rgba(0,0,0,0.5);
  padding: 0.1rem;
  position: absolute;
  top: 46px;
  left: 0;
}
.trackInfo > p{
  margin-bottom: 0.1rem;
}
.trackInfo > p > span{
  font-weight: bold;
}
.van-popup{
  overflow: hidden;
}
/deep/.amap-maptype-wrap, /deep/.amap-maptype-con{
  width: 40px;
  height: 40px;
}
/* /deep/.amap-maptype-con{
  width: 50px;
  height: 50px;
} */
/deep/.amap-maptype-win{
  width: 35px;
  height: 35px;
}
/deep/.amap-maptype-list{
  display: none!important;
}
/deep/.amap-maptype-title{
  display: none;
}
/deep/.amap-luopan{
  display: none;
}
/deep/.amap-maptypecontrol{
  top:auto;
  bottom:166px
}
/deep/.van-overlay{
  z-index: 310;
}
.nowPosition{
  width: 0.3rem;
  height: 0.3rem;
  position: absolute;
  font-size: 22px;
  right: 12px;
  bottom: 169px;
  background: #fff;
  text-align: center;
  line-height: 0.4rem;
}
.carLoad{
  width: 100%;
  /* height: 2.5rem; */
  position: absolute;
  bottom: -2px;
  left: 0;
  background: #fff;
  z-index: 304;
}
.controlCharts{
  width: 100%;
  height: 0.2rem;
  text-align: center;
  font-size: 18px;
  background: #fff;
}
.loadBox{
   width: 100%;
  height:1.5rem;
}
.loadMain{
  width: 100%;
  height:1.5rem;
  /* display: none; */
}
</style>