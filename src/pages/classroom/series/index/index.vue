/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 系列课列表
*/
<template>
  <div>
    <div class="scroll-bd">
      <div class="author-wp mt20">
        <div class="author-hd">
          <img :src="space.avatar || $root.placeHolder.avatar" :alt="space.title">
        </div>
        <div class="author-bd">
          <p>{{ space.title }}</p>
          <p class="fs12 gray">{{ space.fans }}人关注</p>
        </div>
        <div class="author-ft">
          <a class="btn-edit" href="javascript:void(0)" @click="handleUpdateTitle">编辑</a>
          <!-- <a class="btn btn-follow" href="#">关注</a> -->
        </div>
      </div>
      <div class="g-list-wp mt20"
           v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
        <course-item :item="item" v-for="(item,index) in list" :key="index" type="classroomSeries"
                     @click.native="$router.push('/classroom/series/detail/' + item.id)"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data() {
      return {
        list: [], // 系列课列表
        space: {}, // 个人信息
        page: 1,
        loading: false
      }
    },
    created() {
      let vm = this
      vm.API.anchorSpace().then((res) => {
        if (res) {
          console.log(res)
          let space = res.space
          space.fans = res.fansCount;
          vm.space = space

        }
      })
    },
    methods: {
      handleUpdateTitle() {
        let vm = this;
        this.$messagebox.prompt('空间名称', '').then(({value}) => {
          vm.API.anchorUpdateSpace({space_name: value}).then((res) => {
            if (res) {
              console.log(res)
              vm.$toast('操作成功');
              vm.space.title = value;
            }
          });
        });
      },
      loadMore() {
        this.loading = true
        let vm = this
        vm.API.anchorSeries(1, vm.page).then((res) => {
          if (res._items.length > 0) {
            console.log(res)
            vm.list = vm.list.concat(res._items)
            if (res._meta.pageCount > vm.page) {
              vm.page++
              vm.loading = false
            }
          }
        }).catch((err)=>{
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
    .author-ft {
    }
  }

  .g-list-wp {
    background-repeat: no-repeat;
    background-image: linear-gradient(180deg, $color-border, $color-border 50%, transparent 50%);
    background-size: 120% .02rem;
  }
</style>
