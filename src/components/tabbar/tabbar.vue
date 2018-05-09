<template>
  <div class="tabbar-wrap">
    <ul class="tabbar">
      <li>
        <router-link class="item item-home" to="/index" exact>主页</router-link>
      </li>
      <li>
        <router-link class="item item-course" to="/user/course" exact>我的课程</router-link>
      </li>
      <li>
        <router-link class="item item-user" to="/user" exact>我的</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'tabbar'
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .tabbar-wrap {
    position: fixed;
    bottom: 0;
    left: 50%;
    z-index: 1;
    margin-left: -3.75rem;
    width: 7.5rem;
    height: 1rem;
    background-color: #f7f9fa;
    background-image: linear-gradient(0deg, #edeff0, #edeff0 50%, transparent 50%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: top;
  }

  .tabbar {
    display: flex;
    li {
      flex: 1;
    }
    .item {
      display: block;
      height: 1rem;
      text-align: center;
      color: #949ea7;
      font-size: .24rem;
      &:before {
        display: block;
        margin: .12rem auto .08rem;
        width: .40rem;
        height: .40rem;
        content: "";
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }
      &.router-link-active {
        color: $color-blue;
        &.item-home {
          &:before {
            background-image: url(./images/home-active.png);
          }
        }
        &.item-course {
          &:before {
            background-image: url(./images/course-active.png);
          }
        }
        &.item-user {
          &:before {
            background-image: url(./images/user-active.png);
          }
        }
      }
      &.item-home {
        &:before {
          background-image: url(./images/home.png);
        }
      }
      &.item-course {
        &:before {
          background-image: url(./images/course.png);
        }
      }
      &.item-user {
        &:before {
          background-image: url(./images/user.png);
        }
      }
    }
  }
</style>
