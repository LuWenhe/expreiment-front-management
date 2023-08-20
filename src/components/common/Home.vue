<template>
  <div class='wrapper'>
    <v-head></v-head>
    <v-side-bar></v-side-bar>
    <div class='content-box' :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class='content'>
        <transition name='move' mode='out-in'>
          <keep-alive :include='tagsList'>
            <router-view></router-view>
          </keep-alive>
        </transition>
        <!-- 回到顶部 -->
        <el-backtop target='.content'></el-backtop>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue'
import vSideBar from './SideBar.vue'
import vTags from './Tags.vue'
import bus from './bus'

export default {
  data() {
    return {
      tagsList: [],
      collapse: false,
      sideBar_type: ''
    };
  },
  components: {
    vHead,
    vTags,
    vSideBar
  },
  created() {
    //this.sideBar_type  = 'sideBarDispatcher';
    bus.$on('collapse-content', msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  methods: {}
};
</script>
