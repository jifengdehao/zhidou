/**
* @author zhangwenlong
* @date 2018/4/2
* @Description: 系列课单科程直播间
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <mt-swipe class="swipe-wp" :auto="4000">
        <mt-swipe-item v-for="(item,index) in swiper" :key="index">
          <img class="item" :src="item.url || $root.placeHolder.banner">
        </mt-swipe-item>
      </mt-swipe>

      <div class="audio-player">
        <div class="audio-hd">
          <span class="audio-start">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              :percent="percent"
              @percentChange="percentChange"></progress-bar>
          </div>
          <!--<div class="audio-progress">
            <span class="audio-progress-bar"></span>
            <span class="audio-progress-btn"></span>
          </div>-->
          <span class="audio-end">{{format(duration)}}</span>
        </div>
        <div class="audio-bd">
          <div class="audio-items" @click="popPlaylistVisible = true">播放列表({{periodList.length}})</div>
          <div class="audio-control">
            <span class="btn-prev" @click="prev"></span>
            <span :class="playIcon" @click="togglePlaying"></span>
            <span class="btn-next" @click="next"></span>
          </div>
          <div class="audio-title">第{{(currentIndex+1)}}课</div>
        </div>
      </div>

      <div class="detail-info mt20">
        <h2 class="tit fs15">{{course.title}}</h2>
        <div class="info mt10 fs12 gray">
          <p>{{course.times | formatDate }}</p>
         <!-- <div class="income">
            <span class="prize-money mr20">{{course.price_count}}</span>
            <span class="prize-token mr20">{{course.bean_count}}</span>
          </div>-->
        </div>
        <div class="info gray fs12 mt10">
          <p>报名人数&nbsp;&nbsp;{{studentCount}}人</p><p>{{course.view_count}}次学习</p>
        </div>
        <mt-cell class="cell-card mt20" :title="teacher.space_name" @click.native="goToTeacher(teacher.id)">
          <img slot="icon" class="avatar" :src="teacher.avatar || $root.placeHolder.avatar">
          <a class="btn-follow" href="javascript:void(0)" v-if="user.is_followed == 0"
             @click.stop="follewClass(teacher.id)">关注</a>
          <a class="btn-follower" href="javascript:void(0)" v-else @click.stop="follewClass(teacher.id)">已关注</a>
        </mt-cell>
      </div>

      <ul class="nav-tab nav-tab-3 mt20">
        <li :class="{active: tab == 'chat'}" @click="tab = 'chat'">
          <a href="#">大厅</a>
        </li>
        <li :class="{active: tab == 'intro'}" @click="tab = 'intro'">
          <a href="#">课程简介</a>
        </li>
        <li :class="{active: tab == 'order'}" @click="tab = 'order'">
          <a href="#">其他课程</a>
        </li>
      </ul>
      <div class="chat-wp" v-if="tab == 'chat'">
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

      <div class="detail-intro" v-else-if="tab == 'intro'">
        <div v-if="intro">
          <div class="hd">主讲人: {{ course.author }}</div>
          <div class="bd">
            <template v-for="item in intro">
              <img :src="item.url" alt=""/>
              <p>{{item.dec}}</p>
            </template>
          </div>
        </div>
        <div class="tac" v-else style="padding: .5rem;">暂无课程简介</div>
        <div class="explain" v-if="course.pay_type===1">
          <h3>购买须知</h3>
          <p class="mt10">1、该课程为付费系列课程，按课程计划定期更新，每节课程可在开课时直播学习，也可以反复会听</p>
          <p>2、该课程为虚拟内容服务，购买成功后概不退款，敬请原谅</p>
        </div>
      </div>
      <div class="other-class" v-else>
        <course-item v-for="(item, key) in otherClass" :key="key" :item="item" type="index"
                     @click.native="getToClassDetails(item)"/>
      <!--<div class="list-wp user-list" v-else>
        <mt-cell :title="item.name" :item="item" v-for="(item,index) in students" :key="index">
          <img class="avatar" slot="icon" :src="item.avatar || $root.placeHolder.avatar">
          &lt;!&ndash;<span class="btn-forbid"></span>&ndash;&gt;
        </mt-cell>
        <a href="javascript:void(0);" class="btn-more" v-if="students.length > 10">展开全部</a>
      </div>-->
    </div>
    </div>

    <div class="scroll-ft">
      <div class="form-wp">
        <div class="form-input mr20">
          <input type="text" placeholder="来说点什么吧" v-model.trim="commentText"/>
        </div>
        <div class="form-btn" @click="sendComment" v-if="commentText">
          <span>发送</span>
        </div>
        <div class="form-tool" v-else>
          <span class="btn-prize mr20" @click="shangModal=true">赏</span>
          <upload-image
            :success="upload.success">
            <span class="btn-pic"></span>
          </upload-image>
        </div>
      </div>
    </div>
    <div class="pop-playlist" v-show="popPlaylistVisible">
      <div class="pop-playlist-wp">
        <div class="pop-playlist-hd">
          <h3>播放列表</h3>
          <span class="btn-close-x" @click="popPlaylistVisible = false"></span>
        </div>
        <div class="pop-playlist-bd">
          <course-item :item="item" v-for="(item,index) in periodList" :key="index" type="classroomPeriod"
                       @click.native="goToTeach(item)"/>
          <!--<a href="#" class="btn-more">加载更多</a>-->
        </div>
      </div>
    </div>
    <!--打赏-->
    <div class="shang_modal" v-if="shangModal">
      <div class="content">
        <div class="tac">爱赞赏的人，运气不会差哦~</div>
        <span class="btn-close-x" @click="shangModal = false"></span>
        <ul class="tab">
          <li :class="{active: commentType === 3}" @click="commentType = 3">真金白银</li>
          <li :class="{active: commentType === 2}" @click="commentType = 2">智豆</li>
        </ul>
        <div class="tab-content" v-if="commentType === 3">
          <ul class="price-list" @click="selectPrice">
            <li data-price="2">2元</li>
            <li data-price="5">5元</li>
            <li data-price="10">10元</li>
          </ul>
          <ul class="price-list" @click="selectPrice">
            <li data-price="50">50元</li>
            <li data-price="100">100元</li>
            <li data-price="200">200元</li>
          </ul>
          <div class="tac other" @click="otherPrice">其他金额</div>
        </div>
        <div class="tab-content" v-else-if="commentType === 2">
          <ul class="price-list" @click="selectPrice">
            <li data-price="10">10个</li>
            <li data-price="100">100个</li>
            <li data-price="500">500个</li>
          </ul>
          <ul class="price-list" @click="selectPrice">
            <li data-price="1000">1000个</li>
            <li data-price="1500">1500个</li>
            <li data-price="2000">2000个</li>
          </ul>
          <div class="other tac" @click="otherPrice">其他个数</div>
        </div>
      </div>
    </div>
    <audio :src="course.file"
           ref="audio"
           @timeupdate="updateTime"
           @ended="ended"
           @canplay="canplay"
           preload="auto"
           @error="error">
    </audio>
  </div>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  import ProgressBar from '@/components/progress-bar/progress-bar'
  import {weixinPay} from '@/common/otherWeixin'



  export default {
    components: {
      FileUpload,
      ProgressBar
    },
    data() {
      return {
        otherClass:[],  // 其他课程
        teacher:{},
        studentCount:0,
        // 上传图片
        upload: {
          success: (data) => {
            this.uploadCallback(data);
          }
        },
        playing: false, // 播放
        playlist: [], // 播发列表
        currentTime: 0, // 播放时间
        duration: 0, // 总播放时长
        id: this.$route.params.id, //课时Id
        course_id: this.$route.params.course_id, //系列课Id
        currentIndex: 0, // 第几课 默认第一课
        course: {}, // 课程详情
        user: {}, // 用户
        swiper: [], // 课程简介banner图
        students: [], // 用户列表
        intro: null, // 课程简介
        comment: [], // 大厅
        commentText: '', // 文字评论
        commentPrice: '', // 打赏金额
        commentType: 2, // 默认打赏智豆
        tab: 'chat',
        popPlaylistVisible: false,// 是否显示播放列表
        periodList: [], // 课程目录
        shangModal: false, // 打赏
        page: 1,// 请求数据分页 默认第一页
        realPlayTime: 0, // 累计播放时间
        ubaTimer: null,
        ubaRealTimer: null,
        ptTime1: 0,
        ptTime2: 0,
        playError: false // 播放错误
      };
    },
    created() {
      this.getCourseDetails(this.id, this.course_id)
      this.getStudentList(this.id, this.page)
      this.getPeriodList(this.course_id, this.page)
    },
    computed: {
      playIcon() {
        return this.playing ? 'btn-pause' : 'btn-play'
      },
      percent() {
        return this.currentTime / this.duration
      }
    },
    watch: {
      playing(newPlay) {
        let vm = this
        if (newPlay) {
            // 每10秒上报数据
            vm.ubaTimer = setInterval(() => {
              vm.uba('per')
            }, 10000)

            // 统计总播放时长
            vm.ubaRealTimer = setInterval(() => {
              vm.realPlayTime++
              vm.ptTime2 = vm.realPlayTime
            }, 1000)

        } else {
            vm.uba('per')
            this.ptTime1 = this.realPlayTime
            vm.ubaTimer && clearInterval(vm.ubaTimer)
            vm.ubaRealTimer && clearInterval(vm.ubaRealTimer)
        }
      },
    },
    beforeDestroy() {
      this.ubaTimer && clearInterval(this.ubaTimer)
      this.uba('cc')
    },
    methods: {
      getToClassDetails(item){
        console.log(item)
        // item.type 1系列课程 0单次课程
        if (item.type === 0) {
          this.$router.push('/course/detail/' + (item.id || 0));
        } else {
          this.$router.push('/series/detail/' + (item.id || 1));
        }
      },
      //数据采集
      uba(type) {
        let params = {
          _act: type,
          _unt: (new Date()).getTime(),
          ass: 'r',
          cid: this.course_id, // 课程id
          et: 'p',
          pid: this.id,
          pos: this.currentTime,
          ptm: this.ptTime2 - this.ptTime1,
          uid: this.user.id,  // 需要在接口多返回一个用户id
          vd: this.realPlayTime // 播发累计时长
        }
        console.log(params);
        this.API.uba(params)
      },
      percentChange(percent) {
        const currentTime = this.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      canplay(ev) {
        this.duration = parseInt(ev.target.duration)
      },
      // 上一课
      prev() {
        if (this.periodList.length === 1) {
          return
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.periodList.length - 1
          }
          let period = this.periodList[index]
          this.ubaTimer && clearInterval(this.ubaTimer)
          this.uba('cc')
          location.href = '/series/teach/' + this.course_id + '/' + period.id
        }
      },
      // 下一课
      next() {
        if (this.periodList.length === 1) {
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.periodList.length) {
            index = 0
          }
          let period = this.periodList[index]
          this.ubaTimer && clearInterval(this.ubaTimer)
          this.uba('cc')
          location.href = '/series/teach/' + this.course_id + '/' + period.id
        }
      },
      // 切换播放
      togglePlaying() {
        if (this.playError) return
        let audio = this.$refs.audio
        if (this.playing) {
          audio.pause()
        } else {
          audio.play()
        }
        this.playing = !this.playing
      },
      // 获取当前播放时间
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
        this.uba('ov')
      },
      // 播放失败
      error() {
        this.$toast('音频播放失败')
        setTimeout(() => {
          this.playing = false
          this.playError = false
        }, 3000)
      },
      // 添加评论上传图片的回调
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
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //关注主播
      follewClass(id) {
        this.API.spaceIsFollow({id: id}).then((res) => {
          if (res.is_follow == 1) {
            this.user.is_followed = res.is_follow
          } else {
            this.user.is_followed = res.is_follow
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 课时目录列表（系列课程）
      getPeriodList(courseId, page) {
        this.API.coursePeriodList(courseId, page).then((res) => {
          if (res && res._items.length > 0) {
            console.log(res)
            this.periodList = this.periodList.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getPeriodList(page)
            }
            this.periodList.forEach((item, index) => {
              if (item.id == this.id) {
                this.currentIndex = index
              }
            })
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      // 获取课程详情
      getCourseDetails(id, couserId) {
        this.API.courseStudySet({id: id, course_id: couserId}).then((res) => {
          console.log(res)
          this.teacher = res.teacher
          this.studentCount = res.students.total
          this.user = res.user
          this.course = res.course
          this.getClassComment(res.course.id, this.page)
          this.getOtherClass(couserId,res.teacher.id,this.page)
          this.swiper = res.course.img
          if (res.course.note && res.course.note.length > 0) {
            this.intro = res.course.note
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // 获取用户列表
      getStudentList(id, page) {
        this.API.courseUserList(id, page).then((res) => {
          if (res && res._items) {
            this.students = this.students.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getStudentList(page)
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取用户评论
      getClassComment(courseId, page) {
        this.API.classComment({id: courseId, statu: 0, page: page}).then((res) => {
          if (res && res._items) {
            this.comment = this.comment.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getClassComment(courseId, page)
            }
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // 文字添加评论
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
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      // 打赏
      selectPrice(e) {
        const ev = ev || window.event;
        const target = ev.target || ev.srcElement;
        if (target.nodeName.toLocaleLowerCase() === 'li') {
          let params = {
            content: e.target.getAttribute('data-price'),
            type: this.commentType,
            period_id: this.course.id
          }
          this.API.commentPeriod(params).then((res) => {
            if (res) {
              if (this.commentType === 3) {
                let data = res.jsApiParams
                weixinPay(data, function (res) {
                  if (res) {
                    window.location.reload()
                  }
                })
              } else {
                this.comment.push(res)
                this.commentType = 2
                this.commentPrice = ''
                this.shangModal = false
              }
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      // 获取其他课程
      getOtherClass(cid,uid,page){
        this.API.otherClass({cid:cid,uid:uid}).then((res)=>{
          console.log(res)
          this.otherClass=this.otherClass.concat(res._items)
          if(res._meta.pageCount>page){
            page++
            this.getOtherClass(cid,uid,page)
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      // 其他打赏
      otherPrice() {
        if (this.commentType === 2) {
          this.$messagebox.prompt('其他个数', '').then(({value, action}) => {
            console.log(value)
            let params = {
              content: value,
              type: this.commentType,
              period_id: this.course.id
            }
            this.API.commentPeriod(params).then((res) => {
              if (res) {
                this.comment.push(res)
                this.commentPrice = ''
                this.commentType = 2
                this.shangModal = false
              }
            }).catch((err) => {
              console.log(err)
            })
          });
        } else if (this.commentType === 3) {
          this.$messagebox.prompt('其他金额', '').then(({value, action}) => {
            console.log(value)
            let params = {
              content: value,
              type: this.commentType,
              period_id: this.course.id
            }
            this.API.commentPeriod(params).then((res) => {
              if (res) {
                console.log(res)
                let data = res.jsApiParams
                weixinPay(data, function (res) {
                  if (res) {
                    window.location.reload()
                  }
                })
              }
            }).catch((err) => {
              console.log(err)
            })
          });
        }
      },
      goToTeach(item) {
        location.href = '/series/teach/' + this.course_id + '/' + item.id
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  @import "../../../../styles/audio-player.scss";
  @import "../../../../styles/chat.scss";
  @import "../../../../styles/pop-playlist.scss";

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

  .detail-info, .detail-intro, .detail-comment, .order-wp ,.other-class {
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
      // width: 5.4rem;
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
        color: #e6e6e6;
        font-size: .2rem;
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
    border: .01rem solid $color-border;
    border-width: 0.01rem 0;
    .tit {
      padding: .2rem .2rem 0 .2rem;
      max-height: .88rem;
      overflow: hidden;
    }
    .info {
      padding: 0 .2rem;
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
        margin: .4rem auto .2rem;
        max-width: 100%;
      }
    }
    .explain {
      padding: 0 .2rem;
      font-size: .24rem;
      color: $color-gray;
      margin-bottom: .4rem;
      line-height: 1.6;
    }
  }
</style>
