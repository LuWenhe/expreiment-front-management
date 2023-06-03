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
      <!-- 如果是管理员 -->
      <template v-if="role === 'admin'">
        <template v-for="item in items_admin">
          <template v-if="item.child">
            <el-submenu :index="item.index">
              <template slot="title">
                <i :class="item.icon"></i><span>{{ item.title }}</span>
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
              :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <!-- 如果是教师 -->
      <template v-else-if="role === 'teacher'">
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
                  <span slot="title">{{ item1.title }}</span>
                </el-menu-item>
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
      <!-- 如果是学员 -->
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
                  <span slot="title">{{ item1.title }}</span>
                </el-menu-item>
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
import bus from '../common/bus'

export default {
  data() {
    return {
      collapse: false,
      role: '',
      items_admin: [
        {
          'icon': 'el-icon-lx-home',
          'index': '/dashboard',
          'title': '系统首页'
        },
        {
          'icon': 'el-icon-reading',
          'index': '/lessonIndex',
          'title': '课程管理',
          'child': [
            {
              'icon': 'el-icon-s-order',
              'index': '/lessonIndex',
              'title': '课程列表'
            },
            {
              'icon': 'el-icon-s-management',
              'index': '/tagList',
              'title': '标签管理'
            },
            {
              'icon': 'el-icon-s-management',
              'index': '/imageAdmin',
              'title': '工具管理'
            }
          ]
        },
        {
          'icon': 'el-icon-set-up',
          'index': '/lunboManage',
          'title': '系统管理',
          'child': [
            {
              'icon': 'el-icon-s-order',
              'index': '/lunboManage',
              'title': '轮播管理'
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
              'title': '教师管理'
            },
            {
              'icon': 'el-icon-user',
              'index': '/studentManage',
              'title': '学生管理'
            }
          ]
        }
      ],
      items_teacher: [
        {
          'icon': 'el-icon-lx-home',
          'index': '/dashboard',
          'title': '系统首页',
        },
        {
          'icon': 'el-icon-reading',
          'index': '/lessonIndex',
          'title': '课程管理',
          'child': [
            {
              'icon': 'el-icon-s-order',
              'index': '/lessonIndex',
              'title': '个人课程管理'
            },
            {
              'icon': 'el-icon-s-management',
              'index': '/imageAdmin',
              'title': '实验软件管理'
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
              'index': '/studentManage',
              'title': '学生管理',
            }
          ]
        },
        {
          'icon': 'el-icon-school',
          'index': '',
          'title': '班级管理',
          'child': [
            {
              'icon': 'el-icon-s-custom',
              'index': '/clazzManage',
              'title': '班级列表',
            }
          ]
        }
      ],
      items_student: [
        {
          'icon': 'el-icon-lx-home',
          'index': '/dashboard',
          'title': '系统首页'
        }
      ]
    }
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
    let role = localStorage.getItem("role")

    if (role === '管理员') {
      this.role = 'admin'
    } else if (role === '老师') {
      this.role = 'teacher'
    } else if (role === '学生') {
      this.role = 'student'
    }

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
