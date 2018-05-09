/**
* @author zhangwenlong
* @date 2018/3/30
* @Description: 智豆
*/
<template>
  <div class="page-wp">
    <div class="total">
      <div class="hd">
        <span>智豆总数</span>
        <!--<router-link class="link" to="/user/token-detail">收益记录 &gt;</router-link>-->
      </div>
      <div class="bd">
        <p>
          <strong>{{userBean.total}}</strong>智豆
        </p>
      </div>
      <div class="ft">
        <p>总智豆 = 待结算智豆 + 可使用智豆</p>
      </div>
    </div>

    <div class="detail">
      <div class="cell">
        <p>{{userBean.inactive}}</p>
        <p class="text">待结算智豆</p>
        <div class="last">
          <span @click="popupVisible=true">说明 &gt;</span>
        </div>
      </div>
      <div class="cell">
        <p>{{userBean.amount}}</p>
        <p class="text">可使用智豆</p>
        <div class="last">
          <mt-button class="btn" type="primary"
                     @click.native="$router.push('/user/token-transfer')">转出
          </mt-button>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" style="width: 70%;border-radius: 4px;">
      <div class="text">
        <h2 class="blank">
          <span>
            待结算智豆<span class="red">（审核中）</span>
          </span>
          <span class="blue">{{userBean.inactive}}智豆</span>
        </h2>
        <p class="mt10">1、为了保障用户的权益，（授课智豆支付）单次课程未开播产生的入场票收益待结算，已开播的课程购买3天后会自动计入可使用智豆</p>
        <p class="mt10">2、系列课程智豆支付所得会在所有的课程都结束之后3天自动计入可使用智豆</p>
      </div>
    </mt-popup>
    <div class="text">
      <p>智豆获取方式：</p>
      <p class="mt10">1.学习课程赚取</p>
      <p>2.邀请朋友学习，你会有一定比例的智豆返佣</p>
      <p>3.做主播，通过授课可以获得学生上您课程时所赚取的智豆的返佣</p>
      <p>4.做主播，让学生用智豆支付</p>
      <p>5.智豆可通过转账进入其他用户账户，完成交易</p>
    </div>
    <h2 class="detail-hd">智豆交易记录</h2>
    <table class="detail-bd" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>智豆</th>
        <th>时间</th>
        <th>备注</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in bean" :key="index">
        <td class="green" v-if="item.price>0">+{{item.price}}</td>
        <td class="red" v-else>{{item.price}}</td>
        <td class="gray">{{item.time | formatDate}}</td>
        <td>{{item.desc}}</td>
      </tr>
      <!--<tr>
        <td>转出</td>
        <td class="gray">2018-01-01 12:15</td>
        <td class="red"> -100</td>
      </tr>
      <tr>
        <td>邀请同学返佣</td>
        <td class="gray">2018-01-01 12:15</td>
        <td class="green">+100</td>
      </tr>-->
      </tbody>
    </table>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import Scroll from '@/components/scroll/scroll'

  export default {
    components: {
      Scroll
    },
    data() {
      return {
        bean: [], // 智斗交易列表
        page: 1,  // 默认第一页
        userBean: {}, // 用户智豆
        popupVisible: false
      };
    },
    created() {
      this.getUserZhiDou(this.page)
      this.getUserBaseBalance()
    },
    methods: {
      getUserZhiDou(page) {
        this.API.userBeanDetail(page).then((res) => {
          if (res && res._items) {
            this.bean = this.bean.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getUserZhiDou(page)
            }
          }
          console.log(res)
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
    .blank {
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
