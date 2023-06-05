<template>
  <div>
    <el-row :gutter='20'>
      <el-col :span='8'>
        <div class='div_style'>
          <div style='width: 20px'></div>
          <img src='@/assets/icon.png' style='width: 90px;height: 90px;display: inline-block;' />
          <div style='position: absolute;line-height: 100px;height: 100px;right: 40px;top: 0;'>
            <router-link :to="{path: '/backAdmin/lessonIndex'}"
                         style='font-size: 20px;color: #000000;text-decoration: none'>
              课程数量
            </router-link>
            <span class='count_style'>{{ lessonNum }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span='8'>
        <div class='div_style'>
          <div style='width: 20px'></div>
          <img src='@/assets/icon.png' style='width: 90px;height: 90px;display: inline-block;' />
          <div style='position: absolute;line-height: 100px;height: 100px;right: 40px;top: 0;'>
            <router-link :to="{path: '/backAdmin/tagList'}" style='font-size: 20px;color: #000;text-decoration: none'>
              课程标签
            </router-link>
            <span class='count_style'>{{ tagNum }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-divider content-position='left'>课程分类图</el-divider>
    <el-row :gutter='20'>
      <el-col :span='6'>
        <div id='echarts_id' style='width: 700px;height: 700px'></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDashBoardInfo } from '@/api/dashBoard'

export default {
  data: function() {
    return {
      lessonNum: '',
      tagNum: '',
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0
    }
  },
  created() {
    if (localStorage.getItem('token') == null) {
      this.$router.push('/backAdmin/login')
    }

    this.getData()
  },
  mounted() {
    this.drawPic()
  },
  methods: {
    drawPic() {
      getDashBoardInfo().then(res => {
        if (res.data.code === '200') {
          let eChart = this.$echarts.init(document.getElementById('echarts_id'))

          let option = {
            title: {
              text: '实训平台数据图',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: res.data.data.lessonCount, name: '课程数量' },
                  { value: res.data.data.tagCount, name: '课程标签' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }

          eChart.setOption(option)
        }
      })
    },
    getData() {
      getDashBoardInfo().then(res => {
        if (res.data.code === '200') {
          this.lessonNum = res.data.data.lessonCount
          this.tagNum = res.data.data.tagCount
        } else {
          this.$message.error('加载失败');
        }
      })
    }
  }
}
</script>

<style>
@import '../../assets/css/main.css';
@import '../../assets/css/color-dark.css'; /*深色主题*/

.el-table th.gutter {
  display: table-cell !important;
}

.count_style {
  font-size: 20px;
  background-color: rgb(245, 108, 108);
  color: white;
  padding: 1px 17px;
  border-radius: 10px;
}

.div_style {
  width: 300px;
  height: 100px;
  background-color: #b7c4bf;
  line-height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  margin: 22px 10px 10px 30px;
  border: 3px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  border-radius: 10px;
  overflow: hidden;

}
</style>
