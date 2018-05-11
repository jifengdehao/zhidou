import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/oauth',
      name: 'oauth',
      component: () => import('@/pages/oauth/oauth')
    },
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/pages/site/index/index'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/search/search')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/site/login/login'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/site/register/register'),
    },
    {
      path: '/find-pwd',
      name: 'findPwd',
      component: () => import('@/pages/site/find-pwd/find-pwd'),
    },

    /*课程*/
    {
      path: '/course/detail/:id',
      name: 'classDetails',
      component: () => import('@/pages/course/details/details')
    },
    {
      path: '/course/teach/:id',
      name: 'classTeach',
      component: () => import('@/pages/course/teach/teach')
    },
    {
      path: '/course/author/:id',
      name: 'author',
      component: () => import('@/pages/course/author/author')
    },
    {
      path: '/course/classList/:type/:id',
      name: 'classList',
      component: () => import('@/pages/course/classList/classList')
    },
    /*
     * 单课
     */
    /*{
      path: '/course/detail/:id',
      name: 'courseDetail',
      component: () => import('@/pages/course/course/detail/detail'),
    },
    {
      path: '/course/learn',
      name: 'courseLearn',
      component: () => import('@/pages/course/course/learn/learn'),
    },
    {
      path: '/course/teach/:id',
      name: 'courseTeach',
      component: () => import('@/pages/course/course/teach/teach'),
    },
    {
      path: '/course/classList/:type/:id',
      name: 'classList',
      component: () => import('@/pages/course/classList/classList')
    },*/
    /*
     * 系列课
     */
    /*{
      path: '/series/detail/:id',
      name: 'seriesDetail',
      component: () => import('@/pages/course/series/detail/detail'),
    },
    {
      path: '/series/teach/:course_id/:id',
      name: 'seriesTeach',
      component: () => import('@/pages/course/series/teach/teach')
    },*/


    /*
     * 直播间
     */
    {
      path: '/classroom',
      name: 'classroom',
      component: () => import('@/pages/classroom/classroom/index/index'),
    },
    {
      path: '/classroom/create',
      name: 'classroomCreate',
      component: () => import('@/pages/classroom/classroom/create/create'),
    },
    {
      path: '/classroom/banner',
      name: 'classroomBanner',
      component: () => import('@/pages/classroom/classroom/banner/banner'),
    },
    {
      path: '/classroom/introduction',
      name: 'courseIntroduction',
      component: () => import('@/pages/classroom/classroom/introduction/introduction'),
    },
    // 课-列表
    {
      path: '/classroom/classlist/:type',
      name: 'classroomClassList',
      component: () => import('@/pages/classroom/classroom/classlist/classlist'),
    },
    /*
     * 直播间 - 单课
     */
    /*{
      path: '/classroom/course',
      name: 'classroomCourse',
      component: () => import('@/pages/classroom/course/index/index'),
    },*/
    // 新建单课
    {
      path: '/classroom/course/create',
      name: 'classroomCourseCreate',
      component: () => import('@/pages/classroom/course/create/create'),
    },
    // 单课详情
    {
      path: '/classroom/course/detail/:id',
      name: 'classroomCourseDetail',
      component: () => import('@/pages/classroom/course/detail/detail'),
    },
    // 单科直播间
    {
      path: '/classroom/course/teach/:id',
      name: 'classroomCourseTeach',
      component: () => import('@/pages/classroom/course/teach/teach')
    },
    // 编辑单课
    {
      path: '/classroom/course/update/:id',
      name: 'classroomCourseUpdate',
      component: () => import('@/pages/classroom/course/update/update'),
    },
    // 课程banner
    {
      path: '/classroom/course/banner/:id',
      name: 'classroomCourseBanner',
      component: () => import('@/pages/classroom/course/banner/banner'),
    },
    // 课程简介
    {
      path: '/classroom/course/introduction/:id',
      name: 'classroomCourseIntroduction',
      component: () => import('@/pages/classroom/course/introduction/introduction'),
    },

    /*
     * 直播间 - 系列课列表
     */
    /*{
      path: '/classroom/series',
      name: 'classroomSeries',
      component: () => import('@/pages/classroom/series/index/index'),
    },*/
    // 直播间-分类
    {
      path: '/classroom/series/category',
      name: 'classroomSeriesCategory',
      component: () => import('@/pages/classroom/series/category/category'),
    },
    // 系列课 - 课程简介
    {
      path: '/classroom/series/intro/:id',
      name: 'classroomSeriesIntro',
      component: () => import('@/pages/classroom/series/intro/intro')
    },
    // 系列课详情
    {
      path: '/classroom/series/detail/:id',
      name: 'classroomSeriesDetail',
      component: () => import('@/pages/classroom/series/detail/detail'),
    },
    //新建系列课
    {
      path: '/classroom/series/create',
      name: 'classroomSeriesCreate',
      component: () => import('@/pages/classroom/series/create/create'),
    },
    //修改系列课
    {
      path: '/classroom/series/update/:id',
      name: 'classroomSeriesUpdate',
      component: () => import('@/pages/classroom/series/update/update'),
    },
    // 系列课-课时详情
    {
      path: '/classroom/series/period/:id',
      name: 'classroomSeriesPeriod',
      component: () => import('@/pages/classroom/series/period/period'),
    },
    // 系列课-课时直播
    {
      path: '/classroom/series/period/teach/:course_id/:id',
      name: 'classroomSeriesPeriodTeach',
      component: () => import('@/pages/classroom/series/teach/teach')
    },
    // 系列课 - 新增课时
    {
      path: '/classroom/series/add-period/:id',
      name: 'classroomSeriesAddPeriod',
      component: () => import('@/pages/classroom/series/add-period/add-period')
    },
    // 系列课-课时列表
    {
      path: '/classroom/series/list/:id',
      name: 'classroomSeriesList',
      component: () => import('@/pages/classroom/series/list/list'),
    },
    //系列课 - 课时修改
    {
      path: '/classroom/series/period/edit/:id',
      name: 'periodEdit',
      component: () => import('@/pages/classroom/series/update-period/update-period')
    },
    // 系列课 - 课时修改banner
    {
      path: '/classroom/series/period/banner/:id',
      name: 'periodBanner',
      component: () => import('@/pages/classroom/series/banner/banner')
    },
    // 系列课 - 课时修改简介
    {
      path: '/classroom/series/period/intro/:id',
      name: 'periodIntro',
      component: () => import('@/pages/classroom/series/introduction/introduction')
    },
    /*
     * 我的
     */
    {
      path: '/user',
      name: 'userIndex',
      component: () => import('@/pages/user/index/index'),
    },
    {
      path: '/user/info',
      name: 'userInfo',
      component: () => import('@/pages/user/info/info'),
    },
    {
      path: '/user/course',
      name: 'userCourse',
      component: () => import('@/pages/user/course/course'),
    },
    {
      path: '/user/auth',
      name: 'userAuth',
      component: () => import('@/pages/user/auth/auth'),
    },
    {
      path: '/user/wallet',
      name: 'userWallet',
      component: () => import('@/pages/user/wallet/wallet'),
    },
    {
      path: '/user/wallet-transfer',
      name: 'userWalletTransfer',
      component: () => import('@/pages/user/wallet-transfer/wallet-transfer'),
    },
    {
      path: '/user/bindbank',
      name: 'bindbank',
      component: () => import('@/pages/user/bindbank/bindbank')
    },
    {
      path: '/user/token',
      name: 'userToken',
      component: () => import('@/pages/user/token/token'),
    },
    {
      path: '/user/token-transfer',
      name: 'userTokenTransfer',
      component: () => import('@/pages/user/token-transfer/token-transfer'),
    },
    {
      path: '/user/help',
      name: 'userHelp',
      component: () => import('@/pages/user/help/help'),
    },
    {
      path: '/user/order',
      name: 'userOrder',
      component: () => import('@/pages/user/order/order')
    },
    {
      path: '/yinlianxieyi',
      name: 'yinlianxieyi',
      component: () => import('@/pages/xieyi/xieyi')
    },
    {
      path: '/modifyPwd',
      name: 'modifyPwd',
      component: () => import('@/pages/site/modify-pwd/modify-pwd')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/pages/test/test')
    },
    {
      path: '/test/video',
      name: 'test-video',
      component: () => import('@/pages/test/test-video')
    },
    // 邀请好友
    {
      path: '/invite',
      name: 'invite',
      component: () => import('@/pages/user/invite/invite')
    },
    {
      path: '/user/invite/register',
      name: 'invite-register',
      component: () => import('@/pages/user/invite-register/invite-register')
    },
    {
      path: '/invite/success',
      name: 'invite-success',
      component: () => import('@/pages/user/invite-success/invite-success')
    },
    {
      path: '/index/earn-bean',
      name: 'earn-bean',
      component: () => import('@/pages/site/earn-bean/earn-bean')
    },
    {
      path: '/index/course-distribution',
      name: 'course-distribution',
      component: () => import('@/pages/site/course-distribution/course-distribution')
    },
  ]
})
;
