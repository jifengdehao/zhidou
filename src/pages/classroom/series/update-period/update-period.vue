/**
* @author zhangwenlong
* @date 2018/4/1
* @Description: 编辑单课
*/
<template>
  <div class="scroll-wp" v-if="course">
    <div class="scroll-bd">
      <div class="swipe-wp" style="height: 4.7rem;">
        <a href="javascript:void(0);" class="btn-edit"
           @click="$router.push('/classroom/series/period/banner/' + id)">编辑</a>
        <slider v-if="course.img.length>0">
          <div v-for="(item, key) in course.img" :key="key">
            <a href="javascript:;">
              <img :src="item.url || $root.placeHolder.banner" style="height: 4.7rem;"/>
            </a>
          </div>
        </slider>
      </div>
      <div class="form-wp mt20 mint-input-tar">
        <mt-field v-model="course.title" label="课程主题" placeholder="课程主题最多40个字"></mt-field>

        <mt-cell title="课程简介" is-link :to="'/classroom/series/period/intro/'+ id"></mt-cell>
        <div class="form-wp" v-if="course.file_type == 1">
          <h3 class="form-hd">录音文件<span class="gray ml10 fs14">目前支持MP3格式</span></h3>
          <div class="form-bd form-file">
            <file-upload
              class="upload-file"
              name="file"
              post-action="http://up-z0.qiniup.com"
              :multiple="false"
              v-model="files"
              :data="{token:audioUpload.token}"
              @input-filter="inputFilter"
              @input-file="inputFile"
              ref="upload">
              <span class="upload-select">选择文件</span>
              <span class="upload-filename">{{ files[0] && files[0].name }}</span>
            </file-upload>
            <a class="audio-link" :href="course.file" v-show="!files[0]">{{course.file_name}}</a>

            <mt-button type="primary" size="small"
                       @click.native.prevent="$refs.upload.active = true"
                       v-show="audioStatus === 0">上传
            </mt-button>
            <mt-button type="danger" size="small"
                       v-show="audioStatus === 1">上传中
            </mt-button>
            <mt-button type="primary" size="small"
                       v-show="audioStatus === 2"
                       @click.native.prevent="$refs.upload.active = true">已上传
            </mt-button>


          </div>
          <p class="form-ft fs12 gray-dark">备注：录播语音需要审核，通过之后才能上架</p>
        </div>
        <div class="form-wp" v-if="course.file_type==2">
          <h3 class="form-hd">视频文件</h3>
          <div class="form-bd form-file">
            <label class="upload-file" for="uploadVideoNow-file">
              <span class="upload-select">选择文件</span>
              <input id="uploadVideoNow-file" type="file" style="display:none;" @change="uploadVideo"/>
              <span class="upload-filename">{{ videoFile.name }}</span>
            </label>
            <a class="audio-link" href="javascript:;" v-if="!videoFile.name">{{course.file_name}}</a>


            <mt-button type="primary" size="small" @click="uploadVid" v-show="videoStatus === 0">上传</mt-button>
            <mt-button type="danger" size="small" v-show="videoStatus === 1">上传中</mt-button>
            <mt-button type="primary" size="small" v-show="videoStatus === 2" @click="uploadVid">已上传</mt-button>
          </div>
          <p class="form-ft fs12 gray-dark">备注：录播视频需要审核，通过之后才能上架</p>
        </div>
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="primary" @click="handleSubmit">确定</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  import {Indicator} from 'mint-ui'
  import Slider from '@/components/slider/slider'
  import {ajax} from '@/common/util'

  export default {
    data() {
      return {
        id: this.$route.params.id, // 课时Id
        course: {},// 课时详情
        files: [], // 上传音频文件
        audioUpload: {}, // 音频文件参数
        videoFile: {}, // 上传视频文件
        UploadVideoFileId: '',// 上传成功视频Id
        UploadVideoName: '', // 上传视频名称
        videoStatus: 0,  // 上传视频状态
        audioStatus: 0 // 音频上传状态 0 未上传，1 上传中，2上传完成
      };
    },
    components: {
      FileUpload,
      Slider
    },
    created() {
      // 获取课时详情
      this.API.anchorPeriod({id: this.id}).then((res) => {
        if (res) {
          console.log(res)
          this.course = res;
          if (res.file_type == 1) {
            this.getUploadAudioKey()
          }
        }
      });
    },
    methods: {
      // 获取上传音频的参数
      getUploadAudioKey() {
        this.API.getAudioKey().then((res) => {
          this.audioUpload = res
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取上传视频文件
      uploadVideo(e) {
        let file = e.target.files[0]
        let arrType =['MP4','AVI','WMV']
        let fileType = file.type.split('/')[1]
        if(arrType.indexOf(fileType.toUpperCase()) > -1){
          this.videoFile = file
          this.videoStatus = 0
        }else{
          this.$toast('你上传的文件格式不正确')
        }
      },
      // 上传视频
      uploadVid() {
        let vm = this
        if (vm.videoFile.name) {
          vm.videoStatus = 1
          Indicator.open()
          this.loadScript(function () {
            setTimeout(() => {
              qcVideo.ugcUploader.start({
                videoFile: vm.videoFile,
                getSignature: vm.getSignature,
                error: function (result) { //上传失败时的回调函数
                  console.log('上传失败的原因：' + result.msg);
                  Indicator.close()
                  vm.$toast('上传失败');
                  vm.videoStatus = 0
                },
                finish: function (result) {//上传成功时的回调函数
                  vm.UploadVideoFileId = result.fileId
                  vm.UploadVideoName = result.videoName
                  vm.videoStatus = 2
                  Indicator.close()
                  vm.$toast('上传成功');
                  console.log('上传结果的fileId：' + result.fileId);
                  console.log('上传结果的视频名称：' + result.videoName);
                  console.log('上传结果的视频地址：' + result.videoUrl);
                }
              })
            }, 20)
          });
        }
      },
      // 获取上传视频的签名
      getSignature(callback) {
        ajax({
          url: '/api/user/anchor/video-key',
          type: 'post',
          param:{
            'Action': 'GetVodSignatureV2'
          },
          async: true,
          datatype: 'json',
          success:function (data) {
            callback && callback(JSON.parse(data))
          },
          error: function(){
            console.log('error')
          }
        })
      },
      // 添加javascript
      loadScript(callback) {
        if (!window.qcVideo) {
          const jQScript = document.createElement('script');
          const myScript = document.createElement('script');
          jQScript.setAttribute('src', '//code.jquery.com/jquery-1.12.4.min.js');
          myScript.setAttribute('src', '//imgcache.qq.com/open/qcloud/js/vod/sdk/ugcUploader.js');
          myScript.onload = callback;
          document.body.appendChild(jQScript);
          document.body.appendChild(myScript);
        } else {
          callback();
        }
      },
      handleSubmit() {
        let message = '';
        let vm = this;
        let file = this.files[0];
        let params = {
          subject: this.course.title,
          id: this.id
        }
        if (params.subject.length < 2 || params.subject.length > 40) {
          message = '课程主题应为2-40个字';
        }
        if (message) {
          this.$toast(message);
          return;
        }
        if (this.course.file_type == 1 && file) {
          params.file_id = file.response.fileId; // 音频id
          params.file_name = file.name
        } else if (this.course.file_type == 2 && vm.UploadVideoFileId) {
          params.file_id = vm.UploadVideoFileId
          params.file_name = vm.UploadVideoName
        }
        console.log(params)
        vm.API.anchorEditPeriod(params).then((res) => {
          if (res) {
            vm.$toast('编辑成功');
            setTimeout(() => {
              vm.$router.back();
            }, 2000);
          }
        })
      },
      inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          // 添加文件前
          // 过滤系统文件 和隐藏文件
          if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
            return prevent()
          }
          // 过滤 php html js 文件
          if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
            return prevent()
          }
          // 过滤非MP3文件
          if(!/\.(mp3)$/i.test(newFile.name)){
            this.$toast('你上传的文件格式不正确')
            return prevent()
          }
        }
      },
      inputFile(newFile, oldFile) {
        if (newFile && !oldFile) {
          // add
          console.log('add', newFile)
          this.audioStatus = 0
        }
        if (newFile && oldFile) {
          // create
          console.log('update', newFile)
          if(this.$refs.upload.active){
            Indicator.open();
            this.audioStatus = 1
          }
          // 上传错误
          if (newFile.error !== oldFile.error) {
            console.log('error', newFile.error, newFile)
            if (!newFile.response.fileId) {
              Indicator.close();
              this.$toast('上传失败')
              this.audioStatus = 0
              this.$refs.upload.active = false
            }
          }
          // 上传成功
          if (newFile.success !== oldFile.success) {
            console.log('success', newFile.success, newFile)
            if (newFile.response.fileId) {
              Indicator.close();
              this.audioStatus = 2
              this.$toast('上传成功')
              this.getUploadAudioKey()
            }
          }


        }
        if (!newFile && oldFile) {
          // remove
          console.log('remove', oldFile)
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

  .form-wp {
    .form-hd {
      padding: .2rem;
      font-size: .3rem;
    }
    .form-bd {
      display: flex;
      align-items: center;
      height: .96rem;
      background-color: $color-white;
      background-repeat: no-repeat;
      background-image: linear-gradient(180deg, $color-border, $color-border 50%, transparent 50%);
      background-size: 120% .02rem;
    }
    .form-ft {
      padding: .15rem;
    }
    .form-file {
      display: flex;
      justify-content: space-between;
      padding: 0 .2rem;
      .audio-link {
        padding: 0 .3rem;
        max-width: 4rem;
        line-height: .58rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        color: #26a2ff;
        text-decoration: underline;
      }
    }
  }

  .upload-file {
    display: flex;
    align-items: center;
    .upload-select {
      display: inline-block;
      margin-right: .1rem;
      line-height: .66rem;
      padding: 0 .24rem;
      background: $color-bg;
      box-shadow: 0 0 1px #b8bbbf;
      border-radius: .04rem;
      color: $color-black;
    }
    .upload-filename {
      display: block;
      max-width: 3.6rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
