/**
* @author zhangwenlong
* @date 2018/5/10
* @Description: 赚取智豆
*/
<template>
  <div class="page-wp earn" style="padding: .2rem;">
    <h3 class="tac title">方式一</h3>
    <router-link to="/invite">
      <img src="./earn-01.png" width="100%"/>
    </router-link>
    <h3 class="tac title">方式二</h3>
    <router-link to="/">
      <img src="./earn-02.png" width="100%"/>
    </router-link>
    <h3 class="tac title">方式三</h3>
    <router-link to="/register">
      <img src="./earn-03.png" width="100%"/>
    </router-link>
    <h3 class="tac title">方式四</h3>
    <img src="./earn-04.png" width="100%"/>
    <h3 class="tac title">方式五</h3>
    <img src="./earn-05.png" width="100%"/>
	<router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    name: "earn-bean"
  }
</script>

<style scoped lang="scss">
  .earn {
    overflow-y: scroll;
    .title {
      font-size: .32rem;
      margin: .2rem 0;
    }
  }
</style>
