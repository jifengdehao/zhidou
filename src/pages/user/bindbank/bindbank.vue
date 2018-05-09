/**
* @author zhangwenlong
* @date 2018/4/10
* @Description: 绑定银行卡
*/
<template>
  <div class="page-wp">
    <div class="card">
      <div class="hd">请绑定账户本人的银行卡</div>
      <div class="bd">
        <span class="title">开户行</span>
        <select v-model="params.bank_code" class="select-bd">
          <option disabled value="">请选择开户行</option>
          <option v-for="(item,index) in bankList" :key="index" :value="index">{{item}}</option>
        </select>
      </div>
      <mt-field label="卡号" placeholder="请输入银行卡号" v-model.trim="params.bank_account" type="number"></mt-field>
      <mt-field label="姓名" placeholder="请输入持卡人姓名" v-model.trim="params.user_name"></mt-field>
      <!--<mt-field label="身份证" placeholder="请输入持卡人身份证" v-model.trim="params.card"></mt-field>-->
      <!-- <mt-field label="手机号" placeholder="请输入银行预留的手机号" type="number" v-model.trim="params.tel">
         <span class="check-code" :class="{'disabled': countdown}" @click="sendCheckCode">
         {{ countdown ? countdown + 's' : '获取验证码' }}
       </span>
       </mt-field>
       <mt-field type="number" label="验证码" placeholder="请输入验证码" v-model="params.sms_code"></mt-field>-->
      <div class="fd">
        <input type="checkbox" v-model="checked"/>&nbsp;&nbsp;同意<a :href="'/yinlianxieyi'">《银联用户服务协议》</a>
      </div>
      <mt-button type="primary" size="large" class="mt30 btn-submit" @click="postBank">确定</mt-button>
      <router-link tag="div" class="link-home" to="/"></router-link>
    </div>
  </div>
</template>

<script>
  import {isMobile, isCardNo} from '@/common/util'

  export default {
    name: "bindbank",
    data() {
      return {
        checked: false,
        bankList: {},
        countdown: 0, // 验证码时间
        timer: null,
        params: {
          bank_code: '',
          user_name: '',
          bank_account: '',
          /* sms_code: '',
           tel: '', // 手机号
           card: '' // 身份证*/
        }
      }
    },
    created() {
      this.getBankList()
    },
    methods: {
      sendCheckCode() {
        const vm = this;
        const mobile = this.params.tel;
        if (!this.countdown) {
          if (!isMobile(mobile)) {
            this.$toast('手机号格式不正确');
          } else {
            this.API.carryVerifyMobile(mobile).then((res) => {
              if (res.waitTime) {
                console.log(res)
                vm.countdown = res.waitTime;
                vm.timer = setInterval(() => {
                  vm.countdown -= 1;
                  if (vm.countdown < 1) {
                    clearInterval(vm.timer);
                  }
                }, 1000);
              } else {
                vm.$toast('获取验证码失败');
              }
            });
          }
        }
      },
      getBankList() {
        this.API.bankList().then((res) => {
          console.log(res)
          this.bankList = res
        }).catch((err) => {
          console.log(err)
        })
      },
      postBank() {
        let message = '';
        const params = this.params;
        if (!params.bank_code) {
          message = '请选择开户行'
        } else if (!params.bank_account) {
          message = '请输入银行卡号'
        } else if (params.bank_account.length < 15 || params.bank_account.length > 20) {
          message = '你输入的银行卡号有误'
        } else if (!params.user_name) {
          message = '请输入持卡人姓名'
        } else if (!this.checked) {
          message = '请勾选银联用户服务协议'
        }
        /*else if (!params.card) {
          message = '请输入持卡人身份证号码'
        } else if (!params.tel) {
          message = '请输入银行预留的手机号'
        } else if (!isCardNo(params.card)) {
          message = '你输入的身份证号码有误'
        } else if (!isMobile(params.tel)) {
          message = '你输入的手机号有误'
        } */
        if (message) {
          this.$toast(message);
          return;
        }
        console.log(params)
        this.API.bindingBank(params).then((res) => {
          console.log(res)
          this.$router.back()
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin.scss";

  .btn-submit {
    display: block;
    margin: 2rem auto 0;
    width: 7rem;
    border-radius: .4rem;
    background: linear-gradient(left, $color-blue-begin, $color-blue-end) no-repeat;
  }

  .card {
    .hd, .fd {
      padding: 0 .2rem;
      height: .8rem;
      line-height: .8rem;
    }
    .bd {
      background-color: #ffffff;
      display: flex;
      align-items: center;
      margin-bottom: .4rem;
      line-height: 1.2rem;
      height: 1.2rem;
      padding: 0 .2rem;
      .title {
        width: 105px;
        flex: 0 0 105px;
      }
      .select-bd {
        flex: 1;
        height: .4rem;
      }
    }
    .check-code {
      display: inline-block;
      width: 1.6rem;
      line-height: .76rem;
      text-align: center;
      font-size: .24rem;
      color: #ffffff;
      background: #FE5040;
      border-radius: .38rem;
      &.disabled {
        background: #B2B2B2;
      }
    }
  }
</style>
