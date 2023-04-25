<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="$route.path"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-if="this.role=='admin'">
        <template v-for="item in items_admin">
          <template v-if="item.child">
            <el-submenu :index="item.index">
              <template slot="title"><i :class="item.icon"></i><span>{{ item.title }}</span>
              </template>
              <template v-for="item1 in item.child ">
                <el-menu-item
                  :index="item1.index"
                  :key="item1.index"
                ><i :class="item1.icon"></i>
                  <span slot="title">{{ item1.title }}</span></el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item
              :index="item.index"
              :key="item.index"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-else-if="this.role=='teacher'">
        <template v-for="item in items_teacher">
          <template v-if="item.child">
            <el-submenu :index="item.index">
              <template slot="title"><i :class="item.icon"></i> <span>{{ item.title }}</span>
              </template>
              <template v-for="item1 in item.child ">
                <el-menu-item
                  :index="item1.index"
                  :key="item1.index"
                ><i :class="item1.icon"></i>
                  <span slot="title">{{ item1.title }}</span></el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item
              :index="item.index"
              :key="item.index"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-else>
        <template v-for="item in items_student">
          <template v-if="item.child">
            <el-submenu :index="item.index">
              <template slot="title"><i :class="item.icon"></i><span>{{ item.title }}</span>
              </template>
              <template v-for="item1 in item.child ">
                <el-menu-item
                  :index="item1.index"
                  :key="item1.index"
                ><i :class="item1.icon"></i>
                  <span slot="title">{{ item1.title }}</span></el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item
              :index="item.index"
              :key="item.index"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';

export default {
  data() {
    return {
      collapse: false,
      role: 'admin',
      // items_admin: [{
      //     'icon': 'el-icon-lx-home',
      //     'index': '/backAdmin/dashboard',
      //     'title': '系统首页',
      //  },
      //  {
      //     'icon': 'el-icon-reading',
      //      'index':'/backAdmin/lessonIndex',
      //     'title': '课程管理',
      //     'child':[{
      //         'icon': 'el-icon-s-order',
      //         'index': '/backAdmin/lessonIndex',
      //         'title': '课程列表',
      //         },
      //         {
      //             'icon': 'el-icon-s-management',
      //             'index': '/backAdmin/tagList',
      //             'title': '标签管理',
      //         },
      //         {
      //             'icon': 'el-icon-s-management',
      //             'index': '/backAdmin/imageAdmin',
      //             'title': '镜像管理',
      //         },
      //         {
      //             'icon': 'el-icon-s-management',
      //             'index': '/backAdmin/classList',
      //             'title': '班级管理',
      //         }
      //     ]
      // },
      // {
      //     'icon': 'el-icon-set-up',
      //     'index':'/backAdmin/lunboManage',
      //     'title': '系统管理',
      //     'child':[{
      //         'icon': 'el-icon-s-order',
      //         'index': '/backAdmin/lunboManage',
      //         'title': '轮播管理',
      //     }
      //     ]
      // },
      // {
      //     'icon': 'el-icon-s-custom',
      //     'index':'/backAdmin/userManage',
      //     'title': '用户管理',
      //     'child':[
      //         {
      //             'icon': 'el-icon-user',
      //             'index': '/backAdmin/teacherManage',
      //             'title': '教师管理',
      //         },
      //         {
      //             'icon': 'el-icon-user',
      //             'index': '/backAdmin/studentManage',
      //             'title': '学生管理',
      //         },
      //
      //     ]
      // }],
      items_admin: [
        {
          'icon': 'el-icon-lx-home',
          'index': '/dashboard',
          'title': '系统首页',
        },
        {
          'icon': 'el-icon-reading',
          'index': '/lessonIndex',
          'title': '课程管理',
          'child': [{
            'icon': 'el-icon-s-order',
            'index': '/lessonIndex',
            'title': '课程列表',
          },
            {
              'icon': 'el-icon-s-management',
              'index': '/tagList',
              'title': '标签管理',
            },
            {
              'icon': 'el-icon-s-management',
              'index': '/imageAdmin',
              'title': '工具管理',
            }
          ]
        },
        {
          'icon': 'el-icon-set-up',
          'index': '/lunboManage',
          'title': '系统管理',
          'child': [{
            'icon': 'el-icon-s-order',
            'index': '/lunboManage',
            'title': '轮播管理',
          }
          ]
        },
        {
          'icon': 'el-icon-s-custom',
          'index': '/userManage',
          'title': '用户管理',
          'child': [
            {
              'icon': 'el-icon-user',
              'index': '/teacherManage',
              'title': '教师管理',
            },
            {
              'icon': 'el-icon-user',
              'index': '/studentManage',
              'title': '学生管理',
            },
            {
              'icon': 'el-icon-user',
              'index': '/studentNewManage',
              'title': '学员管理',
            }
          ]
        }],
      items_teacher:
        [{
          'icon': 'el-icon-lx-home',
          'index': '/dashboard',
          'title': '系统首页',
        },
          {
            'icon': 'el-icon-reading',
            'index': '/lessonIndex',
            'title': '课程管理',
            'child': [{
              'icon': 'el-icon-s-order',
              'index': '/lessonIndex',
              'title': '个人课程管理',
            },
              {
                'icon': 'el-icon-s-management',
                'index': '/imageAdmin',
                'title': '实验软件管理',
              }]
          }],
      items_student:
        [{
          'icon': 'el-icon-lx-home',
          'index': '/dashboard',
          'title': '系统首页',
        }]

    };
  },
  methods: {

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    UniMainPage() {
      this.$router.push('/union');
    },
    setSideBar() {

    },

    onclick() {
      console.log('被点击');
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    },
    noChildren() {
      return this.asideMenu.filter(item =>
        !item.children
      )
    },
    hasChildren() {
      return this.asideMenu.filter(item =>
        item.children
      )
    }

  },
  created() {
    if (localStorage.getItem("role") === '0') {
      this.role = 'admin'
    } else if (localStorage.getItem("role") === '1') {
      this.role = 'student'
    } else {
      this.role = 'student'
    }
    this.setSideBar()
    bus.$on('collapse', (msg) => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });

  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
