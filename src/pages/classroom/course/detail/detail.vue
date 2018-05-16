/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 课时详情
*/
<template>
  <div class="scroll-wp" v-if="course">
    <div class="scroll-bd">
      <div class="swipe-wp" style="height: 4.7rem;">
        <slider v-if="banner.length > 0">
          <div v-for="(item, key) in banner" :key="key">
            <a href="javascript:;">
              <img :src="item.url || $root.placeHolder.banner" style="height: 4.7rem"/>
            </a>
          </div>
        </slider>
      </div>
      <div class="detail-info">
        <h2 class="tit fs15" v-html="formatTitle(course.title)"></h2>
        <div class="info mt10 fs12 gray">
          <p>时间<span class="ml20 red">{{ course.times | formatDate }}</span></p>
          <span>{{course.study_count}}次学习</span>
        </div>
      </div>
      <!--报名人数-->
      <div class="detail-student">
        <p class="hd fs12 gray">报名人数<span class="ml20">{{students.total}}人</span></p>
        <div class="bd">
          <img class="avatar" :src="item.img || $root.placeHolder.avatar" v-for="(item,index) in students.user"
               :key="index" width="20" height="20">
        </div>
        <div class="ft ml10"><i></i></div>
      </div>
      <div class="detail-audio mt20 fs12">
        <div class="hd gray" v-if="course.file_type == 1">录音文件</div>
        <div class="bd ml20 mr20" v-if="course.file_type == 1">
          <a class="audio-link" href="javascript:;">{{course.file_name}}</a>
        </div>
        <div class="hd gray" v-if="course.file_type == 2">视频文件</div>
        <div class="bd ml20 mr20" v-if="course.file_type == 2">
          <a class="audio-link" href="javascript:;">{{course.file_name}}</a>
        </div>
        <div class="ft">
          <span class="btn btn-red" v-if="course.status == 2">审核未通过</span>
          <span class="btn green" v-else-if="course.status == 1">审核通过</span>
          <span class="btn" v-else>审核中</span>
        </div>
      </div>
      <div class="detail-intro mt20">
        <mt-cell>
          <span class="fs18" slot="title">课程简介</span>
        </mt-cell>
        <div v-if="intro">
          <div class="hd">主讲人: {{ course.author }}</div>
          <div class="bd">
            <template v-for="item in intro">
              <img v-lazy="item.url" v-if="item.url"/>
              <p v-if="item.dec" v-html="formatSolution(item.dec)"></p>
            </template>
          </div>
        </div>
        <div class="bd tac" v-else>暂无课程简介</div>
      </div>
      <router-link tag="div" class="link-home" to="/"></router-link>
    </div>
    <div class="scroll-ft">
      <mt-button type="default" @click="$router.push('/classroom/course/update/' + id)">编辑</mt-button>
      <mt-button type="primary" @click="goToTeach">进入直播</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import Slider from '@/components/slider/slider'

  export default {
    components: {
      Slider
    },
    data() {
      return {
        id: this.$route.params.id,
        course: {},
        students: {},
        intro: [],
        banner: []
      }
    },
    created() {
      this.getSingleDetails()
    },
    methods: {
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
      // 进入直播
      goToTeach() {
        this.$router.push('/classroom/course/teach/' + this.id)
      },
      // 获取课程详情
      getSingleDetails() {
        this.API.anchorSingle(this.id).then((res) => {
          console.log(res)
          if (res) {
            this.course = res;
            this.students.total = res.sign_total
            this.students.user = res.sign_user
            if (res.note.length > 0) {
              this.intro = res.note
            }
            if (res.img.length > 0) {
              this.banner = res.img
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .detail-info, .detail-audio, .detail-intro {
    background: $color-white;
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

  .detail-audio {
    display: flex;
    align-items: center;
    padding: .15rem .2rem;
    border: .01rem solid $color-border;
    border-width: .01rem 0;
    .bd {
      .btn {
        display: block;
        padding: 0 .3rem;
        max-width: 4rem;
        line-height: .58rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: #e5e5e5;
        border-radius: .04rem;
        color: $color-black;
      }
      .audio-link {
        padding: 0 .3rem;
        max-width: 4rem;
        line-height: .58rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        color: #26a2ff;
        text-decoration: underline;
      }
    }
    .ft {
      flex: 1;
      text-align: right;
      .btn {
        display: inline-block;
        padding: 0 .2rem;
        line-height: .5rem;
        text-align: center;
        border: .02rem solid $color-gray;
        border-radius: .04rem;
        color: $color-gray;
        &.btn-red {
          border-color: $color-red;
          color: $color-red;
        }
        &.btn-green {
          border-color: $color-green;
          color: $color-green;
        }
      }
    }
  }

  .detail-student {
    display: flex;
    align-items: center;
    padding: .15rem .2rem;
    background-color: #ffffff;
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
      padding: 0 .2rem;
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
  }
</style>
