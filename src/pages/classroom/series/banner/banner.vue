/**
* @author zhangwenlong
* @date 2018/4/1
* @Description: 系列课程-课时-banner图
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="upload-item" v-if="item" v-for="(item, key) in list" :key="key">
        <span class="upload-x" @click="deleteItem(key)"></span>
        <div class="upload-bd">
          <img class="upload-img" :src="item.url" alt="轮播图">
        </div>
      </div>
      <div class="upload-item" if="list.length < 6">
        <div class="upload-bd">
          <upload-image
            :success="upload.success">
            <img class="upload-icon" src="../../../../assets/icon-img.png" alt="删除">
            <p>上传Banner 750 x 470</p>
          </upload-image>
        </div>
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="default" @click="$router.back()">取消</mt-button>
      <mt-button type="primary" @click="handleSubmit">保存</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: this.$route.params.id, // 课时Id
        list: [],// banner图
        upload: {
          success: (data) => {
            this.uploadCallback(data);
          }
        }
      };
    },
    created() {
      this.API.anchorPeriod({id: this.id}).then((res) => {
        if (res) {
          if (res.img && res.img.length) {
            this.list = res.img;
          }
        }
      });
    },
    methods: {
      uploadCallback(data) {
        this.list.push(data);
      },
      deleteItem(index) {
        this.list.splice(index, 1);
      },
      handleSubmit() {
        let vm = this;
        let fileIds = [];
        this.list.forEach((item) => {
          fileIds.push(item.fileId);
        });

        let params = {
          id: this.id,
          images: fileIds.join('|')
        };
        console.log(params)
        vm.API.anchorEditPeriod(params).then((res) => {
          console.log(res)
          vm.$toast('操作成功');
          setTimeout(() => {
            vm.$router.go(-1);
          }, 2000);
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
</style>
