/**
* @author zhangwenlong
* @date 2018/4/17
* @Description: 课程详情
*/

<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <!--轮播图-->
      <div class="swipe-wp" style="height: 4.7rem;">
        <slider v-if="swiper.length>0">
          <div v-for="(item,index) in swiper" :key="index">
            <a href="javascript:;">
              <img :src="item || $root.placeHolder.banner" style="height: 4.7rem;"/>
            </a>
          </div>
        </slider>
        <div class="sale-share" v-if="course.is_share == 1" @click="share">
          <div>
            <div class="icon-content" v-if="course.pay_type == 1">赚{{course.gain_price}}元</div>
            <div class="icon-content" v-if="course.pay_type == 2">赚{{course.gain_price}}个豆</div>
          </div>
        </div>
        <div class="sale-share" v-else @click="share">
          <i class="icon-share"></i>
        </div>
      </div>
      <!--课程详情-->
      <div class="detail-info">
        <h2 class="tit fs15" v-html="formatTitle(course.title)">{{course.title}}</h2>
        <div class="info mt10 fs12 gray">
          <p>时间<span class="ml10">{{course.times | formatDate }}</span></p>
          <span>{{course.study_count}}次学习</span>
        </div>
      </div>
      <!--报名人数-->
      <!--<div class="detail-student">
        <p class="hd fs12 gray">报名人数<span class="ml20">{{students.total}}人</span></p>
        <div class="bd">
          <img class="avatar" :src="item.img || $root.placeHolder.avatar" v-for="(item,index) in students.user"
               :key="index" width="100%">
        </div>
        <div class="ft ml10"><i></i></div>
      </div>-->
      <!--作者-->
      <mt-cell class="cell-card mt20" :title="teacher.space_name" :to="'/course/author/' +teacher.id">
        <img slot="icon" class="avatar" :src="teacher.avatar || $root.placeHolder.avatar">
        <a class="btn-follow" href="javascript:void(0)" v-if="user.is_followed == 0"
           @click.stop="follewClass(teacher.id)">关注</a>
        <a class="btn-follower" href="javascript:void(0)" v-else @click.stop="follewClass(teacher.id)">已关注</a>
      </mt-cell>
      <ul class="nav-tab nav-tab-2 mt20">
        <li :class="{active: tab == 'intro'}" @click.stop="selectTab('intro')">
          <a href="javascript:;">课程简介</a>
        </li>
        <li :class="{active: tab == 'list'}" @click.stop="selectTab('list')" v-if="type===1">
          <a href="javascript:;">课程目录</a>
        </li>
        <!--<li :class="{active: tab == 'comment'}" @click="tab = 'comment'">
          <a href="#">用户评价</a>
        </li>-->
      </ul>
      <!--课程简介-->
      <div class="detail-intro" v-show="tab == 'intro'">
        <div v-if="intro.length>0">
          <div class="hd">主讲人: {{ course.author }}</div>
          <div class="bd">
            <template v-for="item in intro">
              <img v-lazy="item.url" v-if="item.url"/>
              <p v-if="item.dec" v-html="formatSolution(item.dec)"></p>
            </template>
          </div>
        </div>
        <div class="empty" v-else>暂无课程简介</div>
        <div class="explain" v-if="course.pay_type===1 || course.pay_type===2">
          <h3>购买须知</h3>
          <p class="mt10">1. 该课程为付费系列课程（付费单课课程），按课程计划定期更新，每节课程可在开课时学习，也可反复回听 ；</p>
          <p>2. 购买课程后关注我们的服务号，可在菜单里进入听课；</p>
          <p>3. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅 。</p>
        </div>
      </div>
      <!--课程目录-->
      <div class="list-wp" v-show="tab == 'list'"
           v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
        <div v-if="periodList.length > 0">
          <course-item :item="item" v-for="(item,index) in periodList" :key="index" type="classroomPeriod"
                       @click.native="goToTeach(item)"/>
        </div>
        <div v-else class="tac" style="padding: .5rem;">暂无课程</div>
      </div>
      <!--用户评价-->
      <!--<div class="detail-comment" v-else>
        <ul v-if="comment.length>0">
          <li class="comment-item" v-for="(item,index) in comment" :key="index" v-if="item.type === 0">
            <div class="hd fs12">
              <img class="avatar mr20" :src="item.avatar || $root.placeHolder.avatar">
              <p>{{item.name}}</p>
              <span class="gray">{{item.times | formatDate }}</span>
            </div>
            <div class="bd mt20">
              <p>{{item.con}}</p>
            </div>
          </li>
        </ul>
        <div class="empty" v-else>暂无用户评论</div>
      </div>-->
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
    <!--课程状态 报名-支付-进入-->
    <div class="scroll-ft">
      <mt-button v-if="user.is_enrolled === 0 && course.pay_type===1" type="danger" @click.stop="handleOrder">
        购买课程（¥{{course.price}}）
      </mt-button>
      <mt-button v-if="user.is_enrolled === 0 && course.pay_type===2" type="danger" @click.stop="handleOrder">
        购买课程（{{course.price}}个豆）
      </mt-button>
      <template v-if="user.is_enrolled === 0 &&  course.pay_type===3">
        <div class="input-wp">
          <input type="password" placeholder="输入密码进入直播间" v-model.trim="teachPwd"/>
        </div>
        <mt-button type="primary" @click="handleOrder">进入直播间</mt-button>
      </template>
      <mt-button v-if="user.is_enrolled === 1" type="danger" @click="handleOrder">点击进入</mt-button>
      <mt-button v-if="user.is_enrolled === 0 && course.pay_type === 0" type="danger" @click="handleOrder">报名进入
      </mt-button>
    </div>
    <!--智豆支付弹窗-->
    <div class="detail-order" v-if="orderVisible">
      <div class="order-wp">
        <div class="order-hd fs15 tac">
          <h3>支付详情</h3>
          <span class="btn-close-x" @click.stop="orderVisible = false"></span>
        </div>
        <div class="order-bd">
          <div class="price">
            <span>课程价格</span>
            <strong class="red">{{course.price}}个豆</strong>
          </div>
          <p class="mt10 gray-dark">备注：您的账户还有{{userBean}}个豆</p>
        </div>
        <div class="order-ft">
          <mt-button class="btn-payment" type="danger" v-if="isPay"
                     @click.stop="payOrder">支付
          </mt-button>
          <span class="btn-disabled fs15 tac" v-else>余额不足</span>
        </div>
      </div>
    </div>
    <!-- <div class="share" @click="share">分享课程</div>-->
    <div class="share-wrapper" v-show="isShare">
      <div class="mask"></div>
      <div class="share-icon" @click="isShare=false">
        <img src="../../../assets/icon-share.png" width="104" height="98"/>
        <p>点击右上角分享</p>
      </div>
    </div>
  </div>
