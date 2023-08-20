import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/components/page/Login.vue'),
      meta: {title: '登录'}
    },
    {
      path: '/',
      component: () => import('@/components/common/Home.vue'),
      redirect: '/dashboard',
      meta: {title: '容器页面'},
      children: [
        {
          path: '/dashboard',
          component: () => import('@/components/page/Dashboard.vue'),
          meta: {title: '系统首页'}
        },
        {
          path: '/lessonManage',
          name: 'lessonManage',
          component: () => import('@/components/page/lesson/LessonManage.vue'),
          meta: {title: '课程列表'}
        },
        {
          path: '/fileManage',
          name: 'fileManage',
          component: () => import('@/components/page/lesson/FileManage.vue'),
          meta: {title: '文件管理'}
        },
        {
          path: '/tagManage',
          component: () => import('@/components/page/lesson/TagManage.vue'),
          meta: {title: '标签管理'}
        },
        {
          path: '/addLesson',
          component: () => import('@/components/page/lesson/AddLesson.vue'),
          meta: {title: '添加课程'}
        },
        {
          path: '/editLesson',
          component: () => import('@/components/page/lesson/EditLesson.vue'),
          name: 'editLesson',
          meta: {title: '编辑课程'}
        },
        {
          path: '/ToJupyterPage',
          component: () => import('@/components/page/lesson/ToJupyterPage'),
          name: 'ToJupyterPage',
          meta: {title: 'jupyter实验页面'}
        },
        {
          path: '/toolManage',
          component: () => import('@/components/page/lesson/ToolManage.vue'),
          name: 'toolManage',
          meta: {title: '工具管理'}
        },
        {
          path: "/bannerManage",
          component: () => import("@/components/page/sys/BannerManage.vue"),
          name: 'bannerManage',
          meta: {title: "轮播管理"}
        },
        {
          path: "/studentManage",
          component: () => import("@/components/page/userAdmin/StudentManage.vue"),
          name: "/studentManage",
          meta: {title: "学员管理"}
        },
        {
          path: "/teacherManage",
          component: () => import("@/components/page/userAdmin/TeacherManage.vue"),
          name: "/teacherManage",
          meta: {title: "教师管理"}
        },
        {
          path: '/clazzManage',
          component: () => import('@/components/page/clazz/ClazzManage.vue'),
          name: '/clazzManage',
          meta: {title: '班级管理'}
        }
      ]
    }
  ],
  mode: "history"
})
