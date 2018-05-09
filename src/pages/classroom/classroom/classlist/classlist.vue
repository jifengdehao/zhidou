/**
* @author zhangwenlong
* @date 2018/4/20
* @Description: 单课和系列课列表
*/
<template>
  <scroll class="page-wp" :data="list" @scroll="scroll" :listenScroll="true" style="overflow: hidden;">
    <div>
      <div class="author-wp mt20">
        <div class="author-hd">
          <img v-lazy="space.avatar || $root.placeHolder.avatar" :alt="space.title">
        </div>
        <div class="author-bd">
          <p>{{ space.title }}</p>
          <p class="fs12 gray">{{ space.fans }}人关注</p>
        </div>
        <div class="author-ft">
          <a class="btn-edit" href="javascript:void(0)" @click.stop="handleUpdateTitle">编辑</a>
        </div>
      </div>
      <div class="g-list-wp mt20">
        <div v-if="type==0">
          <course-item :item="item" v-for="(item,index) in list" :key="index" type="classroom"
                       @click.native="$router.push('/classroom/course/detail/' + item.id)"/>
        </div>
        <div v-else-if="type==1">
          <course-item :item="item" v-for="(item,index) in list" :key="index" type="classroomSeries"
                       @click.native="$router.push('/classroom/series/detail/' + item.id)"/>
        </div>
      </div>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </scroll>
</template>

<script>
  import Scroll from '@/components/scroll/scroll'

  export default {
    components: {
      Scroll
    },
    name: 'classlist',
    data() {
      return {
        space: {},
        loading: false,
        type: this.$route.params.type,
        list: [],
        page: 1,
        pageCount: 1
      }
    },
    created() {
      this.getSpaceDetails()
      this.loadMore(this.page)
    },
    methods: {
      scroll() {
        if (this.pageCount > this.page) {
          this.page++
          this.API.anchorSeries(this.type, this.page).then((res) => {
            if (res._items.length > 0) {
              this.list = this.list.concat(res._items)
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      getSpaceDetails() {
        this.API.anchorSpace().then((res) => {
          if (res) {
            let space = res.space
            space.fans = res.fansCount;
            this.space = space
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      handleUpdateTitle() {
        let vm = this;
        this.$messagebox.prompt('空间名称', {inputValue: this.space.title}).then(({value}) => {
          vm.API.anchorUpdateSpace({space_name: value}).then((res) => {
            if (res) {
              vm.$toast('操作成功');
              vm.space.title = value;
            }
          });
        });
      },
      loadMore(page) {
        this.API.anchorSeries(this.type, page).then((res) => {
          if (res._items.length > 0) {
            this.list = res._items
            this.pageCount = res._meta.pageCount
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../styles/mixin";

  .g-list-wp {
    background: $color-white;
  }

  .author-wp {
    background: $color-white;
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
</style>
