import Vue from 'vue'
import router from './router'
import VueWechatTitle from 'vue-wechat-title'
import {base} from "../public/static/js/Base"
import {SFDCApi} from "../public/static/js/SFDCApi"
import veevlinkBase from  "../veevlinkBase"
import config from './utils/config'//引用公共方法文件
Vue.prototype.config = config; //挂载到Vue实例上面
import { DatetimePicker,Picker } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Picker.name, Picker);
// Picker.name, Picker
import store from './utils/store.js'; // 引用vueX
import App from './App.vue'
Vue.config.productionTip = false;
Vue.use(VueWechatTitle);
//全局变量context
window.context = {
  OpenId: "",
  WEQYUserId: ""
};
base();
SFDCApi();
console.log(veevlinkBase);
// 有ApiVersion代表在公众号环境了
if(context.ApiVersion ){
  // 如果是空的 openid 就变成空字符串
  if(!context.OpenId){
    context.OpenId = "";
  }
  const vm = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}




// 跳转前的重定向判断和 url更正
router.beforeEach((to, from, next) => {
  next();
  window.vm.hintbox = "";
  console.log(vm.hintbox);
  console.log('to',to);
  let allowBack = true;    //    给个默认值true
  if (to.meta.allowBack !== undefined) {
    allowBack = to.meta.allowBack
  }
  if (!allowBack) {
    history.pushState(null, null, location.href)
  }
  vm.$store.commit('updateAppSetting',allowBack);
  // 刷新微信的URL地址
  setTimeout(function () {
    window.location = window.location;
  }, 500);
});

