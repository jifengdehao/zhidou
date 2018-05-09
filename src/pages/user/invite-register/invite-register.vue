<template>
  <div class="page-wp invite-register">
    <img src="./bg-two.png" width="100%"/>
    <form class="register-form">
      <div class="form-group">
        <label class="lable">手机号</label>
        <div class="input-wrapper">
          <input type="text" placeholder="请输入手机号" class="input" v-model.trim="params.mobile"/>
          <button type="button" class="btn">
          <span class="check-code" :class="{'disabled': countdown}" @click="sendCheckCode">
            {{ countdown ? countdown + 's' : '获取验证码' }}
          </span>
          </button>
        </div>
      </div>
      <div class="form-group">
        <label class="lable">验证码</label>
        <input type="text" placeholder="请输入验证码" class="input" v-model.trim="params.sms_code"/>
      </div>
      <div class="form-group">
        <label class="lable">密码</label>
        <input type="password" placeholder="请输入密码" class="input" v-model.trim="params.password"/>
      </div>
      <div class="form-group">
        <label class="lable">邀请码</label>
        <input type="text" placeholder="请输入邀请码" class="input" v-model.trim="params.invite_code"/>
      </div>
    </form>
    <div class="desc">
      <div class="title">
        <img src="./icon-line-left.png" width="40%"/>&nbsp;&nbsp;知了TV&nbsp;&nbsp;<img src="./icon-line-right.png"
                                                                                      width="40%"/>
      </div>
      <p class="p">知了TV是全球首个智豆教育链的在线教育社区，用户可通过学习、授课赚取的数字资产智豆，共享社区利益</p>
    </div>
    <div class="scroll-ft">
      <mt-button type="primary" @click="handleSubmit" size="large" class="btn-register">注册</mt-button>
    </div>
  </div>
</template>

<script>
  import {isMobile} from '@/common/util.js';

  export default {
    name: "invite-register",
    data() {
      return {
        countdown: 0,
        params: {
          mobile: '', // 手机号
          sms_code: '', // 验证码
          password: '',// 密码
          invite_code: this.$route.query.invite_code,
        }
      }
    },
    created() {
      console.log(this.params.invite_code)
    },
    methods: {
      handleSubmit() {
        let vm = this;
        let message = '';
        const params = this.params;
        if (!params.mobile) {
          message = '请输入手机号';
        } else if (!isMobile(params.mobile)) {
          message = '手机号格式不正确';
        } else if (!params.sms_code) {
          message = '请输入验证码';
        } else if (!/^\d{6,7}$/.test(params.sms_code)) {
          message = '验证码格式不正确';
        } else if (!params.password || params.password.length < 6) {
          message = '请输入至少6位数的密码';
        }
        if (message) {
          this.$toast(message);
          return;
        }
        console.log(params)
        this.API.register(params).then((res) => {
          if (res.is_first_login) {
            setTimeout(() => {
              vm.$router.push('/user/register/success?bean=' + res.gain);
            }, 2000);
          } else {
            setTimeout(() => {
              vm.$router.push('/index');
            }, 2000);
          }
        }).catch((err) => {
          console.log(err);
        });
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .invite-register {
    .register-form {
      padding: .2rem .2rem .6rem .2rem;
      .form-group {
        height: .9rem;
        margin-bottom: .2rem;
        line-height: .9rem;
        display: flex;
        background-color: #ffffff;
        padding: 0 .2rem;
        border-radius: 4px;
        .lable {
          width: 1.2rem;
          flex: 0 0 1.2rem;
          text-align: right;
          padding-right: .2rem;
        }
        .input-wrapper{
          flex: 1;
          display: flex;
        }
        .input {
          flex: 1;
          height: .7rem;
          margin: .1rem 0;
          border: none;
          font-size: .28rem;
          padding-right: .2rem;
        }
        .btn {
          flex: 0 0 1.7rem;
          border: 1px solid #1772fA;
          background-color: #ffffff;
          height: .7rem;
          line-height: .7rem;
          margin: .1rem 0;
          color: #1772fA;
          font-size: .28rem;
          border-radius: 10px;
        }
      }
    }
    .desc {
      margin: 0 .2rem;
      .title, .p {
        text-align: center;
        color: #666;
      }
      .p {
        margin-top: .2rem;
        padding: 0 .2rem;
        font-size: .24rem;
      }
    }
    .btn-register {
      background: linear-gradient(left, #447cff, #1aa3ff) no-repeat !important;
    }
  }
</style>
