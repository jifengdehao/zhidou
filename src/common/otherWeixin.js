/***
 * 微信支付
 * @param data
 * @param cb
 */
export function weixinPay(data, cb) {

  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady(data, cb), false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady(data, cb));
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(data, cb));
    }
  } else {
    onBridgeReady(data, cb)
  }

  function onBridgeReady(data, cb) {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', data,
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          cb(res)
        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      }
    );
  }
}
