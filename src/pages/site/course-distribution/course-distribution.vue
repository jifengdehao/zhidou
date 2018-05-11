/**
* @author zhangwenlong
* @date 2018/5/10
* @Description: 课程分销
*/
<template>
  <scroll :data="list" class="page-wp distribution" style="overflow-y: hidden" ref="scroll" :listenScroll="true"
          @scroll="scroll">
    <div>
      <ul class="list">
        <router-link tag="li" class="item" v-for="(item,index) in list" :key="index"
                     :to="'/course/detail/'+item.id">
          <img v-lazy="item.img || $root.placeHolder.banner" width="100%" style="height:3rem;"/>
          <div class="content">
            <h3 v-html="formatTitle(item.title)" class="mt10"></h3>
            <div class="gray fs12 mt10">{{item.study_count}}&nbsp;&nbsp;次学习</div>
            <div class="content-bottom">
              <span class="price" v-if="item.pay_type === 1">¥{{item.price}}</span>
              <span class="price" v-if="item.pay_type === 2">{{item.price}}个豆</span>
              <button type="button" class="btn-price" v-if="item.pay_type === 1">赚¥{{item.gain_price}}</button>
              <button type="button" class="btn-price" v-if="item.pay_type === 2">赚{{item.gain_price}}个豆</button>
            </div>
          </div>
        </router-link>
      </ul>
    </div>
  </scroll>
  <!--<div class="page-wp distribution">
    <ul class="list">
      <li class="item">
        <img src="../../../assets/course_default.png" width="100%" height="120"/>
        <div class="content">
          <h3>销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售</h3>
          <div class="gray fs12 mt10">1.6万&nbsp;&nbsp;次学习</div>
          <div class="content-bottom">
            <span class="price">¥50.00</span>
            <button type="button" class="btn-price">赚¥10.03</button>
          </div>
        </div>
      </li>
      <li class="item">
        <img src="../../../assets/course_default.png" width="100%" height="120"/>
        <div class="content">
          <h3>销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售销售</h3>
          <div class="gray fs12 mt10">1.6万&nbsp;&nbsp;次学习</div>
          <div class="content-bottom">
            <span class="price">¥50.00</span>
            <button type="button" class="btn-price">赚¥10.03</button>
          </div>
        </div>
      </li>
    </ul>
  </div>-->
</template>

<script>
  import Scroll from '@/components/scroll/scroll'

  export default {
    components: {
      Scroll
    },
    name: "course-distribution",
    data() {
      return {
        list: [],
        page: 1,
        pageCount: 1
      }
    },
    created() {
      this.API.getDistribution({page: this.page}).then((res) => {
        if (res._items.length > 0) {
          console.log(res)
          this.list = res._items
          this.pageCount = res._meta.pageCount
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    methods: {
      formatTitle(s) {
        if (s) {
          return s.replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      scroll() {
        if (this.pageCount > this.page) {
          this.page++
          this.API.getDistribution({page: this.page}).then((res) => {
            if (res._items.length > 0) {
              this.list = this.list.concat(res._items)
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .distribution {
    .list {
      padding: .2rem;
      .item {
        background-color: #ffffff;
        border-radius: 4px;
        padding: .2rem;
        margin-bottom: .3rem;
        .content-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: .1rem;
          .price {
            color: #fb5a44;
          }
          .btn-price {
            color: #fb5a44;
            border: 1px solid #fe5040;
            background-color: #ffffff;
            padding: .05rem .15rem;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
