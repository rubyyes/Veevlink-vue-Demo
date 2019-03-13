//自适应
var clientWidth = document.documentElement.clientWidth;

fontSize = clientWidth / 7.5 + 'px';
var h = document.getElementsByTagName("html");
h[0].style.fontSize = fontSize;

var equipment = navigator.userAgent;
var isPC = false;
var isApple = false;
if (equipment.indexOf('Android') > -1 || equipment.indexOf('Linux') > -1) {//安卓手机
  console.log('安卓手机');
} else if (equipment.indexOf('iPhone') > -1) {//苹果手机
  console.log('苹果手机');
  isApple = true;
} else if (equipment.indexOf('Windows Phone') > -1) {//winphone手机
  console.log('winphone手机');
} else{
  isPC = true;
}

(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;

      console.log(clientWidth);
      if (isPC) {
        clientWidth = 600;
        docEl.style.fontSize = '50px';
        docEl.style.maxWidth = '500px';
        docEl.style.position = 'relative';
        docEl.style.margin = '0 auto';
        // max-width: 500px;
        // position: relative;
        // margin: 0 auto;
      } else {
        docEl.style.fontSize = clientWidth / 7.5 + 'px';
      }
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var LocalGetter = function (key) {
  return localStorage.getItem(key);
};
var LocalSetter = function (key, val) {
  return localStorage.setItem(key, val);
};
var LocalRemove = function (key) {
  return localStorage.removeItem(key)
};
var SessionGetter = function (key) {
  return sessionStorage.getItem(key);
};
var SessionRemove = function (key) {
  return sessionStorage.removeItem(key)
};
var SessionSetter = function (key, val) {
  return sessionStorage.setItem(key, val);
};


//登录页面路径
var login = 'https://svn.veevlink.com/Custom/chengjia';
// var login = 'https://aps2.veevlink.com/custom/chengjia'; //正式
var celnet = {
  page: [],
  // queryOrderStatu:'https://api.o-home.cc/v2/lakala/queryOrderStatu',//正式
  queryOrderStatu:'https://api.dev.o-home.com/v2/lakala/queryOrderStatu',
  // register:'https://api.o-home.cc/v1/gt/register',//正式
    register:'https://api.dev.o-home.com/v1/gt/register'

};
var debug = '';
var debugget = '';

