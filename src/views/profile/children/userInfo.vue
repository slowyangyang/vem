<template>
  <div class="userInfo">
    <van-card
  :desc="infoList.nickname"
  :thumb="infoList.headimgurl"/>
  </div>
</template>

<script>
export default {
  name:'userInfo',
  props:{
    infoList:{
      required:true,
      default(){
        return {}
      }
    }
  },
  data(){
    return {

    }
  }
}
</script>

<style scoped>
.van-card__content{
  min-height: 60px;
  justify-content: center;
}
.van-card__thumb{
  /* width: 60px;
  height: 60px; */
}


</style>