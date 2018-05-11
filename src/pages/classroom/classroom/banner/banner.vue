/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 主播banner图
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="upload-item" v-if="list.length>0" v-for="(item, key) in list" :key="key">
        <span class="upload-x" @click="deleteItem(key)"></span>
        <div class="upload-bd">
          <img class="upload-img" v-lazy="item.url" alt="轮播图" v-if="item.url"/>
        </div>
      </div>
      <div class="upload-item" if="list.length < 6">
        <div class="upload-bd">
          <upload-image
            :success="upload.success">
            <img class="upload-icon" src="../../../../assets/icon-img.png" alt="删除">
            <p>上传Banner</p>
            <p class="gray" style="margin-top: 0;">(上传图片要求 长:宽=750:470)</p>
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
        list: [],
        upload: {
          success: (data) => {
            this.uploadCallback(data);
          }
        }
      };
    },
    created() {
      this.API.anchorSpace().then((res) => {
        if (res) {
          console.log(res)
          let space = res.space
          if (space.img.length) {
            this.list = space.img;
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
        console.log(fileIds)
        vm.API.anchorUpdateSpace({front_images: fileIds.join('|')}).then((res) => {
          if (res) {
            vm.$toast('操作成功');
            setTimeout(() => {
              vm.$router.push('/classroom')
            }, 2000);
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
</style>
