<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App'
  };
</script>

<style lang="scss">
  @import "./styles/common.scss";
  @import "./styles/mint.scss";
  @import "./styles/course-item.scss";
  @import "./styles/upload-item.scss";

  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }

  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
</style>
