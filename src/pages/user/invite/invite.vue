/**
* @author zhangwenlong
* @date 2018/5/7
* @Description:邀请好友
*/
<template>
  <div class="page-wp invite">
    <img src="./bg.png" width="100%"/>
    <div class="content">
      <h3>你的邀请码</h3>
      <h1 v-clipboard:copy="user.invite_code"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">{{user.invite_code}}</h1>
      <div class="text">
        <P>1、邀请好友注册，每位奖励10个智豆；&nbsp;&nbsp;&nbsp;</P>
        <P>2、邀请超过50名，额外奖励2000智豆；&nbsp;&nbsp;</P>
        <P>3、邀请超过100名，额外奖励5000智豆。</P>
      </div>
      <mt-button type="primary" @click="handleSubmit" size="large" class="btn-submit">立即邀请</mt-button>
    </div>
    <div class="list">
      <div class="title">我的邀请记录（{{inviteList.length}}）</div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
          <tr>
            <th>好友手机号</th>
            <th>获得时间</th>
            <th>智豆奖励</th>
          </tr>
          </thead>
          <tbody v-if="inviteList.length>0">
          <tr v-for="(item,index) in inviteList" :key="index">
            <td>{{item.mobile}}</td>
            <td>{{item.time}}</td>
            <td v-if="item.bean_amount>0">+{{item.bean_amount}}</td>
            <td v-else>{{item.bean_amount}}</td>
          </tr>
          </tbody>
          <tfoot v-else>
          <tr>
            <td></td>
            <td class="tac">暂无数据</td>
            <td></td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
    <div class="share-wrapper" v-show="isShare">
      <div class="mask"></div>
      <div class="share-icon" @click="isShare=false">
        <img src="../../../assets/icon-share.png" width="104" height="98"/>
        <p class="mt20" style="padding-right: 1rem;">点击右上角分享</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {weixinShare} from '@/common/weixin'

  export default {
    name: 'invite',
    data() {
      return {
        isShare: false,
        user: {}, // 用户个人信息
        inviteList: [],
        page: 1
      }
    },
    created() {
      this.weixinShareBg()
      this.getInviteList(this.page)
      this.API.userBaseInfo().then((res) => {
        if (res) {
          console.log(res)
          this.share(res)
          this.user = res
        }
      })
    },
    beforeRouteEnter(to, from, next) {
      if (to.query.from) {
        let url = 'http://www.zhiliaotv.com/invite'
        location.assign(url)
      } else if (isIOSWeChat() && to.path !== location.pathname) {
        // 此处不可使用location.replace
        location.assign(to.fullPath)
      } else {
        next()
      }

      function isIOSWeChat() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/(iPhone|iPod|iPad);?/i)) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      weixinShareBg() {
        let head = document.getElementsByTagName('head')[0]
        let div = document.createElement('div')
        let img = document.createElement('img')
        img.src = 'http://www.zhiliaotv.com/static/img/common/invite.jpg'
        div.style = 'margin:0 auto;width:0px;height:0px;overflow:hidden;'
        div.appendChild(img)
        head.appendChild(div)
      },
      onCopy() {
        this.$toast('已经复制到剪切板')
      },
      onError() {
        console.log('error')
      },
      share(user) {
        let vm = this
        setTimeout(() => {
          if (this.isWeixin()) {
            const url = 'http://www.zhiliaotv.com/invite'
            const registerUrl = 'http://www.zhiliaotv.com/register/?invite_code=' + user.invite_code // 注册的url
            const imgUrl = 'http://www.zhiliaotv.com/static/img/common/invite.jpg'
            this.API.wechatJSSDK(url).then((res) => {
              let content = {
                title: '知了TV',
                desc: '中本聪预测，智豆区块链数字资产价值将......',
                link: registerUrl,
                imgUrl: imgUrl,
                width: '300',
                height: '300'
              }
              weixinShare(res, content, function (res) {
                vm.$toast('分享成功')
                console.log(res)
              }, function (err) {
                console.log(err)
              })
            }).catch((err) => {
              console.log(err)
            })
          } else {
            this.$toast('请在微信客户端邀请分享~')
          }
        }, 20)
      },
      getInviteList(page) {
        this.API.inviteList({page: page}).then((res) => {
          if (res._items.length > 0) {
            console.log(res)
            this.inviteList = this.inviteList.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getInviteList(page)
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      isWeixin() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true;
        } else {
          return false;
        }
      },
      handleSubmit() {
        if (this.isWeixin()) {
          this.isShare = !this.isShare
          let vm = this
          const url = 'http://www.zhiliaotv.com/invite'
          const registerUrl = 'http://www.zhiliaotv.com/register/?invite_code=' + vm.user.invite_code // 注册的url
          const imgUrl = 'http://www.zhiliaotv.com/static/img/common/invite.jpg'
          this.API.wechatJSSDK(url).then((res) => {
            let content = {
              title: '知了TV',
              desc: '中本聪预测，智豆区块链数字资产价值将......',
              link: registerUrl,
              imgUrl: imgUrl
            }
            weixinShare(res, content, function (res) {
              vm.$toast('分享成功')
              console.log(res)
            }, function (err) {
              console.log(err)
            })
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.$toast('请在微信客户端邀请分享~')
        }

      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin.scss";

  .btn-submit {
    margin: .4rem auto 0 auto;
    width: 6rem;
    border-radius: .4rem;
    background: linear-gradient(left, #447cff, #1aa3ff) no-repeat;
  }

  .invite {
    .content {
      background-color: #ffffff;
      border-radius: 4px;
      position: relative;
      top: -.4rem;
      padding: .6rem 0;
      margin: 0 .2rem .4rem .2rem;
      text-align: center;
      box-sizing: border-box;
      & > h3 {
        font-size: .3rem;
      }
      & > h1 {
        font-size: .4rem;
        margin-bottom: .4rem;
      }
      .text {
        line-height: 1.7;
      }
    }
    .list {
      background-color: #ffffff;
      border-radius: 4px;
      margin: 0 .2rem .4rem .2rem;
      padding-bottom: .4rem;
      .title {
        text-align: center;
        position: relative;
        top: -.2rem;
        background: url("./icon-record.png") no-repeat center;
        background-size: contain;
        height: .7rem;
        line-height: .7rem;
        color: #ffffff;
      }
      .table-wrapper {
        overflow-y: scroll;
        height: 4rem;
      }
      .table {
        width: 100%;
        & > thead {
          height: .6rem;
          line-height: .6rem;
          & > tr > th {
            width: 33.33%;
            text-align: center;
            color: #009aff;
          }
        }
        & > tbody {
          height: .6rem;
          line-height: .6rem;
          & > tr > td {
            width: 33.33%;
            text-align: center;
          }
        }
      }
    }
  }
</style>
