<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div>
            <span style='position:absolute;margin-top: 20px'>气象雷达智能技术应用实训系统</span>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <div class="btn-bell">
                    <span style='color: white;font-size: 15px'>欢迎您&nbsp;{{this.name}}</span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{this.name}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
import axios from 'axios';

export default {
    data() {
        return {
          wrapClass:{
            wrapClass:true
          },
          wrapStyle:{
            fontWeight:800
          },

          //滚动整体区域的class
          viewClass:{
            viewClass:true
          },
          viewStyle:{
            border:'1px solid #000000',
            boxSizing:'border-box'
          },
          // native属性：如果为true就不显示el的bar，也就是el模拟出来的滚动条，如果为false就显示模拟的滚动条
          native:false,
          // tag 渲染出来的标签
          tag:'section',
          // noresize 是否刷新滚动条大小
          noresize:true,

            collapse: false,
            fullscreen: false,
            name: 'linxin',
            message: 2,
            drawer: false,
            direction: 'rtl',
            infoSize:"",
          activities:[],
          count:0,
          websock: null, //建立的连接
          lockReconnect: false, //是否真正建立连接
          timeout: 20 * 1000, //20秒一次心跳
          timeoutObj: null, //心跳心跳倒计时
          serverTimeoutObj: null, //心跳倒计时
          timeoutnum: null //断开 重连倒计时
        };
    },

  created() {
      this.name = localStorage.getItem("name");
  },

  methods: {

    load () {
      this.count = this.infoSize
    },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            var id = 0 ;
            if (command == 'loginout') {

                  localStorage.clear();
                  this.$router.push('/backAdmin/login');

            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
      handleFullScreen() {
          let element = document.documentElement;
          if (this.fullscreen) {
              if (document.exitFullscreen) {
                  document.exitFullscreen();
              } else if (document.webkitCancelFullScreen) {
                  document.webkitCancelFullScreen();
              } else if (document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
              } else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
              }
          } else {
              if (element.requestFullscreen) {
                  element.requestFullscreen();
              } else if (element.webkitRequestFullScreen) {
                  element.webkitRequestFullScreen();
              } else if (element.mozRequestFullScreen) {
                  element.mozRequestFullScreen();
              } else if (element.msRequestFullscreen) {
                  // IE11
                  element.msRequestFullscreen();
              }
          }
          this.fullscreen = !this.fullscreen;
      },

  }


};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 0px;
  margin-top: 10px;
      font-size: 24px;
}
.btn-bell{
  padding-left: 50px;
  padding-right: 50px;
}

.btn-bell{
    position: relative;
    width: 120px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
