<template>
  <div id="app">
    <keep-alive exclude="trackBack">
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name:'App',
  components:{
    
  },
}
</script> 
<style>
#app{
  height:100%
}
</style>
