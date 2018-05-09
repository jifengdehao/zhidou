/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 系列课-课时列表
*/
<template>
  <div class="scroll-bd">
    <div class="g-list-wp"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <course-item :item="item" v-for="(item,index) in periodList" :key="index"
                   type="classroomPeriod"
                   @click.native="$router.push('/classroom/series/period/'+item.id)"/>
      <!--  <a href="javascript:void(0)" class="btn-more">展开全部</a>-->
    </div>
   <!-- <div class="bd tac" v-else>暂无课程</div>-->
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: this.$route.params.id, // 系列课Id
        periodList: [], // 系列课的课时列表
        page: 1,
        loading: false
      };
    },
    created() {
      // 获取课时
      // this.getPeriodList(this.id, this.page)
    },
    methods: {
      // 获取系列课 - 课时列表
      getPeriodList(id, page) {
        this.API.coursePeriodList(id, page).then(res => {
          if (res._items && res._items.length > 0) {
            console.log(res)
            this.periodList = this.periodList.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getPeriodList(id, page)
            }
          }
        });
      },
      loadMore() {
        this.loading = true
        this.API.coursePeriodList(this.id, this.page).then(res => {
          if (res._items.length > 0) {
            console.log(res)
            this.periodList = this.periodList.concat(res._items)
            if (res._meta.pageCount > this.page) {
              this.page++
              this.loading = false
            }
          }
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

  .g-list-wp {
    background-repeat: no-repeat;
    background-image: linear-gradient(180deg, $color-border, $color-border 50%, transparent 50%);
    background-size: 120% .02rem;
  }
</style>
