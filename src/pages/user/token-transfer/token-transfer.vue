/**
* @author zhangwenlong
* @date 2018/4/9
* @Description: 智豆转出
*/
<template>
  <div class="page-wp">
    <div class="mt20 mint-input-tar">
      <mt-field label="目标账户" placeholder="请输入以太坊钱包地址" v-model.trim="account_no"></mt-field>
      <div class="text">
        <a href="https://mp.weixin.qq.com/s/jKi-8q_sCD_CFw7f2vtl6w" style="color: red;">如何获取转账地址?</a>
      </div>
      <mt-field label="验证码" placeholder="请输入验证码" v-model.trim="sms_code">
        <span class="check-code" :class="{'disabled': countdown}" @click="sendCheckCode">
          {{countdown ? countdown + 's' : '获取验证码'}}
        </span>
      </mt-field>

      <mt-cell title="可使用智豆">
        <span class="black">{{userBean.amount}}</span>
      </mt-cell>
      <mt-field label="转出智豆" placeholder="请输入智豆数量" v-model.trim="amount"></mt-field>
      <mt-cell title="转出费用">
        <span class="cell-text">3元</span>
      </mt-cell>
      <mt-button type="primary" size="large" class="mt30 btn-submit" @click="handlerSubmit">转出</mt-button>
    </div>
    <div class="text mt30">
      <p>备注:智豆转账需等待几分钟。</p>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import {weixinPay} from '@/common/otherWeixin'

  export default {
    data() {
      return {
        amount: '', // 转出智豆
        account_no: '', // 转出账户
        sms_code: '',
        userBean: {}, // 用户智豆
        countdown: 0
      };
    },
    created() {
      this.getUserBaseBalance()
    },
    methods: {
      sendCheckCode() {
        let vm = this
        this.API.getSendBeanCode().then((res) => {
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
        }).catch((err) => {
          console.log(err)
        })
      },
      getUserBaseBalance() {
        this.API.userBalance().then((res) => {
          console.log(res)
          this.userBean = res.bean
        }).catch((err) => {
          console.log(err)
        })
      },
      handlerSubmit() {
        if (this.userBean.amount > 0) {
          this.API.beanTransferPoundage({
            amount: this.amount,
            account_no: this.account_no,
            sms_code: this.sms_code
          }).then((res) => {
            let vm = this
            let data = res.jsApiParams
            weixinPay(data, function (res) {
              if (res) {
                vm.$router.back()
              }
            })
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.$toast('没有可使用的智豆~')
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin.scss";

  .btn-submit {
    display: block;
    margin: 2rem auto 0;
    width: 7rem;
    border-radius: .4rem;
    background: linear-gradient(left, $color-blue-begin, $color-blue-end) no-repeat;
  }

  .black {
    color: $color-black;
  }

  .text {
    padding: .2rem;
    font-size: .24rem;
    color: $color-gray;
  }

  .check-code {
    display: inline-block;
    width: 2rem;
    line-height: .7rem;
    text-align: center;
    font-size: .28rem;
    color: $color-white;
    background: $color-red;
    border-radius: .38rem;
    margin-left: .2rem;
    &.disabled {
      background: $color-gray;
    }
  }
</style>
