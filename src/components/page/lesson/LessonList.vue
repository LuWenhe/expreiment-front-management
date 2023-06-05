<template>
  <div>
    <el-row>
      <el-col :span='3'>
        <ul v-for='(item,index) in tagsList' :key='index'>
          <li class='tagLi' @click='getLessonsByTag(item.value)'>
            <i class='el-icon-price-tag' style='width: 150px;font-size: 20px'>
              <a href='#' style='width: 150px;height: 50px;font-size: 20px'>{{ item.value }}</a>
            </i>
          </li>
        </ul>
      </el-col>
      <el-col :span='21'>
        <el-row type='flex' class='row-bg' justify='start'>
          <el-col :span='6'>
            <el-input placeholder='请根据课程名称进行检索' v-model='lesson_name' maxlength='20' show-word-limit clearable>
            </el-input>
          </el-col>
          <el-col :span='4'>
            <el-button type='primary' icon='el-icon-search' @click='handleSearch'>搜索</el-button>
            <el-button type='danger' @click='addLesson'>添加课程</el-button>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :xs='14' :sm='14' :md='14' :lg='8' :xl='6' :span='6' v-for='(item,index)  in lesson_list'
                  :key='index'>
            <el-card style='width: 250px;height: 380px;margin-bottom: 25px; ' shadow='hover'>
              <div v-if='item.pic_url != null'>
                <img :src='item.pic_url' class='image' style='width: 100%;height: 250px' @click='stepIntoDetail(item.lessonId)'>
              </div>
              <div v-else>
                <img src='http://10.0.7.205:8081/2c2f312d-9ee4-4306-8c18-960046c32302.png' class='image'
                     style='width: 100%;height: 250px' @click='stepIntoDetail(item.lessonId)'>
              </div>
              <div style='padding: 14px;'>
                <span>{{ item.lesson_name }}</span>
                <br>
                <div style='width: 200px;height: 50px'>
                  <span style='font-size: 15px'>授课老师：{{ item.teacher_name }}</span>
                  <el-button type='warning' style='float:right;position:relative;margin-right: 6px'
                             @click='deleteLesson(item.lessonId)'><i class='el-icon-delete'></i></el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class='block'>
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
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { deleteLessonById, findLessonsByName, getAllLessons, getOptionList } from '@/api/backLesson'

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
      lesson_list: [
        {
          'lessonId': '',
          'lesson_name': '',
          'pic_url': 'http://10.0.7.205:8081/2c2f312d-9ee4-4306-8c18-960046c32302.png',
          'difficulty': 2,
          'lesson_time': 0,
          'learn_credit': 2,
          'suitablePerson': '研究生',
          'canLearn': '',
          'description': '深度学习框架',
          'teacher_id': null,
          'user': null,
          'chapters': null,
          'tags': null,
          'teacher_name': 'nxd'
        }
      ],
      tagsList: [],
      tagActive: '',
      btnShow: false,
      index: '0'
    }
  },
  created() {
    this.tagActive = '全部'
    this.getLessonList()
    this.getOptionList()
  },
  methods: {
    getOptionList() {
      getOptionList().then(res => {
        if (res.data.code === '200') {
          this.tagsList = res.data.data
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
          if (res.data.code === '200') {
            this.$message({
              type: 'success',
              message: '删除课程成功!'
            });
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
    async handleSearch() {
      let lesson_name = this.lesson_name
      let currentPage = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize

      findLessonsByName(lesson_name, currentPage, pageSize).then(res => {
        if (res.data.code === '200') {
          let tableData = res.data.data.list
          let data = res.data.data

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
    //改变每页显示的数据条数
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getLessonList();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getLessonList();
    },

    getLessonsByTag(tagName) {
      this.tagActive = tagName;
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10,
        size: 0,
        startRow: 0,
        endRow: 0,
        total: 0,
        pages: 0
      };
      this.getLessonList();
    },

    async getLessonList() {
      let pageRequest = {
        currentPage: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        tagActive: this.tagActive
      }

      getAllLessons(pageRequest).then(res => {
        if (res.data.code === '200') {
          let tableData = res.data.data.list
          let data = res.data.data

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
};
</script>

<style scoped>
.tagLi:active, .tagLi:hover {
  background-color: #fdf5e6;
}
</style>
