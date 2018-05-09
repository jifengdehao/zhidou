/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 创建系列课程课时
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">

      <div class="form-wp">
        <h3 class="form-hd">课程主题</h3>
        <mt-field placeholder="请输入课程主题" v-model.trim="params.subject"></mt-field>
      </div>
      <div class="form-wp">
        <h3 class="form-hd">选择课程形式</h3>
        <!-- <mt-radio v-model="value" :options="options"></mt-radio> -->
        <mt-cell title="语音录播" label="适合已经录制好的音频，音频播放+文字、图片互动">
          <label class="icon-radio" slot="icon" :class="{'icon-radio-active':params.period_type==1}">
            <input type="radio" value="1" v-model="params.period_type"/>
          </label>
          <!-- <span class="blue">示例</span> -->
        </mt-cell>
        <!-- <mt-cell title="语音直播" label="适合音频为主的直播+文字、图片互动">
          <label class="icon-radio" slot="icon"><input type="radio"></label>
          <span class="blue">示例</span>
        </mt-cell>-->
        <mt-cell title="视频录播" label="适合已经录制好的视频，视频播放+文字、图片互动">
          <label class="icon-radio" slot="icon" :class="{'icon-radio-active':params.period_type==2}">
            <input type="radio" value="2" v-model="params.period_type"/>
          </label>
          <!--<span class="blue">示例</span>-->
        </mt-cell>
      </div>
      <div class="form-wp" v-if="params.period_type == 1">
        <h3 class="form-hd">录音文件<span class="gray ml10 fs14">目前支持MP3格式,文件不能大于100M</span></h3>
        <div class="form-bd form-file">
          <!-- <input type="file"> -->
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
      <div class="form-wp" v-if="params.period_type == 2">
        <h3 class="form-hd">视频文件<span class="gray ml10 fs14">目前支持MP4格式</span></h3>
        <div class="form-bd form-file">
          <label class="upload-file">
            <span class="upload-select">选择文件</span>
            <input id="uploadVideoNow-file" type="file" style="display:none;" @change="uploadVideo"/>
            <span class="upload-filename">{{ videoFile.name }}</span>
          </label>

          <mt-button type="primary" size="small" @click="uploadVid" v-show="videoStatus === 0">上传</mt-button>
          <mt-button type="danger" size="small" v-show="videoStatus === 1">上传中</mt-button>
          <mt-button type="primary" size="small" v-show="videoStatus === 2" @click="uploadVid">已上传</mt-button>

        </div>
        <p class="form-ft fs12 gray-dark">备注：录播视频需要审核，通过之后才能上架</p>
      </div>
    </div>

    <div class="scroll-ft">
      <mt-button type="primary" @click.native="handleNext">下一步</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  import {Indicator} from 'mint-ui'
  import {ajax} from '@/common/util'

  export default {
    data() {
      return {
        files: [], // 上传音频文件
        audioUpload: {}, // 音频文件参数
        videoFile: {}, // 上传视频文件
        videoStatus: 0,// 上传视频状态
        audioStatus: 0, // 音频上传状态 0 未上传，1 上传中，2上传完成
        params: {
          course_id: this.$route.params.id, //系列课程Id
          subject: '', // 课时标题
          period_type: 1,  // 视频类型 1语音 2视频
          file_id: '', // 文件Id
          file_name: '' // 上传文件名称
        },
      };
    },
    components: {
      FileUpload,
    },
    created() {
      this.getUploadAudioKey()
    },
    methods: {
      // 获取上传音频的参数
      getUploadAudioKey() {
        this.API.getAudioKey().then((res) => {
          console.log(res)
          this.audioUpload = res
        }).catch((err) => {
          console.log(err)
        })
      },
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
                error: function (result) {//上传失败时的回调函数
                  console.log('上传失败的原因：' + result.msg);
                  Indicator.close()
                  vm.$toast('上传失败');
                  vm.videoStatus = 0
                },
                finish: function (result) {//上传成功时的回调函数
                  vm.params.file_id = result.fileId
                  vm.params.file_name = result.videoName
                  Indicator.close()
                  vm.$toast('上传成功');
                  vm.videoStatus = 2
                  console.log('上传结果的fileId：' + result.fileId);
                  console.log('上传结果的视频名称：' + result.videoName);
                  console.log('上传结果的视频地址：' + result.videoUrl);
                }
              })
            }, 20)
          });
        }
      },
      //获取上传视频文件
      uploadVideo(e) {
        let file = e.target.files[0]
        let arrType = ['MP4', 'AVI', 'WMV']
        let fileType = file.type.split('/')[1]
        if (arrType.indexOf(fileType.toUpperCase()) > -1) {
          this.videoFile = file
          this.videoStatus = 0
        } else {
          this.$toast('你上传的文件格式不正确')
        }
      },
      // 获取上传视频的签名
      getSignature(callback) {
        ajax({
          url: '/api/user/anchor/video-key',
          type: 'post',
          param: {
            'Action': 'GetVodSignatureV2'
          },
          async: true,
          datatype: 'json',
          success: function (data) {
            callback && callback(JSON.parse(data))
          },
          error: function () {
            console.log('error')
          }
        })
      },
      handleNext() {
        if (!this.tId) {
          let vm = this;
          let message = '';
          let params = this.params;
          if (params.subject.length < 2) {
            message = '课程主题不能少于2个字';
          } else if (params.period_type == 1 && !(params.file_id)) {
            message = '请先上传录音文件';
          } else if (params.period_type == 2 && !(params.file_id)) {
            message = '请先上传视频文件';
          }
          if (message) {
            this.$toast(message);
            return;
          }
          console.log(params)
          vm.API.generatePeriod(params).then((res) => {
            if (res) {
              vm.$toast('创建成功');
              this.tId = true
              setTimeout(() => {
                vm.$router.back()
              }, 3000);
            }
          }).catch((err) => {
            console.log(err);
          });
        }
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
          // 过滤非MP3 文件
          if (!/\.(mp3)$/i.test(newFile.name)) {
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

          if (this.$refs.upload.active) {
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
            if (this.params.period_type == 1 && newFile.response.fileId) {
              this.params.file_name = newFile.name
              this.params.file_id = newFile.response.fileId
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
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .icon-radio {
    position: relative;
    float: left;
    margin-right: .3rem;
    width: .3rem;
    height: .7rem;
    input {
      display: none;
    }
    &:before {
      content: "";
      display: block;
      margin-top: .2rem;
      width: .3rem;
      height: .3rem;
      background-color: #efefef;
      border: solid .06rem #d9d9d9;
      border-radius: 50%;
      box-sizing: border-box;
    }
    &.icon-radio-active {
      &:before {
        border-color: $color-blue;
      }
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
