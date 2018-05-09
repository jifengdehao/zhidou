<template>
  <a class="course-item" v-if="type == 'index'">
    <img class="course-cover" v-lazy="item.img || $root.placeHolder.cover" :alt="item.title">
    <div class="course-info">
      <div class="info-bd">
        <h3 class="tit">{{ item.title }}</h3>
        <p class="gray fs12">{{ item.author }}<span v-show="item.type === 1"> | 共{{ item.period_count || 0 }}节课</span>
        </p>
      </div>
      <div class="info-ft">
        <span class="gray fs12" v-if="studyCount(item)">{{ item.study_count }}&nbsp;次学习</span>
        <span class="gray fs12" v-if="item.recent_learn_time">上次学习&nbsp;{{item.recent_learn_time | formatDate}}</span>
        <span v-if="learning(item)" class="red">已学&nbsp;{{item.learn_percentage}}%</span>
        <template v-if="!item.my_course">
          <strong class="red fs15" v-if="item.pay_type == 2">{{item.price}}个豆</strong>
          <strong class="red fs15" v-if="item.pay_type == 1">¥{{ item.price }}</strong>
          <strong class="green fs15" v-else-if="item.pay_type == 3">加密</strong>
          <strong class="green fs15" v-if="item.pay_type == 0">免费</strong>
        </template>
      </div>
      <!-- <div class="class-status green" v-if="item.status ==1">审核通过</div>-->
      <div class="class-status green" v-if="examine(item)">审核中</div>
    </div>
  </a>
  <a class="course-item" v-else-if="type == 'classroom' || type == 'classroomSeries' || type == 'classroomPeriod'">
    <img class="course-cover" v-lazy="item.img || $root.placeHolder.cover" :alt="item.title">
    <div class="course-info">
      <div class="info-bd">
        <h3 class="tit">{{ item.title }}</h3>
        <p class="gray fs12" v-if="type == 'classroomSeries'">已开课{{ item.period_count || 0 }}节 | 预计更新{{
          item.plan_period_count || 0 }}节课</p>
        <p class="gray fs12" v-else-if="type == 'classroomPeriod'">{{ item.times | formatDate }}</p>
      </div>
      <div class="info-ft">
        <span class="gray fs12">{{ item.study_count }}次学习</span>
        <template v-if="type != 'classroomPeriod'">
          <strong class="red fs15" v-if="item.pay_type == 2">{{item.price}}个豆</strong>
          <strong class="red fs15" v-if="item.pay_type == 1">¥{{ item.price }}</strong>
          <strong class="green fs15" v-else-if="item.pay_type == 3">加密</strong>
          <strong class="green fs15" v-if="item.pay_type == 0">免费</strong>
        </template>
        <span v-else></span>
      </div>
    </div>
  </a>
  <a class="course-item" v-else>
    <img class="course-cover" :src="$root.placeHolder.cover" alt="">
    <div class="course-info">
      <div class="info-bd">
        <h3 class="tit">销售必备技巧：如何在10分钟内打动客户，成交生意</h3>
        <p class="gray fs12">西瓜学院 | 共3节课</p>
      </div>
      <div class="info-ft">
        <span class="gray fs12">1.6万次学习</span>
        <strong class="red fs15">¥16</strong>
      </div>
    </div>
  </a>
</template>

<script>
  export default {
    name: 'courseItem',
    props: {
      item: {
        type: Object,
      },
      type: {
        type: String,
      },
    },
    methods: {
      examine(item) {
        if (item.hasOwnProperty('status')) {
          if (item.status == 1) {
            return false
          } else {
            return true
          }
        }
      },
      learning(item) {
        if (item.hasOwnProperty('learn_percentage')) {
          return true
        }
      },
      studyCount(item) {
        if (item.hasOwnProperty('study_count')) {
          return true
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .course-item {
    position: relative;
    .class-status {
      position: absolute;
      right: .24rem;
      top: .8rem;
      font-weight: bold;
    }
  }
</style>
