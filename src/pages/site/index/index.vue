<template>
  <div class="scroll-wp">
    <!--<div class="scroll-bd">
      <mt-search cancel-text="" placeholder="搜索话题/系列课/直播课" @click.native="$router.push('/search')">
      </mt-search>
      <ul class="nav-tab">
        <li :class="{active:categoryActive === 0}" @click="selectCategory(0)">
          <a href="javascript:void(0)">推荐</a>
        </li>
        <li v-for="(item, index) in resourceGuide" :key="index" :class="{active:categoryActive === item.id}"
            @click="selectCategory(item.id)">
          <a href="javascript:void(0)">{{item.name}}</a>
        </li>
      </ul>
      <div v-show="categoryActive === 0" class="swipe-wp">
        <slider v-if="banner.length>0">
          <div v-for="item in banner">
            <a :href="item.url|| '/'">
              <img :src="item.img || $root.placeHolder.banner" class="needsclick" style="height: 3rem">
            </a>
          </div>
        </slider>
      </div>
      &lt;!&ndash;
      <div class="index-panel">
        <ul class="hd">
          <li>
            <a href="#">通知：无内容时不显示，由右向左滚动显示</a>
          </li>
        </ul>
        <ul class="bd">
          <li>
            <a class="icon-course" href="javascript:void(0);">精品课程</a>
          </li>
          <li>
            <a class="icon-free" href="javascript:void(0);">免费专区</a>
          </li>
          <li>
            <a class="icon-rank" href="javascript:void(0);">排行榜</a>
          </li>
          <li>
            <a class="icon-token" href="javascript:void(0);">挖豆</a>
          </li>
        </ul>
      </div>
      &ndash;&gt;
      <div class="g-list-wp mt20"
           v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
        <mt-cell v-show="categoryActive === 0">
          <span slot="title" class="cell-text">每日精选</span>
        </mt-cell>
        <course-item v-for="(item, key) in resourceCommend" :key="key" :item="item" type="index"
                     @click.native="navTo(item)"/>
      </div>
    </div>-->
    <scroll class="scroll-bd" :data="resourceCommend" :listenScroll="true" @scroll="scroll">
      <div>
        <mt-search cancel-text="" placeholder="搜索话题/系列课/直播课" @click.native="$router.push('/search')"></mt-search>
        <div ref="tabScroll" class="tab-wrapper">
          <ul class="nav-tab" ref="tabList">
            <li :class="{active:categoryActive === 0}" @click="selectCategory(0)">
              <a href="javascript:void(0)">推荐</a>
            </li>
            <li v-for="(item, index) in resourceGuide" :key="index" :class="{active:categoryActive === item.id}"
                @click="selectCategory(item.id)">
              <a href="javascript:void(0)">{{item.name}}</a>
            </li>
          </ul>
        </div>
        <div v-show="categoryActive === 0" class="swipe-wp">
          <slider v-if="banner.length>0">
            <div v-for="item in banner">
              <a :href="item.url|| '/'">
                <img :src="item.img || $root.placeHolder.banner" class="needsclick" style="height: 3rem">
              </a>
            </div>
          </slider>
        </div>
        <div class="index-panel" v-show="categoryActive === 0">
          <ul class="bd">
            <li>
              <a class="icon-sale" href="/index/course-distribution">课程分销</a>
            </li>
            <li>
              <a class="icon-bean" href="/index/earn-bean">赚取智豆</a>
            </li>
            <!--<li>
              <a class="icon-rank" href="javascript:void(0);">排行榜</a>
            </li>
            <li>
              <a class="icon-token" href="javascript:void(0);">挖豆</a>
            </li>-->
          </ul>
        </div>
        <div class="g-list-wp mt20">
          <mt-cell v-show="categoryActive === 0" class="g-line">
            <span slot="title" class="cell-text">每日精选</span>
          </mt-cell>
          <course-item v-for="(item, key) in resourceCommend" :key="key" :item="item" type="index"
                       @click.native="navTo(item)"/>
        </div>
      </div>
    </scroll>
    <Tabbar/>
  </div>
</template>

