/**
* @author zhangwenlong
* @date 2018/5/7
* @Description: 邀请注册成功
*/
<template>
  <div class="page-wp invite-success">
    <div class="title">
      <img src="./icon-notice.png" width="42" height="44"/>
      <h1>你已成功领取<span class="num">100</span>个智豆</h1>
    </div>
    <div class="content">
      <h2>关注公众号<span class="blue">查看资产</span></h2>
      <img src="./icon-qrcode.jpg" width="160"/>
      <p class="mt20">长按二维码&nbsp;关注公众号</p>
      <p>或</p>
      <p>公众号：知了TV</p>
      <button type="button" class="btn mt30"
              v-clipboard:copy="copyContent"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">复制公众号
      </button>
      <router-link tag="div" class="link-home" to="/"></router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "invite-success",
    data() {
      return {
        bean: this.$route.query.bean,
        copyContent: '知了TV'
      }
    },
    created() {
      console.log(this.bean)
    },
    methods: {
      onCopy(e) {
        this.$toast('已经复制到剪切板')
        console.log('你刚刚复制: ' + e.text)
      },
      onError() {
        console.log('error')
      }
    }
  }
</script>

<style scoped lang="scss">
  .invite-success {
    background-color: #1797fa;
    .title {
      height: 2rem;
      padding: .6rem .7rem .4rem .7rem;
      font-size: 0;
      h1 {
        vertical-align: middle;
        padding-left: .4rem;
        display: inline-block;
        font-size: .36rem;
        color: #fff;
        .num {
          font-size: .5rem;
          color: #fded48;
        }
      }
    }
    .content {
      background-color: #ffffff;
      border-radius: 4px;
      margin: .2rem;
      text-align: center;
      height: 80%;
      h2 {
        padding-top: .6rem;
        margin-bottom: .3rem;
      }
      p {
        line-height: 2;
      }
      .blue {
        color: #1797fa;
      }
      .btn {
        background-color: #1772FA;
        color: #ffffff;
        border: none;
        width: 2.5rem;
        height: .6rem;
        line-height: .6rem;
        border-radius: 4px;
        box-shadow: 0 1px 2px #A6C1E9;
      }
    }
  }
</style>
