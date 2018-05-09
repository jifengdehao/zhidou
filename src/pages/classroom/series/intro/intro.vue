/**
* @author zhangwenlong
* @date 2018/4/1
* @Description: 系列课-课程简介
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="intro-wp mt20">
        <!--<textarea class="fs14" placeholder="请填写直播间简介"></textarea>-->
        <mt-field placeholder="请填写课程简介" type="textarea" rows="4" v-model="title"></mt-field>
      </div>
      <!--<div class="upload-item">
        <a class="upload-x" href="#"></a>
        <div class="upload-bd">
          <img class="upload-img" src="../../../../assets/banner.png" alt="照片">
        </div>
        <div class="upload-ft">
          <textarea class="fs14" placeholder="请填写图片文字说明(展示在图片的下方)"></textarea>
        </div>
      </div>
      <div class="upload-item">
        <a class="upload-x" href="#"></a>
        <div class="upload-bd">
          <img class="upload-img" src="../../../../assets/banner.png" alt="照片">
        </div>
        <div class="upload-ft">
          <textarea class="fs14" placeholder="请填写图片文字说明(展示在图片的下方)"></textarea>
        </div>
      </div>-->
      <!--<div class="upload-item">
        <div class="upload-bd">
          <img class="upload-icon" src="../../../../assets/icon-img.png" alt="删除">
          <p>上传图片</p>
          <p class="gray">还可以上传6张，宽度小于400px的图片会显示原图</p>
        </div>
      </div>-->
      <div class="upload-item" v-if="item" v-for="(item, key) in intro" :key="key">
        <span class="upload-x" @click="deleteItem(key)"></span>
        <div class="upload-bd">
          <img class="upload-img" :src="item.url" alt="图片"/>
        </div>
        <mt-field placeholder="请填写图片文字说明(展示在图片的下方)" type="textarea" rows="4" v-model="item.dec"></mt-field>
      </div>
      <div class="upload-item" v-if="intro.length < 6">
        <div class="upload-bd">
          <upload-image
            :success="upload.success">
            <img class="upload-icon" src="../../../../assets/icon-img.png" alt="删除">
            <p>上传图片</p>
          </upload-image>
        </div>
        <!--<mt-field placeholder="请填写图片文字说明(展示在图片的下方)" type="textarea" rows="4" v-model=""></mt-field>-->
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="default" @click="$router.back()">取消</mt-button>
      <mt-button type="primary" @click="handleSubmit">确定</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: this.$route.params.id, // 课程Id
        intro: [], // 课程简介
        title: '', // 课程简介
        course_type: '', // 0单课程 1课程集
        upload: {
          success: (data) => {
            this.uploadCallback(data);
          }
        }
      }
    },
    created() {
      this.API.anchorSet(this.id).then((res) => {
        if (res) {
          console.log(res)
          this.course_type = res.type
          if (res.note.length > 0) {
            this.title = res.note[0].dec
            this.intro = res.note.splice(1, res.note.length)
          }
        }
      });
    },
    methods: {
      handleSubmit() {
        let vm = this;
        let fileIds = [];
        if (this.title) {
          fileIds.push({fileId: '', dec: this.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,'')});
        }
        this.intro.forEach((item) => {
          fileIds.push({fileId: item.fileId, dec: item.dec});
        });
        let params = {
          id: this.id,
          course_type: this.course_type,
          intro: JSON.stringify(fileIds)
        };
        vm.API.editCourse(params).then((res) => {
          if (res) {
            vm.$toast('操作成功');
            setTimeout(() => {
              vm.$router.go(-1);
            }, 2000);
          }
        });
      },
      uploadCallback(data) {
        this.intro.push(data)
      },
      deleteItem(index) {
        this.intro.splice(index, 1);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .intro-wp {
    textarea {
      display: block;
      width: 100%;
      height: 2.4rem;
      padding: 0 .2rem;
      resize: none;
      &.pic-desc {
        height: .82rem;
      }
    }
  }
</style>
