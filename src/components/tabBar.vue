<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item icon="home-o" to="/home">主页</van-tabbar-item>
    <!-- <van-tabbar-item icon="tv-o" to="/monitor">监控</van-tabbar-item> -->
    <van-tabbar-item icon="friends-o" to="/profile">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name:'tabBar',
  data() {
    return {
      active: 0,
    };
  },
}
</script>
<style scoped>

</style>