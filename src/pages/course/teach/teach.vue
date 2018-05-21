/**
* @author zhangwenlong
* @date 2018/4/16
* @Description: 课程学习界面
*/
<template>
  <div class="scroll-wp">
    <div class="scroll-bd" ref="scrollBody">
      <div v-if="course.file_type == 1">
        <!--轮播图-->
        <div class="swipe-wp" style="height: 4.7rem;">
          <slider v-if="swiper.length>0">
            <div v-for="(item,index) in swiper" :key="index">
              <a href="javascript:;">
                <img :src="item || $root.placeHolder.banner" style="height: 4.7rem;"/>
              </a>
            </div>
          </slider>
        </div>
        <!--音频播放-->
        <div class="audio-player" v-if="course.type===1">
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
            <div class="audio-items" @click="popPlaylistVisible=true">播放列表({{periodList.length}})</div>
            <div class="audio-control">
              <span class="btn-prev" @click="prev"></span>
              <span :class="playIcon" @click="togglePlaying"></span>
              <span class="btn-next" @click="next"></span>
            </div>
            <div class="audio-title">第{{currentIndex+1}}课</div>
          </div>
        </div>
        <div class="audio-player" v-else>
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
      <div v-if="course.file_type == 2" style="padding-top: 4rem;">
        <div class="fixedVideo">
          <!-- 设置播放器容器 -->
          <video id="player"
                 preload="auto"
                 playsinline
                 webkit-playinline
                 x5-playinline
                 controls class="video">
          </video>
        </div>
        <!--视频播放-->
        <div class="audio-player" v-if="course.type==1">
          <div class="audio-bd" style="margin-top: 0;">
            <div class="audio-items" @click="popPlaylistVisible = true">播放列表({{periodList.length}})</div>
            <div class="audio-control">
              <span class="btn-prev" @click="prev"></span>
              <span :class="playIcon" @click="togglePlayVideo"></span>
              <span class="btn-next" @click="next"></span>
            </div>
            <div class="audio-title">第{{currentIndex+1}}课</div>
          </div>
        </div>
      </div>
      <!--课程标题-->
      <div class="detail-info mt20">
        <h2 class="tit fs15">{{course.title}}</h2>
        <div class="info mt10 fs12 gray">
          <p>{{course.times | formatDate }}</p>
        </div>
        <div class="info gray fs12 mt10">
          <!-- <p>报名人数&nbsp;&nbsp;{{studentCount}}人</p>-->
          <p>{{course.view_count}}次学习</p>
        </div>
        <mt-cell class="cell-card mt20" :title="teacher.space_name" @click.native="goToTeacher(teacher.id)">
          <img slot="icon" class="avatar" :src="teacher.avatar || $root.placeHolder.avatar">
          <a class="btn-follow" href="javascript:void(0)" v-if="user.is_followed == 0"
             @click.stop="follewClass(teacher.id)">关注</a>
          <a class="btn-follower" href="javascript:void(0)" v-else @click.stop="follewClass(teacher.id)">已关注</a>
        </mt-cell>
      </div>
      <ul class="nav-tab nav-tab-3 mt20">
        <li :class="{active: tab == 'chat'}" @click="selectTab('chat')">
          <a href="javascript:;">大厅</a>
        </li>
        <li :class="{active: tab == 'intro'}" @click="selectTab('intro')">
          <a href="javascript:;">课程简介</a>
        </li>
        <li :class="{active: tab == 'other'}" @click="selectTab('other')">
          <a href="javascript:;">其他课程</a>
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
      <div class="other-class" v-show="tab == 'other'"
           v-infinite-scroll="loadMoreOther"
           infinite-scroll-disabled="loadingOther"
           infinite-scroll-distance="10"
      >
        <course-item v-for="(item, key) in otherClass" :key="key" :item="item" type="index"
                     @click.native="getToClassDetails(item)"/>
      </div>
      <div class="detail-intro" v-show="tab == 'intro'">
        <div v-if="intro.length>0">
          <div class="hd">主讲人: {{ course.author }}</div>
          <div class="bd">
            <template v-for="item in intro">
              <img v-lazy="item.url" v-if="item.url"/>
              <p v-if="item.dec" v-html="formatSolution(item.dec)"></p>
            </template>
          </div>
        </div>
        <div class="tac" v-else style="padding: .5rem;">暂无课程简介</div>
        <div class="explain" v-if="course.pay_type===1 || course.pay_type===2">
          <h3>购买须知</h3>
          <p class="mt10">1. 该课程为付费系列课程（付费单课课程），按课程计划定期更新，每节课程可在开课时学习，也可反复回听 ；</p>
          <p>2. 购买课程后关注我们的服务号，可在菜单里进入听课；</p>
          <p>3. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅 。</p>
        </div>
      </div>
      <router-link tag="div" class="link-home" to="/"></router-link>
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
          <span class="btn-prize mr20" @click="shangModal=true">赏</span>
          <!-- <upload-image
             :success="upload.success">
             <span class="btn-pic"></span>
           </upload-image>-->
        </div>
      </div>
    </div>
    <div class="pop-playlist" v-if="popPlaylistVisible">
      <div class="pop-playlist-wp" style="top:4rem;" v-if="course.file_type == 2">
        <div class="pop-playlist-hd">
          <h3>播放列表</h3>
          <span class="btn-close-x" @click="popPlaylistVisible = false"></span>
        </div>
        <div class="pop-playlist-bd">
          <course-item :item="item" v-for="(item,index) in periodList" :key="index" type="classroomPeriod"
                       @click.native="goToTeach(item)"/>
        </div>
      </div>
      <div class="pop-playlist-wp" v-else>
        <div class="pop-playlist-hd">
          <h3>播放列表</h3>
          <span class="btn-close-x" @click="popPlaylistVisible = false"></span>
        </div>
        <div class="pop-playlist-bd">
          <course-item :item="item" v-for="(item,index) in periodList" :key="index" type="classroomPeriod"
                       @click.native="goToTeach(item)"/>
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
           @error="error"
           @canplay="canplay"
           @timeupdate="updateTime"
           @ended="ended"
           preload="auto"
           v-if="course.file_type == 1">
    </audio>
  </div>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  import ProgressBar from '@/components/progress-bar/progress-bar'
  import {weixinPay} from '@/common/otherWeixin'
  import {weixinCloseWin} from '@/common/weixin'
  import {debounce} from '@/common/util'
  import Slider from '@/components/slider/slider'

  export default {
    name: 'teach',
    components: {
      FileUpload,
      ProgressBar,
      Slider
    },
    data() {
      return {
        upload: {           // 上传图片
          success: (data) => {
            this.uploadCallback(data);
          }
        },
        periodList: [], // 当前系列课课程目录
        popPlaylistVisible: false,
        commentType: 3, // 默认打赏智豆
        shangModal: false, // 打赏
        commentText: '', // 文字评论
        studentCount: 0, // 报名人数
        comment: [], // 评论大厅
        tab: 'chat',
        id: this.$route.params.id, // 课时Id
        swiper: [], //  课时轮播图
        course: {}, // 课时详情
        user: {},  // 个人
        teacher: {}, // 主播
        intro: [],// 课程简介
        playing: false, // 播放
        duration: 0, // 播放时长
        currentTime: 0, // 当前播放
        otherClass: [],// 其他课程
        playError: false, // 播发失败
        realPlayTime: 0, // 累计播放时间
        ubaTimer: null,
        ubaRealTimer: null,
        ptTime1: 0,
        ptTime2: 0,
        otherPage: 1, // 其他课程
        loadingComment: false, // 聊天记录
        commentPage: 1, // 聊天记录
        page: 1,
        loadingOther: true,
        currentIndex: 0
      }
    },
    created() {
      let vm = this
      this.getClassTeachDetails(this.id)
      if (window.addEventListener) {
        window.addEventListener("unload", function () {
          vm.getTeachData()
        }, false)
      } else {
        window.attachEvent("unload", function () {
          vm.getTeachData()
        })
      }
    },
    computed: {
      percent() {
        return this.currentTime / this.duration
      },
      playIcon() {
        return this.playing ? 'btn-pause' : 'btn-play'
      }
    },
    beforeDestroy() {
      this.getTeachData()
    },
    methods: {
      selectTab(tab) {
        this.tab = tab
        if (tab === 'other' && this.loadingOther && !this.oneLoading) {
          this.loadingOther = false
          this.oneLoading = true
        }
      },
      // 收集数据
      getTeachData() {
        if (this.playing) {
          this.uba('cc')
          this.ubaTimer && clearInterval(this.ubaTimer)
          this.ubaRealTimer && clearInterval(this.ubaRealTimer)
          if (this.player) {
            this.player.dispose()
            this.player = null
          }
        } else {
          if (this.realPlayTime === 0) {
            this.ptTime1 = this.ptTime2
            this.ubaTimer && clearInterval(this.ubaTimer)
            this.ubaRealTimer && clearInterval(this.ubaRealTimer)
            if (this.player) {
              this.player.dispose()
              this.player = null
            }
          } else {
            this.ptTime1 = this.ptTime2
            this.uba('cc')
            this.ubaTimer && clearInterval(this.ubaTimer)
            this.ubaRealTimer && clearInterval(this.ubaRealTimer)
            if (this.player) {
              this.player.dispose()
              this.player = null
            }
          }

        }
      },
      formatSolution(s) {
        if (s) {
          return s.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      // 视频播放控制
      togglePlayVideo() {
        if (this.playing) {
          this.player.pause()
        } else {
          this.player.play()
        }
        this.playing = !this.playing
      },
      // 聊天记录
      loadMoreComment() {
        this.loadingComment = true
        this.API.classComment({id: this.id, statu: 0, page: this.commentPage}).then((res) => {
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
      },
      // 其他课程
      loadMoreOther() {
        this.loadingOther = true
        this.API.otherClass({cid: this.course.course_id, uid: this.teacher.id, page: this.otherPage}).then((res) => {
          if (res._items.length > 0) {
            this.otherClass = this.otherClass.concat(res._items)
            if (res._meta.pageCount > this.otherPage) {
              this.otherPage++
              this.loadingOther = false
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 播放列表
      getPeriodList(id, page) {
        this.API.coursePeriodList(id, page).then((res) => {
          if (res._items.length > 0) {
            this.periodList = this.periodList.concat(res._items)
            if (res._meta.pageCount > page) {
              page++
              this.getPeriodList(id, page)
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
      // 跳转到学习界面
      goToTeach(item) {
        let ua = navigator.userAgent.toLowerCase();
        if (ua.match(/iphone/i)) {
          this.getTeachData()
        }
        window.location.href = '/course/teach/' + item.id
      },
      // 跳转到课程介绍页
      getToClassDetails(item) {
        console.log(item)
        // item.type 1系列课程 0单次课程
        this.$router.push('/course/detail/' + item.id)
      },
      //数据采集
      uba(type) {
        let params = {
          _act: type,
          _unt: (new Date()).getTime(),
          ass: 'r',
          cid: this.course.course_id, // 课程id
          et: 'p',
          pid: this.id,
          pos: parseInt(this.currentTime), // 当前的播放位置
          ptm: this.ptTime2 - this.ptTime1,//最近的播放时长 - 上次播放的时长
          uid: this.user.id,  // 需要在接口多返回一个用户id
          vd: this.realPlayTime // 播发累计时长
        }
        console.log(params);
        this.API.uba(params)
      },
      // 拖动播放
      percentChange(percent) {
        const currentTime = this.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      // 播放失败
      error() {
        this.$toast('音频播放失败')
        setTimeout(() => {
          this.playing = false
          this.playError = true
        }, 3000)
      },
      // 播放总时长
      canplay(ev) {
        this.duration = ev.target.duration
      },
      // 当前播放时长
      updateTime(ev) {
        this.currentTime = ev.target.currentTime
      },
      // 切换播放
      togglePlaying() {
        let vm = this
        if (this.playError) return
        this.playing = !this.playing
        let audio = this.$refs.audio
        if (this.playing) {
          audio.play()
          // 每10秒上报数据
          vm.ubaTimer = setInterval(() => {
            vm.uba('per')
            vm.ptTime1 = vm.ptTime2
          }, 10000)
          // 统计总播放时长
          vm.ptTime1 = vm.realPlayTime
          vm.ubaRealTimer = setInterval(() => {
            vm.realPlayTime++
            vm.ptTime2 = vm.realPlayTime
          }, 1000)
        } else {
          audio.pause()
          vm.uba('per')
          vm.ubaTimer && clearInterval(vm.ubaTimer)
          vm.ubaRealTimer && clearInterval(vm.ubaRealTimer)
        }
      },
      // 播放完成
      ended() {
        let vm = this
        vm.ubaTimer && clearInterval(vm.ubaTimer)
        vm.ubaRealTimer && clearInterval(vm.ubaRealTimer)
        vm.uba('ov')
        this.playing = false
        vm.realPlayTime = 0
      },
      // 格式化时间
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
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
          let ua = navigator.userAgent.toLowerCase();
          if (ua.match(/iphone/i)) {
            this.getTeachData()
          }
          location.href = '/course/teach/' + period.id
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
          let ua = navigator.userAgent.toLowerCase();
          if (ua.match(/iphone/i)) {
            this.getTeachData()
          }
          location.href = '/course/teach/' + period.id
        }
      },
      // 课时详情
      getClassTeachDetails(id) {
        this.API.classTeach(id).then((res) => {
          console.log(res)
          this.swiper = res.course.img
          this.course = res.course
          this.user = res.user
          if (res.course.note.length > 0) {
            this.intro = res.course.note
          }
          this.teacher = res.teacher
          //  this.studentCount = res.students.total
          if (res.course.type == 1) {
            this.getPeriodList(res.course.course_id, this.page)
          }
          if (res.course.file_type == 2) {
            setTimeout(() => {
              this.player = TCPlayer('player', { // 播放器容器ID，必须与html中一致
                fileID: res.course.file, // 请传入需要播放的视频filID 必须
                appID: '1256380617', // 请传入点播账号的appID 必须
                autoplay: false, //是否自动播放
                playbackRateMenuButton: false
                //其他参数请在开发文档中查看
              });
              let vm = this
              // 播放
              this.player.on('playing', function () {
                // 每10秒上报数据
                vm.ubaTimer = setInterval(() => {
                  vm.uba('per')
                  vm.ptTime1 = vm.ptTime2
                }, 10000)
                // 统计总播放时长
                vm.ptTime1 = vm.realPlayTime
                vm.ubaRealTimer = setInterval(() => {
                  vm.realPlayTime++
                  vm.ptTime2 = vm.realPlayTime
                }, 1000)
                vm.playing = true
              })
              this.player.on('pause', function () {
                vm.uba('per')
                vm.ubaTimer && clearInterval(vm.ubaTimer)
                vm.ubaRealTimer && clearInterval(vm.ubaRealTimer)
                vm.playing = false
              })
              this.player.on('error', function () {
                vm.playing = false
              })
              this.player.on('ended', function () {
                vm.ptTime1 = vm.ptTime2
                vm.uba('ov')
                vm.ubaTimer && clearInterval(vm.ubaTimer)
                vm.ubaRealTimer && clearInterval(vm.ubaRealTimer)
                vm.playing = false
                vm.realPlayTime = 0
              })
              this.player.on('timeupdate', function () {
                vm.currentTime = vm.player.currentTime()
              })
            }, 20)
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
      // 跳转到主播直播空间
      goToTeacher(id) {
        return this.$router.push('/course/author/' + id);
      },
      // 图片评论
      uploadCallback(data) {
        let params = {
          content: data.fileId,
          type: 1,
          period_id: this.id
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
      },
      // 文字添加评论
      sendComment() {
        if (this.commentText) {
          let params = {
            content: this.commentText,
            type: 0,
            period_id: this.id
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
      // 其他打赏
      otherPrice() {
        if (this.commentType === 2) {
          this.$messagebox.prompt('其他个数', '').then(({value, action}) => {
            if (isNaN(Number(value))) {
              this.$toast('请输入数字')
              return
            }
            let params = {
              content: parseInt(value), // 智豆只能是正数
              type: this.commentType,
              period_id: this.id
            }
            this.API.commentPeriod(params).then((res) => {
              if (res) {
                this.comment.push(res)
                this.shangModal = false
                this.$nextTick(() => {
                  this.$refs.scrollBody.scrollTop = this.$refs.scrollBody.scrollHeight
                })
              }
            }).catch((err) => {
              console.log(err)
            })
          });
        } else if (this.commentType === 3) {
          if (this.isWeiXin()) {
            let vm = this
            this.$messagebox.prompt('其他金额', '').then(({value, action}) => {
              if (isNaN(Number(value))) {
                this.$toast('请输入数字')
                return
              }
              let params = {
                content: Math.floor(value * 10) / 10, // 打赏金额保留一位小数
                type: this.commentType,
                period_id: this.id
              }
              this.API.commentPeriod(params).then((res) => {
                if (res) {
                  let data = res.jsApiParams
                  weixinPay(data, function (res) {
                    if (res) {
                      // window.location.reload()
                      vm.$router.go(0)
                    }
                  })
                }
              }).catch((err) => {
                console.log(err)
              })
            });
          } else {
            this.$toast('请在微信客户端使用微信支付')
          }
        }
      },
      isWeiXin() {
        let ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true;
        } else {
          return false;
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
            period_id: this.id
          }
          this.API.commentPeriod(params).then((res) => {
            if (res) {
              // 微信支付
              if (this.commentType === 3) {
                if (this.isWeiXin()) {
                  let data = res.jsApiParams
                  let vm = this
                  weixinPay(data, function (res) {
                    if (res) {
                      // window.location.reload()
                      vm.$router.go(0)
                    }
                  })
                } else {
                  this.$toast('请在微信客户端使用微信支付')
                }
                // 智豆支付
              } else {
                this.comment.push(res)
                this.shangModal = false
                this.$nextTick(() => {
                  this.$refs.scrollBody.scrollTop = this.$refs.scrollBody.scrollHeight
                })
              }
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin.scss";
  @import "../../../styles/pop-playlist.scss";

  .fixedVideo {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: auto;
    z-index: 45;
    width: 7.5rem;
    margin: 0 auto;
  }

  .player {
    height: 4rem;
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

  .detail-info, .detail-intro, .detail-comment, .order-wp, .other-class {
    background: $color-white;
  }

  .avatar {
    margin-right: .2rem;
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
  }

  .chat-wp {
    padding: .3rem .2rem;
    background: $color-white;
  }

  .chat-item {
    margin-bottom: .4rem;
    font-size: .24rem;
    .chat-hd {
      display: flex;
    }
    .chat-avatar {
      width: .6rem;
      height: .6rem;
      border-radius: 50%;
    }
    .chat-info {
      flex: 1;
      .chat-nick {
        color: $color-gray-dark;
      }
      .chat-teacher {
        display: inline-block;
        margin-left: .1rem;
        padding: 0 .12rem;
        background: $color-red;
        color: $color-white;
        border-radius: .03rem;
      }
      .chat-date {
        color: $color-gray;
      }
    }
    .chat-bd {
      display: flex;
      margin-top: .15rem;
      .chat-content {
        padding: .15rem .24rem;
        border-radius: .05rem;
        background: #e9ecee;
        font-size: .28rem;
        overflow: hidden;
        & > img {
          max-width: 100%;
          height: auto;
        }
      }
    }
  }

  .chat-you {
    .chat-avatar {
      margin-right: .2rem;
    }
    .chat-bd {
      .chat-content {
        margin: 0 0.9rem 0 .8rem;
      }

    }
  }

  .chat-me {
    .chat-avatar {
      margin-left: .2rem;
    }
    .chat-info {
      text-align: right;
    }
    .chat-bd {
      justify-content: flex-end;
      .chat-content {
        margin: 0 0.8rem 0 .9rem;
        background: $color-blue;
        color: $color-white;
      }
    }
  }

  .chat-prize {
    .red {
      color: #e54839;
    }
    .prize-bd {
      display: flex;
      justify-content: center;
      .prize-money, .prize-token {
        padding: .14rem;
        background: #ffcc66;
        color: $color-white;
        border-radius: .04rem;
        &:before {
          content: "";
          float: left;
          margin-right: .12rem;
          width: .32rem;
          height: .32rem;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
        }
      }
      .prize-money {
        &:before {
          background-image: url(../../../assets/icon-hongbao.png);
        }
      }
      .prize-token {
        &:before {
          background-image: url(../../../assets/icon-token-red.png);
        }
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

  .form-wp {
    display: flex;
    padding: .2rem .2rem;
    width: 100%;
    background: $color-bg;
    border-top: .01rem solid $color-border;
    .form-input {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0rem .3rem;
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
        line-height: .5rem;
        text-align: center;
        background-color: #ff5f52;
        border: solid .06rem #ff9f97;
        color: #e6e6e6;;
      }
      .btn-items {
        background: #e5ebf0 url(../../../assets/icon-list.png) no-repeat center center;
        background-size: 50%;
      }
      .btn-pic {
        background: #e5ebf0 url(../../../assets/icon-pic.png) no-repeat center center;
        background-size: 70%;
      }
    }
  }

  .audio-player {
    padding: .35rem .25rem .25rem;
    background: $color-white;
    color: $color-gray-dark;
    border-bottom: .01rem solid $color-border;
    font-size: .24rem;
    .audio-hd {
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0px auto;
      padding: 10px 0;
      .progress-bar-wrapper {
        flex: 1;
      }
      .audio-start, .audio-end {
        flex: 0 0 30px;
        line-height: 30px;
        width: 30px;
        text-align: center;
      }
    }
    .audio-bd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .35rem;
      .audio-items {
        width: 1.5rem;
        text-align: center;
        &:before {
          content: "";
          display: block;
          margin: 0 auto .06rem;
          width: .4rem;
          height: .4rem;
          background: url(../../../assets/icon-items.png) no-repeat center center;
          background-size: contain;
        }
      }
      .audio-control {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 .4rem;
        width: 2.8rem;
      }
      .btn-play {
        display: inline-block;
        width: .9rem;
        height: .9rem;
        background: url(../../../assets/icon-play.png) no-repeat center center;
        background-size: contain;
      }
      .btn-pause {
        display: inline-block;
        width: .9rem;
        height: .9rem;
        background-image: url(../../../assets/icon-pause.png);
        background-size: contain;
      }
      .btn-prev, .btn-next {
        display: inline-block;
        width: .37rem;
        height: .37rem;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;

      }
      .btn-prev {
        background-image: url(../../../assets/icon-prev.png);
      }
      .prev-dis {
        background-image: url("prev-dis.png");
      }
      .btn-next {
        background-image: url(../../../assets/icon-next.png);
      }
      .next-dis {
        background-image: url("next-dis.png");
      }
      .audio-title {
        width: 1.5rem;
        text-align: center;
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
    .explain {
      padding: 0 .2rem;
      font-size: .24rem;
      color: $color-gray;
      margin-bottom: .4rem;
      line-height: 1.6;
    }
  }
</style>
