<template>
  <div class="page-wp">
    <form method="post" action="https://v.polyv.net/uc/services/rest?method=uploadfile" enctype="multipart/form-data">
      <input type="file" id="Filedata" name="Filedata" accept=".avi, .wmv, .mp4, .mp3, .mov, .flv, .mkv, .rmvb">
      <input type="hidden" id="JSONRPC" name="JSONRPC" value='{"title": "upload上传视频", "tag": "标签", "desc": "视频文档描述"}'>
      <input type="hidden" id="writetoken" name="writetoken" value="4cba986c-cdd9-4674-a86d-0d341ad32e10">
      <input type="submit" name="submit1" value="上传">
    </form>
    <br/>
    <file-upload
      name="Filedata"
      input-id="Filedata"
      post-action="https://v.polyv.net/uc/services/rest?method=uploadfile"
      :data="{writetoken: '4cba986c-cdd9-4674-a86d-0d341ad32e10',JSONRPC:JSON.stringify(JSONRPC)}"
      :value="files"
      @input="updatetValue"
      :multiple="false"
      ref="upload">
      <span class="upload-select">选择文件</span>
      <span class="upload-filename">{{ files[0] && files[0].name }}</span>
    </file-upload>
    <mt-button type="primary" size="small" v-if="!$refs.upload || !$refs.upload.active"
               @click.native.prevent="$refs.upload.active = true">上传
    </mt-button>
    <mt-button type="danger" size="small" v-else
               @click.native.prevent="$refs.upload.active = false">取消
    </mt-button>
    <div ref="player"></div>
  </div>
</template>

<script>
  import FileUpload from 'vue-upload-component'

  export default {
    name: 'test-video',
    components: {
      FileUpload
    },
    data() {
      return {
        files: [],
        JSONRPC: {
          title: 'upload上传视频',
          tag: '标签',
          desc: '视频文档描述'
        }
      }
    },
    created() {

    },
    mounted() {
      const player = polyvPlayer({
        wrap: this.$refs.player,
        width: 'auto',
        height: '300',
        vid: 'e8888b74d1229efec6b4712e17cb6b7a_e'
      });
    },
    methods: {
      updatetValue(value) {
        console.log(value)
      },
      inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          // Before adding a file
          // 添加文件前
          // Filter system files or hide files
          // 过滤系统文件 和隐藏文件
          if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
            return prevent()
          }
          // Filter php html js file
          // 过滤 php html js 文件
          if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
            return prevent()
          }
        }
      },
      inputFile(newFile, oldFile) {
        if (newFile && !oldFile) {
          // add
          console.log('add', newFile)
        }
        if (newFile && oldFile) {
          // update
          console.log('update', newFile)
        }
        if (!newFile && oldFile) {
          // remove
          console.log('remove', oldFile)
        }
      }
    }
  }
</script>

<style scoped>

</style>
