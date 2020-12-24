<template>
  <div>
   <!-- // map -->
    <div id="container"></div>
    <!-- // 倍数 -->
    <div class="speed">
      <span
        :class="{multiple: true, milActive: muiltipleIndex == index}"
        v-for="(item,index)  in speedList"
        @click="selectMultiple(index, item)"
        :key="index">{{item}}X</span>
      <span class="bs_title">倍数播放</span>
    </div>
    
    <div class="input-card">
      <div class="plar-cnp">
      <!-- // 进度条 -->
        <van-slider
          class="slider-i"
          v-model="value"
          @change="onChange"
          :button-size="15"
          :step="step"/>
        <!-- // 时间 -->
        <span class="progress_time">{{progressTime}}</span>
        <!-- // 播放，暂停，继续按钮 -->
        <div class="p_icon">
          <van-icon v-if="palyStayus == 0" @click="startAnimation(0, [])" name="play-circle-o" />
          <van-icon v-if="palyStayus == 1" @click="pauseAnimation()" name="pause-circle-o" />
          <van-icon v-if="palyStayus == 2" @click="resumeAnimation()" name="play-circle-o" />
        </div>
      </div>
  </div>
  </div>
</template>
<script>
  let TIME_VARIABLE;
  let path = [{"lng":123.390381,"lat":41.929537,"speed":0},{"lng":123.390315,"lat":41.929736,"speed":13},{"lng":123.390331,"lat":41.930286,"speed":19},{"lng":123.390365,"lat":41.930819,"speed":25},{"lng":123.390381,"lat":41.931436,"speed":25},{"lng":123.390398,"lat":41.932069,"speed":24},{"lng":123.390416,"lat":41.932686,"speed":24},{"lng":123.390482,"lat":41.933203,"speed":20},{"lng":123.390582,"lat":41.933269,"speed":19},{"lng":123.390716,"lat":41.933287,"speed":19},{"lng":123.391433,"lat":41.933337,"speed":24},{"lng":123.392268,"lat":41.933305,"speed":26},{"lng":123.392402,"lat":41.933238,"speed":26},{"lng":123.392652,"lat":41.933071,"speed":24},{"lng":123.392819,"lat":41.932788,"speed":26},{"lng":123.393085,"lat":41.932205,"speed":30},{"lng":123.393536,"lat":41.931422,"speed":35},{"lng":123.393803,"lat":41.930956,"speed":39},{"lng":123.39407,"lat":41.930472,"speed":39},{"lng":123.394287,"lat":41.930006,"speed":41},{"lng":123.394504,"lat":41.929506,"speed":43},{"lng":123.394704,"lat":41.928972,"speed":44},{"lng":123.394921,"lat":41.928423,"speed":46},{"lng":123.395137,"lat":41.927857,"speed":46},{"lng":123.395354,"lat":41.92729,"speed":48},{"lng":123.395588,"lat":41.926707,"speed":46},{"lng":123.395822,"lat":41.926123,"speed":49},{"lng":123.396055,"lat":41.92554,"speed":47},{"lng":123.396338,"lat":41.924991,"speed":44},{"lng":123.396639,"lat":41.924508,"speed":41},{"lng":123.396939,"lat":41.924091,"speed":35},{"lng":123.397506,"lat":41.923391,"speed":28},{"lng":123.397974,"lat":41.922825,"speed":22},{"lng":123.398407,"lat":41.922375,"speed":13},{"lng":123.398841,"lat":41.921942,"speed":15},{"lng":123.399241,"lat":41.921525,"speed":24},{"lng":123.399791,"lat":41.920975,"speed":31},{"lng":123.400159,"lat":41.92061,"speed":35},{"lng":123.400876,"lat":41.919876,"speed":37},{"lng":123.401277,"lat":41.91946,"speed":41},{"lng":123.401693,"lat":41.919026,"speed":41},{"lng":123.40211,"lat":41.918576,"speed":43},{"lng":123.402527,"lat":41.918127,"speed":41},{"lng":123.402911,"lat":41.917727,"speed":37},{"lng":123.403361,"lat":41.917077,"speed":30},{"lng":123.403378,"lat":41.916877,"speed":23},{"lng":123.403261,"lat":41.916811,"speed":23},{"lng":123.402994,"lat":41.916761,"speed":26},{"lng":123.402043,"lat":41.916676,"speed":37},{"lng":123.401342,"lat":41.916643,"speed":41},{"lng":123.400659,"lat":41.91661,"speed":37},{"lng":123.400041,"lat":41.916593,"speed":33},{"lng":123.39899,"lat":41.916542,"speed":28},{"lng":123.398123,"lat":41.916509,"speed":22},{"lng":123.397839,"lat":41.916475,"speed":14},{"lng":123.397806,"lat":41.916325,"speed":15},{"lng":123.397939,"lat":41.915509,"speed":26},{"lng":123.397973,"lat":41.914675,"speed":31},{"lng":123.398073,"lat":41.913825,"speed":33},{"lng":123.398123,"lat":41.913375,"speed":35},{"lng":123.398173,"lat":41.912892,"speed":39},{"lng":123.398206,"lat":41.912425,"speed":34},{"lng":123.398289,"lat":41.911592,"speed":38},{"lng":123.398356,"lat":41.911075,"speed":43},{"lng":123.398389,"lat":41.910526,"speed":41},{"lng":123.398439,"lat":41.91001,"speed":37},{"lng":123.398488,"lat":41.909543,"speed":35},{"lng":123.398538,"lat":41.90876,"speed":28},{"lng":123.398555,"lat":41.90806,"speed":31},{"lng":123.398555,"lat":41.907143,"speed":41},{"lng":123.398572,"lat":41.90666,"speed":39},{"lng":123.398555,"lat":41.905793,"speed":31},{"lng":123.398555,"lat":41.905226,"speed":13},{"lng":123.398555,"lat":41.904743,"speed":22},{"lng":123.398572,"lat":41.904093,"speed":30},{"lng":123.398572,"lat":41.90326,"speed":33},{"lng":123.398588,"lat":41.90251,"speed":26},{"lng":123.398554,"lat":41.901893,"speed":22},{"lng":123.398504,"lat":41.90171,"speed":16},{"lng":123.398421,"lat":41.90166,"speed":16},{"lng":123.398121,"lat":41.90171,"speed":15},{"lng":123.397403,"lat":41.901793,"speed":26},{"lng":123.396285,"lat":41.901875,"speed":35},{"lng":123.395668,"lat":41.901892,"speed":37},{"lng":123.394983,"lat":41.901941,"speed":41},{"lng":123.394232,"lat":41.901991,"speed":44},{"lng":123.393516,"lat":41.902023,"speed":41},{"lng":123.392831,"lat":41.902073,"speed":39},{"lng":123.392197,"lat":41.902072,"speed":35},{"lng":123.391062,"lat":41.902072,"speed":31},{"lng":123.390094,"lat":41.902071,"speed":26},{"lng":123.38941,"lat":41.902087,"speed":17},{"lng":123.388675,"lat":41.90207,"speed":26},{"lng":123.387857,"lat":41.902069,"speed":20},{"lng":123.387189,"lat":41.902036,"speed":17},{"lng":123.386471,"lat":41.902002,"speed":18},{"lng":123.386371,"lat":41.901935,"speed":22},{"lng":123.386338,"lat":41.901818,"speed":20},{"lng":123.386371,"lat":41.901652,"speed":20},{"lng":123.386671,"lat":41.901185,"speed":0},{"lng":123.386939,"lat":41.900785,"speed":22},{"lng":123.387389,"lat":41.900169,"speed":33},{"lng":123.387657,"lat":41.899736,"speed":39},{"lng":123.38794,"lat":41.899286,"speed":39},{"lng":123.388257,"lat":41.898787,"speed":44},{"lng":123.388591,"lat":41.898254,"speed":44},{"lng":123.388924,"lat":41.897754,"speed":43},{"lng":123.389209,"lat":41.897287,"speed":39},{"lng":123.389442,"lat":41.896855,"speed":37},{"lng":123.38991,"lat":41.896055,"speed":32},{"lng":123.390193,"lat":41.895605,"speed":7},{"lng":123.390376,"lat":41.895355,"speed":13},{"lng":123.390694,"lat":41.894889,"speed":24},{"lng":123.391161,"lat":41.894172,"speed":31},{"lng":123.391595,"lat":41.893489,"speed":26},{"lng":123.391978,"lat":41.892957,"speed":15},{"lng":123.392346,"lat":41.89254,"speed":26},{"lng":123.392863,"lat":41.891907,"speed":37},{"lng":123.393214,"lat":41.891458,"speed":41},{"lng":123.393597,"lat":41.890958,"speed":50},{"lng":123.394081,"lat":41.890358,"speed":59},{"lng":123.394648,"lat":41.889709,"speed":63},{"lng":123.395182,"lat":41.889042,"speed":59},{"lng":123.395616,"lat":41.888425,"speed":55},{"lng":123.396033,"lat":41.887909,"speed":44},{"lng":123.3964,"lat":41.887476,"speed":35},{"lng":123.396884,"lat":41.886826,"speed":28},{"lng":123.397051,"lat":41.886593,"speed":24},{"lng":123.397284,"lat":41.88651,"speed":10},{"lng":123.398119,"lat":41.886594,"speed":11},{"lng":123.39877,"lat":41.886677,"speed":26},{"lng":123.399821,"lat":41.886727,"speed":35},{"lng":123.400437,"lat":41.886744,"speed":37},{"lng":123.401105,"lat":41.886778,"speed":42},{"lng":123.401788,"lat":41.886795,"speed":41},{"lng":123.402423,"lat":41.886828,"speed":36},{"lng":123.403457,"lat":41.886878,"speed":30},{"lng":123.404507,"lat":41.886929,"speed":30},{"lng":123.404925,"lat":41.886929,"speed":21},{"lng":123.404975,"lat":41.886896,"speed":21},{"lng":123.405041,"lat":41.886813,"speed":19},{"lng":123.405108,"lat":41.886446,"speed":24},{"lng":123.405208,"lat":41.885679,"speed":35},{"lng":123.405308,"lat":41.884813,"speed":30},{"lng":123.405391,"lat":41.884079,"speed":30},{"lng":123.405491,"lat":41.883213,"speed":33},{"lng":123.405591,"lat":41.882479,"speed":17},{"lng":123.405658,"lat":41.881863,"speed":27},{"lng":123.405674,"lat":41.881096,"speed":33},{"lng":123.40569,"lat":41.880629,"speed":39},{"lng":123.405724,"lat":41.880113,"speed":37},{"lng":123.405757,"lat":41.879613,"speed":41},{"lng":123.40579,"lat":41.879046,"speed":44},{"lng":123.405824,"lat":41.878479,"speed":44},{"lng":123.405857,"lat":41.877929,"speed":43},{"lng":123.405874,"lat":41.877429,"speed":39},{"lng":123.405924,"lat":41.876746,"speed":19},{"lng":123.405957,"lat":41.876279,"speed":11},{"lng":123.406024,"lat":41.875729,"speed":24},{"lng":123.406107,"lat":41.874946,"speed":35},{"lng":123.406157,"lat":41.874463,"speed":37},{"lng":123.40619,"lat":41.874013,"speed":37},{"lng":123.40624,"lat":41.873496,"speed":43},{"lng":123.40629,"lat":41.872929,"speed":50}];
