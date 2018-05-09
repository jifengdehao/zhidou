/**
* @author zhangwenlong
* @date 2018/3/30
* @Description: 我的课程
*/
<template>
  <div class="scroll-wp">
      <scroll class="scroll-bd" :data="list">
        <div>
          <ul v-if="list.length>0">
            <course-item v-for="(item, key) in list" :key="key"
                         :item="item" type="index" @click.native="navTo(item)"/>
          </ul>
          <Empty v-else text="暂无课程" class="mt30"/>
        </div>
      </scroll>
    <Tabbar/>
  </div>
</template>

<script>
  import Tabbar from '@/components/tabbar/tabbar'
  import Scroll from '@/components/scroll/scroll'

  export default {
    name: 'Course',
    data() {
      return {
        list: [], // 我的课程
      };
    },
    components: {
      Tabbar,
      Scroll
    },
    created() {
      this.getUserCourse()
    },
    methods: {
      // 跳转
      navTo(item) {
        // item.type 1系列课程 0单次课程
        if (item.hasOwnProperty('status')) {
          if (item.status == 1) {
            if (item.course_type == 0) {
              this.$router.push('/course/teach/' + item.period_id)
            } else {
              this.$router.push('/course/detail/' + item.id)
            }
          }
        }
      },
      // 我的课程
      getUserCourse() {
        this.API.userCourse().then((res) => {
          if (res && res.length > 0) {
            this.list = res
          }
        }).catch((err) => {
          console.log(err)
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin.scss";

  .scroll-bd {
    background: $color-white;
  }
</style>
