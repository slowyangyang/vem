<template>
  <div class="search">
    <form action="/">
      <van-search
        v-model="value"
        shape="round"
        background="#1989fa"
        placeholder="请输入车牌号"
        @search="onSearch"
        @cancel="onCancel"/>
</form>
  </div>
</template>

<script>
export default {
  name:'search',
  data(){
    return {
      value:''
    }
  },
  methods: {
    onSearch(e){
      this.$emit('Search',e)
    },
    onCancel(e){
      this.$emit('Cancel',e)
    }
  }
}
</script>

<style>

</style>