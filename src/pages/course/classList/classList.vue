/**
* @author zhangwenlong
* @date 2018/4/4
* @Description: 主播系列课列表和主播单课程列表
*/
<template>
  <scroll class="scroll-bd" :data="list" @scroll="scroll" :listenScroll="true" style="overflow: hidden;">
    <div>
      <div class="g-list-wp">
        <div v-if="type == 1">
          <course-item :item="item" v-for="(item,index) in list" :key="index" type="classroomSeries"
                       @click.native="$router.push('/course/detail/' + item.id)"/>
        </div>
        <div v-else-if="type == 0">
          <course-item :item="item" v-for="(item,index) in list" :key="index" type="classroom"
                       @click.native="$router.push('/course/detail/' + item.id)"/>
        </div>
      </div>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </scroll>
</template>

<script>
  import Scroll from '@/components/scroll/scroll'

  export default {
    name: 'classList',
    components: {
      Scroll
    },
    data() {
      return {
        id: this.$route.params.id,
        type: this.$route.params.type,
        list: [],
        page: 1,
        pageCount: 1,
        loading: false
      }
    },
    created() {
      this.loadMore(this.page)
    },
    methods: {
      scroll() {
        if(this.pageCount > this.page){
          this.page++
          this.API.courseList({course_type: this.type, id: this.id, page: this.page}).then((res) => {
            console.log(res)
            this.list = this.list.concat(res._items)
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      loadMore(page) {
        this.API.courseList({course_type: this.type, id: this.id, page: page}).then((res) => {
          console.log(res)
          this.list = res._items
          this.pageCount = res._meta.pageCount
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>

</style>
