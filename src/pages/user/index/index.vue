/**
* @author zhangwenlong
* @date 2018/3/30
* @Description: 个人中心
*/
<template>
  <div class="scroll-wp" v-if="userInfo">
    <div class="scroll-bd">
      <div class="user-hd mt20">
        <mt-cell class="cell-card" :title="userInfo.name || ''" is-link to="/user/info">
          <img slot="icon" class="avatar" v-lazy="userInfo.avatar || $root.placeHolder.avatar">
        </mt-cell>
        <mt-cell class="cell-btn" v-if="userInfo.opened_space === 1">
          <mt-button slot="title" type="danger" :plain="true"
                     @click.native="$router.push('/classroom')">我的直播间
          </mt-button>
        </mt-cell>
        <mt-cell class="cell-btn" v-else-if="userInfo.opened_space === 0 && userInfo.is_apply_space===1 && userInfo.is_verify == 2">
          <mt-button slot="title" type="danger" :plain="true"
                     @click.native="$router.push('/classroom/create')">编辑直播间
          </mt-button>
        </mt-cell>
        <mt-cell class="cell-btn" v-else-if="userInfo.opened_space === 0 && userInfo.is_verify == 0 && userInfo.is_apply_space===1">
          <mt-button slot="title" type="danger" :plain="true">审核中</mt-button>
        </mt-cell>

        <mt-cell class="cell-btn" v-else>
          <mt-button slot="title" type="danger" :plain="true"
                     @click.native="$router.push('/classroom/create')">一键创建直播间
          </mt-button>
        </mt-cell>
      </div>
      <div class="user-bd">
        <mt-cell v-if="userInfo.opened_space" is-link to="/user/wallet">
          <span slot="title" class="red">现金收益</span>
          <img slot="icon" src="./images/icon1.png" width="21" height="15">
        </mt-cell>
        <mt-cell is-link to="/user/token">
          <span slot="title" class="red">智豆</span>
          <img slot="icon" src="./images/icon2.png" width="20" height="16">
        </mt-cell>
        <mt-cell title="实名认证" v-if="userInfo.is_verify== 1">
          <img slot="icon" src="./images/icon3.png" width="21" height="17">
          <span class="green">认证通过</span>
        </mt-cell>
        <mt-cell title="实名认证" v-else-if="userInfo.is_verify == 0">
          <img slot="icon" src="./images/icon3.png" width="21" height="17">
          <span class="green">认证中</span>
        </mt-cell>
        <mt-cell title="实名认证" to="/user/auth" is-link v-else-if="userInfo.is_verify == 2">
          <img slot="icon" src="./images/icon3.png" width="21" height="17">
          <span>认证不通过</span>
        </mt-cell>
        <mt-cell title="实名认证" to="/user/auth" is-link v-else>
          <img slot="icon" src="./images/icon3.png" width="21" height="17">
          <span>未认证</span>
        </mt-cell>
        <mt-cell title="邀请好友" is-link to="/invite">
          <img slot="icon" src="./images/icon5.png" width="19" height="20">
        </mt-cell>
        <!--<mt-cell title="关注我们" is-link to="">
          <img slot="icon" src="./images/icon4.png">
        </mt-cell>-->
        <mt-cell title="常见问题" is-link to="/user/help">
          <img slot="icon" src="./images/icon6.png" width="20" height="20">
        </mt-cell>
        <mt-cell title="联系客服" is-link @click.native="tel">
          <img slot="icon" src="./images/icon7.png" width="18" height="22">
        </mt-cell>
      </div>
    </div>
    <Tabbar/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: null,
      };
    },
    created() {
      this.API.userBaseInfo().then((res) => {
        if (res) {
          console.log(res)
          this.userInfo = res;
          sessionStorage.setItem('user',JSON.stringify(res))
          localStorage.setItem('invite_code',res.invite_code)
        }
      })
    },
    methods: {
      tel() {
        window.location.href = 'tel:020-29874526';
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin.scss";

  .cell-card {
    min-height: 1.6rem;
  }

  .cell-btn {
    min-height: 1.4rem;
    text-align: center;
  }

  .avatar {
    margin-right: .2rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
  }

  .user-bd {
    flex: 1;
    margin-top: .2rem;
    line-height: .48rem;
    background: $color-white;
  }

  .user-bd img {
    margin-right: .2rem;
  }
</style>
