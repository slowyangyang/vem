<template>
  <div class="pushTab">
    <van-tabs v-model="active">
      <van-tab title="GPS报警">
        <van-form @submit="onSubmit" ref="form">
          <div style="margin-bottom:60px">
            <van-field name="radio" class="form-item" border>
              <template #input>
                <van-checkbox v-model="form.fenceAlarm" direction="horizontal">
                  围栏
                </van-checkbox>
              </template>
            </van-field>
            <van-field name="radio" class="form-item">
              <template #input>
                <van-checkbox v-model="form.pressureAlarm" direction="horizontal">
                  空压机
                </van-checkbox>
              </template>
            </van-field>
            <van-field name="radio" class="form-item">
              <template #input>
                <van-checkbox v-model="form.loadAlarm" direction="horizontal">
                  装卸货
                </van-checkbox>
              </template>
            </van-field>
          </div>
          <!-- <van-field name="checkboxGroup">
            <template #input>
              <van-checkbox-group v-model="checkboxGroup" >
                <van-checkbox name="1" shape="square">围栏</van-checkbox>
                <van-checkbox name="2" shape="square">空压机</van-checkbox>
                <van-checkbox name="3" shape="square">装卸货</van-checkbox>
              </van-checkbox-group>
            </template>
          </van-field> -->
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
import {getPushList, updataPushList} from 'network/profile'
import { Dialog } from 'vant';
export default {
  name:'pushTab',
  data(){
    return{
      active:0,
      form:{
        pressureAlarm:0,
        loadAlarm:0,
        fenceAlarm:0
      },
      checkboxGroup: [],
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  activated(){
    this.getSetting()
  },
  deactivated(){
    this.reset()
  },
  methods: {
    onSubmit(){
      // this.$Toast({message:'正在修复中...',duration:2000})
      // return false
      let params = this.form
      for(let i in params) {
        if(params[i]){
          params[i] = 1
        }else{
          params[i] = 0
        }
      }
      updataPushList(params).then(res => {
        console.log(res);
        let data = res.data
        if(res.data.status === '0'){
          this.$Toast({message:data.msg, duration:1000})
        }else{
          Dialog.alert({
            title: '错误',
            message: data.msg,
          }).then(() => {
            // on close
          });
          // this.$Toast({message:data.msg, duration:1000})

        }
      })
    },
    reset(){
      this.form = {
        pressureAlarm:0,
        loadAlarm:0,
        fenceAlarm:0
      }
    },
    getSetting(){
      getPushList().then(res => {
        console.log(res);
        let data = res.data.result
        if(res.data.status === "0"){
          for(let i in data) {
            if(data[i]){
              data[i] = true
            }else{
              data[i] = false
            }
          }
          this.form  = {...data}
          console.log(this.form);
        }
      }).catch(err =>{
        this.$Toast({message:err,duration:1000})
      })
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
  padding: 2px 16px;
}
.van-cell::after{
  border-bottom: 0;
}
.van-checkbox{
  margin-bottom: 0.2rem;
}
</style>