<template>
  <div class="page-wp">
    <mt-cell title="头像" is-link @click.native="showUpload">
      <img class="avatar" v-lazy="userInfo.avatar || $root.placeHolder.avatar" width="24" height="24">
    </mt-cell>

    <mt-cell title="ID" :value="userInfo.id"></mt-cell>

    <mt-cell title="名称" :value="userInfo.name" is-link @click.native="showPrompt"></mt-cell>

    <mt-cell title="手机号" :value="userInfo.mobile"></mt-cell>

    <mt-cell title="修改密码" is-link to="/modifyPwd"></mt-cell>

    <mt-button class="btn-logout" type="primary" @click="handleLogout">退出</mt-button>

    <div class="pop-upload" v-if="uploadVisible">
      <div class="upload-wp">
        <div class="upload-hd">
          <h3>上传头像</h3>
          <span class="btn-close-x" @click="uploadVisible = false"></span>
        </div>
        <div class="upload-bd tac">
          <upload-image :success="upload.success">
            <img class="avatar" v-lazy="uploadAvatar.avatar || $root.placeHolder.avatar" alt="">
            <p class="mt20">点击上传头像</p>
          </upload-image>
        </div>
        <div class="upload-ft">
          <mt-button class="btn-cancle" type="default" @click="uploadVisible = false">取消</mt-button>
          <mt-button class="btn-confirm" type="primary" @click="handleSaveAvatar">确定</mt-button>
        </div>
      </div>
    </div>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        uploadVisible: false,
        uploadAvatar: null,
        userInfo: null,
        upload: {
          success: (data) => {
            this.uploadCallback(data);
          }
        },
      };
    },
    created() {
      /*this.API.userBaseInfo().then((res) => {
        this.userInfo = res;
      }).catch((err) => {
        console.log(err)
      });*/
      this.userInfo = JSON.parse(sessionStorage.getItem('user'))
    },
    methods: {
      showPrompt() {
        this.$messagebox.prompt('请输入名称', {inputValue:this.userInfo.name}).then(({value}) => {
          this.API.userUpdateInfo({name: value}).then((res) => {
            if (res) {
              this.$toast('操作成功');
              this.userInfo.name = value;
            }
          }).catch((res) => {
            console.log(res)
          })
        });
      },
      showUpload() {
        this.uploadVisible = true
        this.uploadAvatar = this.userInfo
      },
      handleLogout() {
        const vm = this;

        this.API.logout().then((res) => {
          if (res) {
            this.$toast('退出成功');
            setTimeout(() => {
              sessionStorage.removeItem('user')
              vm.$router.push('/oauth');
            }, 2000);
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      uploadCallback(data) {
        this.uploadAvatar = data;
        this.uploadAvatar.avatar = data.url;
      },
      handleSaveAvatar() {
        let avatar = this.uploadAvatar.avatar;
        let fileId = this.uploadAvatar.fileId;

        if (!avatar) {
          this.$toast('请先上传头像');
          return;
        }
        this.uploadAvatar = 0;
        this.API.userUpdateInfo({avatar: fileId}).then((res) => {
          if (res) {
            this.$toast('操作成功');
            this.userInfo.avatar = avatar;
            this.uploadVisible = false
          }
        }).catch((err) => {
          console.log(err)
        });
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin.scss";

  .avatar {
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
  }

  .btn-logout {
    position: absolute;
    bottom: 1.8rem;
    left: .25rem;
    display: block;
    width: 7rem;
    border-radius: .4rem;
    background: linear-gradient(left, $color-red-begin, $color-red-end) no-repeat;
  }

  .pop-upload {
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      bottom: 0;
      z-index: 998;
      background: rgba(0, 0, 0, .5);
    }
    .upload-wp {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 999;
      width: 7rem;
      background: $color-white;
      border-radius: .06rem;
      transform: translate(-50%, -50%);
    }
    .upload-hd {
      position: relative;
      margin: .2rem;
      padding-bottom: .2rem;
      border-bottom: .01rem solid $color-border;
      .btn-close-x {
        position: absolute;
        top: .05rem;
        right: .1rem;
      }
    }
    .upload-bd {
      flex-direction: column;
      padding: .3rem .2rem;
      .avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
    }
    .upload-bd, .upload-ft {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .upload-ft {
      padding: .2rem .2rem .5rem;
    }
    .btn-confirm {
      margin-left: .6rem;
    }
  }
</style>
