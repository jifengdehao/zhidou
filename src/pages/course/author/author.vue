/**
* @author zhangwenlong
* @date 2018/4/4
* @Description: 用户-主播空间
*/
<template>
  <scroll class="scroll-bd" :data="swiper" style="overflow:hidden;">
    <div>
      <div class="author-wp" v-if="space">
        <div class="author-hd">
          <img :src="space.avatar || $root.placeHolder.avatar" :alt="space.title">
        </div>
        <div class="author-bd">
          <p>{{ space.title }}</p>
          <p class="fs12 gray">{{ fans }}人关注</p>
        </div>
        <div class="author-ft">
          <a class="btn-follow" href="javascript:void(0)" v-if="user.is_followed == 0"
             @click="follewAuthor">关注</a>
          <a class="btn-follower" href="javascript:void(0)" v-else @click="follewAuthor">已关注</a>
        </div>
      </div>
      <div class="swipe-wp">
        <slider v-if="swiper.length>0">
          <div v-for="(item,index) in swiper" :key="index">
            <a href="javascript:;">
              <img :src="item.url || $root.placeHolder.banner" style="height: 3rem"/>
            </a>
          </div>
        </slider>
      </div>
      <div class="intro-wp">
        <div class="intro-hd">
          <h3>简介</h3>
        </div>
        <div class="intro-bd" v-if="space.intro">
          <p class="overFlow" ref="introP">{{ space.intro }}</p>
        </div>
        <div class="intro-bd tac" v-else>暂无简介</div>
        <div class="intro-ft" @click="seeAllIntro">
          <a href="javascript:void(0);" class="btn-more" v-show="!select">展开全部</a>
          <a href="javascript:void(0);" class="btn-more" v-show="select">收起</a>
        </div>
      </div>
      <div class="g-list-wp mt20">
        <mt-cell is-link :to="'/course/classList/1/'+id" v-if="series.count>0">
          <div slot="title" class="fs18">
            系列课({{ series.count }})
          </div>
        </mt-cell>
        <mt-cell v-else>
          <div slot="title" class="fs18">
            系列课({{ series.count }})
          </div>
        </mt-cell>
        <div v-if="series.count>0">
          <course-item v-for="(item, key) in series.list" :key="key" :item="item" type="classroomSeries"
                       @click.native="$router.push('/course/detail/' + item.id)"/>
          <a class="btn-more" v-if="series.count > 4" :href="'/course/classList/1/'+id">展开全部</a>
        </div>
        <div v-else class="tac" style="padding: .5rem;">暂无课程</div>
      </div>
      <div class="g-list-wp mt20">
        <mt-cell is-link :to="'/course/classList/0/'+id" v-if="single.count>4">
          <span slot="title" class="fs18">单次课({{ single.count }})</span>
        </mt-cell>
        <mt-cell is-link v-else>
          <span slot="title" class="fs18">单次课({{ single.count }})</span>
        </mt-cell>
        <div v-if="single.count>0">
          <course-item v-for="(item, key) in single.list" :key="key" :item="item" type="classroom"
                       @click.native="$router.push('/course/detail/' + item.id)"/>
          <a class="btn-more" v-if="single.count > 4" :href="'/course/classList/0/'+id">展开全部</a>
        </div>
        <div v-else class="tac" style="padding: .5rem;">暂无课程</div>
      </div>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </scroll>
</template>

<script>
  import Scroll from '@/components/scroll/scroll'
  import Slider from '@/components/slider/slider'

  export default {
    name: "author",
    components: {
      Scroll,
      Slider
    },
    data() {
      return {
        id: this.$route.params.id,
        space: {}, // 主播信息
        user: {},  // 个人是否关注
        swiper: [], //主播空间图片
        fans: 0, // 主播粉丝
        series: {}, // 系列课列表
        single: [],  // 单课程列表
        select: false
      }
    },
    created() {
      this.getAuthorDetails()
    },
    methods: {
      seeAllIntro() {
        if (!this.seeAllTro) {
          this.seeAllTro = true
          this.select = true
          this.$refs.introP.className = ''
        } else {
          this.select = false
          this.seeAllTro = false
          this.$refs.introP.className = 'overFlow'
        }
      },
      // 主播空间信息
      getAuthorDetails() {
        this.API.spaceInfo(this.id).then((res) => {
          console.log(res)
          this.space = res.space
          this.user = res.user
          this.swiper = res.space.img
          this.fans = res.fansCount
          this.series = res.series
          this.single = res.single
        }).catch((err) => {
          console.log(err)
        })
      },
      follewAuthor() {
        this.API.spaceIsFollow({id: this.id}).then((res) => {
          console.log(res)
          if (res.is_follow == 1) {
            this.user.is_followed = res.is_follow
          } else {
            this.user.is_followed = res.is_follow
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin";

  .btn-more {
    display: block;
    line-height: .9rem;
    text-align: center;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    color: $color-black;
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
      .overFlow {
        display: -webkit-box;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 1.24rem;
      }
    }
  }
</style>
