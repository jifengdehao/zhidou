/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 系列课详情
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="swipe-wp">
        <slider v-if="banner.length > 0">
          <div v-for="(item, key) in banner" :key="key">
            <a href="javascript:;">
              <img :src="item.url || $root.placeHolder.banner" style="height: 3rem"/>
            </a>
          </div>
        </slider>
      </div>
      <div class="detail-info">
        <h2 class="tit fs15" v-html="formatTitle(course.title)"></h2>
        <div class="info mt10 fs12 gray">
          <p>已开课{{ course.period_count }}节 | 预计更新{{ course.plan_period_count }}节课</p>
        </div>
      </div>

      <mt-cell class="cell-card mt20" :title="course.name" is-link to="/classroom">
        <img slot="icon" class="avatar" v-lazy="course.avatar || $root.placeHolder.avatar">
      </mt-cell>

      <div class="g-list-wp mt20">
        <mt-cell is-link @click.native="goToSeriesList">
          <div slot="title" class="fs18">
            课程目录({{periodList.length}})
          </div>
        </mt-cell>
        <course-item v-for="(item, key) in showPeriodList" :key="key" :item="item" type="classroomPeriod"
                     @click.native="$router.push('/classroom/series/period/'+item.id)"/>
        <div class="bd tac" v-if="periodList.length < 1">暂无课程</div>
        <a class="btn-more" v-if="periodList.length > 4" :href="'/classroom/series/list/' + id">展开全部</a>
      </div>

      <div class="detail-intro mt20">
        <mt-cell>
          <span class="fs18" slot="title">课程简介</span>
        </mt-cell>
        <div v-if="intro.length>0">
          <div class="hd">主讲人: {{ course.name }}</div>
          <div class="bd">
            <template v-for="item in intro">
              <img v-lazy="item.url" v-if="item.url"/>
              <p v-if="item.dec" v-html="formatSolution(item.dec)"></p>
            </template>
          </div>
        </div>
        <div class="bd tac" v-else>暂无课程简介</div>
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="default"
                 @click="$router.push('/classroom/series/update/'+id)">编辑
      </mt-button>
      <mt-button type="primary" @click="$router.push('/classroom/series/add-period/'+id)">新建课程</mt-button>
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
        id: this.$route.params.id, //课程Id
        course: {}, // 课程详情
        showPeriodList: [], // 展示系列课-课时列表
        intro: [],
        banner: [],
        periodList: [],
        page: 1
      };
    },
    created() {
      this.getCourseDetails(this.id)
      this.getPeriodList(this.id, this.page)
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
      // 课程详情
      getCourseDetails(id) {
        this.API.anchorSet(id).then(res => {
          if (res) {
            console.log(res)
            this.course = res;
            if (res.img.length > 0) {
              this.banner = res.img
            }
            if (res.note.length > 0) {
              this.intro = res.note
            }
          }
        });
      },
      // 获取课时
      getPeriodList(id, page) {
        this.API.coursePeriodList(id, page).then((res) => {
          if (res._items.length > 0) {
            this.periodList = this.periodList.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getPeriodList(id, page)
            }
            this.showPeriodList = res._items.filter((item, index) => {
              return index < 4
            })
          }
        });
      },
      goToSeriesList() {
        if (this.periodList.length > 4) {
          this.$router.push('/classroom/series/list/' + this.id)
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .detail-info, .detail-intro {
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

  .avatar {
    margin-right: .2rem;
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
  }

  .btn-more {
    display: block;
    line-height: .9rem;
    text-align: center;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    color: $color-black;
  }

  .detail-intro, .g-list-wp {
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
