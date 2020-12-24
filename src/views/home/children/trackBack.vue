<template>
  <div class="trackBack">
    <nav-bar 
      :title="title" 
      :left-arrow="true"/>
    <div id="map"></div>
    <div class="control">
      <van-row type="flex" justify="space-between" align="center" gutter="10">
       <van-col :span="3" v-if="isPlay && palyStayus === 0"><van-icon name="play-circle-o" :size="24" @click="navgControl('start')"/></van-col>
        <van-col :span="3" v-if="isPlay && palyStayus === 1"><van-icon name="play-circle-o" :size="24" @click="navgControl('resume')"/></van-col>
        <van-col :span="3" v-if="!isPlay"><van-icon name="pause-circle-o" :size="24" @click="navgControl('pause')"/></van-col>
        <van-col :span="17"><van-slider v-model="sliderVal" button-size="20"  @change="onChange" @input="onInput"/></van-col>
        <van-col :span="1">
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
          <div>
            <van-cell is-link @click="pickShow1 = true">开始时间：{{startTime}}</van-cell>
            <van-popup v-model="pickShow1" position="bottom" :style="{ height: '30%' }">
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
          <div>
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
          </div>
          <div class="w_bottom">
            <div class="btn" @click="show = false">取消</div>
            <div class="btn" @click="btnConfirm">确认</div>
          </div>
        </div>
      </div>
    </van-overlay>
    <!-- 轨迹详情 -->
    <div class="trackInfo" v-if="infoShow">
      <p>{{trackInfo.location}}</p>
      <p><span>速度：</span>{{trackInfo.velocity}}</p>
      <p><span>时间：</span>{{trackInfo.setTime}}</p>
    </div>
  </div>
</template>

