/**
* @author zhangwenlong
* @date 2018/4/9
* @Description: 微信授权登录
*/
<template></template>

<script>
  export default {
    name: "oauth",
    data() {
      return {
        goto: '' // 链接
      }
    },
    created() {
      if (this.$route.query.goto) {
        this.goto = this.$route.query.goto
      } else {
        this.goto = ''
      }
      console.log(this.goto)
      this.oauth()
    },
    methods: {
      //判断是否微信登陆 是不是微信浏览器
      isWeiXin() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true;
        } else {
          return false;
        }
      },
      oauth() {
        if (this.isWeiXin()) {
          let host
          if (/www\.zhiliaotv\.com/.test(location.host)) {
            host = 'www.zhiliaotv.com'
          } else {
            host = 'dev.zhiliaotv.com'
          }
          // http://dev.zhiliaotv.com/auth-login/mpweixin
          let webUrl = 'http://' + host + '/auth-login/mpweixin?goto=' + this.goto
          window.location.href = webUrl
        } else {
          this.$router.push('/login?goto=' + this.goto)
        }
      }
    }
  }
</script>

<style scoped>

</style>
