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
            <p class="gray">尺寸：750x300像素</p>
          </upload-image>
        </div>
      </div>
      <div class="form-wp mt20 mint-input-tar">
        <mt-field class="form-bd" v-model.trim="params.name" label="系列课名称"
                  placeholder="系列课名称最多40个字"></mt-field>
        <mt-cell title="系列课分类" is-link :value="params.categoryName"></mt-cell>

        <mt-cell title="收费类型" :value="params.payName"></mt-cell>
        <mt-field class="form-bd" v-model.trim="params.price" type="number" label="价格（元）"
                  placeholder="请输入价格" v-if="params.pay_type === 1"></mt-field>
        <mt-field class="form-bd" v-model.trim="params.price" type="number" label="智豆（个）"
                  placeholder="请输入数量" v-if="params.pay_type === 2"></mt-field>
        <mt-field class="form-bd" v-model.trim="params.pwd" label="密码"
                  placeholder="请输入密码" v-if="params.pay_type === 3"></mt-field>
        <mt-field class="form-bd" v-model.trim="params.plan_period_count" type="number" label="排课计划"
                  placeholder="请填写具体的开课的节数"></mt-field>


        <mt-cell title="课程简介" is-link :to="'/classroom/series/intro/' + id"></mt-cell>
        <!--<mt-field v-model.trim="params.intro" type="textarea" rows="4" label="课程简介"
                  placeholder="请输入课程简介"></mt-field>-->
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="primary" @click="handleSubmit">确定</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    name: 'update',
    data() {
      return {
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
        upload: {  // 上传图片
          success: (data) => {
            this.uploadCallback(data);
          }
        }
      }
    },
    created() {
      this.getCategory()
      this.getSeriesDetails()
    },
    methods: {
      // 课程分类
      getCategory() {
        this.API.resourceGuide().then((res) => {
          this.actions = res;
        }).catch((err) => {
          console.log(err)
        });
      },
      // 获取系列课详情
      getSeriesDetails() {
        this.API.anchorSet(this.id).then((res) => {
          if (res) {
            console.log(res)
            this.params.id = res.id // 课程id
            this.banner = res.img[0]  // 课程banner
            this.params.name = res.title // 课程标题
            this.params.price = res.price // 课程价格
            this.params.course_type = res.type // 课程类型
            this.params.plan_period_count = res.plan_period_count // 课程开课数
            this.params.pay_type = res.pay_type // 课程支付类型
            this.params.pwd = res.pwd // 课程密码
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
        let params = this.params;

        if (!(banner && banner.fileId)) {
          message = '请先上传系列课海报';
        } else if (params.name.length < 2 || params.name.length > 40) {
          message = '系列课名称应为2-40个字';
        } else if (params.pay_type === 3 && !params.pwd) {
          message = '密码不能为空';
        } else if (params.pay_type === 3 && !(/^[0-9a-zA-Z]+$/).test(params.pwd)) {
          message = '密码输入不正确';
        }else if (params.pay_type == 1 && params.price < 1) {
          message = '收费金额不能小于1';
        } else if (params.pay_type == 2 && params.price < 1) {
          message = '智豆数量不能少于1';
        } else if (!params.plan_period_count) {
          message = '请填写课程节数';
        }
        if (message) {
          this.$toast(message);
          return;
        }
        params.images = banner.fileId;
        params.price = Math.floor(params.price * 10) / 10
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