</template>
<script>
  import {weixinPay} from '@/common/otherWeixin'
  import Slider from '@/components/slider/slider'
  import {weixinShare} from '@/common/weixin'
  import Scroll from '@/components/scroll/scroll'
  import Cookie from 'js-cookie'

  export default {
    components: {
      Slider,
      Scroll
    },
    data() {
      return {
        id: this.$route.params.id,
        swiper: [],
        course: {},
        students: {},
        user: {},
        intro: [],
        teacher: {},
        type: 0,// 课程类型 1系列课程 0单次课程
        tab: 'intro',
        comment: [],
        page: 1,
        periodList: [],
        teachPwd: '',
        orderVisible: false,
        userBean: {}, // 用户智豆
        loading: false,
        isShare: false,
        shareCode: ''// 分享码
      }
    },
    created() {
      this.getClassDetails(this.id)
      if (this.$route.query.invite_code) {
        this.shareCode = this.$route.query.invite_code
        sessionStorage.setItem('share-code', this.shareCode)
        sessionStorage.setItem('share-id', this.id)
      } else {
        if (sessionStorage.getItem('share-id') == this.id) {
          this.shareCode = sessionStorage.getItem('share-code')
        } else {
          this.shareCode = ''
        }
      }
    },
    computed: {
      isPay() {
        return Number(this.userBean) >= this.course.price ? true : false
      }
    },
    beforeRouteEnter(to, from, next) {
      // XXX: 修复iOS版微信HTML5 History兼容性问题
      console.log(isIOSWeChat())
      if (isIOSWeChat() && to.path !== location.pathname) {
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
      // 验证是否登录
      isLoign() {
        let isLogin
        if (/www\.zhiliaotv\.com/.test(location.host) || /test\.zhiliaotv\.com/.test(location.host)) {
          isLogin = Cookie.get('__zlt_js__')
        } else {
          isLogin = Cookie.get('__zdb_dev_js__')
        }
        if (isLogin) {
          return true
        } else {
          return false
        }
      },
      // 获取个人信息
      getUserInfo(cb) {
        this.API.userBaseInfo().then((res) => {
          if (res) {
            console.log(res)
            cb && cb(res)
          }
        })
      },
      // 初始分享
      initShare() {
        if (this.isWeixin()) {
          if (this.isLoign() && this.course.is_share == 1) {
            let vm = this
            this.getUserInfo(function (res) {
              let invite_code = res.invite_code
              const url = 'http://www.zhiliaotv.com/course/detail/' + vm.id
              vm.API.wechatJSSDK(url).then((res) => {
                let data = {
                  appId: res.appId,
                  timestamp: res.timestamp,
                  nonceStr: res.nonceStr,
                  signature: res.signature
                }
                let content = {
                  title: '知了TV',
                  desc: vm.course.title,
                  link: url + '?invite_code=' + invite_code,
                  imgUrl: vm.course.img[0] || vm.$root.placeHolder.cover
                }
                weixinShare(data, content, function (res) {
                  console.log(res)
                  vm.$toast('分享成功~')
                })
              }).catch((err) => {
                console.log(err)
              })
            })
          } else {
            let vm = this
            const url = 'http://www.zhiliaotv.com/course/detail/' + vm.id
            vm.API.wechatJSSDK(url).then((res) => {
              let data = {
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature
              }
              let content = {
                title: '知了TV',
                desc: vm.course.title,
                link: url,
                imgUrl: vm.course.img[0] || vm.$root.placeHolder.cover
              }
              weixinShare(data, content, function (res) {
                console.log(res)
                vm.$toast('分享成功~')
              })
            }).catch((err) => {
              console.log(err)
            })
          }
        }
      },
      isWeixin() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true;
        } else {
          return false;
        }
      },
      share() {
        if (this.isWeixin()) {
          this.isShare = !this.isShare
          if (this.isLoign() && this.course.is_share == 1) {
            let vm = this
            this.getUserInfo(function (res) {
              let invite_code = res.invite_code
              const url = 'http://www.zhiliaotv.com/course/detail/' + vm.id
              vm.API.wechatJSSDK(url).then((res) => {
                let data = {
                  appId: res.appId,
                  timestamp: res.timestamp,
                  nonceStr: res.nonceStr,
                  signature: res.signature
                }
                let content = {
                  title: '知了TV',
                  desc: vm.course.title,
                  link: url + '?invite_code=' + invite_code,
                  imgUrl: vm.course.img[0] || vm.$root.placeHolder.cover
                }
                weixinShare(data, content, function (res) {
                  console.log(res)
                  vm.$toast('分享成功~')
                })
              }).catch((err) => {
                console.log(err)
              })
            })
          } else {
            let vm = this
            const url = 'http://www.zhiliaotv.com/course/detail/' + vm.id
            vm.API.wechatJSSDK(url).then((res) => {
              let data = {
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature
              }
              let content = {
                title: '知了TV',
                desc: vm.course.title,
                link: url,
                imgUrl: vm.course.img[0] || vm.$root.placeHolder.cover
              }
              weixinShare(data, content, function (res) {
                console.log(res)
                vm.$toast('分享成功~')
              })
            }).catch((err) => {
              console.log(err)
            })
          }
        } else {
          this.$toast('请在微信客户端分享~')
        }
      },
      formatTitle(s) {
        if (s) {
          return s.replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      formatSolution(s) {
        if (s) {
          return s.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      selectTab(tab) {
        this.tab = tab
      },
      // 加载课程目录
      loadMore() {
        this.loading = true
        this.API.coursePeriodList(this.id, this.page).then((res) => {
          if (res && res._items.length > 0) {
            this.periodList = this.periodList.concat(res._items)
            if (res._meta.pageCount > this.page) {
              this.page++
              this.loading = false
            }
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      goToTeach(item) {
        if (this.user.is_enrolled === 1) {
          return this.$router.push('/course/teach/' + item.id)
        }
      },
      handleOrder() {
        if (this.user.is_enrolled === 1) {
          if (this.isLoign()) {
            // 点击进入
            if (this.type === 0) {
              return this.$router.push('/course/teach/' + this.course.period_id)
            }
            if (this.type === 1) {
              if (this.periodList.length > 0) {
                return this.$router.push('/course/teach/' + this.periodList[0].id)
              } else {
                this.$toast('当前课程还没开课，请等待~')
              }
            }
          } else {
            setTimeout(() => {
              this.$router.push('/oauth?goto=' + location.href)
            }, 20)
          }
        } else if (this.user.is_enrolled === 0 && this.course.pay_type === 3) {
          if (this.isLoign()) {
            // 输入密码
            if (this.teachPwd) {
              this.API.freeEnroll({id: this.id, pwd: this.teachPwd}).then((res) => {
                if (res) {
                  setTimeout(() => {
                    if (this.type === 0) {
                      return this.$router.push('/course/teach/' + this.course.period_id)
                    }
                    if (this.type === 1) {
                      if (this.periodList.length > 0) {
                        return this.$router.push('/course/teach/' + this.periodList[0].id)
                      } else {
                        this.$toast('当前课程还没开课，请等待~')
                      }
                    }
                  }, 1000)
                }
              }).catch((err) => {
                console.log(err)
              })
            } else {
              this.$toast('请输入密码')
            }
          } else {
            setTimeout(() => {
              this.$router.push('/oauth?goto=' + location.href)
            }, 20)
          }
        } else if (this.user.is_enrolled === 0 && this.course.pay_type === 2) {
          // 智豆支付
          this.orderVisible = true
          if (this.isLoign()) {
            this.getUserBaseBalance()
          } else {
            setTimeout(() => {
              this.$router.push('/oauth?goto=' + location.href)
            }, 20)
          }
        } else if (this.user.is_enrolled === 0 && this.course.pay_type === 1) {
          if (this.isLoign()) {
            // 现金支付
            this.API.orderPay({course_id: this.id, pay_type: 2, invite_code: this.shareCode}).then((res) => {
              let data = res.jsApiParams
              let vm = this
              weixinPay(data, function (res) {
                if (res) {
                  if (vm.type === 0) {
                    return vm.$router.push('/course/teach/' + vm.course.period_id)
                  }
                  if (vm.type === 1) {
                    if (vm.periodList.length > 0) {
                      return vm.$router.push('/course/teach/' + vm.periodList[0].id)
                    } else {
                      vm.$toast('当前课程还没开课，请等待~')
                    }
                  }
                }
              })
            }).catch((err) => {
              console.log(err)
            })
          } else {
            setTimeout(() => {
              this.$router.push('/oauth?goto=' + location.href)
            }, 20)
          }

        } else if (this.user.is_enrolled === 0 && this.course.pay_type === 0) {
          if (this.isLoign()) {
            //报名进入
            this.API.freeEnroll({id: this.id}).then((res) => {
              if (res) {
                this.$toast('报名成功')
                setTimeout(() => {
                  if (this.type === 0) {
                    return this.$router.push('/course/teach/' + this.course.period_id)
                  }
                  if (this.type === 1) {
                    if (this.periodList.length > 0) {
                      return this.$router.push('/course/teach/' + this.periodList[0].id)
                    } else {
                      this.$toast('当前课程还没开课，请等待~')
                    }
                  }
                }, 3000)
              }
            }).catch((err) => {
              console.log(err)
            })
          } else {
            setTimeout(() => {
              this.$router.push('/oauth?goto=' + location.href)
            }, 20)
          }
        }
      },
      // 课程详情
      getClassDetails(id) {
        this.API.courseShowCourse(id).then((res) => {
          console.log(res)
          this.swiper = res.course.img
          this.course = res.course
          this.students = res.students
          this.teacher = res.teacher
          this.user = res.user
          this.intro = res.course.note
          this.type = res.course.type
          this.initShare()
        }).catch((err) => {
          console.log(err)
        });
      },
      // 关注课程老师
      follewClass(id) {
        this.API.spaceIsFollow({id: id}).then((res) => {
          if (res.is_follow == 1) {
            this.user.is_followed = res.is_follow
          } else {
            this.user.is_followed = res.is_follow
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取用户智豆
      getUserBaseBalance() {
        this.API.userBalance().then((res) => {
          console.log(res)
          this.userBean = res.bean.amount
        }).catch((err) => {
          console.log(err)
        })
      },
      // 智豆支付
      payOrder() {
        this.API.orderPay({course_id: this.id, pay_type: 1, invite_code: this.shareCode}).then((res) => {
          if (res) {
            this.$toast('支付成功')
            setTimeout(() => {
              if (this.type === 0) {
                return this.$router.push('/course/teach/' + this.course.period_id)
              }
              if (this.type === 1) {
                if (this.periodList.length > 0) {
                  return this.$router.push('/course/teach/' + this.periodList[0].id)
                } else {
                  this.$toast('当前课程还没开课，请等待~')
                }
              }
            }, 3000)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../styles/mixin.scss";

  .sale-share {
    position: fixed;
    top: .2rem;
    right: 0;
    z-index: 50;
    .icon-share {
      display: inline-block;
      width: .44rem;
      height: .38rem;
      background: url("./icon-share-01.png") no-repeat center;
      background-size: contain;
      margin: 0 .2rem 0 auto;
    }
    .icon-content {
      background: #f47a6d url("./icon-share-03.png") no-repeat 15% center;
      background-size: 14px 12px;
      color: #ffffff;
      font-size: .28rem;
      padding: .08rem .1rem .08rem .6rem;
      border-bottom-left-radius: 50px;
      border-top-left-radius: 50px;
      line-height: normal;
    }
  }

  .slide-wrapper {
    position: relative;
    width: 100%;
    padding-top: 40%;
    overflow: hidden;
    .slide-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .detail-info, .detail-student, .detail-intro, .detail-comment, .list-wp {
    background-color: $color-white;
  }

  .detail-order {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .3);
    }
    .btn-close-x {
      position: absolute;
      top: .3rem;
      right: .34rem;
    }
    .order-wp {
      position: fixed;
      bottom: 0;
      left: 50%;
      z-index: 1001;
      margin-left: -3.75rem;
      width: 7.5rem;
      background-color: $color-white;
    }
    .order-hd {
      position: relative;
      padding: .24rem;
      border-bottom: .01rem solid $color-border;
    }
    .order-bd {
      padding: .24rem .3rem;
      .price {
        display: flex;
        justify-content: space-between;
      }
    }
    .order-ft {
      .btn-payment, .btn-disabled {
        flex: 1;
        width: 100%;
        height: .9rem;
        border-radius: 0;
      }
      .btn-disabled {
        display: block;
        background: #b3b3b3;
        color: $color-white;
        line-height: .9rem;
      }
    }
  }

  .detail-comment {
    .comment-item {
      padding: .2rem .3rem .3rem .2rem;
      border-bottom: .01rem solid $color-border;
      .hd {
        background: $color-white;
        display: flex;
        align-items: center;
      }
      p {
        flex: 1;
        max-height: 4.5em;
        overflow: hidden;
      }
    }
    .empty {
      text-align: center;
      padding: .5rem;
    }
  }

  .detail-info {
    padding: .2rem;
    border-bottom: .01rem solid $color-border;
    .tit {
      max-height: .88rem;
      overflow: hidden;
    }
    .info {
      display: flex;
      justify-content: space-between;
    }
  }

  .nav-tab {
    display: flex;
    padding: .3rem .25rem 0;
    background: $color-white;
    border: .02rem solid $color-border;
    &.nav-tab-2 {
      padding: .3rem .8rem 0;
    }
    li {
      flex: 1;
      text-align: center;
      a {
        display: inline-block;
        padding-bottom: .3rem;
        border-bottom: .03rem solid transparent;
        font-size: .3rem;
        line-height: 1;
        color: $color-black;
      }
      &.active {
        a {
          color: $color-blue;
          border-color: $color-blue;
        }
      }
    }
  }

  .input-wp {
    display: flex;
    align-items: center;
    width: 4.5rem;
    padding: .2rem;
    input {
      display: block;
      width: 100%;
      height: .3rem;
      border: none;
      background: transparent;
    }
  }

  .avatar {
    margin-right: .2rem;
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
  }

  .detail-student {
    display: flex;
    align-items: center;
    padding: .15rem .2rem;
    border-bottom: .01rem solid $color-border;
    .hd {
      flex: 1;
    }
    .bd {
      .avatar {
        float: left;
        margin-right: .04rem;
      }
    }
    .ft {
      display: flex;
      align-items: center;
      i, &:before, &:after {
        display: block;
        margin-right: .07rem;
        width: .1rem;
        height: .1rem;
        overflow: hidden;
        border-radius: 50%;
        background: #7f7f7f;
      }
      &:before, &:after {
        content: "";
      }
    }
  }

  .detail-intro {
    .hd {
      padding: .3rem .2rem;
      color: $color-gray;
    }
    .bd {
      padding: .2rem;
      color: $color-gray-dark;
      p {
        margin-bottom: .2rem;
      }
      img {
        display: block;
        max-width: 100%;
      }
    }
    .empty {
      text-align: center;
      padding: .5rem;
    }
    .explain {
      padding: 0 .2rem .2rem .2rem;
      font-size: .24rem;
      color: $color-gray;
      line-height: 1.6;
    }
  }
</style>
