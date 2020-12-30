<template>
  <div class="search">
    <form action="/">
      <van-search
        v-model="value"
        shape="round"
        placeholder="请输入车牌号"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
        @blur="onBlur"
        ref="search"/>
    </form>
    <!-- 搜索记录 -->
    <div class="record" v-show="cordShow">
      <ul id="ztree" class="ztree"></ul>
      <div class="cord_bottom">
        <van-row type="flex" gutter="30" justify="center">
          <van-col :span="6">
            <van-button type="info" plain @click="btnCancel">取消</van-button>
          </van-col>
          <van-col :span="6">
            <van-button type="info" @click="btnConfirm">确定</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/css/zTreeStyle.css'
import "@/assets/js/jquery.ztree.core.min.js"
import "@/assets/js/jquery.ztree.excheck.min.js"
import "@/assets/js/jquery.ztree.exhide.min.js"
import { getZNodes, queryLocal, searchPalteNo } from 'network/home'
import pako from 'pako'
import axios from 'axios'
export default {
  name:'search',
  data(){
    return {
      value:'',
      cordShow:false,
      isfetch:true,
      treeObj:null,
      noData: false,
      treeId: 'ztree',
      treeObj: '',
      nodes: [],
      allNodes: [],
      nodesShow: [],
      setting:{
        check: { 
          enable: true, 
          nocheckInherit: false ,
          chkboxType: { "Y": "", "N": "" }
          },
        data: { 
          simpleData: { 
            enable: true,
            idKey: 'id',
            pIdKey: 'pId',
            rootPId: 0 
          } 
        },
        callback: {
          onClick: this.zTreeOnClick,
          onCollapse:this.Collapse,
          onCheck:this.onchecked,
          onExpand:this.Expand
			  },
        view: {
          showIcon: false,
          nameIsHTML: true,            
          selectedMulti: false,
          dblClickExpand:false
        },
        // async: {
        //   enable: true,
        //   autoParam: ["id=treeCode"],
        //   url:'/app/track/provideShowData',
        //   // otherParam:{"treeCode":"1"},
        //   type:'post',
        //   dataFilter:function(treeId, parentNode, childNodes){
        //     console.log(parnetNode);
        //   }
        // }
      },
      zNodes:[
              { id:1,pid:0,name:"大良造菜单",open:true,nocheck:true,iconOpen:"/src/assets/image/increase.png", iconClose:"/src/assets/image/reduce.png",
                children: [
                    { id:11,pid:1,name:"当前项目"},
                    { id:12,pid:1,name:"工程管理",open:true,nocheck:true,
                        children: [
                            { id:121,pid:12,name:"我的工程"},
                            { id:122,pid:12,name:"施工调度"},
                            { id:1211,pid:12,name:"材料竞价"}
                        ]
                    },
                    { id:13,pid:1,name:"录入管理",nocheck:true,open:true,
                        children: [
                            { id:131,pid:13,name:"用工录入"},
                            { id:132,pid:13,name:"商家录入"},
                            { id:1314,pid:13,name:"机构列表"}
                        ]
                    },
                    { id:14,pid:1,name:"审核管理",nocheck:true,open:true,
                        children: [
                            { id:141,pid:14,name:"用工审核"},
                            { id:142,pid:14,name:"商家审核"},
                            { id:145,pid:14,name:"机构审核"}
                        ]
                    },
                    { id:15,pid:1,name:"公司管理",open:true,nocheck:true,
                        children: [
                            { id:1517,pid:15,name:"我的工程案例"},
                            { id:1518,pid:15,name:"联系人设置"},
                            { id:1519,pid:15,name:"广告设置"}
                        ]
                    },
                    { id:16,pid:1,name:"业务管理",nocheck:true,open:true,
                        children: [
                            { id:164,pid:16,name:"合同范本"},
                            { id:165,pid:16,name:"合同列表"},
                            { id:166,pid:16,name:"需求调度"}
                        ]
                    },
                    { id:17,pid:1,name:"订单管理",open:true,
                        children: [
                            { id:171,pid:17,name:"商品订单"},
                            { id:172,pid:17,name:"用工订单"},
                            { id:175,pid:17,name:"供应菜单"}
                        ]
                    },
                    { id:18,pid:1,name:"我的功能",open:true,nocheck:true,
                        children: [
                            { id:181,pid:18,name:"免费设计"},
                            { id:182,pid:18,name:"装修报价"},
                            { id:1817,pid:18,name:"项目用工"}
                        ]
                    },
                    { id:19,pid:1,name:"分润管理",open:true,nocheck:true,
                        children: [
                            { id:191,pid:19,name:"分润列表"}
                        ]
                    },
                    { id:110,pid:1,name:"运营管理",open:true,nocheck:true,
                        children: [
                            { id:1101,pid:110,name:"代理列表"},
                            { id:1102,pid:110,name:"代售商品"}
                        ]
                    },
                ]
              }
      ],
      bvId:[],
      timer:null,
      autoParam:[]
    }
  },
  mounted(){
    // this.initzTree()
  },
  activated(){
    console.log(this.bvId);
    if(this.bvId.length){
      this.polling()
    }
  },
  deactivated(){
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    onSearch(e){
      this.$emit('Search',e)
    },
    onCancel(e){
      this.$emit('Cancel',e)
    },
    onFocus(){
      if(this.isfetch){
        this.isfetch = false
        this.cordShow = true
        this.fetch(1)
        // this.initzTree()
      }
    },
    onBlur(){
      return false
    },
    btnCancel(){
      this.cordShow = false
      this.isfetch = true
    },
    btnConfirm(){
      let str = ''
      this.bvId = []
      //获取选中的项
      let checked = this.treeObj.getChangeCheckedNodes(true)
      //筛选叶子节点
      checked = checked.filter(item => !item.children)
      if(checked.length){
        checked.forEach(val => {
          str+=val.name+','
          this.bvId.push(val.id)
        })
        str = str.substr(0,str.length-1)
        this.value = str
        this.queryCar(this.bvId)
      }
      this.cordShow = false
      this.isfetch = true
    },
    queryCar(bvId){
      queryLocal(bvId).then(res => {
        console.log(res);
        let data = res.data
        if(data.status === '0'){
          this.$Bus.$emit('getlocal',data.result.vehicle)
          this.polling()
        }else{
          this.$notify({ type: 'primary', message: data.msg});
        }
      })
    },
    Collapse(event, treeId, treeNode){
      //被折叠
    },
    //展开时请求子节点
    Expand(event, treeId, treeNode){
      console.log(treeNode);
      if(!treeNode.isParent){
        return
      }
      this.getZNodes(treeNode)
    },
    getZNodes(treeNode){
      getZNodes(treeNode.id).then(res => {
        console.log(res);
        let data = res.data
        let result = this.unzip(res.data.result)
        let nodes = []
        if(data.status == 0){
          let org = result.data.org
          let bv = result.data.bv
          if(org){
            org.forEach(val => {
              let obj = {}
              obj.id = val.id
              obj.name = val.orgName
              obj.pid = val.parentId
              obj.isParent = true
              obj.nocheck = true
              nodes.push(obj)
            })
            this.treeObj.addNodes(treeNode,-1,nodes,true)
          }
          if(bv){
            nodes = []
            bv.forEach(val=>{
              let obj = {}
              obj.id = val.ve.id
              obj.name = val.ve.plateNo
              obj.simNo = val.ve.simNo
              obj.orgId = val.ve.orgId
              nodes.push(obj)
            })
            this.treeObj.addNodes(treeNode,-1,nodes,true)
          }
          this.treeObj.updateNode(treeNode,false)
          console.log(this.zNodes);
        }else{
          this.$notify("暂无此数据")
        }
      })
    },
    initzTree(){
      $.fn.zTree.init($("#"+this.treeId), this.setting, this.zNodes).expandAll(false);
      this.treeObj = $.fn.zTree.getZTreeObj("ztree")
      var nodes = this.treeObj.getNodes()
      this.allNodes = this.queryFun(nodes)
      this.nodes = []
    },
    zTreeOnClick(event, treeId, treeNode){
      let checked = this.treeObj.getCheckedNodes(true)
      console.log(treeNode);
      if(treeNode.isParent){
        if(treeNode.open){
          this.treeObj.expandNode(treeNode,false)
        }else{
          this.getZNodes(treeNode)
          this.treeObj.expandNode(treeNode,true)
        }
        return
      }
      if(checked.length > 2){
        if(!treeNode.checked){
          this.$Toast({message:'请最多选择三个',duration:1500})
          this.treeObj.cancelSelectedNode(treeNode)
        }else{
          this.treeObj.checkNode(treeNode,'',false)
        }
      }else{
        this.treeObj.checkNode(treeNode,'',true)
      }
    },
    onchecked(event, treeId, treeNode){
      let checked = this.treeObj.getCheckedNodes()
      console.log(checked);
      if(checked.length > 3){
        if(treeNode.checked){
          this.$Toast({message:'请最多选择三个',duration:1500})
        this.treeObj.checkNode(treeNode,'',true)
          // this.treeObj.cancelSelectedNode(treeNode)
        }
      }
    },
    queryFun(node) {
      for (var i in node) {
        this.nodes.push(node[i])
        if (node[i].children) {
          this.queryFun(node[i].children)
        }
      }
      return this.nodes
    },
    searchFun (val, isHighLight, isExpand) {
	      var key = val.replace(/(^\s*)|(\s*$)/g, "")
	      this.nodesShow = []
	      isHighLight = isHighLight === false ? false : true
	      isExpand = isExpand ? true : false
	      this.filterzTree(key, this.allNodes, isExpand, isHighLight)
	      if (this.keyValue === '') {
	        this.noData = false
	      }else {
	        if (this.nodesShow.length === 0) {
	          this.noData = true
	        }else {
	          this.noData = false
	        }
	      }
	      this.showNodesFun(this.nodesShow, key)
    },
    filterzTree(key, nodes, isExpand, isHighLight){
      var metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'
      var rexMeta = new RegExp(metaChar, 'gi')
      var nameKey = this.treeObj.setting.data.key.name
      for (var i =0; i < nodes.length; i++) {
        // if (nodes[i] && nodes[i].oldname && nodes[i].oldname.length > 0) {
        //   nodes[i][nameKey] = nodes[i].oldname
        // }
        // this.treeObj.updateNode(nodes[i])
        if (key === '') {
          this.initzTree()
          break
        }else {
          if(nodes[i][nameKey] && nodes[i][nameKey].toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            if (isHighLight) {
              var newKeywords = key.replace(rexMeta, (matchStr) => {
                return '//' + matchStr
              })
              nodes[i].oldname = nodes[i][nameKey]
              var rexGlobal = new RegExp(newKeywords, 'gi')
              nodes[i][nameKey] = nodes[i].oldname.replace(rexGlobal, (originalText) => {
                var highLightText =
                '<span style="color: whitesmoke;background-color: darkred;">'
                + originalText
                +'</span>'
                return 	highLightText
              })
              this.treeObj.updateNode(nodes[i])
            }
            console.log(nodes[i]);
            this.treeObj.showNode(nodes[i])
            this.nodesShow.push(nodes[i])
          }else {
            this.treeObj.hideNode(nodes[i])
          }
        }
      }
    },
    showNodesFun (nodesShow, key) {
      if(key.length > 0){
        nodesShow.forEach(node => {
          var pathOfOne = node.getPath()
          if (pathOfOne && pathOfOne.length > 0) {
            for (var i = 0; i < pathOfOne.length - 1; i++) {
              console.log(pathOfOne[i]);
                this.treeObj.showNode(pathOfOne[i])
              this.treeObj.expandNode(pathOfOne[i], true)
            }
          }
        })
      }else {
        var rootNodes = this.treeObj.getNodesByParam('level', '0')
        rootNodes.forEach(node => {
          this.treeObj.expandNode(node, true)
        })
      }
    },
    fetch(treeCode){
      getZNodes(treeCode).then(res => {
        let data = res.data
        console.log(data);
        let result = this.unzip(res.data.result)
        if(data.status === '0'){
          let org = result.data.org
          let bv = result.data.bv
          this.zNodes = []
          //遍历组织
          if(org){
            org.forEach(val => {
              let obj = {}
              obj.id = val.id
              obj.name = val.orgName
              obj.pid = val.parentId
              obj.isParent = true,
              obj.nocheck = true
              obj.iconOpen = "../../../assets/image/increase.png"
              obj.iconClose = "../../../src/assets/image/reduce.png"
              this.zNodes.push(obj)
            })
            console.log(this.zNodes);
          }
          //遍历同级节点
          if(bv){
            bv.forEach(val=>{
              let obj = {}
              obj.id = val.ve.id
              obj.name = val.ve.plateNo
              obj.simNo = val.ve.simNo
              obj.orgId = val.ve.orgId
              this.zNodes.push(obj)
            })
          }
          this.initzTree()
        }else{
          this.$notify({type:'primary',message:data.message})
        }
      }).catch(err => {
        console.log(err);
      })
    },
    polling(){
      if(this.timer){
        clearInterval(this.timer)
      }
      this.timer = setInterval(()=> {
        queryLocal(this.bvId).then(res => {
          console.log(res);
          let data = res.data
          if(data.status == 0){
            this.$Bus.$emit('getlocal',data.result.vehicle)
          }else{
            this.$notify({ type: 'primary', message: data.msg});
          }
        })
      },30000)
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
  },
  watch: {
    value(newV) {
      //本地搜索
      // this.searchFun(newV, false, false)
      if(newV.length>=3 && newV){
        searchPalteNo(newV).then(res=>{
          console.log(res);
          let data = res.data
          let result = this.unzip(res.data.result)
          if(data.status === '0'){
            let bv = result.data.bv
            // let bv = res.data.result.data.bv
            if(bv){
              this.zNodes = []
              bv.forEach(val=>{
                let obj = {}
                obj.id = val.ve.id
                obj.name = val.ve.plateNo
                obj.simNo = val.ve.simNo
                obj.orgId = val.ve.orgId
                this.zNodes.push(obj)
              })
              this.initzTree()
            }
          }else{
            this.$notify("暂无此数据")
          }
        })
      }
    },
    cordShow(newVal){
      if(newVal){
        $(".van-tabbar--fixed").hide()
      }else{
        $(".van-tabbar--fixed").show()
      }
    }
  },
}
</script>

<style scopd>
.search{
}
.record{
  width: 100%;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 50px;
  z-index: 111;
  background: #fff;
}
.cord_bottom{
  width: 100%;
  position: absolute;
  bottom: 0.1rem;
  left: 0;
}
.ztree{
  width:90%;
  padding-left: 0.2rem;
  padding-top: 0.08rem;
  height: calc(100% - 50px);
  overflow-y: auto;
}
.van-button--normal{
  height: 30px;
  width: 100%;
}
.ztree li span.button{
  /* width: 0.2rem;
  height: 0.2rem;
  border: 0.01rem solid #ccc; */
  /* background: url("~assets/image/increase.png"); */
}
</style>