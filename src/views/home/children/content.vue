<template>
  <div class="content_box">
    <p class="con_title">北斗</p>
    <div class="content">
      <div class="con_top">
        <div>
          <p>公司总数</p>
          <p>80</p>
        </div>
        <div>
          <p>用户总数</p>
          <p>81</p>
        </div>
      </div>
      <div class="con_bottom">
        <div>
          <p>总车辆</p>
          <p>1565</p>
        </div>
        <div>
          <div>
            <p>在线车辆</p>
            <p>3195</p>
          </div>
          <div>
            <p>离线车辆</p>
            <p>3195</p>
          </div>
          <div>
            <p>报警车辆</p>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'content'
}
</script>

<style scoped>
  .content_box{
    width: 100%;
    padding: 0 0.15rem;
    color: #fff;
  }
  .content_box > div > p{
    text-align: center;
  }
  .con_top{
    display: flex;
    margin-bottom: 0.1rem;
  }
  .con_top > div{
    height: 0.8rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .con_top > div:first-child{
    background: cornflowerblue;
    border-right: 0.1rem solid #fff;
  }
  .con_top > div:last-child{
    background: darkgreen;
  }
  .con_top p{
    margin-bottom: 0.08rem;
  }
  .con_bottom{
    display: flex;
  }
  .con_bottom > div{
    height: 0.8rem;
    display: flex;
  }
  .con_bottom p{
    margin-bottom: 0.08rem;
  }
  .con_bottom > div:first-child{
    width: 1rem;
    background: chocolate;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .con_bottom > div:first-child > div > p{
    text-align: center;
    margin-bottom: 0.8rem;
  }
  .con_bottom > div:last-child{
    flex:1;
    display: flex;
    color: #000;
  }
  .con_bottom > div:last-child > div{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .con_bottom > div:last-child > div > p{
    text-align: center;
  }
  .con_bottom > div:last-child > div > p:first{
    color: #000;
  }
</style>