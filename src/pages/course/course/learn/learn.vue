<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <mt-swipe class="swipe-wp" :auto="4000">
        <mt-swipe-item>
          <img class="item" src="../../../../assets/banner.png" alt="">
        </mt-swipe-item>
      </mt-swipe>

      <div class="audio-player">
        <div class="audio-hd">
          <span class="audio-start">00:00</span>
          <div class="audio-progress">
            <span class="audio-progress-bar"></span>
            <span class="audio-progress-btn"></span>
          </div>
          <span class="audio-end">10:10</span>
        </div>
        <div class="audio-bd">
          <div class="audio-items" @click="popPlaylistVisible = 1">播放列表(33)</div>
          <div class="audio-control">
            <span class="btn-prev"></span>
            <span class="btn-play"></span>
            <span class="btn-next"></span>
          </div>
          <div class="audio-title">第1课</div>
        </div>
      </div>

      <div class="detail-info mt20">
        <h2 class="tit fs15">销售必备技巧：如何在10分钟内打动客户，成交生意仨大时代</h2>
        <div class="info mt10 fs12 gray">
          <p>时间<span class="ml10">2018-01-02  20:00:00</span></p>

        </div>
        <div class="info mt10 fs12 gray">
          <p>报名人数<span class="ml10">2345人</span></p>
          <span>1.6万次学习</span>
        </div>
      </div>

      <mt-cell class="cell-card" title="王小二的直播间">
        <img slot="icon" class="avatar" src="../../../../assets/avatar.png">
        <a class="btn-follow" :class="{ hide: isFollow }" href="javascript:void(0)"
         @click="isFollow = 1">关注</a>
        <a class="btn-follower ml10" :class="{ hide: !isFollow }" href="javascript:void(0)">已关注</a>
      </mt-cell>

      <ul class="nav-tab nav-tab-3 mt20">
        <li :class="{active: tab == 'chat'}" @click="tab = 'chat'">
          <a href="#">大厅</a>
        </li>
        <li :class="{active: tab == 'intro'}" @click="tab = 'intro'">
          <a href="#">课程简介</a>
        </li>
        <li :class="{active: tab == 'list'}" @click="tab = 'list'">
          <a href="#">其他课程</a>
        </li>
      </ul>

      <div class="chat-wp" v-if="tab == 'chat'">
        <ul class="chat-list">
          <li class="chat-item chat-you">
            <div class="chat-hd">
              <img class="chat-avatar" src="../../../../assets/avatar.png" alt="">
              <div class="chat-info">
                <div class="chat-nick">
                  <span>张老师</span>
                  <span class="chat-teacher">主持人</span>
                </div>
                <p class="chat-date">01-02  12:25:25</p>
              </div>
            </div>
            <div class="chat-bd">
              <div class="chat-content">
                <p>老师讲的不错，挺有收获的老师讲的不错，挺有收获的老师讲的不错，挺有收获的老师讲的不错，挺有收获的</p>
              </div>
            </div>
          </li>
          <li class="chat-item chat-prize">
            <div class="prize-hd tac gray">01-02  12:25:25</div>
            <div class="prize-bd prize-money mt10">
              <div class="prize-money">
                张三<span class="ml20 mr20">赞赏了</span>张老师 <span class="red">10元</span>
              </div>
            </div>
          </li>
          <li class="chat-item chat-you">
            <div class="chat-hd">
              <img class="chat-avatar" src="../../../../assets/avatar.png" alt="">
              <div class="chat-info">
                <div class="chat-nick">
                  <span>张同学</span>
                </div>
                <p class="chat-date">01-02  12:25:25</p>
              </div>
            </div>
            <div class="chat-bd">
              <div class="chat-content">
                <p>老师讲的不错</p>
              </div>
            </div>
          </li>
          <li class="chat-item chat-me">
            <div class="chat-hd">
              <div class="chat-info">
                <div class="chat-nick">
                  <span>我自己</span>
                </div>
                <p class="chat-date">01-02  12:25:25</p>
              </div>
              <img class="chat-avatar" src="../../../../assets/avatar.png" alt="">
            </div>
            <div class="chat-bd">
              <div class="chat-content">
                <p>我也觉得老师讲的不错</p>
              </div>
            </div>
          </li>
          <li class="chat-item chat-prize">
            <div class="prize-hd tac gray">01-02  12:25:25</div>
            <div class="prize-bd mt10">
              <div class="prize-token">
                李四<span class="ml20 mr20">赞赏了</span>张老师 <span class="red">100个豆</span>
              </div>
            </div>
          </li>
          <li class="chat-item chat-prize">
            <div class="prize-hd tac gray">01-02  12:25:25</div>
            <div class="prize-bd prize-money mt10">
              <div class="prize-money">
                张三<span class="ml20 mr20">赞赏了</span>张老师 <span class="red">10元</span>
              </div>
            </div>
          </li>
          <li class="chat-item chat-me">
            <div class="chat-hd">
              <div class="chat-info">
                <div class="chat-nick">
                  <span>我自己</span>
                </div>
                <p class="chat-date">01-02  12:25:25</p>
              </div>
              <img class="chat-avatar" src="../../../../assets/avatar.png" alt="">
            </div>
            <div class="chat-bd">
              <div class="chat-content">
                <p>我也觉得老师讲的不错。挺有收获的老师讲的不错，挺有收获的老师讲的不错，挺有收获的老师讲的不错，挺有收获的</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="detail-intro" v-else-if="tab == 'intro'">
        <div class="hd">主讲人: 王小二直播</div>
        <div class="bd">
          <p>课程涉及WIN10，WIN7，MAC系统安装与维护，电脑组装，网络维护，磁盘管理，
          硬件选购，常见耗材，数据恢复，可疑系统进程分析与限制，可疑系统服务设置与优化，
        常用设计软件设置与优化，重要数据备份，电脑常见故障解决方法等，
      从零开始学会高级电脑操作，提高工作效率障解决方法等</p>
          <img src="../../../../assets/cover.jpg" alt="" />
          <p class="tac">课程涉及WIN10，WIN7，MAC系统安装与维护</p>
          <img src="../../../../assets/banner.png" alt="" />
        </div>
      </div>

      <div class="list-wp" v-else>
        <course-item :item="item" v-for="item in [1,2,3,4,5,6]" :key="item"
         @click.native="$router.push('/series/detail')" />
        <a href="#" class="btn-more">展开全部</a>
      </div>
    </div>

    <div class="scroll-ft">
      <div class="form-wp">
        <div class="form-input mr20">
          <input type="text" placeholder="来说点什么吧" />
        </div>
        <div class="form-tool">
          <span class="btn-prize mr20">赏</span>
          <span class="btn-items"></span>
        </div>
      </div>
    </div>

    <div class="pop-playlist" v-show="popPlaylistVisible">
      <div class="pop-playlist-wp">
        <div class="pop-playlist-hd">
          <h3>播放列表</h3>
          <span class="btn-close-x" @click="popPlaylistVisible = 0"></span>
        </div>
        <div class="pop-playlist-bd">
          <course-item :item="item" v-for="item in [1,2,3,4,5,6]" :key="item"
           @click.native="$router.push('/course/detail')" />
          <a href="#" class="btn-more">展开全部</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 'chat',
      orderVisible: 1,
      popPlaylistVisible: 0,
      isFollow: 0,
      disabled: 0,
      actions: [
        { name: '亲自', value: 1, method: this.onSelect },
        { name: '教育', value: 2, method: this.onSelect },
      ],
    };
  },
  methods: {
    handleSubmit() {

    },
    handleOrder() {
      this.orderVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  @import "../../../../styles/audio-player.scss";
  @import "../../../../styles/chat.scss";
  @import "../../../../styles/pop-playlist.scss";

  .detail-info, .detail-intro, .detail-comment, .order-wp {
    background: $color-white;
  }

  .comment-item {
    padding: .2rem .3rem .3rem .2rem;
    border-bottom: .01rem solid $color-border;
    .hd {
      display: flex;
      align-items: center;
      p {
        flex: 1;
        max-height: 4.5em;
        overflow: hidden;
      }
    }
  }

  .form-wp {
    display: flex;
    //align-items: center;
    //width: 4.5rem;
    padding: .2rem .2rem;
    width: 100%;
    background: $color-bg;
    border-top: .01rem solid $color-border;
    .form-input {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0rem .3rem;
      //width: 5.4rem;
      height: .6rem;
      background: #e9ecee;
      border-radius: .3rem;
      input {
        display: block;
        width: 100%;
        height: .3rem;
        border: none;
        background: transparent;
      }
    }
    .form-tool {
      display: flex;
      .btn-prize, .btn-items {
        display: inline-block;
        width: .6rem;
        height: .6rem;
        border-radius: 50%;
        box-sizing: border-box;
      }
      .btn-prize {
        line-height: .54rem;
        text-align: center;
        background-color: #ff5f52;
        border: solid .06rem #ff9f97;
        color: #e6e6e6;;
      }
      .btn-items {
        background: #e5ebf0 url(../../../../assets/icon-list.png) no-repeat center center;
        background-size: 50%;
      }
    }
  }

  .detail-info {
    padding: .2rem;
    border-top: .01rem solid $color-border;
    .tit {
      max-height: .88rem;
      overflow: hidden;
    }
    .info {
      display: flex;
      justify-content: space-between;
    }
  }

  .avatar {
    margin-right: .2rem;
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
  }

  .detail-student {
    display: flex;
    align-items: center;
    padding: .15rem .2rem;
    border-bottom: .01rem solid $color-border;
    .hd {
      flex: 1;
    }
    .bd {
      .avatar {
        float: left;
        margin-right: .04rem;
      }
    }
    .ft {
      display: flex;
      align-items: center;
      i, &:before, &:after {
        display: block;
        margin-right: .07rem;
        width: .1rem;
        height: .1rem;
        overflow: hidden;
        border-radius: 50%;
        background: #7f7f7f;
      }
      &:before, &:after {
        content: "";
      }
    }
  }

  .btn-more {
    display: block;
    line-height: .9rem;
    text-align: center;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    color: $color-black;
  }

  .detail-student, .list-wp {
    background: $color-white;
  }

  .list-wp {
    margin-top: -0.01rem;
  }

  .nav-tab {
    display: flex;
    padding: .3rem .25rem 0;
    background: $color-white;
    border: .02rem solid $color-border;
    &.nav-tab-2 {
      padding: .3rem .8rem 0;
    }
    &.nav-tab-3 {
      padding: .3rem .45rem 0;
    }
    li {
      flex: 1;
      text-align: center;
      a {
        display: inline-block;
        padding-bottom: .3rem;
        min-width: 4em;
        line-height: 1;
        border-bottom: .03rem solid transparent;
        font-size: .3rem;
        color: $color-black;
      }
      &.active {
        a {
          color: $color-blue;
          border-color: $color-blue;
        }
      }
    }
  }

  .detail-intro {
    .hd {
      padding: .3rem .2rem;
      color: $color-gray;
    }
    .bd {
      padding: 0 .2rem .3rem;
      color: $color-gray-dark;
      p {
        margin-bottom: .2rem;
      }
      img {
        display: block;
        margin: .4rem auto .2rem;
        max-width: 100%;
      }
    }
  }
</style>
