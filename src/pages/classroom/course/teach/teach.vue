/**
* @author zhangwenlong
* @date 2018/4/2
* @Description: 单科程直播间
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd" ref="scrollBody">
      <div v-if="course.file_type == 1">
        <div class="swipe-wp" style="height: 4.7rem;">
          <slider v-if="banner.length > 0">
            <div v-for="(item, key) in banner" :key="key">
              <a href="javascript:;">
                <img :src="item || $root.placeHolder.banner" style="height: 4.7rem;"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="audio-player">
          <div class="audio-hd">
            <span class="audio-start">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                @percentChange="percentChange"></progress-bar>
            </div>
            <span class="audio-end">{{format(duration)}}</span>
          </div>
          <div class="audio-bd">
            <div class="audio-items">播放列表(1)</div>
            <div class="audio-control">
              <span class="btn-prev prev-dis"></span>
              <span :class="playIcon" @click="togglePlaying"></span>
              <span class="btn-next next-dis"></span>
            </div>
            <div class="audio-title">第1课</div>
          </div>
        </div>
      </div>
      <!-- 设置播放器容器 -->
      <div v-if="course.file_type === 2" style="padding-top: 4rem">
        <div class="fixedVideo">
          <video id="player"
                 preload="auto"
                 playsinline
                 webkit-playinline
                 x5-playinline
                 controls class="video">
          </video>
        </div>
      </div>
      <div class="detail-info mt20">
        <h2 class="tit fs15" v-html="formatTitle(course.title)"></h2>
        <div class="info mt10 fs12 gray">
          <p>{{course.times | formatDate }}</p>
          <div class="income">
            <span class="prize-money mr20">{{course.price_count}}</span>
            <span class="prize-token mr20">{{course.bean_count}}</span>
          </div>
        </div>
      </div>

      <ul class="nav-tab nav-tab-3 mt20">
        <li :class="{active: tab == 'chat'}" @click="tab='chat'">
          <a href="javascript:;">大厅</a>
        </li>
        <li :class="{active: tab == 'intro'}" @click="tab='intro'">
          <a href="javascript:;">课程简介</a>
        </li>
        <li :class="{active: tab == 'list'}" @click="tab='list'">
          <a href="javascript:;">用户列表</a>
        </li>
      </ul>

      <div class="chat-wp" v-show="tab == 'chat'"
           v-infinite-scroll="loadMoreComment"
           infinite-scroll-disabled="loadingComment"
           infinite-scroll-distance="10">
        <ul class="chat-list">
          <template v-for="item in comment">
            <li class="chat-item chat-you" v-if="item.is_anchor && item.type == 0">
              <div class="chat-hd">
                <img class="chat-avatar" :src="item.avatar || $root.placeHolder.avatar">
                <div class="chat-info">
                  <div class="chat-nick">
                    <span>{{item.name}}</span>
                    <span class="chat-teacher">主持人</span>
                  </div>
                  <p class="chat-date">{{item.times | formatDate }}</p>
                </div>
              </div>
              <div class="chat-bd">
                <div class="chat-content">
                  <p>{{item.con}}</p>
                </div>
              </div>
            </li>
            <li class="chat-item chat-you" v-else-if="item.is_anchor && item.type == 1">
              <div class="chat-hd">
                <img class="chat-avatar" :src="item.avatar || $root.placeHolder.avatar">
                <div class="chat-info">
                  <div class="chat-nick">
                    <span>{{item.name}}</span>
                    <span class="chat-teacher">主持人</span>
                  </div>
                  <p class="chat-date">{{item.times | formatDate }}</p>
                </div>
              </div>
              <div class="chat-bd">
                <div class="chat-content">
                  <img :src="item.con"/>
                </div>
              </div>
            </li>
            <li class="chat-item chat-me" v-else-if="item.is_own && item.type == 0">
              <div class="chat-hd">
                <div class="chat-info">
                  <div class="chat-nick">
                    <span>我自己</span>
                  </div>
                  <p class="chat-date">{{item.times | formatDate }}</p>
                </div>
                <img class="chat-avatar" :src="item.avatar || $root.placeHolder.avatar" alt="">
              </div>
              <div class="chat-bd">
                <div class="chat-content">
                  <p>{{item.con}}</p>
                </div>
              </div>
            </li>
            <li class="chat-item chat-me" v-else-if="item.is_own && item.type == 1">
              <div class="chat-hd">
                <div class="chat-info">
                  <div class="chat-nick">
                    <span>我自己</span>
                  </div>
                  <p class="chat-date">{{item.times | formatDate }}</p>
                </div>
                <img class="chat-avatar" :src="item.avatar || $root.placeHolder.avatar" alt="">
              </div>
              <div class="chat-bd">
                <div class="chat-content">
                  <img :src="item.con"/>
                </div>
              </div>
            </li>
            <li class="chat-item chat-prize" v-else-if="item.type == 2">
              <div class="prize-hd tac gray">{{item.times | formatDate}}</div>
              <div class="prize-bd mt10">
                <div class="prize-token">
                  {{item.name}}<span class="ml20 mr20">赞赏了!</span><span class="red">{{item.con}}个豆</span>
                </div>
              </div>
            </li>
            <li class="chat-item chat-prize" v-else-if="item.type == 3">
              <div class="prize-hd tac gray">{{item.times | formatDate}}</div>
              <div class="prize-bd prize-money mt10">
                <div class="prize-money">
                  {{item.name}}<span class="ml20 mr20">赞赏了!</span><span class="red">{{item.con}}元</span>
                </div>
              </div>
            </li>
            <li class="chat-item chat-you" v-else-if="item.type == 1">
              <div class="chat-hd">
                <img class="chat-avatar" :src="item.avatar || $root.placeHolder.avatar">
                <div class="chat-info">
                  <div class="chat-nick">
                    <span>{{item.name}}</span>
                  </div>
                  <p class="chat-date">{{item.times | formatDate }}</p>
                </div>
              </div>
              <div class="chat-bd">
                <div class="chat-content">
                  <img :src="item.con"/>
                </div>
              </div>
            </li>
            <li class="chat-item chat-you" v-else>
              <div class="chat-hd">
                <img class="chat-avatar" :src="item.avatar || $root.placeHolder.avatar">
                <div class="chat-info">
                  <div class="chat-nick">
                    <span>{{item.name}}</span>
                  </div>
                  <p class="chat-date">{{item.times | formatDate }}</p>
                </div>
              </div>
              <div class="chat-bd">
                <div class="chat-content">
                  <p>{{item.con}}</p>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="detail-intro" v-show="tab == 'intro'">
        <div v-if="intro.length>0">
          <div class="hd">主讲人: {{ course.author }}</div>
          <div class="bd">
            <template v-for="item in intro">
              <img :src="item.url" v-if="item.url"/>
              <p v-if="item.dec" v-html="formatSolution(item.dec)"></p>
            </template>
          </div>
        </div>
        <div class="tac" v-else style="padding: .5rem;">暂无课程简介</div>
      </div>
      <!--用户列表-->
      <div class="list-wp user-list" v-show="tab == 'list'"
           v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
        <mt-cell :title="item.name" :item="item" v-for="(item,index) in students" :key="index" v-if="students.length>0">
          <img class="avatar" slot="icon" :src="item.avatar || $root.placeHolder.avatar">
        </mt-cell>
        <div class="tac" style="padding: .5rem;">暂无用户列表</div>
      </div>
    </div>
    <!--底部-->
    <div class="scroll-ft">
      <div class="form-wp">
        <div class="form-input mr20">
          <input type="text" placeholder="来说点什么吧" v-model.trim="commentText"/>
        </div>
        <div class="form-btn" @click="sendComment" v-if="commentText">
          <span>发送</span>
        </div>
        <div class="form-tool" v-else>
          <upload-image
            :success="upload.success">
            <span class="btn-pic"></span>
          </upload-image>
        </div>
      </div>
    </div>
    <audio :src="course.file"
           preload="auto"
           ref="audio"
           @ended="ended"
           @error="error"
           @timeupdate="updateTime"
           @canplay="canplay" v-if="course.file_type==1"></audio>
    <router-link tag="div" class="link-home" to="/"></router-link>
  </div>
</template>

<script>
  const audioSrc = 'http://dev.zhidou.com/upaudio/fe/38/bb/fe38bbbdb3bcdc8b9e558bc9f56c9e3e018.mp3'
  import ProgressBar from '@/components/progress-bar/progress-bar'
  import FileUpload from 'vue-upload-component'
  import {ShareTimeline, ShareAppMessage} from '@/common/weixin'
  import Slider from '@/components/slider/slider'

  export default {
    data() {
      return {
        audioSrc: audioSrc, // 音频播放地址
        playing: false, // 播放控制
        playError: false, // 播放错误
        currentTime: 0, // 当前播放时间
        duration: 0, // 播放的总时长
        id: this.$route.params.id, //单课Id
        course: {}, // 课程详情
        students: [], // 用户列表
        intro: [], // 课程简介
        comment: [], // 大厅
        page: 1,  // 请求数据分页 默认第一页
        commentText: '', // 评论
        tab: 'chat',
        upload: {           // 上传图片
          success: (data) => {
            this.uploadCallback(data);
          }
        },
        loading: false,
        loadingComment: false,
        commentPage: 1,
        banner: []
      };
    },
    components: {
      ProgressBar,
      FileUpload,
      Slider
    },
    created() {
      this.getCourseDetails(this.id)
    },
    computed: {
      playIcon() {
        return this.playing ? 'btn-pause' : 'btn-play'
      },
      percent() {
        return this.currentTime / this.duration
      }
    },
    // 销毁播放器
    beforeDestroy() {
      if (this.player) {
        this.player.dispose()
        this.player = null
      }
    },
    methods: {
      formatTitle(s) {
        if (s) {
          return s.replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      formatSolution(s) {
        if (s) {
          return s.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      // 用户列表
      loadMore() {
        this.loading = true
        this.API.courseUserList(this.id, this.page).then((res) => {
          if (res._items.length > 0) {
            this.students = this.students.concat(res._items)
            if (res._meta.pageCount > this.page) {
              this.page++
              this.loading = false
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 聊天大厅
      loadMoreComment() {
        this.loadingComment = true
        setTimeout(() => {
          this.API.classComment({id: this.course.id, statu: 0, page: this.commentPage}).then((res) => {
            if (res._items.length > 0) {
              this.comment = this.comment.concat(res._items)
              if (res._meta.pageCount > this.commentPage) {
                this.commentPage++
                this.loadingComment = false
              }
            }
          }).catch((err) => {
            console.log(err)
          });
        }, 400)
      },

      // 获取音频总时长
      canplay(ev) {
        this.duration = parseInt(ev.target.duration)
      },
      // 拖动播放
      percentChange(percent) {
        const currentTime = this.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      // 暂停和播放
      togglePlaying() {
        if (this.playError) {
          return
        }
        let audio = this.$refs.audio
        if (this.playing) {
          audio.pause()
        } else {
          audio.play()
        }
        this.playing = !this.playing
      },
      // 获取播放时间
      updateTime(ev) {
        this.currentTime = parseInt(ev.target.currentTime)
      },
      // 格式化时间
      format(interval) {
        interval = Math.floor(interval)
        const minute = Math.floor(interval / 60)
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      // 格式化时间
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      // 播放完成
      ended() {
        this.playing = false
      },
      // 播放失败
      error() {
        this.$toast('音频播放失败')
        setTimeout(() => {
          this.playing = false
          this.playError = true
        }, 3000)
      },
      // 获取课程详情
      getCourseDetails(id) {
        this.API.courseStudySingle(id).then((res) => {
          console.log(res);
          this.course = res.course
          this.intro = res.course.note
          if (res.course.img.length > 0) {
            this.banner = res.course.img
          }
          if (res.course.file_type == 2) {
            setTimeout(() => {
              this.player = TCPlayer('player', { // 播放器容器ID，必须与html中一致
                fileID: res.course.file, // 请传入需要播放的视频filID 必须
                appID: '1256380617', // 请传入点播账号的appID 必须
                autoplay: false, //是否自动播放
                //其他参数请在开发文档中查看
                playbackRateMenuButton: false
              });
            }, 20)
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // 添加评论 文字
      sendComment() {
        if (this.commentText) {
          let params = {
            content: this.commentText,
            type: 0,
            period_id: this.course.id
          }
          this.API.commentPeriod(params).then((res) => {
            if (res) {
              this.comment.push(res)
              this.commentText = ''
              this.$nextTick(() => {
                this.$refs.scrollBody.scrollTop = this.$refs.scrollBody.scrollHeight
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      // 添加评论 上传图片的回调
      uploadCallback(data) {
        let params = {
          content: data.fileId,
          type: 1,
          period_id: this.course.id
        }
        this.API.commentPeriod(params).then((res) => {
          if (res) {
            this.comment.push(res)
            this.commentText = ''
            this.$nextTick(() => {
              this.$refs.scrollBody.scrollTop = this.$refs.scrollBody.scrollHeight
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  @import "../../../../styles/audio-player.scss";
  @import "../../../../styles/chat.scss";
  @import "../../../../styles/pop-playlist.scss";

  .fixedVideo {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 4rem;
    z-index: 44;
    width: 7.5rem;
    margin: 0 auto;
  }

  .next-dis {
    background-image: url("next-dis.png") !important;
  }

  .prev-dis {
    background-image: url("prev-dis.png") !important;
  }

  .shang_modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    &:before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      z-index: 998;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .3);
    }
    .content {
      background: $color-white;
      z-index: 1000;
      width: 80%;
      position: relative;
      padding: .5rem 0;
      .btn-close-x {
        position: absolute;
        top: .2rem;
        right: .2rem;
      }
      .tab-content {
        padding: .25rem;
        .other {
          color: #0000ff;
        }
        .price-list {
          display: flex;
          margin-bottom: .2rem;
          & > li {
            flex: 1;
            text-align: center;
            height: 1rem;
            line-height: 1rem;
            border: 1px solid #ff5f52;
            color: #ff5f52;
          }
          & > li:nth-child(2) {
            margin: 0 .2rem;
          }
        }
      }
      .tab {
        margin-top: 20px;
        display: flex;
        line-height: .8rem;
        text-align: center;
        & > li {
          flex: 1;
        }
        .active {
          color: #ff5f52;
          border-bottom: solid 1px #ff9f97;
        }
      }
    }
  }

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
    .form-btn {
      width: 1rem;
      flex: 0 0 1rem;
      height: .6rem;
      text-align: center;
      line-height: .6rem;
      border: 1px solid #f6f8fa;
    }
    .form-tool {
      display: flex;
      .btn-prize, .btn-items, .btn-pic {
        display: inline-block;
        width: .6rem;
        height: .6rem;
        border-radius: 50%;
        box-sizing: border-box;
      }
      .btn-prize {
        width: 1rem;
        line-height: .5rem;
        text-align: center;
        background-color: #ff5f52;
        border: solid .06rem #ff9f97;
        color: #e6e6e6;;
      }
      .btn-items {
        background: #e5ebf0 url(../../../../assets/icon-list.png) no-repeat center center;
        background-size: 50%;
      }
      .btn-pic {
        background: #e5ebf0 url(../../../../assets/icon-pic.png) no-repeat center center;
        background-size: 70%;
      }
    }
  }

  .user-list {
    .btn-forbid {
      width: .32rem;
      height: .32rem;
      background: url(../../../../assets/icon-forbid-speak.png) no-repeat center center;
      background-size: contain;
      &.active {
        background-image: url(../../../../assets/icon-forbid-speak-active.png);
      }
    }
  }

  .detail-info {
    padding: .2rem;
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    .tit {
      max-height: .88rem;
      overflow: hidden;
    }
    .info {
      display: flex;
      justify-content: space-between;
    }
    .income {
      display: flex;
      .prize-money, .prize-token {
        //padding: .14rem;
        //background: #ffcc66;
        //color: $color-white;
        //border-radius: .04rem;
        &:before {
          content: "";
          float: left;
          margin-right: .1rem;
          width: .32rem;
          height: .32rem;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
        }
      }
      .prize-money {
        &:before {
          background-image: url(../../../../assets/icon-hongbao.png);
        }
      }
      .prize-token {
        &:before {
          background-image: url(../../../../assets/icon-token-red.png);
        }
      }
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
      padding: .2rem;
      color: $color-gray-dark;
      p {
        margin-bottom: .2rem;
      }
      img {
        display: block;
        max-width: 100%;
      }
    }
  }
</style>
