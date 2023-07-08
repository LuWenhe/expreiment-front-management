<template>
  <el-row class='lesson-container'>
    <el-row class='lesson-container-left'>
      <ul v-for='(item, index) in tagList' :key='index'>
        <li class='tagLi' @click='getLessonsByTag(item.tagName)'>
          <i class='el-icon-price-tag' style='width: 150px;font-size: 20px'>
            <a href='#' style='width: 150px;height: 50px;font-size: 20px'>{{ item.tagName }}</a>
          </i>
        </li>
      </ul>
    </el-row>
    <el-row class='lesson-container-right' ref='lessonRight'>
      <el-row class='search-box'>
        <el-input class='name-input' placeholder='请根据课程名称进行检索' v-model='lesson_name'
                  show-word-limit clearable></el-input>
        <el-button class='search-btn' type='primary' icon='el-icon-search' @click='handleSearch'>搜索</el-button>
        <el-button type='danger' @click='addLesson' v-permission="'lesson:add'">添加课程</el-button>
      </el-row>
      <el-row class='lesson-box'>
        <!-- 5需要调整 -->
        <el-row class='lesson-item' v-for='(item,index) in lesson_list' :key='index' style='margin-left: 20px'>
          <el-row class='lesson-item-card'>
            <el-row class='image'>
              <img :src='item.pic_url' @click='stepIntoDetail(item.lessonId)' alt=''>
            </el-row>
            <el-row class='info'>
              <el-row class='info-left'>
                <span class='lesson-name'>{{ item.lesson_name }}</span>
                <span>授课老师：{{ item.teacher_name }}</span>
              </el-row>
              <el-row class='info-right'>
                <el-button type='warning'
                           @click='deleteLesson(item.lessonId)' v-permission="'lesson:delete'">
                  <i class='el-icon-delete'></i>
                </el-button>
              </el-row>
            </el-row>
          </el-row>
        </el-row>
      </el-row>
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='pageInfo.pageNum'
        :page-sizes='[10, 50, 100, 500]'
        :page-size='pageInfo.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='pageInfo.total'
      >
      </el-pagination>
    </el-row>
  </el-row>
</template>

<script>
import { deleteLessonById, findLessonsByName, getLessonsByTagName, getLessonsByUserId } from '@/network/api/backLesson';
import { getTags } from '@/network/api/tag';

export default {
  inject: ['reload'],
  data() {
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        size: 0,
        startRow: 0,
        endRow: 0,
        total: 0,
        pages: 0
      },
      lesson_name: '',
      currentDate: new Date(),
      lesson_list: [],
      tagList: [],
      btnShow: false,
      index: '0',
      userId: 0,
      roleId: 0,
      numberOfRows: Math.floor(document.documentElement.clientWidth * 0.8 / 250),
      isShowLesson: false
    }
  },
  created() {
    let userData = JSON.parse(localStorage.getItem('userData'))

    this.userId = userData.userId
    this.roleId = userData.roleId

    // 获取浏览器宽度
    // let clientWidth = document.documentElement.clientWidth
    // this.numberOfRows = Math.floor(clientWidth * 0.8 / 250)

    setTimeout(() => {

    }, 2000)

    this.getLessons();
    this.getOptionList()
  },
  methods: {
    getOptionList() {
      getTags().then(res => {
        if (res.status === '200') {
          let tagList = res.data
          let tagOption = []

          tagList.forEach(tagObj => {
            tagOption.push(tagObj)
          })

          this.tagList = tagOption
        }
      })
    },
    stepIntoDetail(lessonId) {
      this.$router.push({ name: 'editLesson', query: { lessonId: lessonId } })
    },
    addLesson() {
      this.$router.push('/addLesson')
    },
    deleteLesson(lesson_id) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteLessonById(lesson_id).then(res => {
          if (res.status === '200') {
            this.$message({
              type: 'success',
              message: '删除课程成功!'
            })

            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSearch() {
      this.getLessonsByLessonName()
    },
    //改变每页显示的数据条数
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getLessons()
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getLessons()
    },
    getLessonsByTag(tagName) {
      let pageRequest = {
        tagName: tagName,
        currentPage: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }

      getLessonsByTagName(pageRequest).then(res => {
        if (res.status === '200') {
          let tableData = res.data.list
          let data = res.data

          if (tableData != null && tableData.length > 0) {
            this.lesson_list = tableData

            this.pageInfo = {
              pageNum: data.pageNum,
              pageSize: data.pageSize,
              size: data.size,
              startRow: data.startRow,
              endRow: data.endRow,
              total: data.total,
              pages: data.pages
            }
          } else {
            this.lesson_list = []
            this.$message.error('当前标签没有对应课程!')
          }
        }
      })
    },
    getLessons() {
      let pageRequest = {
        userId: this.userId,
        roleId: this.roleId,
        currentPage: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }

      getLessonsByUserId(pageRequest).then(res => {
        if (res.status === '200') {
          let tableData = res.data.list
          let data = res.data

          if (tableData != null) {
            this.lesson_list = tableData

            this.pageInfo = {
              pageNum: data.pageNum,
              pageSize: data.pageSize,
              size: data.size,
              startRow: data.startRow,
              endRow: data.endRow,
              total: data.total,
              pages: data.pages
            }
          }
        }
      })
    },
    getLessonsByLessonName() {
      let pageRequest = {
        userId: this.userId,
        lessonName: this.lesson_name,
        currentPage: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }

      findLessonsByName(pageRequest).then(res => {
        if (res.status === '200') {
          let tableData = res.data.list
          let data = res.data

          if (tableData != null) {
            this.lesson_list = tableData

            this.pageInfo = {
              pageNum: data.pageNum,
              pageSize: data.pageSize,
              size: data.size,
              startRow: data.startRow,
              endRow: data.endRow,
              total: data.total,
              pages: data.pages
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.tagLi:active, .tagLi:hover {
  background-color: #fdf5e6;
}

.lesson-container {
  display: flex;
}

.lesson-container-left {
  width: 10%;
}

.lesson-container-right {
  display: flex;
  flex-direction: column;
}

.search-box {
  display: flex;
  margin-left: 20px;
}

.search-box .name-input {
  width: 20%;
}

.search-box .search-btn {
  margin-left: 10px;
}

.lesson-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.is-not-left {
  margin-left: 25px;
}

.lesson-box .lesson-item {
  width: 250px;
  height: 355px;
  margin-bottom: 25px;
}

.lesson-box .lesson-item .lesson-item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  height: 100%;
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  color: #303133;
  transition: .3s;
}

.lesson-item-card .info {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
}

.lesson-item-card .info .info-left {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.lesson-item-card .info .info-right {
  display: flex;
  height: 60%;
}

.lesson-box .image img {
  width: 100%;
  height: 250px;
  cursor: pointer;
}

el-card {
  display: flex;
}
</style>
