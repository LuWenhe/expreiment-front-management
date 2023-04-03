import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
localStorage.getItem("token");

export default new Router({
    routes: [
        {
            path: '/backAdmin',
            component: () => import('../components/common/Home.vue'),
            meta: { title: '容器页面' },
            children: [
                {
                    path: '/backAdmin/dashboard',
                    component: () => import('../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/backAdmin/lessonIndex',
                    name:'lessonIndex',
                    component:() => import('../components/page/lesson/LessonList.vue'),
                    meta: {title:'课程列表'}
                },
                {
                    path: '/backAdmin/tagList',
                    component:() => import('../components/page/lesson/TagList.vue'),
                    meta: {title:'标签管理'}
                },
                {
                    path: '/backAdmin/classList',
                    component:() => import('../components/page/lesson/classList.vue'),
                    meta: {title:'班级管理'}
                },
                {
                    path: '/backAdmin/addLesson',
                    component:()=>import('../components/page/lesson/addLesson'),
                    meta: {title: '添加课程'}
                },
                {
                    path: '/backAdmin/editLesson',
                    component:()=>import('../components/page/lesson/editLesson'),
                    name:'editLesson',
                    meta: {title: '编辑课程'}
                },
                {
                    path: '/backAdmin/ToJupyterPage',
                    component:()=>import('../components/page/lesson/ToJupyterPage'),
                    name:'ToJupyterPage',
                    meta: {title: 'jupyter实验页面'}
                },
                {
                    path: '/backAdmin/imageAdmin',
                    component:()=>import('../components/page/lesson/imageAdmin'),
                    name:'imageAdmin',
                    meta: {title: '工具管理'}
                },
                {
                    path: "/backAdmin/lunboManage",
                    component:()=>import("../components/page/sys/lunboManage"),
                    name: 'lunboManage',
                    meta: {title: "轮播管理"}
                },
                {
                    path:"/backAdmin/userManage",
                    component:()=>import("../components/page/userAdmin/userManage"),
                    name:"/userManage",
                    meta:{title: "用户管理"}
                },
                {
                    path:"/backAdmin/studentManage",
                    component:()=>import("../components/page/userAdmin/studentManage"),
                    name:"/studentManage",
                    meta:{title: "学员管理"}
                },
                {
                    path:"/backAdmin/teacherManage",
                    component:()=>import("../components/page/userAdmin/teacherManage"),
                    name:"/teacherManage",
                    meta:{title: "教师管理"}
                }

            ]
        },
        {
            path: '/backAdmin/login',
            component: () => import('../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/backAdmin/404',
            component: () => import('../components/page/404.vue'),
            meta: { title: '错误' }
        },
    ],

    mode: "hash"
});
