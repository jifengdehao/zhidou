/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 我的直播间
*/
<template>
  <scroll class="scroll-bd" :data="space.img" style="overflow-y: hidden;">
    <div>
      <div class="author-wp mt20" v-if="space">
        <div class="author-hd">
          <img v-lazy="space.avatar || $root.placeHolder.avatar" :alt="space.title">
        </div>
        <div class="author-bd">
          <p>{{ space.title }}</p>
          <p class="fs12 gray">{{ fans }}人关注</p>
        </div>
        <div class="author-ft">
          <a class="btn-edit" href="javascript:void(0)" @click="handleUpdateTitle">编辑</a>
          <!-- <a class="btn btn-follow" href="#">关注</a> -->
        </div>
      </div>
      <div class="swipe-wp mt20" v-if="space">
        <a class="btn-edit" href="/classroom/banner">编辑</a>
        <slider v-if="swiper.length>0">
          <div v-for="item in swiper">
            <a href="javascript:;">
              <img :src="item.url || $root.placeHolder.banner" style="height: 3rem;"/>
            </a>
          </div>
        </slider>
      </div>

      <div class="intro-wp">
        <div class="intro-hd">
          <h3>简介</h3>
          <a class="btn-edit" href="/classroom/introduction">编辑</a>
        </div>
        <div class="intro-bd">
          <p class="overFlow" ref="introP" v-html="formatSolution(space.intro)"></p>
        </div>
        <div class="intro-ft" @click="seeAllIntro">
          <a href="javascript:void(0);" class="btn-more" v-show="!select">展开全部</a>
          <a href="javascript:void(0);" class="btn-more" v-show="select">收起</a>
        </div>
      </div>

      <div class="pannel-wp mt20">
        <div class="cell">
          <p>{{ fans }}</p>
          <p class="text">所有粉丝</p>
          <div class="last">
            <mt-button class="btn" type="primary"
                       @click.native="$router.push('/classroom/course/create')">新建单次课
            </mt-button>
          </div>
        </div>
        <div class="cell">
          <p>{{cash}}</p>
          <p class="text">历史现金收益</p>
          <div class="last">
            <mt-button class="btn btn-blue" type="primary"
                       @click.native="$router.push('/classroom/series/create')">新建系列课
            </mt-button>
          </div>
        </div>
      </div>

      <div class="g-list-wp mt20">
        <mt-cell is-link to="/classroom/classlist/1" v-if="series.count">
          <div slot="title" class="fs18">
            系列课({{ series.count }})
            <!-- <span class="btn-category blue fs15 ml10" @click.stop.prevent="$router.push('/classroom/series/category')">分类管理</span> -->
          </div>
        </mt-cell>
        <mt-cell is-link v-else>
          <div slot="title" class="fs18">
            系列课({{ series.count }})
          </div>
        </mt-cell>
        <div v-if="series.count>0">
          <course-item v-for="(item, key) in series.list" :key="key" :item="item" type="classroomSeries"
                       @click.native="$router.push('/classroom/series/detail/' + item.id)"/>
          <a class="btn-more" v-if="series.count > 4" href="/classroom/classlist/1">展开全部</a>
        </div>
        <div v-else class="tac" style="padding: .5rem;">暂无课程</div>
      </div>
      <div class="g-list-wp mt20" v-if="single">
        <mt-cell is-link to="/classroom/classlist/0" v-if="single.count > 4">
          <span slot="title" class="fs18">单次课({{ single.count }})</span>
        </mt-cell>
        <mt-cell is-link v-else>
          <span slot="title" class="fs18">单次课({{ single.count }})</span>
        </mt-cell>
        <div v-if="single.count>0">
          <course-item v-for="(item, key) in single.list" :key="key" :item="item" type="classroom"
                       @click.native="$router.push('/classroom/course/detail/' + item.id)"/>
          <a class="btn-more" v-if="single.count > 4" href="/classroom/classlist/0">展开全部</a>
        </div>
        <div v-else class="tac" style="padding: .5rem;">暂无课程</div>
      </div>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </scroll>
