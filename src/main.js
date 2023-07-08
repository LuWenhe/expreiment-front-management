import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import { messages } from './components/common/i18n'
import 'element-ui/lib/theme-chalk/index.css'       // 默认主题
import './assets/css/icon.css'
import './components/common/directives'
import 'babel-polyfill'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import * as echarts from 'echarts'   //echarts5.0之后引入的方式
import directives from '@/directives'
import store from '@/store'

Vue.prototype.$echarts = echarts

//导入验证码
import SlideVerify from 'vue-monoplasty-slide-verify'

Vue.use(SlideVerify)
Vue.use(directives)
Vue.use(mavonEditor);
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VueI18n);
Vue.use(ElementUI, {
  size: 'small'
})

const i18n = new VueI18n({
  locale: 'zh',
  messages
});

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
});

//使用钩子函数对路由进行权限跳
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 实训平台管理系统`;
  let token= localStorage.getItem('token');

  // 如果有token, 直接跳转
  if (token) {
    next()
  } else {
    // 如果是登录页面,就停留登录页,不在重复跳转
    if (to.path === '/login') {
      next()
    } else {
      ElementUI.Message.error('登录信息失效, 请重新登录!')
      next('/login')
    }
  }
});

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload();
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error);
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
