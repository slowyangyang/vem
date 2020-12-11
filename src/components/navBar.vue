<template>
  <van-nav-bar
  :title="title"
  :left-text="leftText"
  :left-arrow="leftArrow"
  @click-left="onClickLeft"
/>
</template>

<script>
export default {
  name:'navBar',
  props: {
    title:{
      type:String,
      default(){
        return ''
      }
    },
    leftText:{
      type:String,
      default(){
        return ''
      }
    },
    leftArrow:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  methods:{
    onClickLeft(){
      history.go(-1)
    }
  }
}
</script>

<style scoped>


</style>