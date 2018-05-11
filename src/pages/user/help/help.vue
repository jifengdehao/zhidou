/**
* @author zhangwenlong
* @date 2018/4/9
* @Description: 说明文档
*/
<template>
  <scroll class="page-wp" :data="list">
    <div>
      <ul>
        <li class="help-item" :class="{active: activeIndex == index }"
            v-for="(item, index) in list" :key="index">
          <div class="hd" @click="handleClick(index)">
            <h3 class="q">Q: {{ item.question }} {{ item.active }}</h3>
          </div>
          <div class="bd">
            <span>A:</span>
            <p v-html="item.answer"></p>
          </div>
        </li>
      </ul>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </scroll>
</template>

<script>
  import Scroll from '@/components/scroll/scroll'

  export default {
    name: 'Help',
    components: {
      Scroll
    },
    data() {
      return {
        activeIndex: -1,
        list: [
          {
            question: '智豆有什么用?',
            answer: '智豆是在线教育平台通用数字货币，目前可用于知了TV购买课程、兑换礼品、第三方平台转账交易等.',
          },
          {
            question: '如何获取智豆？',
            answer: '注册送：注册成功获赠智豆；<br/>邀请送：老用户成功邀请新用户完成注册获赠智豆；<br/>学习送：在平台学习获赠智豆；<br/>授课送：主播授课，根据他的学生听课赚取的智豆总数；<br/>返佣送：主播享有用户学习其课程所赚取智豆总数的一定比例返佣.'
          },
          /*{
            question: '平台的邀请返佣机制是什么样的？',
            answer: '邀请好友获取智豆；主播授课，根据他的学生听课赚取的智豆总数，平台会按照一定比例返佣',
          },*/
          {
            question: '如何成为主播?',
            answer: '点击“我的”——“一键创建直播间”，就可以开启你的主播之旅了'
          }
        ],
      };
    },
    methods: {
      handleClick(i) {
        if (i === this.activeIndex) {
          this.activeIndex = -1;
        } else {
          this.activeIndex = i;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin.scss";

  .page-wp {
    padding: .3rem .2rem;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }

  .help-item {
    margin-bottom: .3rem;
    background: $color-white;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, .15);
    &.active {
      .hd {
        &:after {
          transform: translateY(-50%) rotate(315deg);
        }
      }
      .bd {
        p {
          max-height: none;
        }
      }
    }
    .hd {
      position: relative;
      padding: .24rem 1rem .24rem .3rem;
      border-bottom: 1px solid $color-border;
      &:after {
        content: " ";
        top: 50%;
        right: 20px;
        position: absolute;
        width: 6px;
        height: 6px;
        border: solid 2px #c8c8cd;
        border-bottom-width: 0;
        border-left-width: 0;
        transform: translateY(-50%) rotate(135deg);
        transition: .5s all;
      }
      .q {
        color: $color-blue;
      }
    }
    .bd {
      position: relative;
      padding: .2rem .3rem .3rem .7rem;
      span {
        position: absolute;
        left: .3rem;
      }
      p {
        max-height: 4.5em;
        overflow: hidden;
        transition: .5s all;
      }
    }
  }

</style>
