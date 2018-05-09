import Vue from 'vue';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import App from './App';
import router from './router';
import API from './common/api';
import store from './store'
import components from './components';  // 组件扩展
import {formatDate, trimString} from '@/common/util.js';
import Cookie from 'js-cookie';
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Vue.use(Mint);
Vue.config.productionTip = false;
Vue.prototype.API = API;
Vue.prototype.$trim = trimString;

// 自定义组件扩展
Object.keys(components).forEach((key) => {
  // 首字母大写
  const name = key.replace(/(\w)/, v => v.toUpperCase());
  Vue.component(`${name}`, components[key]);
});

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})


const placeHolder = {
  avatar: require('@/assets/avatar_default.png'),
  banner: require('@/assets/course_default.png'),
  cover: require('@/assets/course_thumb_default.png'),
};

Vue.filter('capitalize', function (value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('formatDate', function (value) {
  return formatDate(value);
});

// wechat();


router.beforeEach((to, from, next) => {
  let isLogin
  let path = to.path.substr(1)
  //let isLogin = Cookie.get('__zdb_dev__')  // 验证是否已经登录
  if (/www\.zhiliaotv\.com/.test(location.host)) {
    isLogin = Cookie.get('__zlt_js__')
  } else {
    isLogin = Cookie.get('__zdb_dev_js__')
  }
  if (path === 'oauth') {
    if (isLogin) {
      next('/index')
      return false
    }
  }
  next()
})


new Vue({
  el: '#app',
  data() {
    return {
      placeHolder
    };
  },
  router,
  store,
  components: {App},
  template: '<App/>',
});
