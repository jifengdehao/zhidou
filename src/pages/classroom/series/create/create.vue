/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 新建系列课
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="swipe-wp" v-if="banner">
        <span class="btn-edit" @click="banner = null">清除</span>
        <img class="item" :src="banner.url" alt="">
      </div>
      <div class="upload-item" v-else>
        <div class="upload-bd">
          <upload-image
            :success="upload.success">
            <img class="upload-icon" src="../../../../assets/icon-img.png" alt="">
            <p>上传系列课海报</p>
            <!-- <p class="gray">尺寸：750x300像素</p>-->
            <p class="gray" style="margin-top: 0;">(上传图片要求 长:宽=750:470)</p>
          </upload-image>
        </div>
      </div>
      <div class="form-wp mt20 mint-input-tar">
        <mt-field class="form-bd" v-model.trim="params.name" label="系列课名称"
                  placeholder="系列课名称最多40个字"></mt-field>
        <mt-cell title="系列课分类" is-link :value="categoryName || '请选择'" @click.native="sheetVisible = true"></mt-cell>
        <!-- <mt-cell title="收费类型" value="固定收费"></mt-cell>-->
        <mt-cell title="收费类型" is-link :value="payName || '请选择'" @click.native="payVisible = true"></mt-cell>
        <mt-field class="form-bd" v-model.trim="params.price" type="number" label="价格（元）"
                  placeholder="请输入价格" v-if="params.pay_type === 1"></mt-field>
        <mt-field class="form-bd" v-model.trim="params.price" type="number" label="智豆（个）"
                  placeholder="请输入数量" v-if="params.pay_type === 2"></mt-field>
        <mt-field class="form-bd" v-model.trim="params.pwd" type="text" label="密码"
                  placeholder="请输入密码" v-if="params.pay_type === 3"></mt-field>
        <mt-field class="form-bd" v-model.trim="params.plan_period_count" type="number" label="排课计划"
                  placeholder="请填写具体的开课的节数"></mt-field>
        <template v-if="params.pay_type === 1 || params.pay_type === 2">
          <mt-cell title="设置邀请奖励">
            <mt-switch v-model="isInvite"></mt-switch>
          </mt-cell>
        </template>
        <template v-if="isInvite">
          <a class="mint-cell mint-field form-bd">
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">
                <span class="mint-cell-text">分成比例（%）</span>
              </div>
              <div class="mint-cell-value">
                <input placeholder="请输入分成比例，比例必须是整数" number="true"
                       type="number" class="mint-field-core"
                       v-model.trim="params.share_gain_rate"
                       onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                       onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
                />
              </div>
            </div>
          </a>
        </template>
        <template v-if="isInvite">
          <mt-cell title="分成（¥）" :value="sharePrice" v-if="params.pay_type === 1"></mt-cell>
          <mt-cell title="分成（个豆）" :value="sharePrice" v-if="params.pay_type === 2"></mt-cell>
        </template>
      </div>
    </div>

    <div class="scroll-ft">
      <mt-button type="primary" @click="handleSubmit">确定</mt-button>
    </div>
    <mt-actionsheet :actions="actions" v-if="actions.length>0" v-model="sheetVisible" id="classify_list"></mt-actionsheet>

    <mt-actionsheet :actions="payType" v-if="payType.length>0" v-model="payVisible"></mt-actionsheet>
    <router-link tag="div" class="link-home" to="/" style="bottom:10%;"></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isInvite: false,// 是否设置邀请分享
        banner: null,// banner图
        categoryName: '', // 分类名称
        payName: '免费', // 支付名称
        params: {
          course_type: 1, // 0单课程 1系列课程集
          category_id: 0, //分类ID
          name: '', //系列课名称
          images: '', // banner图Id
          plan_period_count: '', // 排课计划
          pay_type: 0, // 0 免费 1现金收费 2智豆收费 3密码
          price: '',  // 价格
          pwd: '', // 密码
          is_share_gain: 0, // 0不分享 1 分享
          share_gain_rate: '' // 分成比例
        },
        payType: [
          {
            payId: 0,
            name: '免费',
            method: this.selectPay
          },
          {
            payId: 1,
            name: '现金收费',
            method: this.selectPay
          },
          {
            payId: 2,
            name: '智豆收费',
            method: this.selectPay
          },
          {
            payId: 3,
            name: '密码',
            method: this.selectPay
          }
        ],
        sheetVisible: false,
        payVisible: false,
        actions: [],
        upload: {
          success: (data) => {
            this.uploadCallback(data);
          }
        }
      };
    },
    computed: {
      sharePrice() {
        if (this.isInvite && this.params.pay_type == 1 && this.params.share_gain_rate <= 100) {
          return (this.params.share_gain_rate / 100 * this.params.price).toFixed(1)
        } else if (this.isInvite && this.params.pay_type == 2 && this.params.share_gain_rate <= 100) {
          return Math.floor(this.params.share_gain_rate / 100 * this.params.price)
        }
      }
    },
    created() {
      let vm = this;
      // 课程分类
      this.API.courseGuide().then(((res) => {
        let list = res;
        list.forEach(item => {
          item.method = vm.onSelect;
        })
        this.actions = list;
        console.log(this.actions)
      })).catch((err) => {
        console.log(err.message);
      });
    },
    methods: {
      selectPay(item) {
        this.payName = item.name;
        this.params.pay_type = item.payId
      },
      onSelect(item) {
        this.params.category_id = item.id;
        this.categoryName = item.name;
      },
      // 上传图片的回调
      uploadCallback(data) {
        this.banner = data;
      },
      handleSubmit() {
        if (!this.tId) {
          let vm = this;
          let message = '';
          let banner = this.banner;
          let params = this.params;
          let name = this.$trim(params.name);
          if (!(banner && banner.fileId)) {
            message = '请先上传系列课海报';
          } else if (name.length < 2 || name.length > 40) {
            message = '系列课名称应为2-40个字';
          } else if (!params.category_id) {
            message = '请选择课程分类';
          } else if (params.pay_type == 3 && !params.pwd) {
            message = '密码不能为空';
          } else if (params.pay_type == 3 && !(/^[0-9a-zA-Z]+$/).test(params.pwd)) {
            message = '密码输入不正确'
          } else if (params.pay_type == 1 && params.price < 1) {
            message = '收费金额不能小于1';
          } else if (params.pay_type == 1 && params.price > 1000000) {
            message = '收费金额不能大于1000000';
          } else if (params.pay_type == 2 && params.price < 1) {
            message = '智豆数量不能少于1';
          } else if (params.pay_type == 2 && params.price > 1000000) {
            message = '智豆数量不能大于1000000';
          } else if (!params.plan_period_count) {
            message = '请填写课程节数';
          } else if (this.isInvite && !params.share_gain_rate) {
            message = '分享提成比例不能为空';
          } else if (this.isInvite && params.share_gain_rate < 0) {
            message = '分享提成比例大于0或小于100'
          } else if (this.isInvite && params.share_gain_rate > 100) {
            message = '分享提成比例大于0小于100'
          } else if (this.isInvite && this.sharePrice <= 0) {
            message = '分成不能为0'
          }

          if (message) {
            this.$toast(message);
            return;
          }

          if (this.isInvite) {
            params.is_share_gain = 1
          } else {
            params.is_share_gain = 0
          }
          params.images = banner.fileId;
          params.price = Math.floor(this.params.price * 10) / 10
          console.log(params)
          vm.API.generateCourse(params).then((res) => {
            if (res) {
              console.log(res)
              this.tId = true
              vm.$toast('创建成功');
              setTimeout(() => {
                vm.$router.push('/classroom/series/detail/' + res.id)
              }, 2000);
            }
          })
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .swipe-wp {
    position: relative;
    .btn-edit {
      position: absolute;
      top: .2rem;
      right: .2rem;
      z-index: 99;
      padding: .1rem;
      border-radius: .05rem;
      background: rgba(255, 255, 255, .85);
    }
  }

  .detail-info, .detail-audio, .detail-intro {
    background: $color-white;
  }

  .detail-info {
    padding: .2rem;
    border-bottom: .01rem solid $color-border;
    .tit {
      max-height: .88rem;
      overflow: hidden;
    }
    .info {
      display: flex;
      justify-content: space-between;
    }
  }

  .detail-audio {
    display: flex;
    align-items: center;
    padding: .15rem .2rem;
    border: .01rem solid $color-border;
    border-width: .01rem 0;
    .bd {
      .btn {
        display: block;
        padding: 0 .3rem;
        max-width: 4rem;
        line-height: .58rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: #e5e5e5;
        border-radius: .04rem;
        color: $color-black;
      }
    }
    .ft {
      flex: 1;
      text-align: right;
      .btn {
        display: inline-block;
        padding: 0 .2rem;
        line-height: .5rem;
        text-align: center;
        border: .02rem solid $color-green;
        border-radius: .04rem;
        color: $color-green;
        &.btn-red {
          border-color: $color-red;
          color: $color-red;
        }
      }
    }
  }

  .detail-intro {
    .hd {
      padding: 0 .2rem;
      color: $color-gray;
    }
    .bd {
      padding: .2rem;
      color: $color-gray-dark;
      p {
        margin-bottom: .2rem;
      }
      img {
        display: block;
        margin: .4rem auto .2rem;
        max-width: 100%;
      }
    }
  }
</style>
