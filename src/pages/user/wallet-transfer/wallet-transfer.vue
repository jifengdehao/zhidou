/**
* @author zhangwenlong
* @date 2018/4/10
* @Description: 提现
*/
<template>
  <div class="page-wp">
    <div class="total mt20" v-if="bank.length>0">
      <div class="hd" @click="showBankList=!showBankList">
        <img slot="icon" :src="currentBank|iconFilter" width="24" height="24">
        <div class="ml20"><p>{{currentBank.bank_name}}</p>
          <p class="gray">尾号{{currentBank.bank_account | sliceStr}}&nbsp;&nbsp;储蓄卡</p></div>
        <i class="mint-cell-allow-right"></i>
      </div>
      <div class="bink-list" v-if="showBankList">
        <mt-cell title="请添加银行卡" is-link @click.native="$router.push('/user/bindbank')">
          <img slot="icon" src="../../../assets/bind@2x.png" width="24" height="18">
        </mt-cell>
        <!--<div class="hd" v-for="(item,index) in bank" :key="index" :class="{active:currentIndex === index}"
             @click="selectBank(item,index)">
          <img slot="icon" :src="item|iconFilter" width="24" height="24">
          <div class="ml20">{{item.bank_name}}&nbsp;&nbsp;(尾号{{item.bank_account | sliceStr}}储蓄卡)</div>
        </div>-->
        <mt-cell-swipe v-for="(item,index) in bank" :key="index" @click.native="selectBank(item,index)" :right="[
              {
              content:'注销',
              style: { background: 'red', color: '#fff'},
              handler: () => deleteItem(item.id)
              }]">
          <img slot="icon" :src="item|iconFilter" width="24" height="24">
          <span slot="title" :class="{active:currentIndex === index}">{{item.bank_name}}&nbsp;&nbsp;(尾号{{item.bank_account | sliceStr}}储蓄卡)</span>
        </mt-cell-swipe>
      </div>
    </div>
    <mt-cell title="请添加银行卡" is-link class="mt20" @click.native="$router.push('/user/bindbank')" v-else>
      <img slot="icon" src="../../../assets/bind@2x.png" width="24" height="18">
    </mt-cell>
    <div class="card-wap mt20">
      <div class="td">提现金额</div>
      <div class="bd">
        ¥&nbsp;<input type="number" v-model.trim="params.amount" class="input-wp" placeholder="0.00"/>
      </div>
      <mt-field label="实名认证" placeholder="请输入身份证姓名" v-model.trim="params.name"></mt-field>
      <mt-field type="number" label="验证码" placeholder="请输入验证码" v-model="params.sms_code">
        <span class="check-code" :class="{'disabled': countdown}" @click="sendCheckCode">
         {{ countdown ? countdown + 's' : '获取验证码' }}
       </span>
      </mt-field>
      <div class="fd">
        <span>可用余额&nbsp;{{parseInt(cash.amount)}}元</span>
        <span class="blue" @click="params.amount= parseInt(cash.amount)">全部提现</span>
      </div>
    </div>

    <div class="text">提现手续费¥&nbsp;{{shouxufei}}</div>
    <mt-button type="primary" size="large" class="mt30 btn-submit" @click="tiXian">确定</mt-button>
    <div class="text mt30">现金提现，需1-3个工作日到账。</div>
    <!--
    <div class="total mt20">
      <div class="hd">
        <span>当前可提现金额</span>
      </div>
      <div class="bd">
        <p>
          <strong>{{parseInt(cash.amount)}}</strong>元
        </p>
      </div>
    </div>
    <div class="mt20 mint-input-tar">
      <mt-field label="提现金额" placeholder="请输入" v-model.trim="amount"></mt-field>
      <mt-field label="收款方姓名" placeholder="请输入姓名" v-model.trim="name"></mt-field>
    </div>
    <div class="text">
      <p>注意：请输入微信绑定的银行卡持卡人姓名</p>
      <p class="mt20">1、每笔提现金额至少1元，每日提现上线为2万</p>
      <p>2、为保证您的资金安全，提现需要申请实名认证</p>
      <p>3、提现到账后，将直接转入微信钱包</p>
      <p>4、每笔收入，微信已收取0.6%的手续费</p>
    </div>
    -->
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        cash: {}, // 用户余额
        bank: [], // 银行卡列表
        params: {
          id: '', // 用户银行账户ID
          amount: '',// 提现金额
          sms_code: '', // 验证码
          name: ''
        },
        currentBank: {}, // 当前银行卡
        currentIndex: 0,
        showBankList: false,
        transfer: {}, // 提现额度
        countdown: 0 // 验证码时间
      };
    },
    created() {
      this.getUserCash()
      this.getUserBankList()
    },
    computed: {
      // 提现手续费
      shouxufei() {
        if (this.params.amount * 0.001 >= 1 && this.params.amount * 0.001 <= 25) {
          return this.params.amount * 0.001;
        }
        else if (this.params.amount * 0.001 < 1) {
          return 1
        }
        else if (this.params.amount * 0.001 > 25) {
          return 25
        }
      }
    },
    filters: {
      sliceStr: function (value) {
        if (!value) return
        return value.substring(value.length - 4, value.length)
      },
      iconFilter: function (value) {
        if (!value) return
        let iconArry = [
          {id: 1001, icon: 'zhaoshang@2x.png'},
          {id: 1002, icon: 'gongshang@2x.png'},
          {id: 1003, icon: 'jianshe@2x.png'},
          {id: 1004, icon: 'pufa@2x_12.png'},
          {id: 1005, icon: 'nongye.png'},
          {id: 1006, icon: 'mingsheng@2x_92.png'},
          {id: 1009, icon: 'xiangye@2x.png'},
          {id: 1010, icon: 'pingan1@2x.png'},
          {id: 1020, icon: 'jiaotong@2x.png'},
          {id: 1021, icon: 'zhongxin@2x.png'},
          {id: 1022, icon: 'guangda@2x.png'},
          {id: 1025, icon: 'huaxia@2x_54.png'},
          {id: 1026, icon: 'zhongguo@2x.png'},
          {id: 1027, icon: 'guangfa@2x.png'},
          {id: 1032, icon: 'beijing@2x.png'},
          {id: 1056, icon: 'ningbo@2x_48.png'},
          {id: 1066, icon: 'youzhen@2x.png'}
        ]
        let bank_code = value.bank_code
        let icon = ''
        iconArry.forEach((item) => {
          if (item.id == bank_code) {
            icon = item.icon
          }
        })
        return require('../../../assets/' + icon)
      }
    },
    methods: {
      // 提现验证码
      sendCheckCode() {
        let vm = this
        this.API.carryVerifyMobile().then((res) => {
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
      // 注销绑定的银行卡
      deleteItem(id) {
        this.API.userBankDelete(id).then((res) => {
          console.log(res);
          this.getUserBankList()
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取用户可用余额
      getUserCash() {
        this.API.userBalance().then((res) => {
          console.log(res)
          this.cash = res.cash
          this.transfer = res.transfer.asset
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取银行卡列表
      getUserBankList() {
        this.API.userBankList().then((res) => {
          console.log(res)
          if (res.length > 0) {
            this.bank = res
            this.currentBank = res[0]
            this.params.id = res[0].id
          }

        }).catch((err) => {
          console.log(err)
        })
      },
      // 提现
      tiXian() {
        let params = this.params
        let message = ''
        if (!params.id) {
          message = '请添加银行卡'
        } else if (!params.amount) {
          message = '请输入提现金额'
        } else if (params.amount < parseInt(this.transfer.min)) {
          message = '提现最小额度是' + this.transfer.min + '元'
        } else if (params.amount > parseInt(this.transfer.max)) {
          message = '提现最大额度是' + this.transfer.max + '元'
        } else if (!this.cash.amount > 0) {
          message = '你没有可用余额提现'
        } else if (!params.name) {
          message = '请输入认证身份姓名'
        } else if (!params.sms_code) {
          message = '请输入验证码'
        }
        if (message) {
          this.$toast(message);
          return;
        }
        this.API.withdrawals(params).then((res) => {
          if (res) {
            console.log(res)
            this.$toast('提现申请成功,1-3个工作日内到账')
            let vm = this
            setTimeout(() => {
              vm.$router.back()
            }, 3000)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      selectBank(item, index) {
        this.currentIndex = index
        this.currentBank = item
        this.showBankList = false
        this.params.id = item.id
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

  .card-wap {
    background: $color-white;
    border: .01rem solid $color-border;
    border-width: .01rem 0;
    padding: 0 .2rem;
    .td, .fd, .bd {
      line-height: .8rem;
    }
    .bd {
      display: flex;
      .input-wp {
        flex: 1;
        border: none;
        padding-left: .2rem;
        box-sizing: border-box;
        line-height: .8rem;
        height: .8rem;
        font-size: .28rem;
      }
    }
    .fd {
      border-top: 0.5px solid $color-border;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .total {
    border: .01rem solid $color-border;
    border-width: .01rem 0;
    position: relative;
    .bink-list {
      position: absolute;
      left: 0;
      right: 0;
      top: 1.3rem;
      background: $color-white;
      margin: 0 .2rem;
      box-shadow: 0 5px 10px $color-border;
      z-index: 999;
    }
    .hd {
      background: $color-white;
      display: flex;
      align-items: center;
      padding: .3rem .2rem .3rem .2rem;
      position: relative;
    }
    .active {
      color: $color-blue;
    }
    .bd {
      padding: .2rem .2rem .4rem;
      color: $color-black;
      p {
        line-height: 1;
      }
      strong {
        margin-right: .2rem;
        font-size: .52rem;
        vertical-align: baseline;
      }
    }
  }

  .text {
    padding: .2rem;
    color: $color-gray;
  }

  .check-code {
    display: inline-block;
    width: 2rem;
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
</style>
