/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 我的单课程列表
*/
<template>
  <div>
    <div class="page-wp">
      <div class="author-wp mt20">
        <div class="author-hd">
          <img :src="space.avatar || $root.placeHolder.avatar" :alt="space.title">
        </div>
        <div class="author-bd">
          <p>{{ space.title }}</p>
          <p class="fs12 gray">{{ space.fans }}人关注</p>
        </div>
        <div class="author-ft">
          <a class="btn-edit" href="javascript:void(0)" @click.stop="handleUpdateTitle">编辑</a>
          <!-- <a class="btn btn-follow" href="#">关注</a> -->
        </div>
      </div>
      <div class="g-list-wp mt20">
        <div v-if="type==0"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="100">
          <course-item :item="item" v-for="(item,index) in list" :key="index" type="classroom"
                       @click.native="$router.push('/classroom/course/detail/' + item.id)"/>
        </div>
        <div v-else-if="type==1"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="100">
          <course-item :item="item" v-for="(item,index) in list" :key="index" type="classroomSeries"
                       @click.native="$router.push('/classroom/series/detail/' + item.id)"/>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data() {
      return {
        list: [], // 单课程列表
        space: {}, // 个人信息
        page: 1,
        type: this.$route.params.type,
        loading: false
      }
    },
    created() {
      this.getSpaceDetail()
    },
    methods: {
      getSpaceDetail() {
        let vm = this
        vm.API.anchorSpace().then((res) => {
          if (res) {
            let space = res.space
            space.fans = res.fansCount;
            vm.space = space
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      handleUpdateTitle() {
        let vm = this;
        this.$messagebox.prompt('空间名称', '').then(({value}) => {
          vm.API.anchorUpdateSpace({space_name: value}).then((res) => {
            if (res) {
              vm.$toast('操作成功');
              vm.space.title = value;
            }
          });
        });
      },
      loadMore() {
        this.loading = true
        this.API.anchorSeries(this.type, this.page).then((res) => {
          if (res._items.length > 0) {
            this.list = this.list.concat(res._items)
            if (res._meta.pageCount > this.page) {
              this.page++
              this.loading = false
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
  @import "../../../../styles/mixin";

  .btn-more {
    display: block;
    line-height: .9rem;
    text-align: center;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    color: $color-black;
  }

  .author-wp, .g-list-wp {
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
</style>
