/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 主播简介
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="intro-wp mt20">
        <textarea  v-model="intro" placeholder="请填写直播间简介"></textarea>
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="default" @click="$router.back()">取消</mt-button>
      <mt-button type="primary" @click="handleSubmit">确定</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        intro: '',//简介
        introduction: ''
      };
    },
    created() {
      this.API.anchorSpace().then((res) => {
        if (res) {
          this.intro = res.space.intro;
        }
      });
    },
    methods: {
      handleSubmit() {
        let vm = this
        let params = {
          intro: vm.intro.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,'')
        }
        console.log(params)
        vm.API.anchorUpdateSpace(params).then((res) => {
          if (res) {
            vm.$toast('操作成功');
            setTimeout(() => {
              vm.$router.push('/classroom')
            }, 2000);
          }
        });
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .intro-wp {
    width: 100%;
    background: $color-white;
    border: .01rem solid $color-border;
    border-width: .01rem 0;
    padding: 5px;
    textarea {
      display: block;
      width: 100%;
      height: 2.4rem;
      padding: 0 .2rem;
      resize: none;
      border: 0;
      outline: 0;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
  }
</style>
