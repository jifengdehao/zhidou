//微信支付方法（点击按键调用）
import wx from 'weixin-js-sdk'

/*
微信支付方法
获取微信加签信息
@param{data}:获取的微信加签
@param{cb}:成功回调
*/
export function wexinPay(data, cb, errorCb) {
  let appId = data.appId;
  let timestamp = data.timeStamp;
  let nonceStr = data.nonceStr;
  let signature = data.signature;
  let packages = data.package;
  let paySign = data.paySign;
  let signType = data.signType
  wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: appId, // 必填，公众号的唯一标识
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名，见附录1
    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
  wx.ready(function () {
    wx.chooseWXPay({
      timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
      package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: paySign, // 支付签名
      success: function (res) {
        // 支付成功后的回调函数
        cb(res);
      },
      fail: function (res) {
        errorCb(res);
      }
    });
  });
  wx.error(function (err) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    /*alert("config信息验证失败");*/
    console.log(err)
  });
}

/**
 * 关闭页面
 * @param data
 * @param cb
 * @param errorCb
 */
export const weixinCloseWin = function (data, cb, errorCb) {
  let appId = data.appId;
  let timeStamp = data.timeStamp;
  let nonceStr = data.nonceStr;
  let signature = data.signature;
  wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: appId, // 必填，公众号的唯一标识
    timestamp: timeStamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名，见附录1
    jsApiList: ['closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
  wx.ready(function () {
    wx.closeWindow({
      success: function (res) {
        // 用户确认分享后执行的回调函数
        cb(res);
      },
      cancel: function (res) {
        // 用户取消分享后执行的回调函数
        errorCb(res);
      }
    });
  });
  wx.error(function (err) {
    console.log(err)
  });
}

export const weixinShare = function (data, content, cb, errorCb) {
  let appId = data.appId;
  let timestamp = data.timestamp;
  let nonceStr = data.nonceStr;
  let signature = data.signature;
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: appId, // 必填，公众号的唯一标识
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名，见附录1
    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
  wx.ready(function () {
    // 分享朋友
    wx.onMenuShareAppMessage({
      title: content.title, // 分享标题
      desc: content.desc, // 分享描述
      link: content.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: content.imgUrl, // 分享图标
      type: content.type, // 分享类型,music、video或link，不填默认为link
      dataUrl: content.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
      success: function (res) {
        // 用户确认分享后执行的回调函数
        cb(res);
      },
      cancel: function (res) {
        // 用户取消分享后执行的回调函数
        errorCb(res);
      }
    })
    // 分享朋友圈
    wx.onMenuShareTimeline({
      title: "知了TV —— " + content.desc, // 分享标题
      link: content.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: content.imgUrl, // 分享图标
      success: function (res) {
        // 用户确认分享后执行的回调函数
        cb(res);
      },
      cancel: function (res) {
        // 用户取消分享后执行的回调函数
        errorCb(res);
      }
    });
  })
  wx.error(function (err) {
    console.log(err)
  });
}