</template>

<script>
  import Slider from '@/components/slider/slider'
  import Scroll from '@/components/scroll/scroll'

  export default {
    components: {
      Slider,
      Scroll
    },
    data() {
      return {
        swiper: [],
        space: {},
        single: {},
        series: {},
        fans: 0,
        cash: 0,
        select: false,
      };
    },
    created() {
      this.getUserSpace()
    },
    methods: {
      // 我的直播间
      getUserSpace() {
        this.API.anchorSpace().then((res) => {
          this.space = res.space;
          this.single = res.single;
          this.series = res.series;
          this.swiper = res.space.img
          this.fans = res.fansCount
          this.cash = res.earnAmount
        }).catch((err) => {
          console.log(err)
        })
      },
      formatSolution(s) {
        if (s) {
          return s.replace(/\n/g, '<br/>')
        } else {
          return ''
        }
      },
      seeAllIntro() {
        if (!this.seeAllTro) {
          this.select = true
          this.seeAllTro = true
          this.$refs.introP.className = ''
        } else {
          this.select = false
          this.seeAllTro = false
          this.$refs.introP.className = 'overFlow'
        }
      },
      handleUpdateTitle() {
        let vm = this;
        this.$messagebox.prompt('空间名称', {inputValue: this.space.title}).then(({value}) => {
          vm.API.anchorUpdateSpace({space_name: value}).then((res) => {
            if (res) {
              console.log(res)
              vm.$toast('操作成功');
              vm.space.title = value;
            }
          });
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin";

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

  .btn-more {
    display: block;
    line-height: .9rem;
    text-align: center;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    color: $color-black;
  }

  .btn-category {
    position: relative;
    z-index: 2;
  }

  .author-wp, .intro-wp {
    background: $color-white;
  }

  .author-wp {
    display: flex;
    align-items: center;
    padding: .3rem .35rem .3rem .2rem;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    .author-hd {
      margin-right: .27rem;
      img {
        width: .6rem;
        height: .6rem;
        border-radius: 50%;
      }
    }
    .author-bd {
      flex: 1;
    }
  }

  .intro-wp {
    .intro-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .3rem .3rem 0 .2rem;
      /*height: .36rem;*/
      h3 {
        line-height: 1;
        font-size: .36rem;
      }
    }
    .intro-bd {
      padding: .2rem .2rem .3rem;
      overflow: hidden;
      line-height: .42rem;
      color: #808080;
      width: 100%;
      box-sizing: border-box;
      .overFlow {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 1.24rem;
      }
    }
  }

  .swipe-wp {
    position: relative;
    .btn-edit {
      position: absolute;
      top: .2rem;
      right: .2rem;
      z-index: 99;
      padding: .1rem;
      border-radius: .05rem;
      background: rgba(255, 255, 255, .85);
    }
  }

  .pannel-wp {
    position: relative;
    display: flex;
    padding: .72rem .13rem .4rem;
    background: $color-white;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    &:after {
      content: "";
      position: absolute;
      left: 50%;
      top: .34rem;
      width: .02rem;
      height: 1.5rem;
      background: $color-border;
    }
    .cell {
      flex: 1;
      text-align: center;
      p {
        font-size: .36rem;
      }
      p.text {
        margin-top: .06rem;
        font-size: .24rem;
        color: $color-gray;
      }
      .last {
        margin-top: .30rem;
        line-height: .75rem;
      }
      .btn {
        display: block;
        margin: 0 auto;
        width: 3rem;
        height: .76rem;
        border-radius: .38rem;
        background: linear-gradient(left, $color-red-begin, $color-red-end) no-repeat;
        &.btn-blue {
          background: linear-gradient(left, $color-blue-begin, $color-blue-end) no-repeat;
        }
      }
    }
  }
</style>
