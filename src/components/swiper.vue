<template>
  <div class="swiper">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1989fa">
      <van-swipe-item v-for="(item,index) in swiperList" :key="index">
        <img :src="item" alt="">
      </van-swipe-item>
    </van-swipe>
  </div>
  
</template>

<script>
export default {
  name:'swiper',
  props: {
    swiperList: {
      require: true,
      default(){
        return []
      }
    }
  }
}
</script>

<style scopde>
  .swiper{
    height:2rem
  }
  .van-swipe{
    height: 100%;
  }
  .swipe img{
    width: 100%;
    height: 100%;
  }
</style>