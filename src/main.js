import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import * as echarts from 'echarts';   //echarts5.0之后引入的方式
Vue.prototype.$echarts = echarts;
import { get, post } from "./api/index";
//导入验证码
import SlideVerify from 'vue-monoplasty-slide-verify';




Vue.use(SlideVerify);

Vue.prototype.$http = {
    get,
    post
};

// use
Vue.use(mavonEditor)
Vue.config.productionTip = false;
Vue.use(VueAxios,axios);
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
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
router.beforeEach((to, from, next) =>{

    document.title = `${to.meta.title} | 实训平台管理系统`;
    const token = localStorage.getItem('token');

    if (!token && to.path !== '/login') {
        next('/login');
    }else if(token && to.path == '/login'){
        next('/dashboard')

    }else if (to.meta.permission) {
        console.log(to.path);

    } else {
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }

});

router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
        window.location.reload();
        // router.replace(router.history.pending.fullPath);
    }else{
        console.log(error)
    }
});


new Vue({
    router,
    i18n,
    data: function(){
        return {
           URL: 'http://localhost:8089',
            //URL: 'http://10.0.7.205:8089',

        }
    },
    render: h => h(App)
}).$mount('#app');
