<template>
  <!-- <input type="button" id="upload" value="上传"></input>-->
  <mt-button type="primary" @click="addWxContact">关注</mt-button>
</template>

<script>
  export default {
    name: 'test',
    data() {
      return {};
    },
    mounted() {
      // this.loadScript(this.loadUploader);
      // console.log(new Date().getTime())
      // this.addWxContact()
    },
    methods: {
      addWxContact() {
        alert(1)
        if (typeof WeixinJSBridge == 'undefined') return false;
        WeixinJSBridge.invoke('addContact', {
          webtype: '1',
          username: 'gh_f05d70ceba4f'
        }, function (d) {
          // 返回d.err_msg取值，d还有一个属性是err_desc
          // add_contact:cancel 用户取消
          // add_contact:fail　关注失败
          // add_contact:ok 关注成功
          // add_contact:added 已经关注
          alert(d.err_msg)
         /* WeixinJSBridge.log(d.err_msg);*/
        });
      },
      loadScript(callback) {
        if (!window.PolyvUpload) {
          const myScript = document.createElement('script');
          myScript.setAttribute('src', '//v.polyv.net/file/plug-in-v2/polyv-upload.js');
          myScript.onload = callback;
          document.body.appendChild(myScript);
        } else {
          callback();
        }
      },
      loadUploader() {
        const PolyvUpload = window.PolyvUpload;
        const obj = {
          uploadButtton: 'upload',
          userid: 'd5f941b27e',
          ts: new Date().getTime(),
          hash: '90515394976543d65b7ffa8e474633d0',
          sign: '1acd61d94b0d556c49bac3ff7703beca',
          component: 'uploadList',
          cataid: 1499657507273,
          luping: 1,
          extra: {
            keepsource: 1,
          },
          uploadSuccess: function (filedata) {
            cosnole.log(filedata)
            this.closeWrap()
          }
        };
        const upload = new PolyvUpload(obj);
        console.log(upload);
      },
    }
  };
</script>
