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
      <template v-for='menu in menuList'>
        <!-- 如果当前结点有子结点 -->
        <template v-if='menu.children'>
          <el-submenu :index='menu.id.toString()'>
            <template slot='title'>
              <i :class='menu.icon'></i>
              <span>{{menu.name}}</span>
            </template>
            <template v-for='menuChild in menu.children'>
              <!-- 如果孩子结点还有子结点 -->
              <template v-if='menuChild.children'>
                <el-menu-item :index='menuChild.routerUrl'>
                  <template slot='title'>
                    <i :class='menuChild.icon'></i>
                    <span slot='title'>{{menuChild.name}}</span>
                  </template>
                </el-menu-item>
              </template>
              <template v-else>
                <el-menu-item :index='menuChild.routerUrl'>
                  {{menuChild.name}}
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
        </template>
        <!-- 如果当前结点没有子结点 -->
        <template v-else>
          <el-menu-item :index='menu.routerUrl'>
            <i :class='menu.icon'></i>
            <span slot='title'>{{menu.name}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus'
import { getMenuTree } from '@/network/api/permission'

export default {
  data() {
    return {
      collapse: false,
      role: '',
      menuList: []
    }
  },
  created() {
    let userData = JSON.parse(localStorage.getItem('userData'))

    getMenuTree(userData.userId).then(res => {
      if (res.status === '200') {
        this.menuList = res.data.children
      } else {
        this.$message.error('导航栏加载失败!')
      }
    })

    bus.$on('collapse', (msg) => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
  }
}
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
