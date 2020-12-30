<template>
  <div class="pushTab">
    <van-tabs v-model="active">
      <van-tab title="GPS报警">
        <van-form @submit="onSubmit" ref="form">
          <div style="margin-bottom:60px">
            <van-field name="radio" class="form-item">
              <template #input>
                <van-checkbox v-model="form.offLine" direction="horizontal">
                  离线
                </van-checkbox>
              </template>
            </van-field>
            <van-field name="radio" class="form-item">
              <template #input>
                <van-checkbox v-model="form.speeding.checked" direction="horizontal">
                  超速
                </van-checkbox>
                <van-field  label="时长(秒)" placeholder="实时" :label-width="54" v-model="form.speeding.time" clearable/>
              </template>
            </van-field>
            <van-field name="radio" class="form-item">
              <template #input>
                <van-checkbox v-model="form.fatigue.checked" direction="horizontal">
                  疲劳
                </van-checkbox>
                <van-field  label="时长(秒)" placeholder="实时" :label-width="54" v-model="form.fatigue.time" clearable/>
              </template>
            </van-field>
          </div>
          <div class="bottom_btn">
            <van-button round block type="info" native-type="submit">
              设置
            </van-button>
          </div>
        </van-form>
      </van-tab>
      <van-tab title="主动安全"><van-empty description="敬请期待" /></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { pushPolic } from 'network/profile'
export default {
  name:'pushTab',
  data(){
    return{
      active:0,
      form:{
        offLine:0,
        speeding:{checked:false,time:0},
        fatigue:{checked:false,time:0}
      }
    }
  },
  mounted(){
    this.reset()
  },
  methods: {
    onSubmit(){
      pushPolic().then(res => {
        let data = res.data
        console.log(data);
      })
      console.log(this.form);
      
    },
    reset(){
      this.form = {
        offLine:0,
        speeding:{checked:false,time:0},
        fatigue:{checked:false,time:0}
      }
    }
  }
}
</script>

<style scoped>
.pushTab{
  height: calc(100% - 46px);
}
/deep/.van-tabs__line{
  background-color: #1989fa;
}
/deep/.van-field__control:read-only {
    cursor: default;
    flex-direction: column;
    align-items: flex-start;
}
.van-tabs{
  height: 100%;
}
/deep/.van-tabs__content{
  height: calc(100% - 44px);
}
/deep/.van-tab__pane{
  height: 100%;
  overflow-y: auto;
  
}
.van-form{
  position: relative;
}
.bottom_btn{
  width: 90%;
  position: fixed;
  bottom: 0.1rem;
  left: 50%;
  transform: translateX(-50%);
}
.van-button--info{
  height: 0.44rem;
}
.van-cell{
  padding: 5px 16px;
}
</style>