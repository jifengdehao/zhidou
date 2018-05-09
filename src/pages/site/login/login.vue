<template>
  <div class="form-wp">
    <mt-field type="tel" label="手机号" placeholder="请输入手机号" v-model.trim="params.account"></mt-field>
    <mt-field type="password" label="密码" placeholder="请输入密码" v-model.trim="params.password"></mt-field>

    <div class="form-link form-link-between">
      <router-link to="/find-pwd">忘记密码</router-link>
      <router-link to="/register">还没账号？立即注册</router-link>
    </div>

    <mt-button class="btn-submit" type="primary" @click="handleSubmit" @keyup.enter.native="handleSubmit">登录</mt-button>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import {isMobile} from '@/common/util.js';
  import Cookie from 'js-cookie';

  export default {
    data() {
      return {
        params: {
          account: '',
          password: ''
        },
        type: this.$route.query.type,
        code: this.$route.query.code
      };
    },
    created() {
      if (this.type) {
        sessionStorage.setItem('type', this.type)
      } else {
        this.type = sessionStorage.getItem('type')
      }
      if (this.code) {
        sessionStorage.setItem('code', this.code)
      } else {
        this.code = sessionStorage.getItem('code')
      }
      // 监听返回事件 默认返回首页
      let vm = this
      window.addEventListener("popstate", function () {
        vm.$router.push('/')
      })
    },
    mounted() {
      if (this.isWeiXin()) {
        if (sessionStorage.getItem('code') && sessionStorage.getItem('type')) {
          this.$router.push('/login')
        } else {
          this.$router.push('/oauth')
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(to)
      let isLogin
      //let isLogin = Cookie.get('__zdb_dev__')  // 验证是否已经登录
      if (/www\.zhiliaotv\.com/.test(location.host)) {
        isLogin = Cookie.get('__zlt_js__')
      } else {
        isLogin = Cookie.get('__zdb_dev_js__')
      }
      console.log(isLogin)
      if (isLogin) {
        next('/index')
        return false
      }
      next()
    },
    methods: {
      handleSubmit() {
        let vm = this;
        let message = '';
        const params = this.params;
        const account = params.account;
        const password = params.password;

        if (!account) {
          message = '请输入手机号';
        } else if (!isMobile(account)) {
          message = '手机号格式不正确';
        } else if (!password || password.length < 6) {
          message = '请输入至少6位数的密码';
        }

        if (message) {
          this.$toast(message);
          return;
        }
        if (this.isWeiXin() && this.type && this.code) {
          /*if (this.type) {
            params.type = this.type
          } else {
            params.type = sessionStorage.getItem('type')
          }
          if (this.code) {
            params.code = this.code
          } else {
            params.code = sessionStorage.getItem('code')
          }*/
          params.type = this.type
          params.code = this.code
          this.API.loginOauth(params).then((res) => {
            if (res) {
              this.$toast('登录成功');
              setTimeout(() => {
                vm.$router.push('/index');
              }, 2000);
            }
          }).catch((err) => {
            console.log(err);
          });
        } else {
          this.API.login(params).then((res) => {
            if (res) {
              this.$toast('登录成功');
              setTimeout(() => {
                vm.$router.push('/index');
              }, 2000);
            }
          }).catch((err) => {
            console.log(err);
          });
        }
      },
      //判断是否微信登陆 是不是微信浏览器
      isWeiXin() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true;
        } else {
          return false;
        }
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../styles/login.scss";
</style>
