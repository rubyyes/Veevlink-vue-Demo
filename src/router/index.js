import Vue from 'vue'
import Router from 'vue-router'
const home = r => require.ensure([], () => r(require('../page/home/home.vue')), 'home');
Vue.use(Router);
// survey
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'  // 任何没有具体路径的访问，我都让它重定向到home主页，重定向在限制用户手动修改URL时误操作很管用
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '主页',
        allowBack: true
      },
      component: home
    }
  ]
})
