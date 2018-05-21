/**
* @author zhangwenlong
* @date 2018/4/1
* @Description: 修改系列课
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="swipe-wp" v-if="banner">
        <span class="btn-edit" @click="banner = null">清除</span>
        <img class="item" :src="banner.url" width="100%"/>
      </div>
      <div class="upload-item" v-else>
        <div class="upload-bd">
          <upload-image
            :success="upload.success">
            <img class="upload-icon" src="../../../../assets/icon-img.png" width="100%"/>
            <p>上传系列课海报</p>
            <!-- <p class="gray">尺寸：750x470像素</p>-->
            <p class="gray" style="margin-top: 0;">(上传图片要求 长:宽=750:470)</p>
          </upload-image>
        </div>
      </div>
      <div class="form-wp mt20 mint-input-tar">
        <mt-field class="form-bd" v-model.trim="course.title" label="系列课名称"
                  placeholder="系列课名称最多40个字"></mt-field>
        <mt-cell title="系列课分类" :value="params.categoryName"></mt-cell>

        <mt-cell title="收费类型" :value="params.payName"></mt-cell>
        <mt-field class="form-bd" v-model.trim="course.price" type="number" label="价格（元）"
                  placeholder="请输入价格" v-if="course.pay_type === 1"></mt-field>
        <mt-field class="form-bd" v-model.trim="course.price" type="number" label="智豆（个）"
                  placeholder="请输入数量" v-if="course.pay_type === 2"></mt-field>
        <mt-field class="form-bd" v-model.trim="course.pwd" label="密码"
                  placeholder="请输入密码" v-if="course.pay_type === 3"></mt-field>
        <mt-field class="form-bd" v-model.trim="course.plan_period_count" type="number" label="排课计划"
                  placeholder="请填写具体的开课的节数"></mt-field>

        <template v-if="course.pay_type == 1 || course.pay_type == 2">
          <mt-cell title="设置邀请奖励">
            <mt-switch v-model="isInvite" style="padding: 0;" slot></mt-switch>
          </mt-cell>
        </template>
        <template v-if="isInvite">
          <!-- <mt-field v-model.trim="params.share_gain_rate " label="分成比例（%）"
                     placeholder="请输入分成比例，比例必须是整数" type="number"></mt-field>-->
          <a class="mint-cell mint-field form-bd">
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">
                <span class="mint-cell-text">分成比例&nbsp;(%)</span>
              </div>
              <div class="mint-cell-value">
                <input placeholder="请输入分成比例，比例必须是整数" number="true"
                       type="number" class="mint-field-core"
                       v-model.trim="course.share_rate"
                       onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                       onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
                />
              </div>
            </div>
          </a>
        </template>
        <template v-if="isInvite">
          <mt-cell title="分成 (¥)" :value="sharePrice" v-if="course.pay_type === 1"></mt-cell>
          <mt-cell title="分成 (个豆)" :value="sharePrice" v-if="course.pay_type === 2"></mt-cell>
        </template>
        <mt-cell title="课程简介" is-link :to="'/classroom/series/intro/' + id"></mt-cell>
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="primary" @click="handleSubmit">确定</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/" style="bottom:10%;"></router-link>
  </div>
</template>

<script>
  export default {
    name: 'update',
    data() {
      return {
        isInvite: false,
        banner: null,
        id: this.$route.params.id, //课程Id
        payType: [
          {
            payId: 0,
            name: '免费'
          },
          {
            payId: 1,
            name: '现金收费'
          },
          {
            payId: 2,
            name: '智豆收费'
          },
          {
            payId: 3,
            name: '密码'
          }
        ],
        actions: [], // 分类
        params: {},
        course: {},
        upload: {  // 上传图片
          success: (data) => {
            this.uploadCallback(data);
          }
        }
      }
    },
    created() {
      this.getCategory()
      setTimeout(() => {
        this.getSeriesDetails()
      }, 20)
    },
    computed: {
      sharePrice() {
        if (this.isInvite && this.course.pay_type == 1 && this.course.share_rate <= 100) {
          return (this.course.share_rate / 100 * this.course.price).toFixed(1)
        } else if (this.isInvite && this.course.pay_type == 2 && this.course.share_rate <= 100) {
          return Math.floor(this.course.share_rate / 100 * this.course.price)
        }
      }
    },
    methods: {
      // 课程分类
      getCategory() {
        this.API.courseGuide().then((res) => {
          if (res.length > 0) {
            this.actions = res;
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // 获取系列课详情
      getSeriesDetails() {
        this.API.anchorSet(this.id).then((res) => {
          if (res) {
            console.log(res)
            this.course = res
            if (res.img.length > 0) {
              this.banner = res.img[0]
            }
            if (res.is_share == 1) { // 是否分享
              this.isInvite = true
            } else {
              this.isInvite = false
            }
            this.payType.forEach((item) => {
              if (item.payId === res.pay_type) {
                this.params.payName = item.name
              }
            })
            if (this.actions.length > 0) {
              this.actions.forEach(item => {
                if (item.id === res.category) {
                  this.params.categoryName = item.name
                }
              })
            }
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      // 上传图片的回调
      uploadCallback(data) {
        this.banner = data;
      },
      handleSubmit() {
        let vm = this;
        let message = '';
        let banner = this.banner;
        let params = {
          id: this.course.id, // 课程id
          name: this.course.title, // 课程名程
          pay_type: this.course.pay_type,  // 支付类型
          price: this.course.price, // 课程价格
          plan_period_count: this.course.plan_period_count, // 排课计划
          share_gain_rate: this.course.share_rate, // 分成比例
          pwd: this.course.pwd // 密码
        }

        if (!(banner && banner.fileId)) {
          message = '请先上传系列课海报';
        } else if (params.name.length < 2 || params.name.length > 40) {
          message = '系列课名称应为2-40个字';
        } else if (params.pay_type === 3 && !params.pwd) {
          message = '密码不能为空';
        } else if (params.pay_type === 3 && !(/^[0-9a-zA-Z]+$/).test(params.pwd)) {
          message = '密码输入不正确';
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
        params.price = Math.floor(params.price * 10) / 10
        console.log(params)
        vm.API.editCourse(params).then((res) => {
          if (res) {
            vm.$toast('编辑成功');
            setTimeout(() => {
              vm.$router.push('/classroom/series/detail/' + res.id)
            }, 2000);
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }
</script>

<style scoped lang="scss">
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
</style>
