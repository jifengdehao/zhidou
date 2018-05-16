import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';
import router from '@/router/index.js'
import {Indicator} from 'mint-ui';

Vue.prototype.$http = axios;

const apiUrl = '/api';

const handleSuccess = (res) => {
  if (res.status === 200 || res.status === 304) {
    return res.data ? Promise.resolve(res.data) : Promise.resolve(res);
  } else {
    Vue.$toast(res.message);
    return Promise.reject(res);
  }
}
//定义计时器
let loadCount = 0;
// 请求前
axios.interceptors.request.use(
  config => {
    loadCount++;
    Indicator.open();
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
//请求后
axios.interceptors.response.use(
  res => {
    loadCount--
    if (!loadCount) {
      Indicator.close();
    }
    return res;
  },
  err => {
    loadCount--;
    if (!loadCount) {
      Indicator.close();
    }
    return Promise.reject(err);
  }
)


const handleError = (res) => {
  let message;
  const status = res.status;
  const msg = res.data.message
  if (status === 400) {
    message = '传输数据错误';
  } else if (status === 401) {
    message = '请先登录';
    return router.push('/oauth');
  } else if (status === 404) {
    message = '请求接口不存在';
  } else if (status === 500) {
    message = '服务器出错了';
  } else {
    message = '请求出错，请稍后再试';
  }
  Vue.$toast(message);
  return Promise.reject({status, msg});
}

const http = {
  get: (path, data, header) => axios.get(apiUrl + path, {
    params: data,
  }, header || {}).then((res) => {
    return handleSuccess(res.data);
  }).catch((err) => {
    if (err.response) {
      return handleError(err.response);
    } else {
      return Promise.reject(err);
    }
  }),
  post: (path, data) => axios.post(apiUrl + path, qs.stringify(data)).then((res) => {
    return handleSuccess(res.data);
  }).catch((err) => {
    if (err.response) {
      return handleError(err.response);
    } else {
      return Promise.reject(err);
    }
  }),
};

let ubaRequest = (url, callback) => {
  var img = new Image;
  var id = "mini_xsteach_log_" + Math.floor(2147483648 * Math.random()).toString(36);
  window[id] = img;//防止垃圾回收机制
  img.onload = img.onerror = img.onabort = function () {
    img.onload = img.onerror = img.onabort = null;
    img = window[id] = null;
    callback && callback(url)
  };
  img.src = url
};


export default {
  // 数据采集
  uba: (data) => {
    let url
    if (/www\.zhiliaotv\.com/.test(location.host)) {
      url = 'http://uba.zhiliaotv.com/p?'
    } else {
      url = 'http://uba.dev.zhiliaotv.com/p?'
    }
    let arr = []
    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        arr.push(k + '=' + data[k])
      }
    }
    ubaRequest(url + arr.join('&'))
  },
  // 获取微信的JSSDK 验证
  wechatJSSDK: url => http.get('/site/wx-js-conf', {url}, {
    header: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }),

  // 首页 - 轮播图
  banner: () => http.get('/banner'),

  // 首页 - 每日精选
  resourceCommend: (page) => http.get(`/resource/commend?page=${page}`),

  // 首页 - 课程分类
  resourceGuide: () => http.get('/resource/guide'),

  // 首页- 课程类目筛选
  resourceGuideList: data => http.post(`/resource/guide-list?page=${data.page}`, data),

  // 首页 - 搜索页
  searchResult: data => http.post('/resource/search', data),

  // 注册 - 发送验证码
  sendSmsVerifyCode: mobile => http.post('/site/send-sms-verify-code', {mobile}),

  // 微信注册
  registerOuath: data => http.post('/site/o-auth-register', data),

  // 微信登录
  loginOauth: data => http.post('/site/o-auth-bind', data),

  //注册
  register: data => http.post('/site/register', data),

  // 登录
  login: data => http.post('/site/login', data),

  // 退出
  logout: data => http.get('/site/logout', data),

  // 忘记密码 - 发送短信
  forgetPasswordVerifyMobile: mobile =>
    http.post('/site/forget-password-verify-mobile', {mobile}),

  // 找回密码
  findPwd: data => http.post('/site/reset', data),

  // 重置密码 - 发送短信
  resetPasswordVerifyMobile: () => http.post('/user/verify/rest-pwd-verify-mobile'),

  // 重置密码
  resetPwd: data => http.post('/user/verify/rest-pwd', data),

  // 用户观看直播间数据展示
  spaceInfo: id => http.post('/space/space-info', {id}),

  // 用户观看直播间系列课和单课列表
  courseList: data => http.post(`/space/course-list?page=${data.page}`, data),

  // 单课学习
  courseStudySingle: id => http.post('/user/course/study-single', {id}),

  // 系列课学习
  courseStudySet: data => http.post('/user/course/study-set', data),

  // 用户购买免费 （密码）课程
  freeEnroll: data => http.post('/user/course/free-enroll', data),

  // 用户购买付费课程
  orderPay: data => http.post('/user/order/pay', data),

  // 已报课程用户列表
  courseUserList: (id, page) => http.post(`/course/course-userlist?page=${page}`, {id}),

  // 课程详情
  courseShowCourse: id => http.post('/course/show-course', {id}),

  // 学习界面
  classTeach: id => http.post('/user/course/study', {id}),

  // 课程评论
  classComment: (data) => http.post(`/comment/period-comment?page=${data.page}`, data),

  // 添加课时评论
  commentPeriod: data => http.post('/user/comment/comment-period', data),

  // 是否关注主播
  spaceIsFollow: id => http.post('/user/base/follow', id),

  // 主播直播间
  anchorSpace: () => http.get('/user/anchor/anchor-space'),

  // 直播间 - 编辑直播间信息
  anchorUpdateSpace: data => http.post('/user/anchor/update-space', data),

  // 直播间 - 创建课程
  generateCourse: data => http.post('/user/course/generate-course', data),

  // 直播间 - 编辑课程
  editCourse: data => http.post('/user/course/edit-course', data),

  // 直播间 - 系列课-课程详情
  anchorPeriod: id => http.post('/user/anchor/period', id),

  // 直播间 - 系列课-课程修改
  anchorEditPeriod: id => http.post('/user/course/edit-period', id),

  // 直播间 - 单课详情
  anchorSingle: id => http.post('/user/anchor/single', {id}),

  // 直播间 - 系列课详情
  anchorSet: id => http.post('/user/anchor/set', {id}),

  // 直播间 - 创建课时
  generatePeriod: data => http.post('/user/course/generate-period', data),

  // 直播间 - 系列课详情 - 课时列表

  coursePeriodList: (id, page) => http.post(`/course/period-list?page=${page}`, {id}),

  // 个人直播间 系列课详情 - 课时列表
  userCoursePeriodList: (id, page) => http.post(`/user/course/period-list?page=${page}`, {id}),

  // 直播间 - 观看自己创建的课程列表（包含单次课程，系列课程）
  anchorSeries: (course_type, page) => http.post(`/user/anchor/course-list?page=${page}`, {course_type}),


  // 我的
  userBaseInfo: () => http.get('/user/base/info'),
  // 智豆明细
  userBeanDetail: (page) => http.get(`/user/base/user-bean-detail?page=${page}`),
  // 用户余额
  userBalance: () => http.get('/user/base/balance'),
  // 现金明细
  userCashDetail: (page) => http.get(`/user/base/user-asset-detail?page=${page}`),
  // 用户绑定银行卡列表
  userBankList: () => http.get('/user/base/user-bank-list'),

  //提现选择的 银行列表 添加银行
  bankList: () => http.get('/user/base/bank-list'),

  // 用户绑定提现银行卡号
  bindingBank: (data) => http.post('/user/base/binding-bank', data),

  // 修改用户信息
  userUpdateInfo: data => http.post('/user/base/update-info', data),

  // 微信提现
  withdrawals: data => http.post('/user/order/withdrawals', data),

  // 上传图片
  uploadImage: data => http.post('/upload/image', data),

  // 上传图片
  uploadImage64: data => http.post('/upload/image-base64', data),

  // 上传身份认证图片
  verifyImage64: data => http.post('/user/verify/image-base64', data),

  // 我的课程
  userCourse: () => http.get('/user/base/user-course'),

  // 创建直播间 - 分类
  spaceStyle: () => http.get('/space/style'),

  // 创建直播间 - 发送验证码
  spaceVerifyCode: () => http.post('/user/verify/space-verify-mobile'),

  // 创建直播间
  generateSpace: data => http.post('/user/verify/generate-space', data),

  // 身份认证
  identityVerify: data => http.post('/user/verify/identity-verify', data),

  // 上传音频所需参数
  getAudioKey: () => http.get('/upload/audio-key'),

  // 上传视频所需参数
  getVideoKey: data => http.post('/user/anchor/video-key', data),

  // 用户提现的手机验证码
  carryVerifyMobile: () => http.get('/user/order/carry-verify-mobile'),

  // 注销绑定银行卡
  userBankDelete: id => http.post('/user/base/user-bank-delete', {id}),

  // 智豆转出
  beanTransferPoundage: data => http.post('/user/order/bean-transfer-poundage', data),

  // 其他课程
  otherClass: data => http.post(`/user/course/other-course?page=${data.page}`, data),

  // 邀请用户列表
  inviteList: data => http.post(`/user/invite/user-list?page=${data.page}`, data),

  // 课程分销列表
  getDistribution: data => http.post(`/course/distribution-list?page=${data.page}`, data),

  // 智豆转账
  getSendBeanCode: () => http.post('/user/verify/bean-transfer-verify-mobile'),

  //创建或修改课程，加载的课程类目列表
  courseGuide: () => http.post('/resource/course-guide'),
};
