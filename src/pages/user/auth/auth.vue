/**
* @author zhangwenlong
* @date 2018/3/30
* @Description: 实名认证
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="tips">温馨提示：实名认证通过之后的用户才能上传课程和提现哦！</div>
      <div class="tips error" v-if="userInfo.is_verify === 2">审核不通过，请重新认证</div>
      <div class="tips error" v-if="userInfo.is_verify === 0">未认证</div>
      <div class="tips error" v-if="userInfo.is_verify === 1">审核通过</div>
      <div class="form mt20">
        <!-- <mt-field label="手机号" placeholder="请输入手机号" v-model="mobile">
          <span class="check-code" :class="{'disabled': countdown}" @click="getCheckCode">
            {{countdown ? countdown + 's' : '获取验证码'}}
          </span>
        </mt-field>
        <mt-field label="验证码" placeholder="请输入验证码" v-model="checkcode"></mt-field>
        <mt-field label="微信号" placeholder="请输入微信号" v-model="weixin"></mt-field> -->
        <mt-field label="姓名" placeholder="请输入姓名" v-model.trim="params.real_name"></mt-field>
        <mt-field label="身份证号" placeholder="请输入身份证号" v-model.trim="params.card_no"></mt-field>
      </div>

      <div class="upload">
        <div class="hd">
          <h3>身份证正面</h3>
          <img v-show="uploadFront.data" @click="uploadFront.data = ''" src="../../../assets/icon-delete.png" alt="删除">
        </div>
        <div class="bd" v-if="uploadFront.data">
          <img :src="uploadFront.data.url" alt="身份证正面">
        </div>
        <div class="bd" v-else>
          <upload-image class="upload-wp"
                        :apiMethod="uploadFront.methodName"
                        :params="uploadFront.params"
                        :success="uploadFront.success">
            <p class="mt20">点击上传身份证正面</p>
          </upload-image>
        </div>
      </div>

      <div class="upload">
        <div class="hd">
          <h3>身份证反面</h3>
          <img v-show="uploadBack.data" @click="uploadBack.data = ''" src="../../../assets/icon-delete.png" alt="删除">
        </div>
        <div class="bd" v-if="uploadBack.data">
          <img :src="uploadBack.data.url" alt="身份证反面">
        </div>
        <div class="bd" v-else>
          <upload-image class="upload-wp"
                        :apiMethod="uploadBack.methodName"
                        :params="uploadBack.params"
                        :success="uploadBack.success">
            <p class="mt20">点击上传身份证反面</p>
          </upload-image>
        </div>
      </div>

      <div class="upload">
        <div class="hd">
          <h3>手持身份证照片</h3>
          <img v-show="uploadWhole.data" @click="uploadWhole.data = ''" src="../../../assets/icon-delete.png" alt="删除">
        </div>
        <div class="bd" v-if="uploadWhole.data">
          <img :src="uploadWhole.data.url" alt="手持身份证照片">
        </div>
        <div class="bd" v-else>
          <upload-image class="upload-wp"
                        :apiMethod="uploadWhole.methodName"
                        :params="uploadWhole.params"
                        :success="uploadWhole.success">
            <p class="mt20">点击上传手持身份证照片</p>
          </upload-image>
        </div>
      </div>
    </div>
    <mt-button class="btn-submit" type="primary" @click="handleSubmit"  v-bind:disabled="userInfo.is_verify === 1">提交</mt-button>
    <!-- <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet> -->
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import {isCardNo} from '@/common/util';

  export default {
    data() {
      return {
        userInfo: {},
        params: {
          real_name: '', // 真实姓名
          card_no: '',  // 身份证号码
          pic_front: '', //身份证正面
          pic_back: '',  //身份证反面
          pic_whole: '', // 手持身份证
        },
        uploadFront: {
          data: null,
          methodName: 'verifyImage64',
          success: (data) => {
            this.uploadCallback('uploadFront', data);
          }
        },
        uploadBack: {
          data: null,
          methodName: 'verifyImage64',
          success: (data) => {
            this.uploadCallback('uploadBack', data);
          }
        },
        uploadWhole: {
          data: null,
          methodName: 'verifyImage64',
          success: (data) => {
            this.uploadCallback('uploadWhole', data);
          }
        },
        /*
        mobile: '',
        checkcode: '',
        weixin: '',
        countdown: 0,
        timer: null,
        sheetVisible: false,
        actions: [
          { name: '拍照', value: 1, method: this.onSelect },
          { name: '从相册选择', value: 2, method: this.onSelect },
        ],
        */
      };
    },
    created() {
      this.API.userBaseInfo().then((res) => {
        if (res) {
          console.log(res);
          this.userInfo = res;
        }
      }).catch((err) => {
        this.$toast(err.message);
      });
    },
    methods: {
      uploadCallback(type, data) {
        this[type].data = data;
      },
      handleSubmit() {
        let vm = this;
        let message = '';
        const params = this.params;
        const realName = params.real_name
        const cardNo = params.card_no

        params.pic_front = this.uploadFront.data && this.uploadFront.data.fileId;
        params.pic_back = this.uploadBack.data && this.uploadBack.data.fileId;
        params.pic_whole = this.uploadWhole.data && this.uploadWhole.data.fileId;

        if (!realName) {
          message = '请输入姓名';
        } else if (!isCardNo(cardNo)) {
          message = '身份证号格式不正确';
        } else if (!params.pic_front) {
          message = '请上传身份证正面照片';
        } else if (!params.pic_back) {
          message = '请上传身份证反面照片';
        } else if (!params.pic_whole) {
          message = '请上传手持身份证照片';
        }

        if (message) {
          vm.$toast(message);
          return;
        }

        vm.API.identityVerify(params).then((res) => {
          if (res) {
            console.log(res)
            this.$toast({message: '操作成功', duration: 2});
            setTimeout(() => {
              vm.$router.push('/user');
            }, 2000);
          }
        }).catch((err) => {
          vm.$toast(err.message);
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin.scss";

  .tips {
    padding: 0 .2rem;
    line-height: .62rem;
    font-size: .24rem;
    background: #ffe2c3;
  }

  .error {
    text-align: center;
    background: $color-white;
    color: $color-red;
  }

  .check-code {
    display: inline-block;
    width: 2rem;
    line-height: .76rem;
    text-align: center;
    font-size: .28rem;
    color: $color-white;
    background: $color-red;
    border-radius: .38rem;
    &.disabled {
      background: $color-gray;
    }
  }

  .upload {
    .hd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .1rem .3rem 0;
      height: .9rem;
      img {
        width: .28rem;
        height: .3rem;
      }
    }
    .bd {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 2.8rem;
      background: $color-white;
      p {
        margin-top: .18rem;
        color: $color-blue;
      }
      .icon {
        width: .68rem;
        height: .48rem;
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .upload-wp {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &:before {
        content: "";
        display: block;
        width: .68rem;
        height: .48rem;
        background: url(../../../assets/icon-img.png);
        background-size: cover;
      }
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