<script>
  import Tabbar from '@/components/tabbar/tabbar'
  import Slider from '@/components/slider/slider'
  import Scroll from '@/components/scroll/scroll'
  import BScroll from 'better-scroll'

  export default {
    name: 'Index',
    data() {
      return {
        categoryActive: 0, // 推荐
        banner: [], // banner图
        page: 1, // 默认第一页
        pageCount: 1,
        resourceGuide: [], // 分类
        resourceCommend: [],
        loading: false
      };
    },
    components: {
      Scroll,
      Tabbar,
      Slider
    },
    created() {
      // 轮播图
      this.API.banner().then((res) => {
        if (res && res.length > 0) {
          this.banner = res;
        }
      }).catch((err) => {
        console.log(err);
      });

      // 课程分类
      this.API.resourceGuide().then(((res) => {
        if (res && res.length > 0) {
          this.resourceGuide = res;
        }
      })).catch((err) => {
        console.log(err);
      });
      this.loadMore(this.page)
    },
    watch: {
      'resourceGuide'() {
        this.$nextTick(() => {
          this.initTabScroll()
        })
      },
      'categoryActive'(){
        this.loadMore(this.page)
      }
    },
    methods: {
      scroll() {
        if (this.pageCount > this.page) {
          this.page++
          if (this.categoryActive === 0) {
            this.API.resourceCommend(this.page).then(((res) => {
              if (res && res._items.length > 0) {
                console.log(res)
                this.resourceCommend = this.this.resourceCommend.concat(res._items)
              }
            })).catch((err) => {
              console.log(err);
            });
          } else {
            this.API.resourceGuideList({id: this.categoryActive, page: this.page}).then((res) => {
              if (res._items.length > 0) {
                console.log(res)
                this.resourceCommend = this.resourceCommend.concat(res._items)
              }
            }).catch((err) => {
              console.log(err)
            });
          }
        }
      },
      initTabScroll() {
        if (this.$refs.tabList) {
          this.tabGroup = this.$refs.tabList
          this.children = this.tabGroup.children
          let width = 0
          for (let i = 0; i < this.children.length; i++) {
            width += this.children[i].clientWidth
          }
          this.$refs.tabList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.tabScroll) {
              this.tabScroll = new BScroll(this.$refs.tabScroll, {
                scrollX: true,
                eventPassthrough: 'vertical',
                click: true
              });
            } else {
              this.tabScroll.refresh()
            }
          })
        }
      },
      loadMore(page) {
        if (this.categoryActive === 0) {
          this.API.resourceCommend(page).then(((res) => {
            if (res && res._items.length > 0) {
              console.log(res)
              this.resourceCommend = res._items
              this.pageCount = res._meta.pageCount
            }
          })).catch((err) => {
            console.log(err);
          });
        } else {
          this.API.resourceGuideList({id: this.categoryActive, page: page}).then((res) => {
            if (res._items.length > 0) {
              console.log(res)
              this.resourceCommend = res._items
              this.pageCount = res._meta.pageCount
            }
          }).catch((err) => {
            console.log(err)
          });
        }
      },
      navTo(item) {
        this.$router.push('/course/detail/' + item.id)
      },
      // 选择分类
      selectCategory(id) {
        this.categoryActive = id
        this.page = 1
        this.resourceCommend = []
      },
      // 课程类目筛选课程列表
      getCategoryClass(id, page) {
        this.API.resourceGuideList({id: id, page: page}).then((res) => {
          if (res && res._items.length > 0) {
            this.resourceCommend = this.resourceCommend.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getCategoryClass(id, page)
            }
          }
        }).catch((err) => {
          console.log(err)
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

  @import "../../../styles/mixin";

  .nav-tab, .index-swipe, .index-panel, .g-list-wp {
    background: $color-white;
  }

  .tab-wrapper {
    background-color: #ffffff;
  }

  .nav-tab {
    white-space: nowrap;
    overflow-x: scroll;
    padding: .1rem .1rem 0;
    li {
      display: inline-block;
      padding: 0 .3rem;
      text-align: center;
      a {
        display: inline-block;
        padding-bottom: .18rem;
        border-bottom: .02rem solid transparent;
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

  .index-swipe {
    height: 3rem;
    .item {
      display: block;
      height: 3rem;
    }
  }

  .index-panel {
    .hd, .bd {
      //border-bottom: .01rem solid $color-border;
    }
    .hd {
      li {
        padding: .17rem .34rem .17rem .34rem;
        line-height: .34rem;
        &:before {
          content: "";
          display: inline-block;
          float: left;
          margin-top: -0.06rem;
          margin-right: .26rem;
          width: .34rem;
          height: .34rem;
          background: url(./images/icon-notify.png) no-repeat;
          background-size: cover;
        }
        a {
          display: block;
          height: .34rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: .24rem;
          color: $color-black;
        }

      }
    }
    .bd {
      display: flex;
      padding: .3rem .2rem;
      background-image: linear-gradient(180deg, $color-border, $color-border 0%, transparent 0.02rem);
      li {
        flex: 1;
      }
      a {
        display: block;
        text-align: center;
        font-size: .24rem;
        color: #808080;
        &:before {
          content: "";
          display: block;
          margin: 0 auto .1rem;
          width: .8rem;
          height: .8rem;
          background-repeat: no-repeat;
          background-size: cover;
        }
        &.icon-sale {
          &:before {
            background-image: url(./images/icon-sale.png);
          }
        }
        &.icon-bean {
          &:before {
            background-image: url(./images/icon-bean.png);
          }
        }
        &.icon-course {
          &:before {
            background-image: url(./images/icon-course.png);
          }
        }
        &.icon-free {
          &:before {
            background-image: url(./images/icon-free.png);
          }
        }
        &.icon-rank {
          &:before {
            background-image: url(./images/icon-rank.png);
          }
        }
        &.icon-token {
          &:before {
            background-image: url(./images/icon-token.png);
          }
        }
      }
    }
  }
</style>
