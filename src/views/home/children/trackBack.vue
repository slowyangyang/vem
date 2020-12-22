<template>
  <div class="trackBack">
    <nav-bar 
      :title="title" 
      :left-arrow="true"/>
    <div id="map"></div>
    <!-- <div class="input-card">
      <div class="input-item">
          <input type="button" class="btn" value="开始动画" id="start" @click="startAnimation()"/>
          <input type="button" class="btn" value="暂停动画" id="pause" @click="pauseAnimation()"/>
      </div>
      <div class="input-item">
          <input type="button" class="btn" value="继续动画" id="resume" @click="resumeAnimationpauseAnimation()"/>
          <input type="button" class="btn" value="停止动画" id="stop" @click="stopAnimation()"/>
      </div>
    </div> -->
    <div class="control">
      <van-row type="flex" justify="space-between" align="center" gutter="10">
        <van-col :span="3"><van-icon :name="playing ? 'play-circle-o': 'pause-circle-o'" :size="24" @click="startPlay" /></van-col>
        <van-col :span="17"><van-slider v-model="value" button-size="20"  @change="onChange" @input="onInput"/></van-col>
        <van-col :span="1"><van-button size="samll" @click="changeSpeed">x{{speed}}</van-button></van-col>
        <van-col :span="3"><van-icon name="setting-o" :size="24" @click="openSetting"/></van-col>
      </van-row>
    </div>
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
  </div>
</template>

<script>
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
      let speed = this.speed*500000
      this.marker[1].moveAlong(_this.lineArr, speed);
      //添加监听事件： 车辆移动的时候，更新速度窗体位置，记录当前回放百分比
      AMap.event.addListener(_this.marker[1], 'moving', function (e) {
        console.log(e);
          var lastLocation = e.passedPath.length;
          console.log(lastLocation);
          _this.value = (lastLocation/_this.lineArr.length)*100
          console.log(_this.value)
          //移动窗体
          // carWindow.setPosition(lastLocation);
          //根据gps信息，在源数据中查询当前位置速度
          // setVehicleSpeedInWidowns(lastLocation);
          //更新进度条
          // $("#ionrange_process").data('ionRangeSlider').update({from: Math.round((e.passedPath.length + VEHICLE_PATH_REPLAY_START) / routeInfo.length * 100)})
      });
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
            //初始化地图
            this.init()
            this.$notify({ type: 'primary', message: '请开始播放'});
          }else{
             this.$notify({ type: 'primary', message: '暂无历史数据'});
             //初始化地图
            this.init()
          }
          
        }
      })
    },
    //当进度条改变
    onChange(e){
      console.log(e);
    },
    //拖动进度条时
    onInput(e){
      console.log(e);
    },
    //开始播放
    startPlay(){
      this.playing = !this.playing
      if(this.playing){
        this.pauseAnimation()
      }else{
        this.startAnimation()
      }
    },
    //改变速率
    changeSpeed(){
      let _this = this
      if(this.speed == 5){
        this.speed = 1
        return 
      }
      this.speed++
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
.control{
  width: 100%;
  height: 0.44rem;
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
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  width: 3rem;
  height: 3rem;
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
</style>