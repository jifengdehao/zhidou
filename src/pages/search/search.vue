/**
* @author zhangwenlong
* @date 2018/4/4
* @Description:搜索页
*/
<template>
  <scroll class="scroll-bd" :data="set || single">
    <div>
      <div class="mint-search">
        <div class="mint-searchbar">
          <div class="mint-searchbar-inner">
            <i class="mintui mintui-search"></i>
            <input type="search" placeholder="搜索话题/系列课/直播课" class="mint-searchbar-core" v-model.trim="search"
                   @keyup.enter="searchR" autofocus="autofocus" v-focus ref="input"/>
          </div>
          <a class="mint-searchbar-cancel" v-show="search" @click="searchR">搜索</a>
        </div>
      </div>
      <div class="g-list-wp mt20" v-if="set.length>0 || single.length>0">
        <div v-if="set.length>0">
          <mt-cell title="系列课"></mt-cell>
          <course-item v-for="(item, key) in set" :key="key" :item="item" type="index"
                       @click.native="navTo(item)"/>
        </div>
        <div v-if="single.length>0">
          <mt-cell title="单课程"></mt-cell>
          <course-item v-for="(item, key) in single" :key="key" :item="item" type="index"
                       @click.native="navTo(item)"/>
        </div>
      </div>
      <div class="tac" style="padding: .5rem;" v-else>没有查询到结果~</div>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </scroll>
</template>

<script>
  import Scroll from '@/components/scroll/scroll'

  const DEBOUNCE_TIME = 400
  export default {
    name: "search",
    components: {
      Scroll
    },
    data() {
      return {
        search: '', // 搜索词
        set: [], // 系列课
        single: [], // 单课
        tId: null
      }
    },
    mounted() {
      this.$refs['input'].focus()
    },
    methods: {
      searchR() {
        if (this.search) {
          window.clearTimeout(this.tId)
          this.tId = window.setTimeout(() => {
            this.API.searchResult({con: this.search}).then((res) => {
              console.log(res)
              this.set = res.set
              this.single = res.single
            }).catch((err) => {
              console.log(err)
            })
          }, DEBOUNCE_TIME)
        }
      },
      navTo(item) {
        console.log(item)
        // item.type 1系列课程 0单次课程
        this.$router.push('/course/detail/' + item.id)
      }
    }
  }
</script>
