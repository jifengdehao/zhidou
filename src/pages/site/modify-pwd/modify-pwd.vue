/**
* @author zhangwenlong
* @date 2018/4/18
* @Description: 修改密码
*/
<template>
  <div class="form-wp">
    <mt-field type="tel" label="手机号" placeholder="请输入手机号" v-model.trim="params.mobile" disabled>
      <span class="check-code" :class="{'disabled': countdown}" @click="sendCheckCode">
        {{ countdown ? countdown + 's' : '获取验证码' }}
      </span>
    </mt-field>
    <mt-field type="number" label="验证码" placeholder="请输入验证码" v-model.trim="params.sms_code"></mt-field>
    <mt-field type="password" label="密码" placeholder="请输入6-18位密码"
              v-model.trim="params.password"></mt-field>
    <mt-field type="password" label="密码确认" placeholder="请再次输入6-18位密码"
              v-model.trim="params.verifyPassword"></mt-field>
    <mt-button class="btn-submit" type="primary" @click="handleSubmit" @keyup.enter.native="handleSubmit">提交</mt-button>
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
          verifyPassword: '',
          sms_code: '',
        },
        countdown: 0,
        timer: null
      };
    },
    created(){
      this.params.mobile = JSON.parse(sessionStorage.getItem('user')).mobile
    },
    methods: {
      sendCheckCode() {
        const vm = this;
        if (!this.countdown) {
          this.API.resetPasswordVerifyMobile().then((res) => {
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
      },
      handleSubmit() {
        let vm = this;
        let message = '';
        const params = this.params;
        const mobile = this.$trim(params.mobile);
        const smsCode = this.$trim(params.sms_code);
        const password = this.$trim(params.password);
        const verifyPassword = this.$trim(params.verifyPassword);

        if (!smsCode) {
          message = '请输入验证码';
        } else if (!/^\d{6,7}$/.test(smsCode)) {
          message = '验证码格式不正确';
        } else if (!password || password.length < 6) {
          message = '请输入至少6位数的密码';
        } else if (!verifyPassword) {
          message = '请再次输入密码';
        } else if (password !== verifyPassword) {
          message = '两次输入的密码不一致';
        }

        if (message) {
          this.$toast(message);
          return;
        }

        this.API.resetPwd(params).then((res) => {
          if (res) {
            this.$toast('密码修改成功')
            setTimeout(() => {
              vm.$router.back()
            }, 3000);
          }
        }).catch((err) => {
          this.$toast(err.message);
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../styles/login.scss";
</style>