export default {
data() {
    return {
      progressTime: 0,  // 时间
      palyStayus: 0, //0->未开始  1->行驶中  2->暂停
      value: 0,  // 进度条初始化
      speedList: [1, 2, 3, 4, 5], // 倍数数据
      markerSpeed: 100, // 初始化速度
      marker: null, // 标记点
      lineArr: [], // 轨迹点数组
      passedPolyline: null, 
      positionIndex: [], //轨迹起始点--车辆所在的位置
      speedCount: 1, // 目前选择的倍数
      passedPath: 0, // 存放（播放时点击倍数）抓取到的位置
      int: null, // 定时器--进度条
      timeInt: null, // 定时器--时间
      curreGDPath: null,  //存放（播放时点击倍数）抓取到的经纬度
      polyline: null, // 轨迹线路
      map: null, //map地图
      muiltipleIndex:0,
      step:0,
      baseUrl: process.env.BASE_URL

    }
  },
  mounted(){
    this.pathlifer()
 
  },
  methods:{
    pathlifer(){
      var map = new AMap.Map('container', {
        zoom: 13
    });
       AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {

        if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
        }

        var pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            //autoSetFitView:false,
            map: map, //所属的地图实例

            getPath: function(pathData, pathIndex) {

                return pathData.path;
            },
            getHoverTitle: function(pathData, pathIndex, pointIndex) {

                if (pointIndex >= 0) {
                    //point 
                    return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                }

                return pathData.name + '，点数量' + pathData.path.length;
            },
            renderOptions: {

                renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
            }
        });

        window.pathSimplifierIns = pathSimplifierIns;

        //设置数据
        pathSimplifierIns.setData([{
            name: '路线0',
            path: [
                [116.405289, 39.904987],
                [113.964458, 40.54664],
                [111.47836, 41.135964],
                [108.949297, 41.670904],
                [106.380111, 42.149509],
                [103.774185, 42.56996],
                [101.135432, 42.930601],
                [98.46826, 43.229964],
                [95.777529, 43.466798],
                [93.068486, 43.64009],
                [90.34669, 43.749086],
                [87.61792, 43.793308]
            ]
        }]);

        //对第一条线路（即索引 0）创建一个巡航器
        var navg1 = pathSimplifierIns.createPathNavigator(0, {
            loop: true, //循环播放
            speed: 1000000 //巡航速度，单位千米/小时
        });

        navg1.start();
    });
    },
    onChange(){

    },
        // 初始化回放路线
    initPolyline() {
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArr,
        showDir: true,
        strokeColor: "#28F", //线颜色
        strokeWeight: 6 //线宽
      });
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#AF5", //线颜色
        strokeWeight: 6 //线宽
      });
    },
        startAnimation(status, arr) {
      //速度 = 初始速度 * 倍数
      let markerSpeed = this.markerSpeed * this.speedCount;
      
      if (status == 0) {
        // 初始时间为00:00
        this.progressTime = formatSeconds(0); 
        this.value = 0; // 进度条归0
        this.palyStayus = 1; // icon状态为播放
        arr = this.lineArr; 
        //计时器--- 开始监听时间和进度条
        this.monitorInterval(); 
      }
      // 还是播放---请查看高德地图api
      this.marker.moveAlong(arr, markerSpeed);
    },
    
    formatSeconds(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if(secondTime > 60) {
            minuteTime = parseInt(secondTime / 60);
            secondTime = parseInt(secondTime % 60);
            if(minuteTime > 60) {
                hourTime = parseInt(minuteTime / 60);
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        var result = parseInt(secondTime)< 10?("0" + parseInt(secondTime)): ("" + parseInt(secondTime));
        result =parseInt(minuteTime)< 10?("0" + parseInt(minuteTime))+ ":" + result : ("" + parseInt(minuteTime)) + ":" + result;
        return result;
    },
    monitorInterval() {
  // 进度条
  // 当（TIME_VARIABLE / 100) * 1000时间 每循环一次 进度条走一个倍数，等播放完进度条也刚好走完
  this.int = setInterval(() => {
    this.value += 1 * this.speedCount;
  }, (TIME_VARIABLE / 100) * 1000);
  
  // 时间
  this.timeInt = setInterval(() => {
    this.ptm += 1;
    this.progressTime = formatSeconds(this.ptm);
  }, 1000);
},
selectMultiple(e, data) {
  this.muiltipleIndex = e;
  this.speedCount = data; //倍数
  // 如果正在行驶中点击倍数
  if (this.palyStayus == 1) { 
    this.marker.pauseMove(); // 先暂停车
    // 截取到车辆未走的经纬度数组
    this.lineArr = this.lineArr.slice(this.passedPath); 
    
    //并把暂停住车辆时，车辆正好所在的经纬度拼接到未走的经纬度数组里面-------当前未回放的经纬度
    //this.curreGDPath这个很关键--在前面的代码中有交代
    //this.lineArr现在这个数据截取到了点击倍数时未走的路程
    this.lineArr.unshift(this.curreGDPath);
    //并把this.lineArr更新到线条里面，，要不线条颜色不同步
    this.initPolyline();
    // 刚才暂停了一下，就要再次开启播放
    this.startAnimation(1, this.lineArr);
  }
},
 // 暂停
pauseAnimation() {
  this.palyStayus = 2; // icon状态为2
  // 停止计时器
  clearInterval(this.int); 
  clearInterval(this.timeInt);
  this.marker.pauseMove();
},
// 继续
resumeAnimation() {
  this.palyStayus = 1;  // icon状态为2
  this.monitorInterval();
  this.marker.resumeMove();
},
// 停止
stopAnimation() {
  this.marker.stopMove();
},

    
  }
}
</script>>
<style scoped>
#container{
  height: 5rem;
}
</style>