/**
* @author zhangwenlong
* @date 2018/4/1
* @Description: 编辑单课
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">

      <div class="swipe-wp" style="height: 4.7rem">
        <a href="javascript:void(0);" class="btn-edit" @click="$router.push('/classroom/course/banner/' + id)">编辑</a>
        <slider v-if="banner.length>0">
          <div v-for="(item, key) in banner" :key="key">
            <a href="javascript:;">
              <img :src="item.url || $root.placeHolder.banner" style="height: 4.7rem"/>
            </a>
          </div>
        </slider>
      </div>

      <div class="form-wp mt20 mint-input-tar">

        <mt-field v-model.trim="course.title" label="课程主题" placeholder="课程主题最多40个字"></mt-field>
        <mt-cell title="课程分类" is-link :value="categoryName"></mt-cell>

        <mt-cell title="课程简介" is-link :to="'/classroom/course/introduction/' + id"></mt-cell>

        <!-- <mt-cell title="语音录播文件" is-link></mt-cell> -->

        <template v-if="course.pay_type == 3">
          <mt-cell title="收费类型" value="密码"></mt-cell>
          <mt-field v-model.trim="course.pwd"
                    label="修改密码" placeholder="请输入密码"></mt-field>
        </template>
        <template v-else-if="course.pay_type == 1">
          <mt-cell title="收费类型" value="固定收费"></mt-cell>
          <mt-field v-model.trim="course.price" label="价格（元）"
                    placeholder="请输入门票价格" type="number"></mt-field>
        </template>
        <template v-else-if="course.pay_type == 2">
          <mt-cell title="收费类型" value="智豆收费"></mt-cell>
          <mt-field v-model.trim="course.price" label="数量（个）"
                    placeholder="请输入智豆个数" type="number"></mt-field>
        </template>
        <template v-else-if="course.pay_type == 0">
          <mt-cell title="收费类型" value="免费"></mt-cell>
        </template>

        <template v-if="course.pay_type == 1 || course.pay_type == 2">
          <mt-cell title="设置邀请奖励">
            <mt-switch v-model="isInvite" style="padding: 0;" slot></mt-switch>
          </mt-cell>
        </template>
        <template v-if="isInvite">
          <!--<mt-field v-model.trim="course.share_rate " label="分成比例（%）"
                    placeholder="请输入分成比例，比例必须是整数" type="number"></mt-field>-->
          <a class="mint-cell mint-field">
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
        <div class="form-wp" v-if="course.file_type==1">
          <h3 class="form-hd">录音文件<span class="gray ml10 fs14">目前支持MP3格式</span></h3>
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
            <a class="audio-link" href="javascript:;" v-if="!files[0]">{{course.file_name}}</a>


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
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="primary" @click="handleSubmit">确定</mt-button>
    </div>
    <router-link tag="div" class="link-home" to="/" style="bottom:10%;"></router-link>
  </div>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  import Slider from '@/components/slider/slider'
  import {Indicator} from 'mint-ui'
  import {ajax} from '@/common/util'

  export default {
    data() {
      return {
        isInvite: false,
        id: this.$route.params.id,
        categoryName: '', // 分类
        actions: [], // 分类
        banner: [],
        course: {},// 课程详情
        files: [],// 上传音频文件
        audioUpload: {}, // 上传音频所需的参数
        videoFile: {}, // 上传视频文件
        UploadVideoFileId: '', // 上传视频成功id
        UploadVideoName: '', // 上传视频名称
        videoStatus: 0,// 上传视频状态 0 未上传，1 上传中，2上传完成
        audioStatus: 0 // 音频上传状态 0 未上传，1 上传中，2上传完成
      };
    },
    components: {
      FileUpload,
      Slider
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
    created() {
      this.getCourseGuide()
      setTimeout(() => {
        this.getSingleDetail(this.id)
      }, 20)
    },
    methods: {
      // 获取课程分类
      getCourseGuide() {
        this.API.courseGuide().then((res) => {
          if (res.length > 0) {
            console.log(res)
            this.actions = res
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // 获取上传音频的参数
      getUploadAudioKey() {
        this.API.getAudioKey().then((res) => {
          this.audioUpload = res
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取课程详情
      getSingleDetail(id) {
        this.API.anchorSingle(id).then((res) => {
          if (res) {
            console.log(res)
            this.course = res;
            if (res.is_share == 1) {
              this.isInvite = true
            } else {
              this.isInvite = false
            }
            if (res.img.length > 0) {
              this.banner = res.img
            }
            if (res.file_type == 1) {
              this.getUploadAudioKey()
            }
            if (this.actions.length > 0) {
              this.actions.forEach(item => {
                if (item.id === res.category) {
                  this.categoryName = item.name
                }
              })
            }
          }
        });
      },
      // 获取上传视频文件
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
                  vm.UploadVideoFileId = result.fileId
                  vm.UploadVideoName = result.videoName
                  vm.videoStatus = 1
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
          course_type: this.course.type,
          name: this.course.title,
          price: Math.floor(this.course.price * 10) / 10,
          pwd: this.course.pwd,
          id: this.id,
          pay_type: this.course.pay_type,
          share_gain_rate: this.course.share_rate
        }
        if (params.name.length < 2 || params.name.length > 40) {
          message = '课程主题应为2-40个字';
        } else if (params.pay_type === 3 && !params.pwd) {
          message = '密码不能为空';
        } else if (params.pay_type === 3 && !(/^[0-9a-zA-Z]+$/).test(params.pwd)) {
          message = '密码输入不正确'
        } else if (params.pay_type === 1 && params.price < 1) {
          message = '收费金额不能小于1';
        } else if (params.pay_type == 1 && params.price > 1000000) {
          message = '收费金额不能大于1000000';
        } else if (params.pay_type === 2 && params.price < 1) {
          message = '智豆数量不能少于1';
        } else if (params.pay_type == 2 && params.price > 1000000) {
          message = '智豆数量不能大于1000000';
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

        if (this.course.file_type == 1 && file) {
          params.file_id = file.response.fileId; // 音频id
          params.file_name = file.name
        } else if (this.course.file_type == 2 && vm.UploadVideoFileId) {
          params.file_id = vm.UploadVideoFileId
          params.file_name = vm.UploadVideoName
        }
        console.log(params)
        vm.API.editCourse(params).then((res) => {
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
