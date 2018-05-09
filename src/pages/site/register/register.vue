<template>
  <div class="form-wp" style="padding: 0 0 .8rem 0;">
    <img src="./bg-two.png" width="100%"/>
    <mt-field type="tel" label="手机号" placeholder="请输入手机号" v-model="params.mobile">
      <span class="check-code" :class="{'disabled': countdown}" @click="sendCheckCode">
        {{ countdown ? countdown + 's' : '获取验证码' }}
      </span>
    </mt-field>
    <mt-field type="number" label="验证码" placeholder="请输入验证码" v-model="params.sms_code"></mt-field>
    <mt-field type="password" label="密码" placeholder="请输入6-18位密码"
              v-model="params.password"></mt-field>
    <!--<mt-field type="password" label="密码确认" placeholder="请再次输入6-18位密码"
              v-model="params.password2"></mt-field>-->
    <!-- <mt-field type="text" label="邀请码" placeholder="选填" v-model="params.invite_code" id="invite-input"></mt-field>-->
    <a class="mint-cell mint-field">
      <div class="mint-cell-wrapper">
        <div class="mint-cell-title">
          <span class="mint-cell-text">邀请码</span>
        </div>
        <div class="mint-cell-value">
          <input placeholder="选填" type="text" class="mint-field-core" v-model="params.invite_code" id="invite-input">
        </div>
      </div>
    </a>
    <div class="form-link">
      <span @click="goToLogin">已有账号? 立即登录</span>
    </div>
    <mt-button class="btn-submit" type="primary" @click="handleSubmit" style="margin-top: 1rem;"
               @keyup.enter.native="handleSubmit">立即注册
    </mt-button>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import {isMobile} from '@/common/util.js';

  export default {
    data() {
      return {
        params: {
          mobile: '',
          password: '',
          sms_code: '',
          invite_code: this.$route.query.invite_code || localStorage.getItem('invite_code') || '' // 邀请码
        },
        countdown: 0,
        timer: null
      };
    },
    created() {
      if (this.params.invite_code) {
        localStorage.setItem('invite_code', this.params.invite_code)
      }
    },
    methods: {
      goToLogin() {
        if (this.isWeiXin()) {
          if (sessionStorage.getItem('code') && sessionStorage.getItem('type')) {
            this.$router.push('/login')
          } else {
            this.$router.push('/oauth')
          }
        } else {
          this.$router.push('/login')
        }
      },
      sendCheckCode() {
        const vm = this;
        const mobile = this.$trim(this.params.mobile);
        if (!this.countdown) {
          if (!isMobile(mobile)) {
            this.$toast('手机号格式不正确');
          } else {
            this.API.sendSmsVerifyCode(mobile).then((res) => {
              if (res.waitTime) {
                vm.countdown = res.waitTime;
                vm.timer = setInterval(() => {
                  vm.countdown -= 1;
                  if (vm.countdown < 1) {
                    clearInterval(vm.timer);
                  }
                }, 1000);
              } else {
                vm.$toast('获取验证码失败');
              }
            });
          }
        }
      },
      handleSubmit() {
        let vm = this;
        let message = '';
        const params = this.params;
        const mobile = this.$trim(params.mobile);
        const smsCode = this.$trim(params.sms_code);
        const password = this.$trim(params.password);

        if (!mobile) {
          message = '请输入手机号';
        } else if (!isMobile(mobile)) {
          message = '手机号格式不正确';
        } else if (!smsCode) {
          message = '请输入验证码';
        } else if (!/^\d{6,7}$/.test(smsCode)) {
          message = '验证码格式不正确';
        } else if (!password || password.length < 6) {
          message = '请输入至少6位数的密码';
        }

        if (message) {
          this.$toast(message);
          return;
        }
        if (this.isWeiXin() && sessionStorage.getItem('code') && sessionStorage.getItem('type')) {
          params.code = sessionStorage.getItem('code')
          params.type = sessionStorage.getItem('type')
          this.API.registerOuath(params).then((res) => {
            if (res) {
              console.log(res)
              this.$toast('注册成功')
              setTimeout(() => {
                vm.$router.push('/invite/success');
              }, 2000);
            }
          }).catch((err) => {
            console.log(err.message);
          });
        } else {
          this.API.register(params).then((res) => {
            if (res) {
              console.log(res)
              this.$toast('注册成功')
              setTimeout(() => {
                vm.$router.push('/invite/success');
              }, 2000);
            }
          }).catch((err) => {
            console.log(err.message);
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

  #invite-input {
    color: #666;
  }
</style>
