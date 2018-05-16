/**
* @author zhangwenlong
* @date 2018/3/30
* @Description: 用户-单课程详情
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <mt-swipe class="swipe-wp" :auto="4000">
        <mt-swipe-item v-for="(item,index) in course.img" :key="index">
          <img class="item" :src="item.url || $root.placeHolder.banner">
        </mt-swipe-item>
      </mt-swipe>

      <div class="detail-info">
        <h2 class="tit fs15">{{course.title}}</h2>
        <div class="info mt10 fs12 gray">
          <p>时间<span class="ml10">{{course.times | formatDate }}</span></p>
          <span>{{course.study_count}}次学习</span>
        </div>
      </div>

      <div class="detail-student">
        <p class="hd fs12 gray">报名人数<span class="ml20">{{students.total}}人</span></p>
        <div class="bd">
          <img class="avatar" :src="item.img || $root.placeHolder.avatar" v-for="(item,index) in students.user"
               :key="index">
        </div>
        <div class="ft ml10"><i></i></div>
      </div>

      <mt-cell class="cell-card mt20" :title="teacher.space_name" @click.native="goToTeacher(teacher.id)">
        <img slot="icon" class="avatar" :src="teacher.avatar || $root.placeHolder.avatar">
        <a class="btn-follow" href="javascript:void(0)" v-if="user.is_followed == 0"
           @click.stop="follewClass(teacher.id)">关注</a>
        <a class="btn-follower" href="javascript:void(0)" v-else @click.stop="follewClass(teacher.id)">已关注</a>
      </mt-cell>

      <ul class="nav-tab nav-tab-2 mt20">
        <li :class="{active: tab == 'intro'}" @click="tab = 'intro'">
          <a href="#">课程简介</a>
        </li>
        <li :class="{active: tab == 'comment'}" @click="tab = 'comment'">
          <a href="#">用户评价</a>
        </li>
      </ul>

      <div class="detail-intro" v-if="tab == 'intro'">
        <div v-if="intro.length>0">
          <div class="hd">主讲人: {{ course.author }}</div>
          <div class="bd">
            <template v-for="item in intro">
              <img :src="item.url" alt=""/>
              <p>{{item.dec}}</p>
            </template>
          </div>
        </div>
        <div class="tac" v-else style="padding: 0.5rem;">暂无课程简介</div>
        <div class="explain" v-if="course.pay_type===1">
          <h3>购买须知</h3>
          <p class="mt10">1、该课程为付费系列课程，按课程计划定期更新，每节课程可在开课时直播学习，也可以反复会听</p>
          <p>2、该课程为虚拟内容服务，购买成功后概不退款，敬请原谅</p>
        </div>
      </div>

      <div class="detail-comment" v-else>
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
        <div class="tac" v-else style="padding: 0.5rem;">暂无用户评论</div>
      </div>
    </div>

    <div class="scroll-ft">
      <mt-button v-if="user.is_enrolled === 0 && course.pay_type===1" type="danger" @click="handleOrder">
        购买课程（¥{{course.price}}）
      </mt-button>
      <mt-button v-if="user.is_enrolled === 0 && course.pay_type===2" type="danger" @click="handleOrder">
        购买课程（{{course.price}}个豆）
      </mt-button>
      <template v-if="user.is_enrolled === 0 &&  course.pay_type===3">
        <div class="input-wp">
          <input type="number" placeholder="输入密码进入直播间" v-model.trim="teachPwd"/>
        </div>
        <mt-button type="primary" @click="handleOrder">进入直播间</mt-button>
      </template>
      <mt-button v-if="user.is_enrolled === 1" type="danger" @click="handleOrder">点击进入</mt-button>
      <mt-button v-if="user.is_enrolled === 0 && course.pay_type === 0" type="danger" @click="handleOrder">报名进入
      </mt-button>
    </div>

    <div class="detail-order" v-if="orderVisible">
      <div class="order-wp">
        <div class="order-hd fs15 tac">
          <h3>支付详情</h3>
          <span class="btn-close-x" @click="orderVisible = 0"></span>
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
                     @click="payOrder">支付
          </mt-button>
          <span class="btn-disabled fs15 tac" v-else>余额不足</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {weixinPay} from '@/common/otherWeixin'

  export default {
    data() {
      return {
        id: this.$route.params.id, // 课程id
        tab: 'intro',
        orderVisible: false,  // 控制是否需要智豆支付
        userBean: {},  // 用户智豆
        userCash: {},   // 用户现金
        course: {},  // 课程简介
        teacher: {},   // 老师
        user: {},   // 个人
        students: {}, // 学生
        intro: [], // 课程简介
        comment: [], // 评论
        teachPwd: '', // 购买课程需要密码
        page: 1
      };
    },
    created() {
      this.getCourseDetails(this.id)
      this.getClassComment(this.id, this.page)
      this.getUserBaseBalance()
    },
    computed: {
      isPay() {
        return this.userBean >= this.course.price ? true : false
      }
    },
    methods: {
      // 跳转到直播空间
      goToTeacher(id) {
        return this.$router.push('/course/author/' + id);
      },
      // 支付课程
      payOrder() {
        this.API.orderPay({course_id: this.id, pay_type: 1}).then((res) => {
          if (res) {
            console.log(res)
            this.$router.push('/course/teach/' + this.id)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 报名和支付
      handleOrder() {
        if (this.user.is_enrolled === 1) {
          this.$router.push('/course/teach/' + this.course.period_id)
        } else if (this.user.is_enrolled === 0 && this.course.pay_type === 3) {
          if (this.teachPwd) {
            this.API.freeEnroll({id: this.id, pwd: this.teachPwd}).then((res) => {
              if (res) {
                console.log(res);
                this.$router.push('/course/teach/' + this.course.period_id)
              }
            }).catch((err) => {
              this.$toast(err.msg)
              console.log(err)
            })
          } else {
            this.$toast('请输入密码')
          }
        } else if (this.user.is_enrolled === 0 && this.course.pay_type === 2) {
          this.orderVisible = true
        } else if (this.user.is_enrolled === 0 && this.course.pay_type === 1) {
          console.log('现金支付，谢谢')
          console.log(typeof WeixinJSBridge)
          this.API.orderPay({course_id: this.id, pay_type: 2}).then((res) => {
            let data = res.jsApiParams
            weixinPay(data, function (res) {
              if (res) {
                window.location.reload()
              }
            })
          }).catch((err) => {
            console.log(err)
          })
        } else if (this.user.is_enrolled === 0 && this.course.pay_type === 0) {
          this.API.freeEnroll({id: this.id}).then((res) => {
            if (res) {
              console.log(res);
              this.$router.push('/course/teach/' + this.course.period_id)
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      // 获取课程详情
      getCourseDetails(id) {
        this.API.courseShowCourse(id).then((res) => {
          console.log(res);
          this.course = res.course
          this.students = res.students
          this.teacher = res.teacher
          this.user = res.user
          this.intro = res.course.note
        }).catch((err) => {
          console.log(err)
        });
      },
      // 获取评论
      getClassComment(courseId, page) {
        this.API.classComment({id: courseId, statu: 1, page: page}).then((res) => {
          if (res && res._items) {
            this.comment = this.comment.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getClassRemmd(courseId, page)
            }
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      //关注主播
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
          this.userBean = res.bean.amount
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .detail-info, .detail-intro, .detail-comment, .order-wp {
    background: $color-white;
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

  .btn-more {
    display: block;
    line-height: .9rem;
    text-align: center;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    color: $color-black;
  }

  .detail-student, .list-wp {
    background: $color-white;
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
        margin: .4rem auto .2rem;
        max-width: 100%;
      }
    }
    .explain {
      padding: 0 .2rem;
      font-size: .24rem;
      color: $color-gray;
      margin-bottom: .4rem;
      line-height: 1.6;
    }
  }
</style>
