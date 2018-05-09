/**
* @author zhangwenlong
* @date 2018/3/30
* @Description: 创建直播间
*/
<template>
  <div class="wrap">
    <img class="banner" src="./images/banner.png" alt="再小的老师都有自己的讲台"/>
    <div class="form">
      <!--<mt-field label="手机号" placeholder="请输入手机号" v-model.trim="params.mobile">
        <span class="check-code" :class="{'disabled': countdown}" @click="sendCheckCode">
          {{countdown ? countdown + 's' : '获取验证码'}}
        </span>
      </mt-field>-->
      <mt-field label="手机号" placeholder="请输入手机号" v-model.trim="tel" disabled></mt-field>
      <mt-field label="验证码" placeholder="请输入验证码" v-model.trim="params.sms_code">
        <span class="check-code" :class="{'disabled': countdown}" @click="sendCheckCode">
          {{countdown ? countdown + 's' : '获取验证码'}}
        </span>
      </mt-field>
      <mt-field label="微信号" placeholder="请输入微信号" v-model.trim="params.wx_no"></mt-field>
    </div>
    <mt-cell class="mt10" title="选择直播间分类"
             :value="categoryActive.name || '未选择'"
             @click.native="categoryVisible = true"></mt-cell>
    <div class="intro">
      <h3>产品特点:</h3>
      <p>1.直播话题数量和听众人数均无上限。</p>
      <p>2.直播内容永久保存，可回看。</p>
      <p>3.产品基于区块链技术开发，上线产品内流通货币智豆，可通过学习获得，可用于购买课程和打赏。</p>
    </div>
    <mt-button class="btn-submit" type="primary" @click="handleSubmit">下一步</mt-button>
    <mt-actionsheet v-if="categoryList.length" :actions="categoryList" v-model="categoryVisible"></mt-actionsheet>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import {isMobile} from '@/common/util';

  export default {
    data() {
      return {
        params: {
          /*  mobile: '', // 手机号*/
          sms_code: '', // 验证码
          wx_no: '', // 微信号
          category_id: '', // 分类
        },
        tel: '',
        countdown: 0,
        timer: null,
        categoryActive: {}, // 当前的分类
        categoryList: [], // 分类
        categoryVisible: false, // 分类的显示和隐藏
      };
    },
    created() {
      let vm = this;
      this.API.spaceStyle().then((res) => {
        if (res.length) {
          let list = [];
          res.forEach((item) => {
            item.method = vm.onSelect;
            list.push(item);
          });
          this.categoryList = list;
        }
      }).catch((err) => {
        console.log(err)
      });
      vm.API.userBaseInfo().then((res) => {
        if (res) {
          console.log(res)
          this.tel = res.mobile
        }
      })
    },
    methods: {
      onSelect(item) {
        this.categoryActive = item;
        this.params.category_id = item.id;
      },
      sendCheckCode() {
        const vm = this;
        vm.API.spaceVerifyCode().then((res) => {
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
        }).catch((err) => {
          console.log(err)
        });
        /*
        const vm = this;
        const mobile = this.params.mobile;
        if (!this.countdown) {
          if (!isMobile(mobile)) {
            this.$toast('手机号格式不正确');
          } else {
            vm.API.spaceVerifyCode(mobile).then((res) => {
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
            }).catch((err) => {
              console.log(err)
            });
          }
        }
        */
      },
      handleSubmit() {
        let vm = this;
        let message = '';
        const params = this.params;
        /* const mobile = params.mobile;*/
        const smsCode = params.sms_code;
        const categoryId = params.category_id;
        const wxNo = params.wx_no;

        /* if (!mobile) {
           message = '请输入手机号';
         } else if (!isMobile(mobile)) {
           message = '手机号格式不正确';
         } else */
        if (!smsCode) {
          message = '请输入验证码';
        } else if (!/^\d{6,7}$/.test(smsCode)) {
          message = '验证码格式不正确';
        } else if (!wxNo) {
          message = '请输入微信号';
        } else if (!categoryId) {
          message = '请选择直播间分类';
        }

        if (message) {
          vm.$toast(message);
          return;
        }

        vm.API.generateSpace(params).then((res) => {
          console.log(res);
          if (res.isUserVerify == 0) {
            vm.$router.push('/user/auth');
          } else if (res.isUserVerify == 1) {
            vm.$toast('开通成功');
            setTimeout(() => {
              vm.$router.push('/user/');
            }, 3000);
          } else if (res.isUserVerify == 2) {
            // vm.$toast('身份认证不通过，请重新上传');
            vm.$router.push('/user/auth');
            /*
            setTimeout(() => {
              vm.$router.push('/user/auth');
            }, 3000);
            */
          } else if (res.is_verify == 3) {
            vm.$toast('身份认证中,请等待~');
            setTimeout(() => {
              vm.$router.push('/user');
            }, 3000);
          }
        }).catch((err) => {
          console.log(err)
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .banner {
    width: 7.5rem;
    height: 3rem;
  }

  .check-code {
    display: inline-block;
    width: 2rem;
    line-height: .7rem;
    text-align: center;
    font-size: .28rem;
    color: $color-white;
    background: $color-red;
    border-radius: .38rem;
    &.disabled {
      background: $color-gray;
    }
  }

  .intro {
    margin: .4rem .2rem;
    color: $color-gray;
    h3 {
      margin-bottom: .04rem;
    }
    p {
      font-size: .24rem;
    }
  }

  .btn-submit {
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -3.75rem;
    display: block;
    width: 7.5rem;
    border-radius: 0;
    background: linear-gradient(left, $color-blue-begin, $color-blue-end) no-repeat;
  }
</style>
