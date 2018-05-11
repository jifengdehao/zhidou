<template>
  <div class="wrap">
    <div class="total">
      <div class="hd">
        <span>现金历史总收益</span>
        <!--<router-link class="link" to="/user/wallet-detail">收益记录 &gt;</router-link>-->
      </div>
      <div class="bd">
        <p>
          <strong>{{cash.profit}}</strong>元
        </p>
      </div>
      <div class="ft">
        <p>总收益 = 待结算金额 + 可提现金额 + 已提现金额</p>
      </div>
    </div>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" style="width: 70%;border-radius: 4px;">
      <div class="text">
        <h2 class="blank">
          <span>
            待结算金额<span class="red">（审核中）</span>
          </span>
          <span class="blue">{{cash.inactive}}元</span>
        </h2>
        <!--<p>待结算金额<span class="red">（审核中）</span></p>-->
        <p class="mt10">1、为了保障用户的权益，（授课现金支付）单次课程未开播产生的入场票收益待结算，已开播的课程购买3天后会自动计入可提现金额</p>
        <p class="mt10">2、系列课程现金支付所得会在所有的课程都结束之后3天自动计入可提现金额</p>
      </div>
    </mt-popup>
    <div class="detail">
      <div class="cell">
        <p>{{cash.inactive}}</p>
        <p class="text">待结算金额</p>
        <div class="last">
          <span @click="popupVisible=true">说明&nbsp;&gt</span>
        </div>
      </div>
      <div class="cell">
        <p>{{cash.amount}}</p>
        <p class="text">可提现金额</p>
        <div class="last">
          <mt-button class="btn" type="primary"
                     @click.native="$router.push('/user/wallet-transfer')">提现
          </mt-button>
        </div>
      </div>
      <div class="cell">
        <p>{{cash.transfer}}</p>
        <p class="text">已提现金额</p>
        <!--<div class="last">
          <router-link class="link" to="/user/help">提现手续费&nbsp;&gt;</router-link>
        </div>-->
      </div>
    </div>
    <h2 class="detail-hd">现金交易记录</h2>
    <table class="detail-bd" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>现金</th>
        <th>时间</th>
        <th>备注</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in cashList" :key="index">
        <td class="green" v-if="item.price>0">+{{item.price}}</td>
        <td class="red" v-else>{{item.price}}</td>
        <td class="gray">{{item.time | formatDate}}</td>
        <td>{{item.desc}}</td>
      </tr>
      </tbody>
    </table>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        cash: {}, // 用户现金
        cashList: [],
        page: 1,
        popupVisible: false
      };
    },
    created() {
      this.getUserCash()
      this.getUserCashDetails(this.page)
    },
    methods: {
      getUserCash() {
        this.API.userBalance().then((res) => {
          console.log(res)
          this.cash = res.cash
        }).catch((err) => {
          console.log(err)
        })
      },
      getUserCashDetails(page) {
        this.API.userCashDetail(page).then((res) => {
          console.log(res)
          this.cashList = this.cashList.concat(res._items)
          if (res._meta.pageCount > page) {
            page++
            this.getUserCashDetails(page)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin.scss";

  .total {
    background: $color-blue;
    color: $color-white;
    .hd {
      display: flex;
      justify-content: space-between;
      padding: .24rem .2rem;
      .link {
        color: $color-white;
      }
    }
    .bd {
      margin-top: .1rem;
      padding: .3rem .2rem;
      p {
        line-height: 1;
      }
      strong {
        margin-right: .2rem;
        font-size: .52rem;
        vertical-align: baseline;
      }
    }
    .ft {
      padding: .2rem .2rem;
      background: #008fed;
      color: #9ec9f4;
      font-size: .24rem;
    }
  }

  .detail {
    display: flex;
    padding: .4rem .3rem .5rem;
    background: $color-white;
    border-bottom: .01rem solid $color-border;
    .cell {
      flex: 1;
      text-align: center;
      p {
        font-size: .36rem;
      }
      p.text {
        font-size: .24rem;
        color: $color-gray;
      }
      .link {
        color: #808080;
      }
      .last {
        margin-top: .15rem;
        line-height: .75rem;
      }
      .btn {
        display: block;
        margin: 0 auto;
        width: 2rem;
        height: .76rem;
        border-radius: .4rem;
        background: linear-gradient(left, $color-red-begin, $color-red-end) no-repeat;
      }
    }
  }

  .text {
    padding: .2rem;
    font-size: .24rem;
    color: $color-gray;
    line-height: 1.6;
    .blank{
      color: #333333;
      font-size: .28rem;
      display: flex;
      justify-content: space-between;
    }
  }

  .detail-hd {
    padding: .2rem;
    background: $color-white;
    font-size: .32rem;
  }

  .detail-bd {
    width: 100%;
    line-height: .9rem;
    background: $color-white;
    color: #808080;
    text-align: center;
    .red {
      color: $color-red;
    }
    .green {
      color: $color-green;
    }
    .gray {
      color: $color-gray;
    }
    td, th {
      padding-left: .4rem;
    }
    th {
      background: #eff6f9;
      text-align: center;
    }
    td {
      text-align: center;
      border-bottom: .01rem solid $color-border;
    }
  }
</style>
