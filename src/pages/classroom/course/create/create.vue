/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 新建单课程
*/
<template>
  <div class="scroll-wp" v-if="step == 1">
    <div class="scroll-bd">
      <div class="form-wp">
        <h3 class="form-hd">课程主题</h3>
        <mt-field placeholder="请输入课程主题" v-model.trim="params.name"></mt-field>
      </div>
      <div class="form-wp">
        <h3 class="form-hd">选择课程形式</h3>
        <!--<mt-radio v-model="fileType" :options="options"></mt-radio>-->
        <mt-cell title="语音录播" label="适合已经录制好的音频，音频播放+文字、图片互动">
          <label class="icon-radio" slot="icon" :class="{'icon-radio-active':params.period_type==1}">
            <input type="radio" value="1" v-model="params.period_type"/>
          </label>
          <!-- <span class="blue">示例</span>-->
        </mt-cell>
        <mt-cell title="视频录播" label="适合已经录制好的视频，视频播放+文字、图片互动">
          <label class="icon-radio" slot="icon" :class="{'icon-radio-active':params.period_type==2}">
            <input type="radio" value="2" v-model="params.period_type"/>
          </label>
          <!--<span class="blue">示例</span>-->
        </mt-cell>
      </div>
      <div class="form-wp" v-show="params.period_type==1">
        <h3 class="form-hd">录音文件<span class="gray ml10 fs14">目前支持MP3格式,文件不能大于100M</span></h3>
        <div class="form-bd form-file">
          <file-upload
            class="upload-file"
            name="file"
            post-action="http://up-z0.qiniup.com"
            :multiple="false"
            v-model="audioFiles"
            :data="{token:audioUpload.token}"
            @input-filter="inputFilter"
            @input-file="inputFile"
            ref="uploadAudio">
            <span class="upload-select">选择文件</span>
            <span class="upload-filename">{{ audioFiles[0] && audioFiles[0].name }}</span>
          </file-upload>
          <mt-button type="primary" size="small"
                     @click.native.prevent="$refs.uploadAudio.active = true"
                     v-show="audioStatus === 0">上传
          </mt-button>
          <mt-button type="danger" size="small"
                     v-show="audioStatus === 1">上传中
          </mt-button>
          <mt-button type="primary" size="small"
                     v-show="audioStatus === 2"
                     @click.native.prevent="$refs.uploadAudio.active = true">已上传
          </mt-button>
        </div>
        <p class="form-ft fs12 gray-dark">备注：录播语音需要审核，通过之后才能上架</p>
      </div>
      <div class="form-wp" v-show="params.period_type==2">
        <h3 class="form-hd">视频文件<span class="gray ml10 fs14">目前支持MP4、AVI、WMV格式</span></h3>
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
      <div class="form-wp">
        <mt-cell title="课程分类" is-link
                 :value="categoryName || '请选择'" @click.native="sheetVisible = true">
        </mt-cell>
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="primary" @click.native="handleNext">下一步</mt-button>
    </div>
    <mt-actionsheet :actions="actions" v-if="actions.length" v-model="sheetVisible"></mt-actionsheet>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
  <div class="scroll-wp" v-else>
    <div class="scroll-bd">
      <div class="select-hd">
        <h3>选择上课类型</h3>
        <p class="mt10 gray">选择后不可更改</p>
      </div>
      <div class="select-bd">
        <ul class="tab-hd">
          <li class="icon-free" :class="{active: tab== 0}" @click="selectType(0)"><i></i>公开</li>
          <li class="icon-private" :class="{active: tab == 3}" @click="selectType(3)"><i></i>加密</li>
          <li class="icon-cash" :class="{active: tab == 4}" @click="selectType(4)"><i></i>收费</li>
          <!-- <li class="icon-cash" :class="{active: params.pay_type == 1}"
               @click="params.pay_type = 1"><i></i>现金收费
           </li>
           <li class="icon-charge" :class="{active: params.pay_type == 2}"
               @click="params.pay_type = 2"><i></i>智豆收费
           </li>-->
        </ul>
        <ul class="tab-bd">
          <li v-if="tab == 0">
            <p>任何人都可以收听直播</p>
          </li>
          <li v-if="tab == 3">
            <label>设置一个固定密码</label>
            <input v-model.trim="params.pwd" type="text" placeholder="支持英文和数字，不区分大小写">
          </li>
          <li v-if="tab == 4">
            <div style="justify-content: space-between;display: flex;margin-bottom: .2rem">设置一个固定金额
              <select v-model="params.pay_type">
                <option value="1">现金收费</option>
                <option value="2">智豆收费</option>
              </select></div>
            <input v-model.trim="params.price" type="number" placeholder="最小金额1元" v-if="params.pay_type ==  1">
            <input v-model.trim="params.price" type="number" placeholder="最少1个智豆" v-if="params.pay_type ==  2">
          </li>
          <li v-if="tab == 4" class="mt20">
            <div style="justify-content: space-between;display: flex;margin-bottom: .2rem;align-items: center;">设置邀请奖励
              <mt-switch v-model="isInvite" style="padding: 0;"></mt-switch>
            </div>
            <div style="justify-content: space-between;display: flex;align-items: center;margin-bottom: .2rem">
              分成比例（%）<input v-model.trim="params.share_gain_rate" type="number"
                            placeholder="请输入分成比例，比例必须是整数"
                            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                            onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
                            style="flex: 1;">
            </div>
            <div style="justify-content: space-between;display: flex;align-items: center;" v-if="params.pay_type == 1">
              分成（¥）&nbsp;{{sharePrice}}
            </div>
            <div style="justify-content: space-between;display: flex;align-items: center;" v-if="params.pay_type == 2">
              分成（个豆）&nbsp;{{sharePrice}}
            </div>
          </li>
          <!--<li v-if="params.pay_type == 1">
            <label>设置一个固定金额</label>
            <input v-model.trim="params.price" type="number" placeholder="最小金额1元">
          </li>
          <li v-if="params.pay_type == 2">
            <label>设置一个固定智豆个数</label>
            <input v-model.trim="params.price" type="number" placeholder="最少1个智豆">
          </li>-->
        </ul>
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="default" @click.native="step = 1">上一步</mt-button>
      <mt-button type="primary" @click.native="handleSubmit">完成</mt-button>
    </div>
  </div>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  import {Indicator} from 'mint-ui'
  import {ajax} from '@/common/util'


  export default {
    data() {
      return {
        isInvite: false, // 是否设置邀请分享
        tab: 0,
        step: 1,
        audioFiles: [], // 音频文件
        videoFile: {}, //　视频文件
        categoryName: '', // 分类名称
        params: {
          course_type: 0, // 单课程
          name: '', // 课程主题
          category_id: 0, // 分类Id
          file_id: '', // 文件Id
          pay_type: 0,
          pwd: '',// 加密
          price: '', // 价格
          images: '',
          intro: '',
          period_type: 1, // 上传类型
          file_name: '',// 上传文件名
          share_gain_rate: '', // 分享提成比例
          is_share_gain: 0 // 0不是 1 是
        },
        sheetVisible: false,
        actions: [],
        audioUpload: {}, // 上传音频参数
        videoStatus: 0,// 上传视频状态 0 未上传，1 上传中，2上传完成
        audioStatus: 0 // 音频上传状态 0 未上传，1 上传中，2上传完成
      };
    },
    components: {
      FileUpload,
    },
    created() {
      this.getUploadAudioKey();
      this.getCourseClassify();
      // this.getSignature()
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
    methods: {
      selectType(num) {
        this.tab = num
        if (num == 4) {
          this.params.pay_type = 1
        } else {
          this.params.pay_type = num
        }
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
          Indicator.open();
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
                  Indicator.close()
                  vm.$toast('上传成功');
                  vm.videoStatus = 2
                  vm.params.file_id = result.fileId
                  vm.params.file_name = result.videoName
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
        for (let i = 0; i < arrType.length; i++) {
        }
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
      // 课程分类
      getCourseClassify() {
        this.API.courseGuide().then(((res) => {
          let list = res;
          list.forEach(item => {
            item.method = this.onSelect;
          })
          this.actions = list;
        })).catch((err) => {
          console.log(err);
        });
      },
      // 获取上传音频的参数
      getUploadAudioKey() {
        this.API.getAudioKey().then((res) => {
          console.log(res)
          this.audioUpload = res
        }).catch((err) => {
          console.log(err)
        })
      },
      // 选取分类
      onSelect(item) {
        this.params.category_id = item.id;
        this.categoryName = item.name;
      },
      // 下一步
      handleNext() {
        let message = '';
        let params = this.params;
        let categoryId = params.category_id;

        if (params.name.length < 2) {
          message = '课程主题不能少于2个字';
        } else if (params.period_type == 1 && !(params.file_id)) {
          message = '请先上传录音文件';
        } else if (params.period_type == 2 && !(params.file_id)) {
          message = '请先上传视频文件';
        } else if (!categoryId) {
          message = '请选择课程分类';
        }
        if (message) {
          this.$toast(message);
          return;
        }
        this.step = 2;
      },
      handleSubmit() {
        if (!this.tId) {
          let vm = this;
          let message = '';
          let params = this.params;
          console.log(this.isInvite)
          if (params.pay_type == 3 && !(/^[0-9a-zA-Z]+$/).test(params.pwd)) {
            message = '密码输入不正确';
          } else if (params.pay_type == 1 && params.price < 1) {
            message = '收费金额不能小于1';
          } else if (params.pay_type == 1 && params.price > 1000000) {
            message = '收费金额不能大于1000000';
          } else if (params.pay_type == 2 && params.price < 1) {
            message = '智豆数量不能少于1';
          } else if (params.pay_type == 2 && params.price > 1000000) {
            message = '智豆数量不能大于1000000';
          } else if (this.isInvite && !params.share_gain_rate) {
            message = '分享提成比例不能为空';
          } else if (this.isInvite && params.share_gain_rate < 0) {
            message = '分享提成比例大于0或小于100'
          } else if (this.isInvite && params.share_gain_rate > 100) {
            message = '分享提成比例大于0小于100'
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
          params.price = Math.floor(this.params.price * 10) / 10
          console.log(params)
          vm.API.generateCourse(params).then((res) => {
            if (res) {
              console.log(res)
              this.tId = true
              vm.$toast('创建成功');
              setTimeout(() => {
                vm.$router.push('/classroom/course/detail/' + res.id)
              }, 2000);
            }
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
          if (this.$refs.uploadAudio.active) {
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
              this.$refs.uploadAudio.active = false
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
    }
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

  .select-hd {
    margin: .5rem 0;
    text-align: center;
    h3 {
      font-size: .36rem;
    }
    p {
      font-size: .24rem;
    }
  }

  .select-bd {
    margin: 0 .4rem;
  }

  .tab-hd {
    display: flex;
    justify-content: space-between;
    li {
      position: relative;
      width: 1.6rem;
      height: 1.6rem;
      line-height: 1;
      text-align: center;
      background: $color-white;
      border: .02rem solid $color-border;
      color: $color-gray-dark;
      i {
        display: block;
        margin: .2rem auto;
        width: .76rem;
        height: .76rem;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
      }
      &.icon-free {
        i {
          background-image: url(./images/icon-free.png);
        }
      }
      &.icon-private {
        i {
          background-image: url(./images/icon-private.png);
        }
      }
      &.icon-charge {
        i {
          background-image: url(images/zhifu.png);
        }
      }
      &.icon-cash {
        i {
          background-image: url(images/icon-charge.png);
        }
      }
      &.active {
        border-color: $color-blue;
        color: $color-blue;
        &:before, &:after {
          position: absolute;
          bottom: -0.62rem;
          left: 50%;
          margin-left: -0.1rem;
          content: "";
          width: 0;
          height: 0;
          border: .2rem solid transparent;
          z-index: 2;
        }
        &:before {
          border-bottom-color: $color-border;
        }
        &:after {
          bottom: -0.63rem;
          border-bottom-color: $color-white;
        }
        &.icon-free {
          i {
            background-image: url(./images/icon-free-active.png);
          }
        }
        &.icon-private {
          i {
            background-image: url(./images/icon-private-active.png);
          }
        }
        &.icon-charge {
          i {
            background-image: url(images/zhifu-active.png);
          }
        }
        &.icon-cash {
          i {
            background-image: url(images/icon-charge-active.png);
          }
        }
      }
    }
  }

  .tab-bd {
    margin-top: .6rem;
    li {
      position: relative;
      padding: .25rem .2rem;
      background: $color-white;
      border: .01rem solid $color-border;
      p, label {
        display: block;
        padding: .1rem .2rem;
      }
      input {
        display: block;
        padding: .2rem .2rem;
        border: none;
        background: $color-bg;
        width: 100%;
        font-size: .24rem;
      }
    }
  }
</style>