<script>
let path = [{"lng":123.390381,"lat":41.929537,"speed":0},{"lng":123.390315,"lat":41.929736,"speed":13},{"lng":123.390331,"lat":41.930286,"speed":19},{"lng":123.390365,"lat":41.930819,"speed":25},{"lng":123.390381,"lat":41.931436,"speed":25},{"lng":123.390398,"lat":41.932069,"speed":24},{"lng":123.390416,"lat":41.932686,"speed":24},{"lng":123.390482,"lat":41.933203,"speed":20},{"lng":123.390582,"lat":41.933269,"speed":19},{"lng":123.390716,"lat":41.933287,"speed":19},{"lng":123.391433,"lat":41.933337,"speed":24},{"lng":123.392268,"lat":41.933305,"speed":26},{"lng":123.392402,"lat":41.933238,"speed":26},{"lng":123.392652,"lat":41.933071,"speed":24},{"lng":123.392819,"lat":41.932788,"speed":26},{"lng":123.393085,"lat":41.932205,"speed":30},{"lng":123.393536,"lat":41.931422,"speed":35},{"lng":123.393803,"lat":41.930956,"speed":39},{"lng":123.39407,"lat":41.930472,"speed":39},{"lng":123.394287,"lat":41.930006,"speed":41},{"lng":123.394504,"lat":41.929506,"speed":43},{"lng":123.394704,"lat":41.928972,"speed":44},{"lng":123.394921,"lat":41.928423,"speed":46},{"lng":123.395137,"lat":41.927857,"speed":46},{"lng":123.395354,"lat":41.92729,"speed":48},{"lng":123.395588,"lat":41.926707,"speed":46},{"lng":123.395822,"lat":41.926123,"speed":49},{"lng":123.396055,"lat":41.92554,"speed":47},{"lng":123.396338,"lat":41.924991,"speed":44},{"lng":123.396639,"lat":41.924508,"speed":41},{"lng":123.396939,"lat":41.924091,"speed":35},{"lng":123.397506,"lat":41.923391,"speed":28},{"lng":123.397974,"lat":41.922825,"speed":22},{"lng":123.398407,"lat":41.922375,"speed":13},{"lng":123.398841,"lat":41.921942,"speed":15},{"lng":123.399241,"lat":41.921525,"speed":24},{"lng":123.399791,"lat":41.920975,"speed":31},{"lng":123.400159,"lat":41.92061,"speed":35},{"lng":123.400876,"lat":41.919876,"speed":37},{"lng":123.401277,"lat":41.91946,"speed":41},{"lng":123.401693,"lat":41.919026,"speed":41},{"lng":123.40211,"lat":41.918576,"speed":43},{"lng":123.402527,"lat":41.918127,"speed":41},{"lng":123.402911,"lat":41.917727,"speed":37},{"lng":123.403361,"lat":41.917077,"speed":30},{"lng":123.403378,"lat":41.916877,"speed":23},{"lng":123.403261,"lat":41.916811,"speed":23},{"lng":123.402994,"lat":41.916761,"speed":26},{"lng":123.402043,"lat":41.916676,"speed":37},{"lng":123.401342,"lat":41.916643,"speed":41},{"lng":123.400659,"lat":41.91661,"speed":37},{"lng":123.400041,"lat":41.916593,"speed":33},{"lng":123.39899,"lat":41.916542,"speed":28},{"lng":123.398123,"lat":41.916509,"speed":22},{"lng":123.397839,"lat":41.916475,"speed":14},{"lng":123.397806,"lat":41.916325,"speed":15},{"lng":123.397939,"lat":41.915509,"speed":26},{"lng":123.397973,"lat":41.914675,"speed":31},{"lng":123.398073,"lat":41.913825,"speed":33},{"lng":123.398123,"lat":41.913375,"speed":35},{"lng":123.398173,"lat":41.912892,"speed":39},{"lng":123.398206,"lat":41.912425,"speed":34},{"lng":123.398289,"lat":41.911592,"speed":38},{"lng":123.398356,"lat":41.911075,"speed":43},{"lng":123.398389,"lat":41.910526,"speed":41},{"lng":123.398439,"lat":41.91001,"speed":37},{"lng":123.398488,"lat":41.909543,"speed":35},{"lng":123.398538,"lat":41.90876,"speed":28},{"lng":123.398555,"lat":41.90806,"speed":31},{"lng":123.398555,"lat":41.907143,"speed":41},{"lng":123.398572,"lat":41.90666,"speed":39},{"lng":123.398555,"lat":41.905793,"speed":31},{"lng":123.398555,"lat":41.905226,"speed":13},{"lng":123.398555,"lat":41.904743,"speed":22},{"lng":123.398572,"lat":41.904093,"speed":30},{"lng":123.398572,"lat":41.90326,"speed":33},{"lng":123.398588,"lat":41.90251,"speed":26},{"lng":123.398554,"lat":41.901893,"speed":22},{"lng":123.398504,"lat":41.90171,"speed":16},{"lng":123.398421,"lat":41.90166,"speed":16},{"lng":123.398121,"lat":41.90171,"speed":15},{"lng":123.397403,"lat":41.901793,"speed":26},{"lng":123.396285,"lat":41.901875,"speed":35},{"lng":123.395668,"lat":41.901892,"speed":37},{"lng":123.394983,"lat":41.901941,"speed":41},{"lng":123.394232,"lat":41.901991,"speed":44},{"lng":123.393516,"lat":41.902023,"speed":41},{"lng":123.392831,"lat":41.902073,"speed":39},{"lng":123.392197,"lat":41.902072,"speed":35},{"lng":123.391062,"lat":41.902072,"speed":31},{"lng":123.390094,"lat":41.902071,"speed":26},{"lng":123.38941,"lat":41.902087,"speed":17},{"lng":123.388675,"lat":41.90207,"speed":26},{"lng":123.387857,"lat":41.902069,"speed":20},{"lng":123.387189,"lat":41.902036,"speed":17},{"lng":123.386471,"lat":41.902002,"speed":18},{"lng":123.386371,"lat":41.901935,"speed":22},{"lng":123.386338,"lat":41.901818,"speed":20},{"lng":123.386371,"lat":41.901652,"speed":20},{"lng":123.386671,"lat":41.901185,"speed":0},{"lng":123.386939,"lat":41.900785,"speed":22},{"lng":123.387389,"lat":41.900169,"speed":33},{"lng":123.387657,"lat":41.899736,"speed":39},{"lng":123.38794,"lat":41.899286,"speed":39},{"lng":123.388257,"lat":41.898787,"speed":44},{"lng":123.388591,"lat":41.898254,"speed":44},{"lng":123.388924,"lat":41.897754,"speed":43},{"lng":123.389209,"lat":41.897287,"speed":39},{"lng":123.389442,"lat":41.896855,"speed":37},{"lng":123.38991,"lat":41.896055,"speed":32},{"lng":123.390193,"lat":41.895605,"speed":7},{"lng":123.390376,"lat":41.895355,"speed":13},{"lng":123.390694,"lat":41.894889,"speed":24},{"lng":123.391161,"lat":41.894172,"speed":31},{"lng":123.391595,"lat":41.893489,"speed":26},{"lng":123.391978,"lat":41.892957,"speed":15},{"lng":123.392346,"lat":41.89254,"speed":26},{"lng":123.392863,"lat":41.891907,"speed":37},{"lng":123.393214,"lat":41.891458,"speed":41},{"lng":123.393597,"lat":41.890958,"speed":50},{"lng":123.394081,"lat":41.890358,"speed":59},{"lng":123.394648,"lat":41.889709,"speed":63},{"lng":123.395182,"lat":41.889042,"speed":59},{"lng":123.395616,"lat":41.888425,"speed":55},{"lng":123.396033,"lat":41.887909,"speed":44},{"lng":123.3964,"lat":41.887476,"speed":35},{"lng":123.396884,"lat":41.886826,"speed":28},{"lng":123.397051,"lat":41.886593,"speed":24},{"lng":123.397284,"lat":41.88651,"speed":10},{"lng":123.398119,"lat":41.886594,"speed":11},{"lng":123.39877,"lat":41.886677,"speed":26},{"lng":123.399821,"lat":41.886727,"speed":35},{"lng":123.400437,"lat":41.886744,"speed":37},{"lng":123.401105,"lat":41.886778,"speed":42},{"lng":123.401788,"lat":41.886795,"speed":41},{"lng":123.402423,"lat":41.886828,"speed":36},{"lng":123.403457,"lat":41.886878,"speed":30},{"lng":123.404507,"lat":41.886929,"speed":30},{"lng":123.404925,"lat":41.886929,"speed":21},{"lng":123.404975,"lat":41.886896,"speed":21},{"lng":123.405041,"lat":41.886813,"speed":19},{"lng":123.405108,"lat":41.886446,"speed":24},{"lng":123.405208,"lat":41.885679,"speed":35},{"lng":123.405308,"lat":41.884813,"speed":30},{"lng":123.405391,"lat":41.884079,"speed":30},{"lng":123.405491,"lat":41.883213,"speed":33},{"lng":123.405591,"lat":41.882479,"speed":17},{"lng":123.405658,"lat":41.881863,"speed":27},{"lng":123.405674,"lat":41.881096,"speed":33},{"lng":123.40569,"lat":41.880629,"speed":39},{"lng":123.405724,"lat":41.880113,"speed":37},{"lng":123.405757,"lat":41.879613,"speed":41},{"lng":123.40579,"lat":41.879046,"speed":44},{"lng":123.405824,"lat":41.878479,"speed":44},{"lng":123.405857,"lat":41.877929,"speed":43},{"lng":123.405874,"lat":41.877429,"speed":39},{"lng":123.405924,"lat":41.876746,"speed":19},{"lng":123.405957,"lat":41.876279,"speed":11},{"lng":123.406024,"lat":41.875729,"speed":24},{"lng":123.406107,"lat":41.874946,"speed":35},{"lng":123.406157,"lat":41.874463,"speed":37},{"lng":123.40619,"lat":41.874013,"speed":37},{"lng":123.40624,"lat":41.873496,"speed":43},{"lng":123.40629,"lat":41.872929,"speed":50}];
let lineArr = []
for(let i = 0;i<path.length;i++){
  lineArr.push([path[i].lng,path[i].lat])
}
console.log(lineArr);
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
export default {
  components: { tabBar,NavBar },
  name: "trackBack",
  data(){
    return {
      title:'轨迹回放',
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
      actions:[{ text: '1' },{ text: '2' },{ text: '3' },{ text: '4' },{ text: '5' }],
      REPLAY_INDEX:0,
      baseUrl: process.env.BASE_URL,
      // 信息窗体
      infoWindow: null,
      // 巡航轨迹
      AMap: null,
      PathSimplifier: null,
      isPlay: true,
      sliderVal: 0, // 进度条
      times: 2, // 倍速
      maxSpeed: 32, // 最高倍速
      navgtrSpeed: 3000, // 速度
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
      infoShow:false
    }
  },
  mounted(){
    // this.fetch()
    this.Init()
  },
  methods: {
    // 初始化巡航组件实例
    initPathSimplifier() {
      let that = this
      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }
        that.initSimplifier = true
        that.signMarker.setLabel({})
        if (window.pathSimplifierIns && that.pathSimplifierIns) {
          //通过该方法清空上次传入的轨迹
          that.pathSimplifierIns.setData([]);
        }
        // TODO
        // let linArray = this.lineArr
        // let pointDataList = this.result
        let linArray = lineArr
        let pointDataList = path
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
            //自定义样式，可设置巡航器样式，巡航轨迹样式，巡航轨迹点击、hover等不同状态下的样式，不设置则用默认样式，详情请参考api文档 renderOptions:{}
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
          //对第一条线路（即索引 0）创建一个巡航器
          let image = PathSimplifier.Render.Canvas.getImageContent('/car.png', onload, onerror)
          that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
            loop: false, //循环播放
            speed: that.navgtrSpeed, //巡航速度，单位千米/小时
            pathNavigatorStyle: {
              width: 40,
              height: 25,
              //使用图片
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
            that.map.setCenter(lineArr[position.dataItem.pointIndex])
            that.isCursorAtPathEnd = false
            let idx = position.dataItem.pointIndex //走到了第几个点
            let tail = position.tail //至下一个节点的比例位置
            let totalIdx = idx + tail
            let len = position.dataItem.pathData.path.length
            // 设置当前点位
            that.currentPoint = that.actualList[idx]
            that.velocity = pointDataList[idx]
            // 打开信息窗体
            let content = [
              '<div style="padding: 5px;">',
              '<div>接收时间 : ' + pointDataList[idx].sendTime + '</div>',
              '<div>速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度 : ' + pointDataList[idx].velocity + '(km/h)</div>',
              '<div>经&nbsp;&nbsp;纬&nbsp;&nbsp;度 : ' + pointDataList[idx].longitude + ',' + pointDataList[idx].latitude + '</div>',
              '</div>'
            ]
            that.infoWindow.setContent(content.join(''))
            that.infoWindow.open(that.map, that.actualList[idx])
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
        if(res.data.status == 0){
          let data = res.data.result.carHistory
          this.result = this.unzip(data)
          console.log(this.result);
          if(this.result.length !== 0){
            this.lineArr = []
            this.result.forEach(val => {
              this.lineArr.push([val.longitude,val.latitude])
            })
            console.log(this.lineArr);
            this.Init()
            this.$notify({ type: 'primary', message: '请开始播放'});
          }else{
             this.$notify({ type: 'primary', message: '暂无历史数据'});
             // 初始化地图
              this.initMap()
          }
        }
      }).catch(err=>{
        // 初始化地图
        this.initMap()
      })
    },
    Init(){
      // 初始化地图
      this.initMap()
      // 初始化点位
      this.initMarker()
      // 初始化信息窗体
      this.initInfoWindow()
      this.initPathSimplifier()
    },
    // 初始化地图
    initMap() {
      this.map = new AMap.Map('map', {
        resizeEnable: true, 
        zoom: 15
      })
      console.log(this.lineArr);
      // this.map.setCenter(this.lineArr ?  [this.lineArr[0][0],this.lineArr[0][1]] : [])
    },
    initMarker() {
      // 引入Marker,绘制点标记
      this.signMarker = new AMap.Marker({
        map: this.map,
        offset: new AMap.Pixel(-4, -4),
        visible: false,
        content: '<div style="text-align:center; background-color: hsla(180, 100%, 50%, 0.9); height: 10px; width: 10px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>'
      })
    },
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
    openSetting(){
      this.show = true
      this.initDate()
    },
    getNowDate(t){
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
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
      let obj = {
        // lspeed:this.speed1,
        // hspeed:this.speed2
      }
      obj.startTime = this.startTime,
      obj.endTime = this.endTime,
      obj.plateNo = this.plateNo
      console.log(obj);
      this.fetch()
      // trackQuery(this.plateNo,this.startTime,this.endTime).then(res => {
      //   console.log(res);
      // })
    },
    /**---------------------------------tools-----------------------------**/
    //标准时间转化年月日
    formatterTime(date) {
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
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute
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
  height: 2.6rem;
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
  height:1.2rem;
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
</style>