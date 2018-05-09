import API from './api';

if(typeof wxShare == 'undefined'){
  window.wxShare = {
    title: '智豆',
    desc: '描述',
    link: 'http://www.zhiliaotv.com/',
    imgUrl: 'http://www.zhiliaotv.com/static/assets/logo.png',

  };
}

//微信分享参数

//获取“分享给朋友”按钮点击状态及自定义分享内容接口
var onMenuShareAppFn = function(){
    wx.onMenuShareAppMessage({
        title: wxShare.title, // 分享标题
        desc: wxShare.desc, // 分享描述
        link: wxShare.link, // 分享链接
        imgUrl: wxShare.imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
};
//分享到朋友圈
var onMenuShareTL = function(){
    wx.onMenuShareTimeline({
        title: wxShare.title, // 分享标题
        link: wxShare.link, // 分享链接
        imgUrl: wxShare.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
};
//分享给qq好友
var onMenuShareQQ = function(){
    wx.onMenuShareQQ({
        title: wxShare.title, // 分享标题
        desc: wxShare.desc, // 分享描述
        link: wxShare.link, // 分享链接
        imgUrl: wxShare.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
};
//分享腾讯微博
var onMenuShareWB = function(){
    wx.onMenuShareWeibo({
        title: wxShare.title, // 分享标题
        desc: wxShare.desc, // 分享描述
        link: wxShare.link, // 分享链接
        imgUrl: wxShare.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
};
//分享QQ空间
var onMenuShareQZ = function(){
    wx.onMenuShareQZone({
        title: wxShare.title, // 分享标题
        desc: wxShare.desc, // 分享描述
        link: wxShare.link, // 分享链接
        imgUrl: wxShare.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            ajax(5);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
};
var wxReady = function(){
    wx.ready(function(){
        onMenuShareAppFn();
        onMenuShareTL();
        onMenuShareQQ();
        onMenuShareWB();
        onMenuShareQZ();
    });
};
var wxError = function(){
    wx.error(function(err){
        //alert(err);
    });
};

var wxConfig = function(data){
    wx.config(data);
    wxReady();
    wxError();
};

//签名
var currentUrl = window.location.href;
/*$.post(signalUrl, {currentUrl: currentUrl}, function(data){
    if(data){
        //var obj = JSON.parse(data);
        wxConfig(obj);
    }
});*/

export function wechat () {
    API.wechat(currentUrl).then(res => {
        console.log(res);
        let conf = typeof res == 'string' ? JSON.parse(res) : res;
        conf.jsApiList.push('scanQRCode');
        wxConfig(conf);
    }).catch(err => {
        console.log(err.message);
    })
}

//是否使用本地调用
/*var WXSHARE_USE_LOCALURL = true;
if (WXSHARE_USE_LOCALURL) {
    //签名URL
    var signalUrl = '/site/wx-js-conf'; //local
    $.ajax({
        type: 'get',
        url: signalUrl,
        data: {currentUrl: currentUrl},
        dataType: "json",
        success: function(data){
            if(data){
                data.debug = false;
                wxConfig(data);
            }
        },
        error: function(data){
            console.log(data);
        }
    });
} else {

    //签名URL

    //var signalUrl = 'http://dev.example.com/api/weixin';   //dev
    var signalUrl = 'http://www.example.com/api/weixin';
    $.ajax({
        type: 'post',
        url: signalUrl,
        data: {currentUrl: currentUrl},
        dataType: "jsonp",
        jsonp: "jsonpcallback",
        success: function(data){
            if(data){
                data.debug = false;
                wxConfig(data);
            }
        },
        error: function(data){
            console.log(data);
        }
    });
}*/
