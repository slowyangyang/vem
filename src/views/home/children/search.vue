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
import { getZNodes } from 'network/home'
export default {
  name:'search',
  data(){
    return {
      value:'',
      cordShow:false,
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
          chkboxType: { "Y": "ps", "N": "ps" }
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
            onCollapse:this.onCollapse,
            onExpand:this.onExpand,
            onClick:this.onClick,
            onCheck:this.onCheck
          },
          view: {
            showIcon: false,
            nameIsHTML: true,            
	          selectedMulti: false
          },
      },
      zNodes:[
              { id:1,pid:0,name:"大良造菜单",open:true,nocheck:false,
                children: [
                    { id:11,pid:1,name:"当前项目"},
                    { id:12,pid:1,name:"工程管理",open:true,
                        children: [
                            { id:121,pid:12,name:"我的工程"},
                            { id:122,pid:12,name:"施工调度"},
                            { id:1211,pid:12,name:"材料竞价"}
                        ]
                    },
                    { id:13,pid:1,name:"录入管理",open:true,
                        children: [
                            { id:131,pid:13,name:"用工录入"},
                            { id:132,pid:13,name:"商家录入"},
                            { id:1314,pid:13,name:"机构列表"}
                        ]
                    },
                    { id:14,pid:1,name:"审核管理",open:true,
                        children: [
                            { id:141,pid:14,name:"用工审核"},
                            { id:142,pid:14,name:"商家审核"},
                            { id:145,pid:14,name:"机构审核"}
                        ]
                    },
                    { id:15,pid:1,name:"公司管理",open:true,
                        children: [
                            { id:1517,pid:15,name:"我的工程案例"},
                            { id:1518,pid:15,name:"联系人设置"},
                            { id:1519,pid:15,name:"广告设置"}
                        ]
                    },
                    { id:16,pid:1,name:"业务管理",open:true,
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
                    { id:18,pid:1,name:"我的功能",open:true,
                        children: [
                            { id:181,pid:18,name:"免费设计"},
                            { id:182,pid:18,name:"装修报价"},
                            { id:1817,pid:18,name:"项目用工"}
                        ]
                    },
                    { id:19,pid:1,name:"分润管理",open:true,
                        children: [
                            { id:191,pid:19,name:"分润列表"}
                        ]
                    },
                    { id:110,pid:1,name:"运营管理",open:true,
                        children: [
                            { id:1101,pid:110,name:"代理列表"},
                            { id:1102,pid:110,name:"代售商品"}
                        ]
                    },
                ]
              }
            ]  
    }
  },
  mounted(){
    
  },
  methods: {
    onSearch(e){
      this.$emit('Search',e)
    },
    onCancel(e){
      this.$emit('Cancel',e)
    },
    onFocus(){
      this.cordShow = true
      this.fetch()
    },
    btnCancel(){
      this.cordShow = false
    },
    btnConfirm(){
      let str = ''
      //获取选中的项
      let checked = this.treeObj.getChangeCheckedNodes(true)
      //筛选叶子节点
      checked = checked.filter(item => !item.children)
      checked.forEach(val => {
        str+=val.name+','
      })
      str = str.substr(0,str.length-1)
      this.value = str
      this.cordShow = false
    },
    onCollapse(event, treeId, treeNode){

    },
    onExpand(event, treeId, treeNode){

    },
    initzTree(){
      $.fn.zTree.init($("#"+this.treeId), this.setting, this.zNodes).expandAll(false);
      this.treeObj = $.fn.zTree.getZTreeObj("ztree")
      var nodes = this.treeObj.getNodes()
      this.allNodes = this.queryFun(nodes)
      console.log(this.allNodes);
      this.nodes = []
    },
    onClick(event, treeId, treeNode){
      this.treeObj.checkNode(treeNode,'',true)
    },
    onCheck(event, treeId, treeNode){
      
    },
    queryFun(node) {
      for (var i in node) {
        this.nodes.push(node[i])
        if (node[i].children) {
          this.queryFun(node[i].children)
        }
        // else{
        //   this.nodes.push(node[i])
        // }
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
      console.log(key);
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
            console.log(nodes[i]);
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
    fetch(){
      getZNodes().then(res => {
        console.log(res);
        this.initzTree()
      }).catch(err => {
        console.log(err);
      })
    }
  },
  watch: {
    value(newV) {
      console.log(newV);
      this.searchFun(newV, false, false)
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
  z-index: 1;
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
</style>