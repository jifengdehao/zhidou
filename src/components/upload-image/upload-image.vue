/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 上传图片
*/
<template>
  <div class="upload">
    <slot></slot>
    <input type="file" class="upload" @change="fileChange" :accept="accepts" ref="upload">
  </div>
</template>

<script>
  import {Indicator} from 'mint-ui'

  export default {
    props: {
      /*apiUrl: String,
      params: {
        isSend: Boolean,
      },*/
      isAuto: {
        type: Boolean,
        default: true,
      },
      apiMethod: {
        type: String,
        default: 'uploadImage64',
      },
      success: Function
    },
    data() {
      return {
        percent: 0,
        files: [],
        accepts: 'image/*'
      }
    },
    methods: {
      fileChange(e) {
        let self = this;
        if (e.target.files.length == 0) return false
        // 读取本地图片转成base64显示到页面待使用
        Indicator.open()
        let size = e.target.files[0].size
        let minSize = 512000
        let maxSize = 1048576
        let TwoMaxSize = 2097152
        let fr = new FileReader()
        fr.readAsDataURL(e.target.files[0]);
        fr.onload = e => {
          if (!!self.isAuto) {
            // 图片 小于500kb 不压缩
            if (size < minSize) {
              self.$refs.upload.setAttribute('type', 'text')
              self.uploadToSever(e.target.result)
            } else if (size < maxSize) {
              self.$refs.upload.setAttribute('type', 'text')
              self.canvasDataURL(e.target.result, {quality: 0.7}, function (base64Codes) {
                self.uploadToSever(base64Codes)
              })
            } else if (size < TwoMaxSize) {
              self.$refs.upload.setAttribute('type', 'text')
              self.canvasDataURL(e.target.result, {quality: 0.5}, function (base64Codes) {
                self.uploadToSever(base64Codes)
              })
            } else {
              self.$refs.upload.setAttribute('type', 'text')
              self.canvasDataURL(e.target.result, {quality: 0.4}, function (base64Codes) {
                self.uploadToSever(base64Codes)
              })
            }
          } else {
            self.success(e.target.result);
          }
        }
      },
      canvasDataURL(path, obj, callback) {
        let img = new Image();
        img.src = path;
        img.onload = function () {
          let that = this;
          // 默认按比例压缩
          let w = that.width,
            h = that.height,
            scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          let quality = 0.7;  // 默认图片质量为0.7
          //生成canvas
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          // 创建属性节点
          let anw = document.createAttribute("width");
          anw.nodeValue = w;
          let anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // gif 压缩不了
          if(/gif/ig.test(that.src)){
            var base64 = that.src
          }else{
            var base64 = canvas.toDataURL('image/jpeg', quality);
          }
          // quality值越小，所绘制出的图像越模糊
          // 回调函数返回base64的值
          callback(base64);
        }
      },
      uploadToSever(data) {
        let vm = this;
        this.API[this.apiMethod]({upimg: data}).then((res) => {
          console.log(res);
          vm.success(res);
          vm.$refs.upload.setAttribute('type', 'file')
          Indicator.close()
        }).catch((err) => {
          vm.$toast(err.message);
          vm.$refs.upload.setAttribute('type', 'file')
          Indicator.close()
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .upload {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: inherit;
  }

  .upload > input {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    cursor: pointer;
  }

  .upload .progress {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, .8);
  }

  /*.upload .progress span{
      box-sizing: border-box;
      display: block;
      height:100%;
      width:0%;
      border-bottom:5px solid rgba(164, 208, 99,.8);
  }
  .upload .progress em{
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
      font-size:.8rem;
      line-height: 100%;
      color:#fff;
  }
  .loading{
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
  }*/
</style>
