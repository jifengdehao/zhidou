/**
 * 判断有效手机号码
 * @method isMobile
 * @param {Number} mobile 手机号码
 */
export function isMobile(mobile) {
  return /^1[345789]\d{9}$/.test(mobile);
}

/**
 * 判断有效身份证号
 * @method isCardNo
 * @param {Number} card 身份证号
 */
//^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|
//(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$
export function isCardNo(cardNo) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(cardNo);
}

/**
 * 去除字符串两端空格
 * @method trimString
 * @param {String} str 被处理字符串
 * @return {String} 期望字符串
 */
export function trimString(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}


/**
 * 格式化时间
 * @method formatDate
 * @param {String} data 时间戳秒数
 * @param {formate} 格式
 * @return {String} 格式化后的时间
 */
export function formatDate(date, format) {
  var fmt = format || 'yyyy-MM-dd HH:mm';
  var day = new Date(date * 1000);

  let o = {
    'M+': day.getMonth() + 1, // 月份
    'd+': day.getDate(), // 日
    'H+': day.getHours(), // 小时
    'm+': day.getMinutes(), // 分
    's+': day.getSeconds(), // 秒
    'q+': Math.floor((day.getMonth() + 3) / 3), // 季度
    'S': day.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (day.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt;
}

let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

// 添加class
export function addClass(el, className) {
  if (hasClass(el, className)) return
  // console.log(hasClass(el, className))
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}
// 判读是否有class
export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/*获取属性数据*/
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

/*延迟执行*/
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 *
 * @param data
 */
export const ajax=function (data) {
  let xhr;
  // 兼容IE浏览器
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  data.async = data.async || true;
  //把提交格式转化为小写字符
  let type = data.type.toLocaleLowerCase();

  //定义接受提交参数数组
  let params = [];

  //获取data.param的所有key值
  let key = Object.keys(data.param);
  for (let i = 0; i < key.length; i++) {
    //把每一个参数添加到数组中
    params.push(key[i] + '=' + data.param[key[i]]);
  }
  //把数组拼接成表单提交格式字符串
  params = params.join('&');

  //判断是否是jsonp
  if(data.datatype === 'jsonp'){
    let jsonp = data.jsonp || 'callback',
      jsonpCallback = data.jsonpCallback || 'myjsonp'+ new Date().getTime(),
      src = data.url+"?"+params+"&"+jsonp+"="+jsonpCallback,
      // src = params ? (data.url+"&"+params) : data.url,
      script = document.createElement('script');
    window[jsonpCallback] = function(res){
      console.log(res);
      data.success(res)
    }
    script.src = src;
    document.body.appendChild(script);
  }else{

    //判断请求方法
    if (type === 'get') {
      let url = data.url +"?"+params;

      xhr.open(type, url, data.async);
      xhr.send();
    } else {
      xhr.open(type, data.url, data.async);
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xhr.send(params);
    }

    //链接服务器成功执行函数

    xhr.onreadystatechange = function(){
      if(this.readyState == 4){
        if(this.status == 200){
          if(data.datatype == 'json' || data.datatype == 'html' || data.datatype == 'text'){
            let res = this.responseText;
            data.success(res);
          }else if(data.datatype == 'xml'){
            let res = this.responseXML;
            data.success(res);
          }
        }else{
          data.error();
        }
      }
    }
  }
}
